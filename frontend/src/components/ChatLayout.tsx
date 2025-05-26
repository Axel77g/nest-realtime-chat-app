import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import MessageInput from "./ChatMessageInput";
import MessageSeperator from "./MessageSeperator.tsx";
import { ChatHistory, Message } from "../lib/ChatHistory.ts";
import { Conversation, Participant } from "../hooks/useConversations.ts";
import { useWebsocketEvents } from "../hooks/useWebsocketEvents.ts";
import { useAuth } from "../contexts/AuthContext.tsx";

interface ChatLayoutProps {
  conversation: Conversation | null;
  history: ChatHistory;
  sendMessage: (message: string) => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  sendMessage,
  conversation,
  history,
}) => {
  const { user } = useAuth();
  const [messageContent, setMessageContent] = React.useState("");

  const goToBottom = () => {
    const chatHistoryScroll = document.getElementById("chat-scroll");
    chatHistoryScroll?.scrollTo({
      top: chatHistoryScroll?.scrollHeight,
    });
  };

  const stopTypingDebounce = useRef<number | null>(null);
  const typing = useRef(false);

  const startStopTypingEvent = useWebsocketEvents("typingUpdate");
  const handleInput = () => {
    if (conversation === null) return;

    if (stopTypingDebounce.current !== null) {
      clearTimeout(stopTypingDebounce.current);
    }

    stopTypingDebounce.current = setTimeout(() => {
      typing.current = false;
      startStopTypingEvent({
        conversation: conversation,
        author: user,
        typing: false,
      });
    }, 3000);

    if (typing.current) return;
    typing.current = true;
    startStopTypingEvent({
      conversation: conversation,
      author: user,
      typing: true,
    });
  };

  const handleSubmit = () => {
    if (messageContent.length > 0) {
      typing.current = false;
      startStopTypingEvent({
        conversation: conversation,
        author: user,
        typing: false,
      });
      sendMessage(messageContent);
      goToBottom();
      setMessageContent("");
    }
  };

  useEffect(() => {
    goToBottom();
  }, [history.length]);

  function getAuthorParticipant(message: Message): Participant {
    if (!conversation)
      return { pseudo: "unknown", avatarURL: "", color: "#7269ef" };
    return (
      conversation.participants.find((p) => p.pseudo === message.author) || {
        pseudo: "unknown",
        avatarURL: "",
        color: "#7269ef",
      }
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 flex-1">
      <ChatHeader
        name={conversation?.name || "chat"}
        participants={[...(conversation?.participants ?? [])].splice(1)}
      />
      {/* Messages container */}
      <div id={"chat-scroll"} className="flex-1 overflow-y-auto p-4">
        {history.toArray().map((el) => {
          if ("label" in el) {
            return <MessageSeperator key={el.label} label={el.label} />;
          } else {
            return (
              <ChatMessage
                key={el.identifier}
                message={el.content}
                time={el.date?.toLocaleTimeString() || ""}
                participant={getAuthorParticipant(el)}
                isSender={el.isSender}
                isTyping={el.isTyping}
              />
            );
          }
        })}
      </div>
      {/* Footer / Input area */}
      <MessageInput
        value={messageContent}
        setValue={setMessageContent}
        onSend={handleSubmit}
        onInput={handleInput}
      />
    </div>
  );
};

export default React.memo(ChatLayout, (prevProps, nextProps) => {
  return (
    prevProps.conversation?.identifier === nextProps.conversation?.identifier &&
    prevProps.history === nextProps.history
  );
});
