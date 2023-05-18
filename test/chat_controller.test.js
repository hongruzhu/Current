import { chatMessage } from "../server/controllers/chat_controller.js";

describe("chatMessage", () => {
  it('emits "chat-message" event to specified room', () => {
    // 建立假的 socket 物件
    const socket = {
      on: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    // 呼叫 chatMessage 函式並模擬 "chat-message" 事件
    chatMessage(socket);
    const roomId = "room1";
    const name = "John";
    const msg = "Hello, world!";

    // 模擬socket.on接受到參數
    socket.on.mock.calls[0][1](roomId, name, msg);

    // 驗證是否正確呼叫 socket.to 和 socket.emit
    expect(socket.to).toHaveBeenCalledWith(roomId);
    expect(socket.emit).toHaveBeenCalledWith("chat-message", name, msg);
  });
});
