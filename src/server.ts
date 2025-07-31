/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import envVars from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
const port = envVars.PORT || 5000;
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to Tour Management Backend DB");
    server = app.listen(port, () => {
      console.log(`Listening on Port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};
(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection detected , shutting down the server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("I forgot to handle this error"));
// Promise.reject(new Error("Unhandled Rejection"));

process.on("uncaughtException", (error) => {
  console.log("uncaught excetion detected , shutting down the server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// throw new Error("Uncaught Exception error");

process.on("SIGTERM", () => {
  console.log("SIGTERM signal detected , shutting down the server");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal detected , shutting down the server");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
