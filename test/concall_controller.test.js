import {
  getStartTime,
  getRoomTitle,
} from "../server/controllers/concall_controller.js";
import * as concallCache from "../server/service/concall_cache.js";

jest.mock("../server/service/concall_cache.js");

describe("getStartTime", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with the start time from the cache", async () => {
    const mockReq = { query: { roomId: "room123" } };
    const mockRes = { json: jest.fn() };
    const mockStartTime = "2023-05-17T09:00:00Z";

    concallCache.getStartTimeCache.mockResolvedValueOnce(mockStartTime);

    await getStartTime(mockReq, mockRes);

    expect(concallCache.getStartTimeCache).toHaveBeenCalledTimes(1);
    expect(concallCache.getStartTimeCache).toHaveBeenCalledWith("room123");
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockStartTime });
  });
});

describe("getRoomTitle", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with the room title from the cache", async () => {
    const mockReq = { body: { roomId: "room123" } };
    const mockRes = { json: jest.fn() };
    const mockRoomTitle = "Sample Room";

    concallCache.getTitleCache.mockResolvedValueOnce(mockRoomTitle);

    await getRoomTitle(mockReq, mockRes);

    expect(concallCache.getTitleCache).toHaveBeenCalledTimes(1);
    expect(concallCache.getTitleCache).toHaveBeenCalledWith("room123");
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockRoomTitle });
  });

  it("should respond with '無' if room title is not found in the cache", async () => {
    const mockReq = { body: { roomId: "room456" } };
    const mockRes = { json: jest.fn() };

    concallCache.getTitleCache.mockResolvedValueOnce(null);

    await getRoomTitle(mockReq, mockRes);

    expect(concallCache.getTitleCache).toHaveBeenCalledTimes(1);
    expect(concallCache.getTitleCache).toHaveBeenCalledWith("room456");
    expect(mockRes.json).toHaveBeenCalledWith({ data: "無" });
  });
});



