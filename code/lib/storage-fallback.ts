// Fallback para when backend não está disponível - usa localStorage como backup
// Mantém a compatibilidade com a versão atual enquanto integra com backend

import type { User } from "@/lib/storage"

export const storageFallback = {
  // Simula delay de rede
  delay: (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms)),

  // Login fallback quando backend não responde
  async loginFallback(identifier: string, password: string): Promise<User | null> {
    await this.delay()
    // Usa dados do localStorage como fallback
    if (typeof window === "undefined") return null

    const users = JSON.parse(localStorage.getItem("workbox_users") || "[]") as User[]
    const user = users.find(
      (u) => (u.id === identifier || u.email === identifier) && u.password === password && u.status === "active",
    )

    return user || null
  },

  // Wrapper que tenta backend primeiro, depois fallback
  async withFallback<T>(apiCall: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
      return await apiCall()
    } catch (error) {
      console.warn("[Storage Fallback] Backend não disponível, usando fallback")
      return await fallback()
    }
  },
}
