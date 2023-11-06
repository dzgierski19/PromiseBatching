import { Request } from "Express";

// PROMISES

export const promiseCache = new Map();

export const createLongTask = <T>(taskId: T): Promise<T> => {
  const promise: Promise<T> = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(taskId);
    }, 10000);
  });
  promiseCache.set(taskId, promise);
  return promise;
};

export const getLongTask = <T>(taskId: T): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    if (promiseCache.has(taskId)) {
      promiseCache.get(taskId).then((taskId) => {
        resolve(taskId);
      });
    }
    createLongTask(taskId).then((taskId) => {
      promiseCache.delete(taskId);
      resolve(taskId);
    });
  });
};

// ASYNC/AWAIT

export const asyncAwaitCache = new Map();

const createLongTaskAsync = <T>(taskId: T): Promise<T> => {
  const promise: Promise<T> = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(taskId);
    }, 10000);
  });
  asyncAwaitCache.set(taskId, promise);
  return promise;
};

export const getLongTaskAsync = async <T>(taskId: T): Promise<T> => {
  try {
    if (asyncAwaitCache.has(taskId)) {
      const result = await asyncAwaitCache.get(taskId);
      asyncAwaitCache.delete(taskId);
      return result;
    }
    await createLongTaskAsync(taskId);
    asyncAwaitCache.delete(taskId);
  } catch (error) {
    throw error;
  }
};
