import { useEffect, useState } from "react";
import { getAxiosInstance } from "../lib/axiosInstance.ts";

export interface Participant {
  pseudo: string;
  avatarURL?: string;
  color: string;
}

export interface Conversation {
  identifier: string;
  name: string;
  avatarUrl: string;
  participants: Participant[];
  lastMessage: string;
  lastMessageDate: Date;
  online: boolean;
  unreadCount: number;
  isTyping: boolean;
  selected: boolean;
  getParticipantsWithoutUser: (userPseudo: string) => Participant[] | undefined;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  async function fetchConversations(): Promise<void> {
    const client = getAxiosInstance();
    const response = await client.get("/conversations");
    return setConversations(
      response.data.map((conversation: any) => {
        return {
          identifier: conversation.identifier,
          name: conversation.name,
          avatarUrl: "/avatar.jpg",
          participants: conversation.participants,
          lastMessage: conversation.lastMessage || "no message",
          lastMessageDate: conversation.lastMessageDate
            ? new Date(conversation.lastMessageDate)
            : undefined,
          online: true,
          unreadCount: conversation.unreadCount,
          isTyping: false,
          getParticipantsWithoutUser(
            userPseudo: string,
          ): Participant[] | undefined {
            return this.participants.filter(
              (participant: Participant) => participant.pseudo !== userPseudo,
            );
          },
        };
      }),
    );
  }

  useEffect(() => {
    fetchConversations().then();
  }, []);

  useEffect(() => {
    console.log("Conversation has changed", conversations);
  }, [conversations]);

  return { conversations, fetchConversations, setConversations };
}
