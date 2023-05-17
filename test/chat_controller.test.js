import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import { chatMessage } from "../server/controllers/chat_controller.js";

describe("chatMessage", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("chatMessage", (done) => {
    clientSocket.on("chat-message", (roomId, name, msg) => {
      expect(roomId).toBe("roomId");
      expect(name).toBe("name");
      expect(msg).toBe("msg");
      done();
    });
    serverSocket.emit("chat-message", "roomId", "name", "msg");
  });

  test('emits "chat-message" event to specified room', () => {
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
    socket.on.mock.calls[0][1](roomId, name, msg);

    // 驗證是否正確呼叫 socket.to 和 socket.emit
    expect(socket.to).toHaveBeenCalledWith(roomId);
    expect(socket.emit).toHaveBeenCalledWith("chat-message", name, msg);
  });
});
