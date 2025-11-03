// Sistema de armazenamento local para simular banco de dados
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "manager" | "user"
  status: "active" | "inactive"
  department: string
  lastAccess: string
  avatar?: string
  createdAt: string
  companyId: string
}

export interface Product {
  id: string
  name: string
  category: string
  stock: number
  minimum: number
  price: string
  description?: string
  status: "normal" | "low" | "critical"
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  number: string
  type: "NF-e" | "NFC-e"
  date: string
  value: string
  status: "processed" | "pending" | "error"
  supplier: string
  fileName: string
  fileSize: number
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  createdAt: string
}

export interface Activity {
  id: string
  action: string
  description: string
  time: string
  icon: string
  color: string
  userId: string
}

export interface Company {
  id: string
  name: string
  cnpj: string
  email: string
  phone: string
  address: string
  logo?: string
  createdAt: string
}

// Funções de armazenamento
export const storage = {
  // Usuários
  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("workbox_users")
    return users ? JSON.parse(users) : []
  },

  saveUsers: (users: User[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_users", JSON.stringify(users))
  },

  addUser: (user: Omit<User, "id" | "createdAt">) => {
    const users = storage.getUsers()
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    storage.saveUsers(users)
    return newUser
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const users = storage.getUsers()
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      storage.saveUsers(users)
      return users[index]
    }
    return null
  },

  deleteUser: (id: string) => {
    const users = storage.getUsers().filter((u) => u.id !== id)
    storage.saveUsers(users)
  },

  // Produtos
  getProducts: (): Product[] => {
    if (typeof window === "undefined") return []
    const products = localStorage.getItem("workbox_products")
    return products ? JSON.parse(products) : []
  },

  saveProducts: (products: Product[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_products", JSON.stringify(products))
  },

  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "status">) => {
    const products = storage.getProducts()
    const status =
      product.stock <= product.minimum ? (product.stock <= product.minimum * 0.5 ? "critical" : "low") : "normal"

    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products.push(newProduct)
    storage.saveProducts(products)

    // Adicionar atividade
    storage.addActivity({
      action: "Produto adicionado",
      description: product.name,
      icon: "Plus",
      color: "text-green-600",
      userId: "current-user",
    })

    return newProduct
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const products = storage.getProducts()
    const index = products.findIndex((p) => p.id === id)
    if (index !== -1) {
      const updatedProduct = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      // Recalcular status
      updatedProduct.status =
        updatedProduct.stock <= updatedProduct.minimum
          ? updatedProduct.stock <= updatedProduct.minimum * 0.5
            ? "critical"
            : "low"
          : "normal"

      products[index] = updatedProduct
      storage.saveProducts(products)

      storage.addActivity({
        action: "Produto atualizado",
        description: updatedProduct.name,
        icon: "Package",
        color: "text-blue-600",
        userId: "current-user",
      })

      return updatedProduct
    }
    return null
  },

  deleteProduct: (id: string) => {
    const products = storage.getProducts()
    const product = products.find((p) => p.id === id)
    const filteredProducts = products.filter((p) => p.id !== id)
    storage.saveProducts(filteredProducts)

    if (product) {
      storage.addActivity({
        action: "Produto removido",
        description: product.name,
        icon: "Trash2",
        color: "text-red-600",
        userId: "current-user",
      })
    }
  },

  // Notas Fiscais
  getInvoices: (): Invoice[] => {
    if (typeof window === "undefined") return []
    const invoices = localStorage.getItem("workbox_invoices")
    return invoices ? JSON.parse(invoices) : []
  },

  saveInvoices: (invoices: Invoice[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_invoices", JSON.stringify(invoices))
  },

  addInvoice: (invoice: Omit<Invoice, "id" | "createdAt">) => {
    const invoices = storage.getInvoices()
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    invoices.push(newInvoice)
    storage.saveInvoices(invoices)

    storage.addActivity({
      action: "Nota fiscal processada",
      description: `${invoice.type} ${invoice.number}`,
      icon: "FileText",
      color: "text-blue-600",
      userId: "current-user",
    })

    return newInvoice
  },

  // Notificações
  getNotifications: (): Notification[] => {
    if (typeof window === "undefined") return []
    const notifications = localStorage.getItem("workbox_notifications")
    return notifications ? JSON.parse(notifications) : []
  },

  saveNotifications: (notifications: Notification[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_notifications", JSON.stringify(notifications))
  },

  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => {
    const notifications = storage.getNotifications()
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    notifications.unshift(newNotification) // Adicionar no início
    storage.saveNotifications(notifications.slice(0, 50)) // Manter apenas 50
    return newNotification
  },

  markNotificationAsRead: (id: string) => {
    const notifications = storage.getNotifications()
    const index = notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications[index].read = true
      storage.saveNotifications(notifications)
    }
  },

  markAllNotificationsAsRead: () => {
    const notifications = storage.getNotifications().map((n) => ({ ...n, read: true }))
    storage.saveNotifications(notifications)
  },

  // Atividades
  getActivities: (): Activity[] => {
    if (typeof window === "undefined") return []
    const activities = localStorage.getItem("workbox_activities")
    return activities ? JSON.parse(activities) : []
  },

  saveActivities: (activities: Activity[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_activities", JSON.stringify(activities))
  },

  addActivity: (activity: Omit<Activity, "id" | "time">) => {
    const activities = storage.getActivities()
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      time: new Date().toISOString(),
    }
    activities.unshift(newActivity) // Adicionar no início
    storage.saveActivities(activities.slice(0, 100)) // Manter apenas 100
    return newActivity
  },

  // Empresas
  getCompanies: (): Company[] => {
    if (typeof window === "undefined") return []
    const companies = localStorage.getItem("workbox_companies")
    return companies ? JSON.parse(companies) : []
  },

  saveCompanies: (companies: Company[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_companies", JSON.stringify(companies))
  },

  addCompany: (company: Omit<Company, "id" | "createdAt">) => {
    const companies = storage.getCompanies()
    const newCompany: Company = {
      ...company,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    companies.push(newCompany)
    storage.saveCompanies(companies)
    return newCompany
  },

  getCurrentCompany: (): Company | null => {
    if (typeof window === "undefined") return null
    const company = localStorage.getItem("workbox_current_company")
    return company ? JSON.parse(company) : null
  },

  setCurrentCompany: (company: Company) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_current_company", JSON.stringify(company))
  },

  getUserCompanies: (userId: string): Company[] => {
    const users = storage.getUsers()
    const user = users.find((u) => u.id === userId)
    if (!user) return []
    const companies = storage.getCompanies()
    return companies.filter((c) => c.id === user.companyId)
  },

  loginUser: (identifier: string, password: string): User | null => {
    const users = storage.getUsers()
    const user = users.find(
      (u) => (u.id === identifier || u.email === identifier) && u.password === password && u.status === "active",
    )
    if (user) {
      storage.setCurrentUser(user)
      const company = storage.getCompanies().find((c) => c.id === user.companyId)
      if (company) {
        storage.setCurrentCompany(company)
      }
      return user
    }
    return null
  },

  // Perfil do usuário atual
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("workbox_current_user")
    return user ? JSON.parse(user) : null
  },

  setCurrentUser: (user: User) => {
    if (typeof window === "undefined") return
    localStorage.setItem("workbox_current_user", JSON.stringify(user))
  },

  // Upload de avatar
  saveAvatar: (userId: string, file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        const user = storage.getCurrentUser()
        if (user && user.id === userId) {
          const updatedUser = { ...user, avatar: base64 }
          storage.setCurrentUser(updatedUser)
          storage.updateUser(userId, { avatar: base64 })
        }
        resolve(base64)
      }
      reader.readAsDataURL(file)
    })
  },
}

// Inicializar dados de exemplo
export const initializeData = () => {
  if (typeof window === "undefined") return

  // Usuários de exemplo
  if (storage.getUsers().length === 0) {
    const sampleUsers: User[] = [
      {
        id: "1",
        name: "João Silva",
        email: "joao.silva@empresa.com",
        password: "password123",
        role: "admin",
        status: "active",
        department: "TI",
        lastAccess: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        companyId: "1",
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria.santos@empresa.com",
        password: "password123",
        role: "manager",
        status: "active",
        department: "Vendas",
        lastAccess: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        companyId: "1",
      },
    ]
    storage.saveUsers(sampleUsers)
    storage.setCurrentUser(sampleUsers[0])
  }

  // Empresas de exemplo
  if (storage.getCompanies().length === 0) {
    const sampleCompanies: Company[] = [
      {
        id: "1",
        name: "Empresa XYZ",
        cnpj: "12345678901234",
        email: "contato@empresa.com",
        phone: "(11) 1234-5678",
        address: "Rua das Flores, 123, São Paulo",
        createdAt: new Date().toISOString(),
      },
    ]
    storage.saveCompanies(sampleCompanies)
  }

  // Produtos de exemplo
  if (storage.getProducts().length === 0) {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Notebook Dell Inspiron 15",
        category: "Eletrônicos",
        stock: 15,
        minimum: 10,
        price: "R$ 2.499,00",
        status: "normal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Mouse Logitech MX Master",
        category: "Periféricos",
        stock: 5,
        minimum: 15,
        price: "R$ 299,00",
        status: "low",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    storage.saveProducts(sampleProducts)
  }

  // Notificações de exemplo
  if (storage.getNotifications().length === 0) {
    storage.addNotification({
      title: "Estoque Baixo",
      message: "Mouse Logitech MX Master está com estoque baixo (5 unidades)",
      type: "warning",
      read: false,
    })

    storage.addNotification({
      title: "Bem-vindo ao WorkBox!",
      message: "Sistema inicializado com sucesso",
      type: "success",
      read: false,
    })
  }
}
