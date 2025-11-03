"use client"

import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Bell, Shield, Database, Palette, Save, Upload, Moon, Sun } from "lucide-react"

export function SettingsManagement() {
  const { theme, setTheme, primaryColor, setPrimaryColor, mounted } = useTheme()
  const [companySettings, setCompanySettings] = useState({
    name: "Empresa Exemplo Ltda",
    cnpj: "12.345.678/0001-90",
    email: "contato@empresa.com",
    phone: "(11) 99999-9999",
    address: "Rua Exemplo, 123 - São Paulo, SP",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    stockAlerts: true,
    fiscalAlerts: true,
    systemUpdates: false,
  })

  const [systemSettings, setSystemSettings] = useState({
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    currency: "BRL",
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    sidebarCompact: false,
    animations: true,
  })

  if (!mounted) return null

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
  }

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        {/* Configurações da Empresa */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-cnpj">CNPJ</Label>
                  <Input
                    id="company-cnpj"
                    value={companySettings.cnpj}
                    onChange={(e) => setCompanySettings({ ...companySettings, cnpj: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">E-mail</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input
                    id="company-phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Endereço</Label>
                <Textarea
                  id="company-address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-card rounded-lg flex items-center justify-center border">
                    <img src="/logo.png" alt="Company Logo" className="w-14 h-14 object-contain" />
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar Logo
                  </Button>
                </div>
              </div>
              <Button className="bg-primary hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas por E-mail</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações importantes por e-mail</p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Estoque</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando produtos estiverem com estoque baixo
                    </p>
                  </div>
                  <Switch
                    checked={notifications.stockAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, stockAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas Fiscais</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre vencimentos e obrigações fiscais</p>
                  </div>
                  <Switch
                    checked={notifications.fiscalAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, fiscalAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atualizações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações sobre novas funcionalidades</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                  />
                </div>
              </div>
              <Button className="bg-primary hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Alterar Senha</Label>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Senha atual" />
                    <Input type="password" placeholder="Nova senha" />
                    <Input type="password" placeholder="Confirmar nova senha" />
                  </div>
                  <Button variant="outline">Alterar Senha</Button>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <Label>Sessões Ativas</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="font-medium">Navegador Atual</p>
                          <p className="text-sm text-muted-foreground">Chrome - São Paulo, SP</p>
                        </div>
                        <span className="text-sm text-green-600">Ativo</span>
                      </div>
                    </div>
                    <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      Encerrar Todas as Sessões
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Formato de Data</Label>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Select
                    value={systemSettings.currency}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-primary hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalização da Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Modo de Tema</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        theme === "light" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                      <p className="text-sm font-medium">Modo Claro</p>
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                      <p className="text-sm font-medium">Modo Escuro</p>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
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
                        onClick={() => handlePrimaryColorChange(c.name)}
                        className={`w-8 h-8 ${c.color} rounded-full transition-all ${
                          primaryColor === c.name ? "ring-2 ring-offset-2 ring-primary" : "hover:ring-2 ring-offset-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label>Sidebar Compacta</Label>
                    <p className="text-sm text-muted-foreground">Manter a barra lateral sempre recolhida</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.sidebarCompact}
                    onCheckedChange={(checked) =>
                      setAppearanceSettings({ ...appearanceSettings, sidebarCompact: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label>Animações</Label>
                    <p className="text-sm text-muted-foreground">Habilitar transições e animações da interface</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.animations}
                    onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, animations: checked })}
                  />
                </div>
              </div>
              <Button className="bg-primary hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Aplicar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
