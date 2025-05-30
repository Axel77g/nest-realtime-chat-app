import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import MessageInput from "./ChatMessageInput";
import MessageSeperator from "./MessageSeperator.tsx";
import { ChatHistory, Message } from "../lib/ChatHistory.ts";
import { Conversation, Participant } from "../hooks/useConversations.ts";
import { useWebsocketEvents } from "../hooks/useWebsocketEvents.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useChatContext } from "../contexts/ChatContext.tsx";

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
  const { loading, fetchMessages } = useChatContext();
  const [messageContent, setMessageContent] = React.useState("");

  const goToBottom = (smooth: boolean = false) => {
    const chatHistoryScroll = document.getElementById("chat-scroll");
    chatHistoryScroll?.scrollTo({
      top: chatHistoryScroll?.scrollHeight,
      behavior: smooth ? "smooth" : undefined,
    });
  };

  const stopTypingDebounce = useRef<any | null>(null);
  const typing = useRef(false);
  const scrollDebounce = useRef<any | null>(null);

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
      setTimeout(() => {
        goToBottom(true);
      }, 100);
      setMessageContent("");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      goToBottom();
    }, 100); // Delay to ensure the DOM is updated
  }, [conversation]);

  useEffect(() => {
    const chatScroll = document.getElementById("chat-scroll");
    function _handleScroll() {
      if (chatScroll) {
        const atTop = chatScroll.scrollTop === 0;
        if (!atTop) return;
        if (scrollDebounce.current) {
          clearTimeout(scrollDebounce.current);
        }

        scrollDebounce.current = setTimeout(() => {
          const currentLastMessageIdentifier =
            history?.firstMessage?.identifier;

          const messageDiv = document.getElementById(
            currentLastMessageIdentifier ?? "null",
          );
          fetchMessages(true).then(() => {
            if (messageDiv) {
              messageDiv.scrollIntoView();
            }
          });
        });
      }
    }
    if (chatScroll) {
      chatScroll.addEventListener("wheel", _handleScroll);
    }

    return () => {
      if (chatScroll) {
        chatScroll.removeEventListener("wheel", _handleScroll);
      }
    };
  }, [history]);

  function getAuthorParticipant(message: Message): Participant {
    if (!conversation) return { pseudo: "", avatarURL: "", color: "#7269ef" };
    return (
      conversation.participants.find((p) => p.pseudo === message.author) || {
        pseudo: "",
        avatarURL: "",
        color: "#7269ef",
      }
    );
  }

  function getReadByParticipants(message: Message): Participant[] {
    if (!conversation) return [];
    return conversation.participants.filter((p) =>
      message.readBy
        .filter((pseudo) => pseudo != message.author && user?.pseudo != pseudo) //not the author and not the user
        .includes(p.pseudo),
    );
  }

  let title;
  if (!conversation) {
    title = null;
  } else {
    title = conversation
      .getParticipantsWithoutUser(user?.pseudo || "")
      ?.map((p) => p.pseudo)
      .join(", ");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 flex-1">
      <ChatHeader
        name={title || "chat"}
        participants={[...(conversation?.participants ?? [])].splice(1)}
      />

      {/* Messages container */}
      <div id={"chat-scroll"} className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        )}
        {history.toArray().map((el) => {
          if ("label" in el) {
            return <MessageSeperator key={el.label} label={el.label} />;
          } else if (el.isTyping) {
            return (
              <div className={"opacity-50 italic text-sm"}>
                someone is typing ...
              </div>
            );
          } else {
            return (
              <ChatMessage
                identifier={el.identifier}
                key={el.identifier}
                message={el.content}
                time={el.date?.toLocaleTimeString() || ""}
                participant={getAuthorParticipant(el)}
                isSender={el.isSender}
                isTyping={false}
                readBy={getReadByParticipants(el)}
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
