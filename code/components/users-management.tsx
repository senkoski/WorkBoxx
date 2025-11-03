"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddUserModal } from "@/components/add-user-modal"
import { EditUserModal } from "@/components/edit-user-modal"
import { Edit, Plus, Search, Trash2, Shield, Eye } from "lucide-react"
import { usersApi } from "@/lib/api"

const roles = {
  admin: { label: "Administrador", color: "bg-red-100 text-red-800" },
  manager: { label: "Gerente", color: "bg-blue-100 text-blue-800" },
  user: { label: "Usuário", color: "bg-green-100 text-green-800" },
}

export function UsersManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await usersApi.getUsers()
        if (response.success && response.data) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()

    // Recarregar periodicamente para refletir mudanças do banco
    const interval = setInterval(loadUsers, 5000)
    return () => clearInterval(interval)
  }, [])

  const getRoleBadge = (role: keyof typeof roles) => {
    const roleInfo = roles[role]
    return <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case "inactive":
        return <Badge variant="secondary">Inativo</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await usersApi.deleteUser(id)
        if (response.success) {
          // Recarregar usuários após exclusão
          const usersResponse = await usersApi.getUsers()
          if (usersResponse.success && usersResponse.data) {
            setUsers(usersResponse.data)
          }
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error)
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5" />
              Usuários do Sistema
            </CardTitle>
            <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cargos</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">Carregando usuários...</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{getRoleBadge(user.role as keyof typeof roles)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          {new Date(user.lastAccess).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(user.lastAccess).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedUser(user)
                              setIsEditModalOpen(true)
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Departamento:</span>
                          <span>{user.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cargo:</span>
                          {getRoleBadge(user.role as keyof typeof roles)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Último acesso:</span>
                          <span>{new Date(user.lastAccess).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => {
                          setSelectedUser(user)
                          setIsEditModalOpen(true)
                        }}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Permissões por Cargo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5" />
            Permissões por Cargo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-red-800 mb-3">Administrador</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Acesso total ao sistema</li>
                <li>• Gerenciar usuários</li>
                <li>• Configurações avançadas</li>
                <li>• Relatórios completos</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Gerente</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Gestão de estoque</li>
                <li>• Relatórios departamentais</li>
                <li>• Aprovação de processos</li>
                <li>• Visualizar dados fiscais</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">Usuário</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Consultar produtos</li>
                <li>• Registrar movimentações</li>
                <li>• Relatórios básicos</li>
                <li>• Perfil pessoal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSuccess={() => {
          const loadUsers = async () => {
            try {
              const response = await usersApi.getUsers()
              if (response.success && response.data) {
                setUsers(response.data)
              }
            } catch (error) {
              console.error("Erro ao carregar usuários:", error)
            }
          }
          loadUsers()
        }}
        user={selectedUser}
      />
    </div>
  )
}
