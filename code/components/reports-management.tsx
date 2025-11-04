"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, FileText, Package, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/date-picker-range"

const reportTypes = [
  {
    id: "inventory",
    title: "Relatório de Estoque",
    description: "Status atual e movimentação do estoque",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "fiscal",
    title: "Relatório Fiscal",
    description: "Notas fiscais e documentos processados",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "users",
    title: "Relatório de Usuários",
    description: "Atividade e acesso dos usuários",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const recentReports = [
  {
    name: "Estoque - Dezembro 2023",
    type: "Estoque",
    date: "2024-01-15",
    status: "completed",
    size: "1.8 MB",
  },
  {
    name: "Fiscal - Q4 2023",
    type: "Fiscal",
    date: "2024-01-10",
    status: "processing",
    size: "4.1 MB",
  },
  {
    name: "Usuários - Janeiro 2024",
    type: "Usuários",
    date: "2024-01-05",
    status: "completed",
    size: "0.8 MB",
  },
]

export function ReportsManagement() {
  const [selectedReport, setSelectedReport] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReports, setGeneratedReports] = useState(recentReports)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case "processing":
        return <Badge variant="secondary">Processando</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedReport || !selectedPeriod) {
      alert("Por favor, selecione o tipo de relatório e o período.")
      return
    }

    setIsGenerating(true)

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      const reportTypeNames = {
        inventory: "Estoque",
        fiscal: "Fiscal",
        users: "Usuários"
      }

      const periodNames = {
        today: "Hoje",
        week: "Esta Semana",
        month: "Este Mês",
        quarter: "Este Trimestre",
        year: "Este Ano",
        custom: "Período Personalizado"
      }

      const newReport = {
        name: `${reportTypeNames[selectedReport as keyof typeof reportTypeNames]} - ${periodNames[selectedPeriod as keyof typeof periodNames]}`,
        type: reportTypeNames[selectedReport as keyof typeof reportTypeNames],
        date: new Date().toISOString().split('T')[0],
        status: "completed" as const,
        size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      }

      setGeneratedReports(prev => [newReport, ...prev])

      // Reset form
      setSelectedReport("")
      setSelectedPeriod("")
      setShowCustomDatePicker(false)

      alert("Relatório gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      alert("Erro ao gerar relatório. Tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (report: typeof recentReports[0]) => {
    let csvContent = ""
    let filename = ""

    // Generate CSV content based on report type
    switch (report.type) {
      case "Estoque":
        csvContent = `Nome,Categoria,Estoque,Mínimo,Preço,Status
Produto A,Eletrônicos,50,10,299.99,normal
Produto B,Móveis,25,5,899.99,low
Produto C,Ferramentas,100,20,49.99,normal
Produto D,Limpeza,5,10,19.99,critical`
        filename = `relatorio_estoque_${report.date}.csv`
        break

      case "Fiscal":
        csvContent = `Número,Data,Valor,Status,Fornecedor
NF-e 001,${report.date},1500.00,processada,Empresa A Ltda
NF-e 002,${report.date},750.50,pending,Empresa B S.A.
NF-e 003,${report.date},2200.75,processada,Empresa C Comércio
NFC-e 001,${report.date},89.99,processada,Loja X`
        filename = `relatorio_fiscal_${report.date}.csv`
        break

      case "Usuários":
        csvContent = `Nome,Email,Cargo,Departamento,Último Acesso
João Silva,joao.silva@empresa.com,Administrador,TI,${report.date}
Maria Santos,maria.santos@empresa.com,Gerente,Vendas,${report.date}
Pedro Costa,pedro.costa@empresa.com,Usuário,Estoque,${report.date}
Ana Oliveira,ana.oliveira@empresa.com,Usuário,Fiscal,${report.date}`
        filename = `relatorio_usuarios_${report.date}.csv`
        break

      default:
        csvContent = `Tipo,Data,Status
${report.type},${report.date},${report.status}`
        filename = `relatorio_${report.date}.csv`
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Gerar Novo Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Gerar Novo Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Relatório de Estoque</SelectItem>
                  <SelectItem value="fiscal">Relatório Fiscal</SelectItem>
                  <SelectItem value="users">Relatório de Usuários</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select
                value={selectedPeriod}
                onValueChange={(value) => {
                  setSelectedPeriod(value)
                  setShowCustomDatePicker(value === "custom")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                className="w-full bg-primary hover:bg-primary/80"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {isGenerating ? "Gerando..." : "Gerar Relatório"}
              </Button>
            </div>
          </div>
          {showCustomDatePicker && (
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Selecione o período personalizado</label>
              <DatePickerWithRange />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tipos de Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${report.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <report.icon className={`h-6 w-6 ${report.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Relatórios Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Tipo: {report.type}</span>
                      <span>Data: {new Date(report.date).toLocaleDateString("pt-BR")}</span>
                      <span>Tamanho: {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(report.status)}
                  {report.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport(report)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
