import { redis } from "../server/util/cache.js";
import { updateRoomUsers } from "../server/service/concall_cache.js";

jest.mock("../server/util/cache.js", () => ({ redis: jest.fn() }));

describe("updateRoomUsers", () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("should increment the room users count by the specified number", async () => {
    const roomId = "room123";
    const number = 1;

    redis.hincrby = jest.fn().mockResolvedValueOnce(7);

    const count = await updateRoomUsers(roomId, number);

    expect(redis.hincrby).toHaveBeenCalledTimes(1);
    expect(redis.hincrby).toHaveBeenCalledWith("room", roomId, number);
    expect(count).toBe(7);
  });
});
