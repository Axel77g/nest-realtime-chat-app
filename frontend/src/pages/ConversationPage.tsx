import ChatLayout from "../components/ChatLayout.tsx";
import {useChatContext} from "../contexts/ChatContext.tsx";


function ConversationPage() {
    const {history , selectedConversation,sendMessage} = useChatContext()
    return <>
            <ChatLayout
                history={history}
                sendMessage={sendMessage}
                conversation={selectedConversation}
            />
        </>
}

export default ConversationPage;