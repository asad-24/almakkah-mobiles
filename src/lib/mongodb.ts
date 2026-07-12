import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  serverSelectionTimeoutMS: 2500,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

export function getMongoClient() {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }

    return globalWithMongo._mongoClientPromise
  }

  if (!clientPromise) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}
