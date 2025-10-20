import { chatApi } from "@/services/api";

// === Tipos DTO ===
export interface ConversationDTO {
  id: number;
  title: string;
  type: "PRIVATE" | "GROUP";
  createdAt: string;
}

export interface ParticipantDTO {
  id: number;
  conversationId: number;
  userId: number;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
}

export interface MessageDTO {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  read: boolean;
  sentAt: string;
}

// === Conversations ===
export async function getConversationsByUser(userId: number): Promise<ConversationDTO[]> {
  const { data } = await chatApi.get(`/chats/${userId}`);
  return data;
}

export async function createConversation(payload: Partial<ConversationDTO>): Promise<ConversationDTO> {
  const { data } = await chatApi.post("/chats", payload);
  return data;
}

// === Messages ===
export async function getMessages(conversationId: number): Promise<MessageDTO[]> {
  const { data } = await chatApi.get(`/chats/messages/${conversationId}`);
  return data;
}

export async function sendMessage(conversationId: number, payload: Partial<MessageDTO>): Promise<MessageDTO> {
  const { data } = await chatApi.post(`/chats/messages/${conversationId}`, payload);
  return data;
}

// === Participants ===
export async function getParticipantsByUser(userId: number): Promise<ParticipantDTO[]> {
  const { data } = await chatApi.get(`/chats/participants/${userId}`);
  return data;
}

export async function addParticipant(payload: Partial<ParticipantDTO>): Promise<ParticipantDTO> {
  const { data } = await chatApi.post("/chats/participants", payload);
  return data;
}
