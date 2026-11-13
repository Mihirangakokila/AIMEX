import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  _aimexMongoose?: MongooseCache;
  _aimexDbDownUntil?: number;
};

const cache: MongooseCache = globalForMongoose._aimexMongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose._aimexMongoose = cache;

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local and restart the server.");
  }

  if (Date.now() < (globalForMongoose._aimexDbDownUntil ?? 0)) {
    throw new Error("Database unavailable. Check that MongoDB is running.");
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 4000, bufferCommands: false })
      .then((connection) => {
        cache.conn = connection;
        return connection;
      })
      .catch((error: unknown) => {
        cache.promise = null;
        cache.conn = null;
        globalForMongoose._aimexDbDownUntil = Date.now() + 10000;
        throw error;
      });
  }

  return cache.promise;
}
