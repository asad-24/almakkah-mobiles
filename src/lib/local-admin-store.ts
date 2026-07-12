import { mkdir, readFile, writeFile } from "fs/promises"
import { dirname, join } from "path"

type CollectionName = "products" | "offers" | "gallery"

interface LocalStore {
  products: Record<string, unknown>[]
  offers: Record<string, unknown>[]
  gallery: Record<string, unknown>[]
}

const STORE_PATH = join(process.cwd(), ".local-data", "admin-store.json")

const defaultStore: LocalStore = {
  products: [],
  offers: [],
  gallery: [],
}

export function createLocalId() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export async function readLocalStore(): Promise<LocalStore> {
  try {
    const content = await readFile(STORE_PATH, "utf8")
    return { ...defaultStore, ...JSON.parse(content) }
  } catch {
    return { ...defaultStore }
  }
}

async function writeLocalStore(store: LocalStore) {
  await mkdir(dirname(STORE_PATH), { recursive: true })
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2))
}

export async function listLocalItems(collection: CollectionName) {
  const store = await readLocalStore()
  return store[collection]
}

export async function insertLocalItem(collection: CollectionName, item: Record<string, unknown>) {
  const store = await readLocalStore()
  const now = new Date().toISOString()
  const localItem = {
    ...item,
    _id: createLocalId(),
    createdAt: item.createdAt ?? now,
    updatedAt: item.updatedAt ?? now,
  }

  store[collection] = [localItem, ...store[collection]]
  await writeLocalStore(store)
  return localItem
}

export async function updateLocalItem(collection: CollectionName, id: string, updates: Record<string, unknown>) {
  const store = await readLocalStore()
  const index = store[collection].findIndex((item) => item._id === id)

  if (index === -1) {
    return null
  }

  const updatedItem = {
    ...store[collection][index],
    ...updates,
    _id: id,
    updatedAt: new Date().toISOString(),
  }

  store[collection][index] = updatedItem
  await writeLocalStore(store)
  return updatedItem
}

export async function deleteLocalItem(collection: CollectionName, id: string) {
  const store = await readLocalStore()
  const nextItems = store[collection].filter((item) => item._id !== id)
  const deleted = nextItems.length !== store[collection].length

  if (deleted) {
    store[collection] = nextItems
    await writeLocalStore(store)
  }

  return deleted
}

export function isLocalId(id: string) {
  return id.startsWith("local_")
}
