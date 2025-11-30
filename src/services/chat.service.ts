import { api } from "@/services/api";

// === Tipos DTO ===
export interface ConversationDTO {
  id: number;
  title: string;
  type: "PRIVATE" | "GROUP";
  avatar?: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageSender?: string;
  lastMessageTime?: string;
  lastMessageMine?: boolean;
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
  conversationId?: number;
  senderId: number;
  receiverId?: number; // <-- agregado para nuevos chats
  senderName?: string;
  senderAvatar?: string;
  content: string;
  read: boolean;
  sentAt: string;
}

// === Conversations ===
export async function getConversationsByUser(userId: number): Promise<ConversationDTO[]> {
  const { data } = await api.get(`/chats/${userId}`);
  return data;
}

export async function createConversation(payload: Partial<ConversationDTO>): Promise<ConversationDTO> {
  const { data } = await api.post("/chats", payload);
  return data;
}

// === Messages ===
export async function getMessages(conversationId: number): Promise<MessageDTO[]> {
  const { data } = await api.get(`/chats/messages/${conversationId}`);
  return data;
}

/**
 * Envía un mensaje, reutilizando el mismo método para:
 * - Conversaciones existentes (usa /chats/messages/{id})
 * - Conversaciones nuevas (usa /chats/messages)
 */
export async function sendMessage(
  conversationId: number | undefined,
  payload: Partial<MessageDTO>
): Promise<MessageDTO> {
  const endpoint = conversationId
    ? `/chats/messages/${conversationId}`
    : `/chats/messages`; // <-- el backend crea la conversación automáticamente

  const { data } = await api.post(endpoint, payload);
  return data;
}

export async function markMessageAsRead(messageId: number): Promise<MessageDTO> {
  const { data } = await api.patch(`/chats/messages/${messageId}/read`);
  return data;
}

// === Participants ===
export async function getParticipantsByUser(userId: number): Promise<ParticipantDTO[]> {
  const { data } = await api.get(`/chats/participants/${userId}`);
  return data;
}

export async function addParticipant(payload: Partial<ParticipantDTO>): Promise<ParticipantDTO> {
  const { data } = await api.post("/chats/participants", payload);
  return data;
}
