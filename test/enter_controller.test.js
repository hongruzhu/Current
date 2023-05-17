import { checkRoomId, setRoomId } from "../server/service/enter_cache.js";
import { generateRoomId } from "../server/util/util.js";
import { getRoomId } from "../server/controllers/enter_controller.js";

jest.mock("../server/service/enter_cache.js");
jest.mock("../server/util/util.js");

describe("getRoomId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a unique roomId and set it before redirecting", async () => {
    const mockReq = {};
    const mockRes = {
      redirect: jest.fn(),
    };

    // Mock generateRoomId to return a unique roomId
    generateRoomId.mockReturnValueOnce("unique-room-id");

    // Mock checkRoomId to return 0 (indicating roomId is not used)
    checkRoomId.mockResolvedValueOnce(0);

    await getRoomId(mockReq, mockRes);

    expect(generateRoomId).toHaveBeenCalledTimes(1);
    expect(checkRoomId).toHaveBeenCalledTimes(1);
    expect(setRoomId).toHaveBeenCalledTimes(1);
    expect(setRoomId).toHaveBeenCalledWith("unique-room-id");
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(
      "/room/create?roomId=unique-room-id"
    );
  });
});
