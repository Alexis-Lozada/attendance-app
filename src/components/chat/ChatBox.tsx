"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/AuthContext";

interface Props {
  conversationId?: number;
  receiverId?: number;
  title: string;
  onBack: () => void;
}

export default function ChatBox({ conversationId, receiverId, title, onBack }: Props) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  const { groupedMessages, loading, handleSend, messagesEndRef } = useChat(
    conversationId,
    receiverId,
    user?.idUser
  );

  // === Etiqueta de fecha ===
  const formatDateLabel = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const same = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (same(date, today)) return "Hoy";
    if (same(date, yesterday)) return "Ayer";
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div
      className="
        fixed bottom-4 right-4
        w-80 md:w-96
        bg-white border border-gray-200 rounded-xl shadow-2xl
        flex flex-col overflow-hidden
        max-h-[calc(100vh-10rem)]
        z-[100]
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-primary text-white">
        <button onClick={onBack} className="hover:text-gray-200 transition md:hidden">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-medium text-sm md:text-base truncate">{title}</h2>
      </div>

      {/* Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {loading ? (
          <p className="text-sm text-gray-500 text-center">Cargando mensajes...</p>
        ) : Object.keys(groupedMessages).length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No hay mensajes aún. ¡Escribe el primero!
          </p>
        ) : (
          Object.keys(groupedMessages).map((dateKey) => (
            <div key={dateKey}>
              <div className="flex justify-center mb-4 mt-2">
                <span className="text-xs text-gray-600 bg-gray-200/80 px-3 py-1 rounded-full">
                  {formatDateLabel(dateKey)}
                </span>
              </div>

              {groupedMessages[dateKey].map((msg) => {
                const isMine = msg.senderId === user?.idUser;
                const time = new Date(msg.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={`${msg.id}-${msg.sentAt}`}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    {!isMine && (
                      <img
                        src={msg.senderAvatarUrl || "/default-avatar.png"}
                        alt={msg.senderName || "Usuario"}
                        className="w-8 h-8 rounded-full mr-2 border border-gray-300 object-cover"
                      />
                    )}
                    <div className="flex flex-col max-w-[75%]">
                      {!isMine && (
                        <span className="text-xs text-gray-600 mb-1 font-medium">
                          {msg.senderName || "Usuario"}
                        </span>
                      )}
                      <div
                        className={`px-3 py-2 rounded-lg text-sm break-words ${
                          isMine
                            ? "bg-primary text-white self-end"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span
                        className={`text-[10px] text-gray-400 mt-1 ${
                          isMine ? "self-end" : "self-start"
                        }`}
                      >
                        {time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t p-3 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 text-sm border rounded-lg text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend(newMessage)}
        />
        <button
          onClick={() => handleSend(newMessage)}
          className="bg-primary text-white p-2 rounded-lg hover:opacity-90 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
