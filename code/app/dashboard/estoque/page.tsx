import { StockManagement } from "@/components/stock-management"

export default function EstoquePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestão de Estoque</h1>
          <p className="text-muted-foreground mt-1">Controle seus produtos e inventário</p>
        </div>
      </div>

      <StockManagement />
    </div>
  )
}
