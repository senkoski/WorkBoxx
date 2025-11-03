"use client"

import type React from "react"
import { initializeData } from "@/lib/storage"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { storage } from "@/lib/storage"
import { authApi } from "@/lib/api"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await authApi.login(identifier, password)

      if (response.success && response.data?.user) {
        // Salvar token e dados do usuário
        localStorage.setItem("auth_token", response.data.token)
        storage.setCurrentUser(response.data.user)
        if (response.data.company) {
          storage.setCurrentCompany(response.data.company)
        }
        router.push("/dashboard")
      } else {
        setError(response.error || "ID/Email ou senha incorretos")
      }
    } catch (err) {
      setError("Erro na autenticação. Verifique se o backend está rodando.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-xl border-0">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl text-center">Acesse sua conta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="identifier">ID ou Email</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Digite seu ID ou email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:opacity-90"
            disabled={isLoading || !identifier || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}