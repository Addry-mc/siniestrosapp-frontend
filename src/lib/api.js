import { auth } from "./firebase"

// Empty base URL because Vite dev proxy handles all routes.
// In production, set VITE_API_URL to the backend origin.
export const baseUrl = import.meta.env.VITE_API_URL || ""

export async function getToken() {
    const user = auth.currentUser
    if (!user) return null
    return user.getIdToken()
}

export async function api(path, options = {}) {
    const token = await getToken()
    const headers = new Headers(options.headers || {})
    if (typeof options.body === "string" && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
    }
    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }
    return fetch(`${baseUrl}${path}`, { ...options, headers })
}
