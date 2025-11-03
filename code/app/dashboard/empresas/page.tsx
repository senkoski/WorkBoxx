import { CompaniesManagement } from "@/components/companies-management"

export default function EmpresasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestão de Empresas</h1>
        <p className="text-muted-foreground mt-1">Cadastre e gerencie as empresas do sistema</p>
      </div>

      <CompaniesManagement />
    </div>
  )
}