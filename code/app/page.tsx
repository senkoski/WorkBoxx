"use client"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <Image src="/logo.png" alt="WorkBox Logo" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">WorkBox</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Sistema de Gestão Empresarial</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
