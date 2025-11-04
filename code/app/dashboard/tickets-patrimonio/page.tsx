import { AssetTicket } from "@/components/asset-ticket"

export default function TicketsPatrimonioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tickets de Patrimônio</h1>
        <p className="text-muted-foreground mt-1">Solicite ou acompanhe tickets de patrimônio</p>
      </div>
      <AssetTicket />
    </div>
  )
}
