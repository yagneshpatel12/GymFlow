import mongoose from "mongoose";
import dns from "node:dns";

/**
 * Some networks hand Node an IPv6 DNS resolver that its internal c-ares
 * resolver can't use for SRV/TXT lookups, breaking `mongodb+srv://` with
 * `querySrv ECONNREFUSED`. Pointing the resolver at reliable IPv4 DNS fixes
 * SRV resolution. `dns.lookup` (host connection) still uses the OS resolver.
 */
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);
} catch {
  // non-fatal: fall back to system resolver
}

/**
 * Cached Mongoose connection.
 * Next.js hot-reloads modules in dev, which would otherwise open a new
 * connection on every change and exhaust the Atlas connection pool. We cache
 * the connection promise on the global object to reuse it across reloads.
 */

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? {
  conn: null,
  promise: null,
};
global._mongoose = cached;

/**
 * Connect with a few retries. Some networks intermittently return
 * `querySrv ECONNREFUSED` on the SRV lookup for `mongodb+srv://`; a short
 * retry rides through the blip instead of failing the whole request.
 */
async function connectWithRetry(
  uri: string,
  attempts = 3,
): Promise<typeof mongoose> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await mongoose.connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      });
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add your Atlas connection string to .env.local.",
    );
  }

  if (!cached.promise) {
    cached.promise = connectWithRetry(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
