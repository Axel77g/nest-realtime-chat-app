import ConversationAsideList from "../components/CoversationsList.tsx";
import {Outlet} from "react-router-dom";

function ChatPage() {
    return <div className='flex h-screen'>
        <ConversationAsideList  />
        <Outlet/>
    </div>
}

export default ChatPage;