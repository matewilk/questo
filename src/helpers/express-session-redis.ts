import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { RedisOptions } from "ioredis";
import { Express } from "express";

export default (app: Express, redisOptions: RedisOptions) => {
  const RedisStore = connectRedis(session);
  app.use(
    session({
      name: "questo.sess",
      store: new RedisStore({ client: new Redis(redisOptions) }),
      secret: process.env.COOKIE_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.ENVIRONMENT === "production",
        httpOnly: false,
      },
    })
  );
};
