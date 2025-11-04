import { ProductMovement } from "@/components/product-movement"

export default function MovimentacaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Movimentação de Produtos</h1>
        <p className="text-muted-foreground mt-1">Registre entradas, saídas e empréstimos de produtos</p>
      </div>
      <ProductMovement />
    </div>
  )
}
