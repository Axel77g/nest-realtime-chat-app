import {ChatHistory} from "../lib/ChatHistory.ts";
import {createContext, JSX, useContext, useEffect, useState} from "react";
import {useChatHistory} from "../hooks/useChatHistory.ts";
import {Conversation, useConversations} from "../hooks/useConversations.ts";
import {getAxiosInstance} from "../lib/axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import {useWebsocketEvents} from "../hooks/useWebsocketEvents.ts";

export interface ChatContextType {
    history : ChatHistory,
    sendMessage: (content : string) => void
    fetchMessages : () => Promise<void>
    fetchConversations : () => Promise<void>
    conversations : Conversation[]
    selectedConversation : Conversation | null
    setSelectedConversation : (conversation : Conversation | null) => void
}

export const ChatContext = createContext<ChatContextType|null>(null)

function ChatContextProvider(props: {children : JSX.Element}) {
    const [selectedConversation, _setSelectedConversation] = useState<Conversation|null>(null)
    const {conversations, fetchConversations, setConversations} = useConversations()
    const {chatHistory, fetchMessages,toggleTypingMessage} = useChatHistory(selectedConversation?.identifier)
    const navigate = useNavigate()

    async function sendMessage(content : string){
        try{
            const client = getAxiosInstance()
            await client.post(`/conversations/${selectedConversation?.identifier}/messages`,{content})
            await fetchMessages()
        }catch (e){
            console.error(e)
        }
    }

    useWebsocketEvents("newUpdate", () => {
        fetchConversations().then()
        fetchMessages().then()
    })

    useWebsocketEvents("typingUpdate", (message: {conversation: Conversation, data: {typing: boolean}}) => {
        if(selectedConversation?.identifier === message.conversation.identifier){
            toggleTypingMessage(message.data.typing)
        }

        //set the isTyping value on the coresponding conversation
        const temp = [...conversations]
        const index = temp.findIndex((el) => el.identifier === message.conversation.identifier)
        if(index !== -1){
            temp[index].isTyping = message.data.typing
        }
        setConversations(temp)
    })

    useEffect(() => {
        if(selectedConversation){
            navigate(`/${selectedConversation.identifier}`)
        }
    },[selectedConversation])

    useEffect(() => {
        if(!selectedConversation){
            setSelectedConversation(conversations.length > 0 ? conversations[0] : null)
        }else if(conversations.every(c=>!c.selected)){ //reselect the conversation if it is not in the list of conversations
            setSelectedConversation(selectedConversation)
        }
    },[conversations])

    function setSelectedConversation(conversation : Conversation | null){
        if(conversation){
            //find by identifier the conversation in the list of conversations
            const index = conversations.findIndex((el) => el.identifier === conversation.identifier)
            if(index !== -1){
                const temp = [...conversations]
                temp.forEach((el) => el.selected = false)
                temp[index].selected = true
                setConversations(temp)
                _setSelectedConversation(conversation)
            }
        }else{
            _setSelectedConversation(null)
        }
    }
    const val = {
        conversations,
        selectedConversation,
        history: chatHistory,
        fetchConversations,
        setSelectedConversation,
        fetchMessages,
        sendMessage,
    }
    return <ChatContext.Provider value={val}>
        {props.children}
    </ChatContext.Provider>
}

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatContextProvider');
    }
    return context;
}

export default ChatContextProvider;