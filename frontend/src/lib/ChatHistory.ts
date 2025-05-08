
type History  = Array<Message | MessageSeparator>;

export interface Message {
    identifier: string;
    author: string;
    readBy: string[];
    conversationIdentifier: string;
    attachments?: {
        identifier: string;
        name: string;
        type: string;
        size: number;
        url: string;
    }
    content: string;
    date: Date;
    unread: boolean;
    isSender: boolean;
    isTyping: boolean;
}

export interface MessageSeparator {
    label: string;
}

export class ChatHistory {

    setTyping(typing: boolean) {
        this.typing = typing;
    }

    constructor(
        private _messages : Message[] = [],
        public readonly conversationIdentifier :
        string, private typing : boolean = false
    ) {}

    clone() : ChatHistory {
        return new ChatHistory(this.messages, this.conversationIdentifier, this.typing);
    }

    get messages(){
        return this._messages
    }

    get length(){
        return this._messages.length;
    }

    prependMessages(messages: Message[]) {
        this._messages = messages.concat(this._messages);
    }

    appendMessages(messages: Message[]) {
        this._messages = this._messages.concat(messages);
    }

    toArray() : History {
        const history : History = []
        const sortedMessages = this.messages.sort((a, b) => a.date.getTime() - b.date.getTime());

        const firstUnreadIndex = sortedMessages.findIndex(message => message.unread);

        if (firstUnreadIndex !== -1) {
            history.push(...sortedMessages.slice(0, firstUnreadIndex));
            history.push({label: "New messages"});
            history.push(...sortedMessages.slice(firstUnreadIndex));
        } else {
            history.push(...sortedMessages);
        }

        const formatDate = (date: Date): string => {
            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        };

        const finalHistory: History = [];
        let currentDate: string | null = null;

        history.forEach((item) => {
            if ('date' in item) {
                const messageDate = formatDate(item.date);
                if (messageDate !== currentDate) {
                    currentDate = messageDate;
                    finalHistory.push({label: currentDate});
                }
                finalHistory.push(item);
            } else {
                finalHistory.push(item);
            }
        });

        //add final typing message no sender if typing is true
        if (this.typing) {
            finalHistory.push({
                identifier: "typing",
                content: "typing...",
                date: new Date(),
                author: "",
                readBy: [],
                conversationIdentifier: this.conversationIdentifier,
                attachments: undefined,
                unread: false,
                isTyping:true,
                isSender : false,
            });
        }

        return finalHistory;
    }

    get lastMessage() {
        return this.messages[this.messages.length - 1];
    }

    removeMessage(message: Message) {
        this._messages = this._messages.filter(m => m.identifier !== message.identifier);
    }
}