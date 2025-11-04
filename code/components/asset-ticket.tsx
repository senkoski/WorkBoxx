"use client"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AssetTicket() {
  const [type, setType] = useState("solicitacao")
  const [asset, setAsset] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode salvar o ticket no backend ou localStorage
    alert(`Ticket registrado: ${type}, Patrimônio: ${asset}`)
    setAsset("")
    setDescription("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Patrimônio</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Button type="button" variant={type === "solicitacao" ? "default" : "outline"} onClick={() => setType("solicitacao")}>Solicitação</Button>
            <Button type="button" variant={type === "devolucao" ? "default" : "outline"} onClick={() => setType("devolucao")}>Devolução</Button>
          </div>
          <Input placeholder="Patrimônio" value={asset} onChange={e => setAsset(e.target.value)} required />
          <Input placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} />
            <Button type="submit" className="bg-primary hover:bg-primary/80 w-full">Registrar Ticket</Button>
        </form>
      </CardContent>
    </Card>
  )
}
