import { Request } from "Express";

// const express = require("express");
// const app = express();
// const port = 3000;

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// PROMISES

const promiseCache = new Map();

const createLongTask = (taskId: string): Promise<string> => {
  const promise: Promise<string> = new Promise((resolve) => {
    setTimeout(() => {
      resolve(taskId);
    }, 10000);
  });
  promiseCache.set(taskId, promise);
  return promise;
};

const getLongTask = (taskId: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
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

const asyncAwaitCache = new Map();

const createLongTaskAsync = (taskId: string): Promise<string> => {
  const promise: Promise<string> = new Promise((resolve) => {
    setTimeout(() => {
      resolve(taskId);
    }, 10000);
  });
  asyncAwaitCache.set(taskId, promise);
  return promise;
};

const getLongTaskAsync = async (taskId: string) => {
  try {
    if (asyncAwaitCache.has(taskId)) {
      const result = await asyncAwaitCache.get(taskId);
      asyncAwaitCache.delete(taskId);
      return result;
    }
    return createLongTaskAsync(taskId);
  } catch (error) {
    console.log(Error(error));
  }
};

console.time("a");
console.log(asyncAwaitCache);
getLongTaskAsync("10");
console.log(asyncAwaitCache);
setTimeout(() => {
  getLongTaskAsync("10").then(() => console.timeEnd("a"));
}, 1000);

console.log(asyncAwaitCache);
console.log(asyncAwaitCache);
// setTimeout(() => {
//   console.log("aaa");
//   console.log(asyncAwaitCache);
// }, 2000);

//array funkcji ktora zwraca promisy
