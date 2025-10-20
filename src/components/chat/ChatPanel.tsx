"use client";
import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getConversationsByUser } from "@/services/chat.service";
import ChatBox from "./ChatBox";

export default function ChatPanel() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cargar conversaciones
  useEffect(() => {
    if (!open || !user?.idUser) return;
    setLoading(true);
    getConversationsByUser(user.idUser)
      .then((data) => setConversations(data))
      .catch((err) => console.error("Error cargando conversaciones:", err))
      .finally(() => setLoading(false));
  }, [open, user]);

  // Cerrar con clic fuera
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

  // ✅ Control unificado del icono de chat
  const handleToggleChat = () => {
    if (selectedConversation) {
      // Si hay conversación abierta, la cerramos
      setSelectedConversation(null);
      setOpen(false);
    } else {
      // Si no hay conversación abierta, alternamos el panel
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative">
      {/* Icono de chat */}
      <button
        onClick={handleToggleChat}
        className={`flex items-center text-gray-600 hover:text-primary transition-colors ${
          open || selectedConversation ? "text-primary" : ""
        }`}
        title="Abrir chat"
      >
        <MessageSquare size={20} />
      </button>

      {/* Panel de conversaciones */}
      {open && !selectedConversation && (
        <div
          ref={panelRef}
          className="fixed inset-x-4 top-16 md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-2 
                     w-auto md:w-96 bg-white border border-gray-200 rounded-xl shadow-lg animate-slide-down z-50"
        >
          <div className="max-h-96 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Tus conversaciones
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-gray-500">No tienes conversaciones aún.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {conversations.map((conv) => (
                  <li
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          {conv.title || `Chat #${conv.id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conv.type === "PRIVATE" ? "Privado" : "Grupo"}
                        </p>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(conv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ChatBox independiente */}
      {selectedConversation && (
        <ChatBox
          conversationId={selectedConversation.id}
          title={selectedConversation.title || `Chat #${selectedConversation.id}`}
          onBack={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
}
