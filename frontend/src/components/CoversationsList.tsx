import { Plus, Search } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { useChatContext } from "../contexts/ChatContext.tsx";
import { CreateConversationDialog } from "./CreateConversationDialog.tsx";
import { createDialogContext } from "./ui/Dialog.tsx";
import { ProfileBottomStatusBar } from "./ProfileBottomStatusBar.tsx";

const ConversationAsideList = () => {
  const { setSelectedConversation, conversations, searchString, search } =
    useChatContext();

  const createConversationDialogContext = createDialogContext(false);

  return (
    <aside className="w-[400px] bg-sidebar-bg h-full border-r border-primary-light/10 overflow-y-auto">
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>

        {/* Search bar */}
        <div className="relative mb-6">
          <input
            value={searchString}
            onChange={(e) => search(e.target.value)}
            type="text"
            placeholder="Search conversation"
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-primary-light/10 placeholder:text-gray-500 text-gray-700 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
        <CreateConversationDialog {...createConversationDialogContext} />
        <div
          onClick={() => createConversationDialogContext.openDialog()}
          className="flex items-center justify-center border-1 rounded-sm border-dashed mb-4 gap-3 text-primary hover:bg-primary/10 cursor-pointer p-2"
        >
          <Plus />
          Create conversation
        </div>
        {/* Recent Chats */}
        <h3 className="text-md font-medium text-primary-light mb-2">Recent</h3>
        <div className="space-y-1 ">
          {conversations.map((conv) => (
            <div
              key={conv.identifier}
              className={conv.selected ? "rounded-lg" : ""}
            >
              <ConversationItem
                title={conv.name}
                message={
                  conv.isTyping ? (
                    <span className="text-primary">
                      typing<span className="animate-pulse">...</span>
                    </span>
                  ) : (
                    conv.lastMessage
                  )
                }
                time={conv.lastMessageDate?.toLocaleTimeString() || ""}
                participants={[...(conv?.participants ?? [])].splice(1)}
                online={conv.online}
                selected={conv.selected}
                onClick={() => setSelectedConversation(conv)}
                unreadCount={conv.unreadCount}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 p-4">
        <ProfileBottomStatusBar />
      </div>
    </aside>
  );
};

export default ConversationAsideList;
