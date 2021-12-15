import http from "http";
import https from "https";
import { Express } from "express";

type HttpConfig = {
  ssl: boolean;
  port: number;
  hostname: string;
};

interface Config {
  [key: string]: HttpConfig;
}

export default (app: Express) => {
  const configurations: Config = {
    development: { ssl: false, port: 4000, hostname: "localhost " },
    production: { ssl: true, port: 443, hostname: "production" },
  };

  const environment: string = process.env.NODE_ENV || "production";
  const config = configurations[environment];

  const crt = config.ssl ? { key: "", cert: "" } : {};

  return config.ssl ? https.createServer(crt, app) : http.createServer(app);
};
