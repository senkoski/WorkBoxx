// Configuração centralized da API para integração com backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
  token?: string
}

// Função genérica para fazer requisições à API
export async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {}, token } = options

  try {
    const url = `${API_BASE_URL}${endpoint}`
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    // Adicionar token se fornecido ou existir no localStorage
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null)
    if (authToken) {
      defaultHeaders["Authorization"] = `Bearer ${authToken}`
    }

    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Erro na requisição",
      }
    }

    return {
      success: true,
      data: data.data || data,
    }
  } catch (error) {
    console.error(`[API] Erro na chamada ${endpoint}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// API de Autenticação
export const authApi = {
  login: (identifier: string, password: string) =>
    apiCall<{ user: any; token: string; company: any }>("/auth/login", {
      method: "POST",
      body: { identifier, password },
    }),

  register: (data: { name: string; email: string; password: string; companyId: string }) =>
    apiCall<{ user: any; token: string; company: any }>("/auth/register", {
      method: "POST",
      body: data,
    }),

  logout: () =>
    apiCall("/auth/logout", {
      method: "POST",
    }),
}

// API de Usuários
export const usersApi = {
  getUsers: () => apiCall<any[]>("/users", { method: "GET" }),

  getUser: (id: string) => apiCall<any>(`/users/${id}`, { method: "GET" }),

  createUser: (data: any) =>
    apiCall<any>("/users", {
      method: "POST",
      body: data,
    }),

  updateUser: (id: string, data: any) =>
    apiCall<any>(`/users/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteUser: (id: string) =>
    apiCall(`/users/${id}`, {
      method: "DELETE",
    }),

  getUserCompanies: (userId: string) => apiCall<any[]>(`/users/${userId}/companies`, { method: "GET" }),
}

// API de Empresas
export const companiesApi = {
  getCompanies: () => apiCall<any[]>("/companies", { method: "GET" }),

  getCompany: (id: string) => apiCall<any>(`/companies/${id}`, { method: "GET" }),

  createCompany: (data: any) =>
    apiCall<any>("/companies", {
      method: "POST",
      body: data,
    }),

  updateCompany: (id: string, data: any) =>
    apiCall<any>(`/companies/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteCompany: (id: string) =>
    apiCall(`/companies/${id}`, {
      method: "DELETE",
    }),
}

// API de Produtos
export const productsApi = {
  getProducts: (filters?: { search?: string; category?: string; status?: string }) =>
    apiCall<any[]>("/products", {
      method: "GET",
      headers: filters ? { "x-filters": JSON.stringify(filters) } : {},
    }),

  getProduct: (id: string) => apiCall<any>(`/products/${id}`, { method: "GET" }),

  createProduct: (data: any) =>
    apiCall<any>("/products", {
      method: "POST",
      body: data,
    }),

  updateProduct: (id: string, data: any) =>
    apiCall<any>(`/products/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteProduct: (id: string) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
    }),

  getStats: () => apiCall<any>("/products/stats/summary", { method: "GET" }),
}

// API de Notas Fiscais
export const invoicesApi = {
  getInvoices: (filters?: any) => apiCall<any[]>("/invoices", { method: "GET" }),

  getInvoice: (id: string) => apiCall<any>(`/invoices/${id}`, { method: "GET" }),

  uploadInvoice: (file: File, type: "NF-e" | "NFC-e") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    return fetch(`${API_BASE_URL}/invoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: formData,
    }).then((res) => res.json())
  },

  updateInvoice: (id: string, data: any) =>
    apiCall<any>(`/invoices/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteInvoice: (id: string) =>
    apiCall(`/invoices/${id}`, {
      method: "DELETE",
    }),
}

// API de Notificações
export const notificationsApi = {
  getNotifications: () => apiCall<any[]>("/notifications", { method: "GET" }),

  markAsRead: (id: string) =>
    apiCall(`/notifications/${id}/read`, {
      method: "POST",
    }),

  markAllAsRead: () =>
    apiCall("/notifications/read-all", {
      method: "POST",
    }),
}

// API de Atividades
export const activitiesApi = {
  getActivities: (limit = 50, offset = 0) =>
    apiCall<any[]>(`/activities?limit=${limit}&offset=${offset}`, { method: "GET" }),
}

// API de Dashboard
export const dashboardApi = {
  getStats: () => apiCall<any>("/dashboard/stats", { method: "GET" }),

  getRecentActivities: () => apiCall<any[]>("/dashboard/recent-activities", { method: "GET" }),

  getTopProducts: () => apiCall<any[]>("/dashboard/top-products", { method: "GET" }),

  getStockAlerts: () => apiCall<any[]>("/dashboard/stock-alert", { method: "GET" }),
}
