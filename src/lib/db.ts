import { getMongoClient } from "./mongodb"

export async function getDatabase() {
  const client = await getMongoClient()
  return client.db("zam-zam-mobile")
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}
