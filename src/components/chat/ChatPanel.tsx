"use client";
import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getConversationsByUser } from "@/services/chat.service";
import { getFileUrl } from "@/services/storage.service";
import ChatBox from "./ChatBox";

export default function ChatPanel() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // === Cargar conversaciones ===
  useEffect(() => {
    if (!open || !user?.idUser) return;
    setLoading(true);
    getConversationsByUser(user.idUser)
      .then(async (data) => {
        // 🔁 Resolver URLs de avatares desde storage-ms
        const resolved = await Promise.all(
          data.map(async (conv) => {
            let avatarUrl = null;
            if (conv.avatar) {
              avatarUrl = await getFileUrl(conv.avatar);
            }
            return { ...conv, avatarUrl };
          })
        );
        setConversations(resolved);
      })
      .catch((err) => console.error("Error cargando conversaciones:", err))
      .finally(() => setLoading(false));
  }, [open, user]);

  // === Cerrar con clic fuera ===
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSelectedConversation(null);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // === Alternar chat ===
  const handleToggleChat = () => {
    if (selectedConversation) {
      setSelectedConversation(null);
      setOpen(false);
    } else {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative">
      {/* === Icono flotante === */}
      <button
        onClick={handleToggleChat}
        className={`flex items-center text-gray-600 hover:text-primary transition-colors ${
          open || selectedConversation ? "text-primary" : ""
        }`}
        title="Abrir chat"
      >
        <MessageSquare size={20} />
      </button>

      {/* === Panel de conversaciones === */}
      {open && !selectedConversation && (
        <div
          ref={panelRef}
          className="fixed inset-x-4 top-16 md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-2
                     w-auto md:w-96 bg-white border border-gray-200 rounded-xl shadow-lg animate-slide-down z-50"
        >
          <div className="max-h-96 overflow-y-auto p-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Tus conversaciones
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-gray-500">No tienes conversaciones aún.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {conversations.map((conv) => (
                  <li
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition ${
                      selectedConversation?.id === conv.id ? "bg-gray-50" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <img
                      src={conv.avatarUrl || "/default-avatar.png"}
                      alt={conv.title}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                    />

                    {/* Info del chat */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{conv.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage
                          ? conv.lastMessageMine
                            ? `Tú: ${conv.lastMessage}`
                            : `${conv.lastMessageSender}: ${conv.lastMessage}`
                          : "Sin mensajes"}
                      </p>
                    </div>

                    {/* Hora */}
                    {conv.lastMessageTime && (
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                        {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* === ChatBox (vista individual) === */}
      {selectedConversation && (
        <ChatBox
          conversationId={selectedConversation.id}
          title={selectedConversation.title}
          onBack={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
}
