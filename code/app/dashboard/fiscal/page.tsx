import { FiscalManagement } from "@/components/fiscal-management"

export default function FiscalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestão Fiscal</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas notas fiscais e documentos</p>
      </div>

      <FiscalManagement />
    </div>
  )
}
