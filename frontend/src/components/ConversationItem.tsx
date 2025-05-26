import React, { JSX } from "react";
import clsx from "clsx";
import { Participant } from "../hooks/useConversations.ts";
import Avatar from "./ui/Avatar.tsx";

interface ConversationItemProps {
  title: string;
  participants: Participant[];
  message: string | JSX.Element;
  time: string;
  online?: boolean;
  selected?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  title,
  participants,
  message,
  time,
  selected = false,
  unreadCount = 0,
  onClick,
}) => {
  const hasUnread: boolean = unreadCount > 0;
  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition",
        selected ? "bg-back-light" : "bg-transparent hover:bg-back-light",
      )}
    >
      {/* Avatar with status */}
      <Avatar user={participants[0]} />

      {/* Text content */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">{title}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{message}</p>
      </div>
      {/* Unread count */}
      {hasUnread && (
        <div className="absolute right-[20px] bottom-[7px] bg-rose-200 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {unreadCount.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
