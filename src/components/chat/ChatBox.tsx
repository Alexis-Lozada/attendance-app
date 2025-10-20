"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { getMessages, sendMessage } from "@/services/chat.service";
import { useAuth } from "@/context/AuthContext";

interface Props {
  conversationId: number;
  title: string;
  onBack: () => void;
}

export default function ChatBox({ conversationId, title, onBack }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // === Cargar mensajes ===
  useEffect(() => {
    setLoading(true);
    getMessages(conversationId)
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error cargando mensajes:", err))
      .finally(() => setLoading(false));
  }, [conversationId]);

  // === Auto-scroll ===
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === Enviar mensaje ===
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const msg = await sendMessage(conversationId, {
        senderId: user?.idUser,
        content: newMessage,
        read: false,
      });
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  return (
    <div
      className="
        fixed bottom-4 right-4
        w-80 md:w-96
        bg-white border border-gray-200 rounded-xl shadow-2xl
        flex flex-col overflow-hidden
        max-h-[calc(100vh-10rem)]   /* ✅ límite más bajo */
        z-[100]
      "
    >
      {/* === Header === */}
      <div className="flex items-center gap-3 px-4 py-3 bg-primary text-white">
        <button
          onClick={onBack}
          className="hover:text-gray-200 transition md:hidden"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-medium text-sm md:text-base truncate">{title}</h2>
      </div>

      {/* === Mensajes === */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {loading ? (
          <p className="text-sm text-gray-500 text-center">Cargando mensajes...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No hay mensajes aún. ¡Escribe el primero!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === user?.idUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                  msg.senderId === user?.idUser
                    ? "bg-primary text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* === Input === */}
      <div className="flex items-center gap-2 border-t p-3 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 text-sm border rounded-lg text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white p-2 rounded-lg hover:opacity-90 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
