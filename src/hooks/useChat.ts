import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, markMessageAsRead } from "@/services/chat.service";
import { getFileUrl } from "@/services/storage.service";
import {
  initChatSocket,
  subscribeToConversation,
  disconnectChatSocket,
} from "@/services/chatSocket";

export function useChat(conversationId?: number, receiverId?: number, userId?: number) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // === Cargar mensajes iniciales ===
  useEffect(() => {
    if (!conversationId || !userId) return;
    setLoading(true);

    getMessages(conversationId)
      .then(async (data) => {
        const resolved = await Promise.all(
          data.map(async (msg) => {
            const url = msg.senderAvatar ? await getFileUrl(msg.senderAvatar) : null;
            return { ...msg, senderAvatarUrl: url };
          })
        );
        setMessages(resolved);

        // Marcar como leídos los no míos
        for (const msg of resolved.filter((m) => !m.read && m.senderId !== userId)) {
          try {
            await markMessageAsRead(msg.id);
          } catch (err) {
            console.error("Error marcando mensaje como leído:", err);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conversationId, userId]);

  // === Suscripción WebSocket ===
  useEffect(() => {
    if (!conversationId || !userId) return;

    const client = initChatSocket(() => {
      subscribeToConversation(conversationId, async (msg) => {
        try {
          const url = msg.senderAvatar ? await getFileUrl(msg.senderAvatar) : null;
          const newMsg = { ...msg, senderAvatarUrl: url };

          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMsg.id);
            return exists ? prev : [...prev, newMsg];
          });

          if (msg.senderId !== userId && !msg.read) {
            await markMessageAsRead(msg.id);
          }
        } catch (err) {
          console.error("Error procesando mensaje en tiempo real:", err);
        }
      });
    });

    return () => disconnectChatSocket();
  }, [conversationId, userId]);

  // === Enviar mensaje ===
  const handleSend = async (content: string) => {
    if (!content.trim() || !userId) return;
    try {
      const msg = await sendMessage(conversationId, {
        senderId: userId,
        receiverId,
        content,
        read: false,
      });
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        return exists ? prev : [...prev, msg];
      });
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  // === Scroll automático ===
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === Utilidad: agrupar mensajes por fecha ===
  const groupMessagesByDate = (msgs: any[]) => {
    const groups: Record<string, any[]> = {};
    msgs.forEach((msg) => {
      const date = new Date(msg.sentAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return {
    messages,
    groupedMessages,
    loading,
    handleSend,
    messagesEndRef,
  };
}
