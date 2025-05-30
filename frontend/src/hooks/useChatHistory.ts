import { useEffect, useRef, useState } from "react";
import { ChatHistory, Message } from "../lib/ChatHistory.ts";
import { getAxiosInstance } from "../lib/axiosInstance.ts";
import { useAuth } from "../contexts/AuthContext.tsx";

export function useChatHistory(conversationIdentifier: string = "unknown") {
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory>(
    new ChatHistory([], conversationIdentifier),
  );
  const typing = useRef(false);
  const { user } = useAuth();

  function toggleTypingMessage(typingVal: boolean) {
    if (!user) return;
    typing.current = typingVal; // utilisation de ref pour le cas ou la reception de l'event typing et le fetchMessage se font en meme temps
    const newChatHistory = chatHistory.clone();
    newChatHistory.setTyping(typing.current);
    setChatHistory(newChatHistory);
  }

  async function fetchMessages(previous = false): Promise<void> {
    setLoading(true);
    if (conversationIdentifier === "unknown")
      return setChatHistory(
        new ChatHistory([], conversationIdentifier, typing.current),
      );
    const client = getAxiosInstance();
    const lastConversationIdenfier = chatHistory.conversationIdentifier;
    try {
      const query = {};
      const target = previous
        ? chatHistory.firstMessage
        : chatHistory.lastMessage;
      if (lastConversationIdenfier === conversationIdentifier && target) {
        //@ts-expect-error query['from'] is not a valid property
        query[previous ? "before" : "after"] = target.identifier;
      }
      const queryString = new URLSearchParams(query).toString();
      const response = await client.get(
        `/conversations/${conversationIdentifier}/messages?${queryString}`,
      );
      setLoading(false);
      const messages: Message[] = response.data.map((message: any): Message => {
        return {
          identifier: message.identifier,
          content: message.content,
          date: new Date(message.date),
          author: message.author,
          readBy: message.readBy,
          conversationIdentifier: message.conversationIdentifier,
          attachments: message.attachments,
          unread: !message?.readBy?.includes(user?.pseudo) || false,
          isSender: user?.pseudo === message.author,
          isTyping: false,
        };
      });

      if (messages.length > 0) {
        messages.sort((a, b) => a.date.getTime() - b.date.getTime());
      }

      if (lastConversationIdenfier === conversationIdentifier) {
        const newChatHistory = chatHistory.clone();
        if (previous) {
          newChatHistory.prependMessages(messages);
        } else {
          newChatHistory.appendMessages(messages);
        }
        newChatHistory.setTyping(typing.current);
        setChatHistory(newChatHistory);
        return;
      } else {
        return setChatHistory(
          new ChatHistory(messages, conversationIdentifier, typing.current),
        );
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      return setChatHistory(
        new ChatHistory([], conversationIdentifier, typing.current),
      );
    }
  }

  useEffect(() => {
    typing.current = false;
    fetchMessages().then();
  }, [conversationIdentifier]);

  return {
    loading,
    chatHistory,
    fetchMessages,
    toggleTypingMessage,
  };
}
