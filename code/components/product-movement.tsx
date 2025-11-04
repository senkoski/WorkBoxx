"use client"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ProductMovement() {
  const [type, setType] = useState("entrada")
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode salvar a movimentação no backend ou localStorage
    alert(`Movimentação registrada: ${type}, Produto: ${product}, Quantidade: ${quantity}`)
    setProduct("")
    setQuantity(1)
    setDescription("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Movimentação</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Button type="button" variant={type === "entrada" ? "default" : "outline"} onClick={() => setType("entrada")}>Entrada</Button>
            <Button type="button" variant={type === "saida" ? "default" : "outline"} onClick={() => setType("saida")}>Saída</Button>
            <Button type="button" variant={type === "emprestimo" ? "default" : "outline"} onClick={() => setType("emprestimo")}>Empréstimo</Button>
          </div>
          <Input placeholder="Produto" value={product} onChange={e => setProduct(e.target.value)} required />
          <Input type="number" min={1} placeholder="Quantidade" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
          <Input placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} />
           <Button type="submit" className="bg-primary hover:bg-primary/80 w-full">Registrar</Button>
        </form>
      </CardContent>
    </Card>
  )
}
