"use client";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getConversationsByUser } from "@/services/chat.service";
import { getUsersByUniversity } from "@/services/user.service";
import { getFileUrl } from "@/services/storage.service";
import ChatBox from "./ChatBox";

export default function ChatPanel() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // === Cargar conversaciones + usuarios ===
  useEffect(() => {
    if (!open || !user?.idUser || !user?.idUniversity) return;
    setLoading(true);

    Promise.all([
      getConversationsByUser(user.idUser),
      getUsersByUniversity(user.idUniversity),
    ])
      .then(async ([convs, allUsers]) => {
        // Resolver avatares de conversaciones
        const resolvedConvs = await Promise.all(
          convs.map(async (conv) => {
            const avatarUrl = conv.avatar ? await getFileUrl(conv.avatar) : null;
            return { ...conv, avatarUrl };
          })
        );

        // Resolver avatares de usuarios
        const filteredUsers = allUsers.filter((u) => u.idUser !== user.idUser);
        const resolvedUsers = await Promise.all(
          filteredUsers.map(async (u) => {
            const avatarUrl = u.profileImage ? await getFileUrl(u.profileImage) : null;
            return { ...u, avatarUrl };
          })
        );

        setConversations(resolvedConvs);
        setUsers(resolvedUsers);
      })
      .catch((err) => console.error("Error cargando datos de chat:", err))
      .finally(() => setLoading(false));
  }, [open, user]);

  // === Cerrar al hacer clic fuera ===
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSelectedConversation(null);
        setSelectedUser(null);
        setIsSearching(false);
        setSearchTerm("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // === Alternar panel ===
  const handleToggleChat = () => {
    if (selectedConversation || selectedUser) {
      setSelectedConversation(null);
      setSelectedUser(null);
      setOpen(false);
    } else {
      setOpen((prev) => !prev);
    }
  };

  // === Buscar usuarios ===
  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(value.trim().length > 0);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setIsSearching(false);
  };

  // === Abrir chat existente o nuevo ===
  const handleSelectUser = (u: any) => {
    const existing = conversations.find(
      (c) => c.title === `${u.firstName} ${u.lastName}`
    );
    if (existing) setSelectedConversation(existing);
    else setSelectedUser(u);
  };

  // === Formato de tiempo ===
  const formatMessageTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
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

      {/* === Panel principal === */}
      {open && !selectedConversation && !selectedUser && (
        <div
          ref={panelRef}
          className="fixed inset-x-4 top-16 md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-2
                     w-auto md:w-96 bg-white border border-gray-200 rounded-xl shadow-lg animate-slide-down z-50"
        >
          <div className="max-h-96 overflow-y-auto p-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Tus conversaciones
            </h2>

            {/* === Buscador === */}
            <div className="relative mb-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar personas..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-9 py-2 text-sm border border-gray-200 rounded-lg 
                           focus:outline-none focus:ring-0 focus:border-primary 
                           text-gray-800 placeholder-gray-400"
              />
              {isSearching && searchTerm && (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* === Lista de resultados === */}
            {loading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : isSearching ? (
              filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  No se encontraron usuarios.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <li
                      key={u.idUser}
                      onClick={() => handleSelectUser(u)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition"
                    >
                      <img
                        src={u.avatarUrl || "/default-avatar.png"}
                        alt={`${u.firstName} ${u.lastName}`}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : conversations.length === 0 ? (
              <p className="text-sm text-gray-500">No tienes conversaciones aún.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {conversations.map((conv) => (
                  <li
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition"
                  >
                    <img
                      src={conv.avatarUrl || "/default-avatar.png"}
                      alt={conv.title}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
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

                    {/* Hora o fecha */}
                    {conv.lastMessageTime && (
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                        {formatMessageTime(conv.lastMessageTime)}
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
      {(selectedConversation || selectedUser) && (
        <ChatBox
          conversationId={selectedConversation?.id}
          receiverId={selectedUser?.idUser}
          title={
            selectedConversation?.title ||
            `${selectedUser?.firstName} ${selectedUser?.lastName}`
          }
          onBack={() => {
            setSelectedConversation(null);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
