import { SettingsManagement } from "@/components/settings-management"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Configure as preferências do sistema</p>
      </div>

      <SettingsManagement />
    </div>
  )
}
