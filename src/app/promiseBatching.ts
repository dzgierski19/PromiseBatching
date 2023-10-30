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

const getLongTask = (taskId: string) => {
  if (promiseCache.has(taskId)) {
    createLongTask(taskId).then((taskId) => {
      promiseCache.get(taskId);
      promiseCache.delete(taskId);
    });
  }
  createLongTask(taskId).then((taskId) => {
    promiseCache.delete(taskId);
  });
};

getLongTask("10");
console.log(promiseCache);
setTimeout(() => {
  getLongTask("11");
  getLongTask("10");
  getLongTask("10");
  console.log(promiseCache);
}, 11000);

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
  if (asyncAwaitCache.has(taskId)) {
    await createLongTaskAsync(taskId);
    asyncAwaitCache.get(taskId);
    asyncAwaitCache.delete(taskId);
  }
  await createLongTaskAsync(taskId);
  asyncAwaitCache.delete(taskId);
};

getLongTaskAsync("10");
console.log(asyncAwaitCache);
setTimeout(() => {
  getLongTaskAsync("11");
  getLongTaskAsync("10");
  getLongTaskAsync("10");
  console.log(asyncAwaitCache);
}, 11000);

// app.get("/getPromise/:id", (req: Request, res) => {
//   const promiseTask = req.params.id;
//   res.send(promiseTask);
// });

// http://localhost:3000/getPromise/123123
