import React from "react";
import { Search, Phone, Video, User, MoreHorizontal } from "lucide-react";
import { NotImplemented } from "./ui/NotImplemented.tsx";
import Avatar from "./ui/Avatar.tsx";
import { Participant } from "../hooks/useConversations.ts";

interface ChatHeaderProps {
  participants: Participant[];
  name: string;
  statusColor?: string; // Optionnel, couleur du point de présence
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ participants, name }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-primary-light/10 bg-white">
      {/* Avatar + Name + Status */}
      <div className="flex items-center space-x-3">
        {participants.length && <Avatar user={participants[0]} />}

        <span className="font-semibold text-gray-800">{name}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-5 text-gray-500">
        <NotImplemented>
          <button className="hover:text-gray-700 transition" type="button">
            <Search size={18} />
          </button>
        </NotImplemented>
        <NotImplemented>
          <button className="hover:text-gray-700 transition" type="button">
            <Phone size={18} />
          </button>
        </NotImplemented>
        <NotImplemented>
          <button className="hover:text-gray-700 transition" type="button">
            <Video size={18} />
          </button>
        </NotImplemented>
        <NotImplemented>
          <button className="hover:text-gray-700 transition" type="button">
            <User size={18} />
          </button>
        </NotImplemented>
        <NotImplemented>
          <button className="hover:text-gray-700 transition" type="button">
            <MoreHorizontal size={18} />
          </button>
        </NotImplemented>
      </div>
    </div>
  );
};

export default ChatHeader;
