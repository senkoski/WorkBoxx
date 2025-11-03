"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, User } from "lucide-react"
import { storage, type User as UserType } from "@/lib/storage"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onUserUpdate: (user: UserType) => void
}

export function ProfileModal({ isOpen, onClose, user, onUserUpdate }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    // Simular delay de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedUser = storage.updateUser(user.id, formData)
    if (updatedUser) {
      storage.setCurrentUser(updatedUser)
      onUserUpdate(updatedUser)

      // Adicionar notificação
      storage.addNotification({
        title: "Perfil Atualizado",
        message: "Suas informações foram atualizadas com sucesso",
        type: "success",
        read: false,
      })
    }

    setIsLoading(false)
    onClose()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      storage.addNotification({
        title: "Erro no Upload",
        message: "A imagem deve ter no máximo 5MB",
        type: "error",
        read: false,
      })
      return
    }

    try {
      const avatarUrl = await storage.saveAvatar(user.id, file)
      const updatedUser = { ...user, avatar: avatarUrl }
      onUserUpdate(updatedUser)

      storage.addNotification({
        title: "Foto Atualizada",
        message: "Sua foto de perfil foi atualizada com sucesso",
        type: "success",
        read: false,
      })
    } catch (error) {
      storage.addNotification({
        title: "Erro no Upload",
        message: "Não foi possível atualizar a foto de perfil",
        type: "error",
        read: false,
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const roles = {
      admin: { label: "Administrador", color: "bg-red-100 text-red-800" },
      manager: { label: "Gerente", color: "bg-blue-100 text-blue-800" },
      user: { label: "Usuário", color: "bg-green-100 text-green-800" },
    }
    const roleInfo = roles[role as keyof typeof roles]
    return <Badge className={roleInfo?.color}>{roleInfo?.label}</Badge>
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                {getRoleBadge(user.role)}
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{user.department}</span>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <Label className="text-xs text-gray-500">Último Acesso</Label>
                <p>{new Date(user.lastAccess).toLocaleString("pt-BR")}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Membro desde</Label>
                <p>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
