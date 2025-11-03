import { ReportsManagement } from "@/components/reports-management"

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground mt-1">Análises e relatórios do seu negócio</p>
      </div>

      <ReportsManagement />
    </div>
  )
}
