import React from "react";
import { Clock } from "lucide-react";
import clsx from "clsx";
import Avatar from "./ui/Avatar.tsx";
import { Participant } from "../hooks/useConversations.ts";

interface ChatMessageProps {
  message: string;
  time: string;
  participant: Participant;
  isSender?: boolean;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  time,
  participant,
  isSender = false,
  isTyping = false,
}) => {
  return (
    <div
      className={clsx("flex items-end space-x-3 mb-5", {
        "justify-end": isSender,
      })}
    >
      {/* Avatar */}
      {!isSender && <Avatar className={"w-12 h-12"} user={participant} />}

      {/* Message bubble */}
      <div>
        <div
          className={clsx(
            "relative rounded-xl px-5 py-3 max-w-xs sm:max-w-sm lg:max-w-md",
            {
              "bg-primary text-white": isSender,
              "bg-gray-100 text-gray-800": !isSender,
            },
          )}
        >
          <div className="flex items-center justify-between space-x-3">
            <p className="text-base">
              {isTyping ? (
                <>
                  typing{" "}
                  <span className="">
                    <span className="animate-ping inline-block w-[3px] h-[3px] mx-[3px] rounded-full bg-primary-light/50"></span>
                    <span className="animate-ping inline-block w-[3px] h-[3px] mx-[3px] rounded-full bg-primary-light/50"></span>
                    <span className="animate-ping inline-block w-[3px] h-[3px] mx-[3px] rounded-full bg-primary-light/50"></span>
                  </span>
                </>
              ) : (
                message
              )}
            </p>
          </div>
          {!isTyping && (
            <div
              className={clsx("flex items-center text-xs mt-2", {
                "text-white/70": isSender,
                "text-gray-500": !isSender,
              })}
            >
              <Clock className="mr-2" size={12} />
              {time}
            </div>
          )}
        </div>

        {/* Name */}
        <p className="text-sm text-gray-700 mt-2 font-medium">
          {participant.pseudo}
        </p>
      </div>

      {/* Sender avatar */}
      {isSender && <Avatar className={"w-12 h-12"} user={participant} />}
    </div>
  );
};

export default ChatMessage;
