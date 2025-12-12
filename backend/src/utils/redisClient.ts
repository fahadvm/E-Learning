// import Redis from "ioredis";

// export const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   lazyConnect: false, 
// });

// redis.on("connect", () => console.log(" Redis Connected"));
// redis.on("error", (err) => console.error(" Redis Error:", err));


import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  lazyConnect: false,
});

redis.on("connect", () => console.log(" Redis Connected"));
redis.on("error", (err) => console.error(" Redis Error:", err));
