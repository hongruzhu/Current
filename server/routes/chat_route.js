import { chatMessage } from "../controllers/chat_controller.js";

const chat = (io, socket) => {
  chatMessage(socket);
}

export { chat };