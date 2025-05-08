import React from 'react';
import {
  Search,
  Phone,
  Video,
  User,
  MoreHorizontal
} from 'lucide-react';

interface ChatHeaderProps {
  name: string;
  avatarUrl?: string;
  online?: boolean;
  statusColor?: string; // Optionnel, couleur du point de présence
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatarUrl,
  online = false,
  statusColor = 'bg-emerald-400', // Par défaut : vert
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-primary-light/10 bg-white">
      {/* Avatar + Name + Status */}
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
              {name.charAt(0)}
            </div>
          )}
          {online && (
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColor}`}
            />
          )}
        </div>
        <span className="font-semibold text-gray-800">{name}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-5 text-gray-500">
        <button className="hover:text-gray-700 transition" type="button"><Search size={18} /></button>
        <button className="hover:text-gray-700 transition" type="button"><Phone size={18} /></button>
        <button className="hover:text-gray-700 transition" type="button"><Video size={18} /></button>
        <button className="hover:text-gray-700 transition" type="button"><User size={18} /></button>
        <button className="hover:text-gray-700 transition" type="button"><MoreHorizontal size={18} /></button>
      </div>
    </div>
  );
};

export default ChatHeader;
