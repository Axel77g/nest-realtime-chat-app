import ConversationAsideList from "../components/CoversationsList.tsx";
import { Outlet, useLocation } from "react-router-dom";

function ChatPage() {
  const location = useLocation();
  return (
    <div className="flex h-screen">
      <ConversationAsideList />

      {location.pathname === "/" ? (
        <div className={"p-6"}>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to ChatESGI!
          </h1>
          <p className="text-gray-600 mt-2">
            Select a conversation or start a new one to begin chatting.
          </p>
        </div>
      ) : (
        <>
          <Outlet />
        </>
      )}
    </div>
  );
}

export default ChatPage;
