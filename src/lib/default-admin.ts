import crypto from "crypto"

export const DEFAULT_ADMIN_USERNAME = "alihassan"
export const DEFAULT_ADMIN_PASSWORD = "ali@12345$$"
export const DEFAULT_ADMIN_EMAIL = "alihassan@almakkahmobile.local"

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function getDefaultAdminToken() {
  return crypto
    .createHash("sha256")
    .update(`${DEFAULT_ADMIN_USERNAME}:${DEFAULT_ADMIN_PASSWORD}:almakkah-admin`)
    .digest("hex")
}

export function isDefaultAdminLogin(username: string, password: string) {
  return username.trim().toLowerCase() === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD
}
