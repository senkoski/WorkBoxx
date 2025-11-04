"use client"

import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function SettingsManagement() {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme()
  // Notificações
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [stockAlerts, setStockAlerts] = useState(false)
  // Segurança
  const [twoFactor, setTwoFactor] = useState(false)
  // Sistema
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [dailyBackup, setDailyBackup] = useState(false)
  // Aparência
  const [sidebarCompact, setSidebarCompact] = useState(false)
  const [animations, setAnimations] = useState(false)

  // Carregar valores do localStorage ao montar
  useState(() => {
    setEmailAlerts(JSON.parse(localStorage.getItem("emailAlerts") || "false"))
    setStockAlerts(JSON.parse(localStorage.getItem("stockAlerts") || "false"))
    setTwoFactor(JSON.parse(localStorage.getItem("twoFactor") || "false"))
    setAutoUpdate(JSON.parse(localStorage.getItem("autoUpdate") || "false"))
    setDailyBackup(JSON.parse(localStorage.getItem("dailyBackup") || "false"))
    setSidebarCompact(JSON.parse(localStorage.getItem("sidebarCompact") || "false"))
    setAnimations(JSON.parse(localStorage.getItem("animations") || "false"))
  })

  const handleApply = () => {
    localStorage.setItem("emailAlerts", JSON.stringify(emailAlerts))
    localStorage.setItem("stockAlerts", JSON.stringify(stockAlerts))
    localStorage.setItem("twoFactor", JSON.stringify(twoFactor))
    localStorage.setItem("autoUpdate", JSON.stringify(autoUpdate))
    localStorage.setItem("dailyBackup", JSON.stringify(dailyBackup))
    localStorage.setItem("sidebarCompact", JSON.stringify(sidebarCompact))
    localStorage.setItem("animations", JSON.stringify(animations))
  }
  return (
    <div className="space-y-6">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-medium">Alertas por E-mail</span>
                    <p className="text-sm text-muted-foreground">Receber notificações importantes por e-mail</p>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-medium">Alertas de Estoque</span>
                    <p className="text-sm text-muted-foreground">Receber avisos sobre produtos em estoque baixo</p>
                  </div>
                  <Switch checked={stockAlerts} onCheckedChange={setStockAlerts} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Alterar Senha</span>
                  <Button variant="outline">Alterar</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Autenticação em 2 Fatores</span>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Atualizações Automáticas</span>
                  <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Backup Diário</span>
                  <Switch checked={dailyBackup} onCheckedChange={setDailyBackup} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        {/* Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg font-semibold">Personalização da Interface</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                {/* Modo de Tema */}
                <div className="mb-4">
                  <span className="block font-medium mb-2">Modo de Tema</span>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className={`p-4 border-2 rounded-lg flex flex-col items-center transition-all bg-transparent hover:border-primary/50 ${theme === "light" ? "border-primary bg-primary/10" : "border-border"}`}
                      onClick={() => setTheme("light")}
                    >
                      <svg className="h-6 w-6 mb-2 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                      <span className="text-sm font-medium">Modo Claro</span>
                    </button>
                    <button
                      className={`p-4 border-2 rounded-lg flex flex-col items-center transition-all bg-transparent hover:border-primary/50 ${theme === "dark" ? "border-primary bg-primary/10" : "border-border"}`}
                      onClick={() => setTheme("dark")}
                    >
                      <svg className="h-6 w-6 mb-2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" /></svg>
                      <span className="text-sm font-medium">Modo Escuro</span>
                    </button>
                  </div>
                </div>

                {/* Cor Primária */}
                <div className="mb-4">
                  <span className="block font-medium mb-2">Cor Primária</span>
                  <div className="flex gap-3">
                    {[
                      { name: "green", color: "bg-green-600" },
                      { name: "blue", color: "bg-blue-600" },
                      { name: "purple", color: "bg-purple-600" },
                      { name: "red", color: "bg-red-600" },
                      { name: "orange", color: "bg-orange-600" },
                    ].map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setPrimaryColor(c.name)}
                        className={`w-8 h-8 ${c.color} rounded-full transition-all ${
                          primaryColor === c.name ? "ring-2 ring-offset-2 ring-primary" : "hover:ring-2 ring-offset-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar Compacta */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <span className="font-medium">Sidebar Compacta</span>
                    <p className="text-sm text-muted-foreground">Manter a barra lateral sempre recolhida</p>
                  </div>
                  <Switch checked={sidebarCompact} onCheckedChange={setSidebarCompact} />
                </div>

                {/* Animações */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <span className="font-medium">Animações</span>
                    <p className="text-sm text-muted-foreground">Habilitar transições e animações da interface</p>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>
              </div>
              <Button className="bg-green-600 hover:opacity-90 mt-6 flex items-center gap-2" onClick={handleApply}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                Aplicar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
