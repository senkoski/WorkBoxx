"use client"

import type React from "react"
import { storage } from "@/lib/storage"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X } from "lucide-react"

export function FileUploadArea() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    setIsUploading(true)

    try {
      for (const file of files) {
        // Simular processamento do arquivo XML
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Gerar dados fictícios baseados no arquivo
        const invoice = {
          number: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
          type: file.name.toLowerCase().includes("nfce") ? "NFC-e" : ("NF-e" as "NF-e" | "NFC-e"),
          date: new Date().toISOString().split("T")[0],
          value: `R$ ${(Math.random() * 5000 + 500).toFixed(2).replace(".", ",")}`,
          status: Math.random() > 0.8 ? "error" : ("processed" as "processed" | "pending" | "error"),
          supplier: `Fornecedor ${Math.floor(Math.random() * 100)}`,
          fileName: file.name,
          fileSize: file.size,
        }

        storage.addInvoice(invoice)
      }

      storage.addNotification({
        title: "Upload Concluído",
        message: `${files.length} arquivo(s) processado(s) com sucesso`,
        type: "success",
        read: false,
      })

      setFiles([])
    } catch (error) {
      storage.addNotification({
        title: "Erro no Upload",
        message: "Não foi possível processar os arquivos",
        type: "error",
        read: false,
      })
    }

    setIsUploading(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload de Notas Fiscais</h3>
          <p className="text-gray-600 mb-4">Arraste e solte seus arquivos XML aqui ou clique para selecionar</p>
          <input type="file" multiple accept=".xml" onChange={handleFileSelect} className="hidden" id="file-upload" />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer bg-transparent">
              Selecionar Arquivos
            </Button>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Arquivos Selecionados:</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={uploadFiles} className="bg-green-600 hover:bg-green-700" disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Processando..." : "Processar Arquivos"}
              </Button>
              <Button variant="outline" onClick={() => setFiles([])}>
                Limpar Lista
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
