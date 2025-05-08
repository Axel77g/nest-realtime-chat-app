import React from 'react';
import {  Clock } from 'lucide-react';
import clsx from 'clsx';

interface ChatMessageProps {
  message: string;
  time: string;
  name: string;
  avatar?: string;
  isSender?: boolean;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  time,
  name,
  avatar,
  isSender = false,
  isTyping = false,
}) => {
  return (
    <div
      className={clsx("flex items-end space-x-2 mb-4", {
        "justify-end": isSender,
      })}
    >
      {/* Avatar */}
      {!isSender && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
          {avatar ? (
            <img src={avatar} alt={name} className="rounded-full w-full h-full object-cover" />
          ) : (
            name?.charAt(0)
          )}
        </div>
      )}

      {/* Message bubble */}
      <div>
        <div
          className={clsx(
            "relative rounded-xl px-4 py-2 max-w-xs sm:max-w-sm lg:max-w-md",
            {
              "bg-primary text-white": isSender,
              "bg-gray-100 text-gray-800": !isSender,
            }
          )}
        >
          <div className="flex items-center justify-between space-x-2">
            <p className="text-sm">
              {isTyping ? (
                <>
                  typing <span className="">
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
            <div className={
                clsx(
                    "flex items-center text-[11px] mt-1", 
                    {
                        "text-white/70": isSender,
                        "text-gray-500": !isSender,
                    } 
                )
            }>
              <Clock className="mr-1" size={12} />
              {time}
            </div>
          )}
        </div>

        {/* Name */}
        <p className="text-xs text-gray-700 mt-1 font-medium">{name}</p>
      </div>

      {/* Sender avatar */}
      {isSender && avatar && (
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover ml-2"
        />
      )}
    </div>
  );
};

export default ChatMessage;
