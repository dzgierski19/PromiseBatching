import {
  asyncAwaitCache,
  createLongTask,
  getLongTask,
  getLongTaskAsync,
  promiseCache,
} from "../app/promiseBatching";

describe("Promise batching test suite promises", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    promiseCache.clear();
    asyncAwaitCache.clear();
    jest.clearAllTimers();
  });

  describe("Async/Await testing suite", () => {
    it("Should set task in cache ", () => {
      getLongTaskAsync("10");
      expect(asyncAwaitCache.has("10")).toBeTruthy();
    });
    it("Should not add another task with the same id", async () => {
      getLongTaskAsync("10");
      getLongTaskAsync("10");
      await waitMiliseconds(5000);
      expect([...asyncAwaitCache.keys()]).toHaveLength(1);
    });
    it("Should have been called", async () => {
      const promiseBatching = require("../app/promiseBatching");
      const spy = jest.spyOn(promiseBatching, "getLongTask");
      promiseBatching.getLongTask();
      promiseBatching.getLongTask();
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it("Should resolve both tasks with the same id at the same time if provided second task is before resolving first one", async () => {
      getLongTaskAsync("10");
      await waitMiliseconds(9000);
      getLongTaskAsync("10");
      await waitMiliseconds(2000);
      expect([...asyncAwaitCache.keys()]).toHaveLength(0);
    });

    it("Should delete resolved task from cache after set time", async () => {
      getLongTaskAsync("10");
      await waitMiliseconds(10000);
      expect([...asyncAwaitCache.keys()]).toHaveLength(0);
    });
    it("Should delete resolved task from cache and keep unresolved task", async () => {
      getLongTaskAsync("10");
      await waitMiliseconds(5000);
      getLongTaskAsync("11");
      await waitMiliseconds(5000);
      expect([...asyncAwaitCache.keys()]).toHaveLength(1);
    });
    it("should delete both resolved tasks from cache", async () => {
      getLongTaskAsync("10");
      await waitMiliseconds(12000);
      getLongTaskAsync("20");
      await waitMiliseconds(12000);
      expect([...asyncAwaitCache.keys()]).toHaveLength(0);
    });
  });
  describe("Promise testing suite", () => {
    it("Should set task in cache ", () => {
      getLongTask("10");
      expect(promiseCache.has("10")).toBeTruthy();
    });
    it("Should not add another task with the same id", async () => {
      getLongTask("10");
      getLongTask("10");
      await waitMiliseconds(5000);
      expect([...promiseCache.keys()]).toHaveLength(1);
    });
    it("Should resolve both tasks with the same id at the same time if provided second task is before resolving first one", async () => {
      getLongTask("10");
      await waitMiliseconds(9000);
      getLongTask("10");
      await waitMiliseconds(1000);
      expect([...promiseCache.keys()]).toHaveLength(0);
    });

    it("Should delete resolved task from cache after set time", async () => {
      getLongTask("10");
      await waitMiliseconds(11000);
      expect([...promiseCache.keys()]).toHaveLength(0);
    });
    it("Should delete resolved task from cache and keep unresolved task", async () => {
      getLongTask("10");
      await waitMiliseconds(5000);
      getLongTask("11");
      await waitMiliseconds(5000);
      expect([...promiseCache.keys()]).toHaveLength(1);
    });
    it("should delete both resolved tasks from cache", async () => {
      getLongTask("10");
      await waitMiliseconds(10000);
      getLongTask("20");
      await waitMiliseconds(12000);
      expect([...promiseCache.keys()]).toHaveLength(0);
    });
  });
});

async function waitMiliseconds(miliseconds: number) {
  jest.advanceTimersByTime(miliseconds);
}
