import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;

// Inicia la conexión WebSocket si aún no está activa.
export function initChatSocket(onConnectCallback?: () => void) {
  if (stompClient && stompClient.active) return stompClient;

  const socket = new SockJS("http://localhost:8085/ws-chat");
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: () => {}, // opcional: quitar logs
  });

  if (onConnectCallback) {
    stompClient.onConnect = onConnectCallback;
  }

  stompClient.activate();
  return stompClient;
}

// Se suscribe a una conversación y ejecuta el callback al recibir mensajes.
export function subscribeToConversation(
  conversationId: number,
  onMessage: (msg: any) => void
) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.subscribe(`/topic/conversation/${conversationId}`, (message: IMessage) => {
    const body = JSON.parse(message.body);
    onMessage(body);
  });
}

// Envía un mensaje directamente a un destino STOMP.
export function sendSocketMessage(destination: string, payload: any) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }
}

// Cierra la conexión WebSocket.
export function disconnectChatSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
