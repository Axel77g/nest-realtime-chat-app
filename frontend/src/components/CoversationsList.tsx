import { Search } from "lucide-react";
import ConversationItem from "./ConversationItem";
import {useChatContext} from "../contexts/ChatContext.tsx";

// interface Conversation {
//     id: string;
//     name: string;
//     avatarUrl?: string;
//     message: string;
//     time: string;
//     online?: boolean;
//     unreadCount?: number;
//     isTyping?: boolean;
//     selected?: boolean;
//   }



const ConversationAsideList = () => {
    const {setSelectedConversation, conversations} = useChatContext()
    return (
      <aside className="w-[400px] bg-sidebar-bg h-full border-r border-primary-light/10 overflow-y-auto">
        <div className="p-5">
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
  
          {/* Search bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search messages or users"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-primary-light/10 placeholder:text-gray-500 text-gray-700 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
  
        
          {/* Recent Chats */}
          <h3 className="text-md font-medium text-primary-light mb-2">Recent</h3>
          <div className="space-y-1 ">
            {conversations.map(conv => (
              <div
                key={conv.identifier}
                className={conv.selected ? 'rounded-lg' : ''}
              >
               
                <ConversationItem
                  name={conv.name}
                  message={
                    conv.isTyping ? (
                      <span className="text-primary">typing<span className="animate-pulse">...</span></span>
                    ) : conv.lastMessage
                  }
                  time={conv.lastMessageDate?.toLocaleTimeString() || ''}
                  avatarUrl={conv.avatarUrl || ''}
                  online={conv.online}
                  selected={conv.selected}
                  onClick={() => setSelectedConversation(conv)}
                  unreadCount={conv.unreadCount}
                />
                
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  };
  
  export default ConversationAsideList;