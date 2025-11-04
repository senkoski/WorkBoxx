"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light")
  const [primaryColor, setPrimaryColorState] = useState<string>("green")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const savedColor = localStorage.getItem("primaryColor") as string | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
    const initialColor = savedColor || "green"

    setThemeState(initialTheme)
    setPrimaryColorState(initialColor)
    updateTheme(initialTheme, initialColor)
  }, [])

  const updateTheme = (newTheme: "light" | "dark", color: string = primaryColor) => {
    const html = document.documentElement
    if (newTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }

    const colorMap: Record<string, string> = {
      green: "142 76% 36%",
      blue: "217.2 91.2% 59.8%",
      purple: "262.1 80% 50.4%",
      red: "0 84.2% 60.2%",
      orange: "24.6 95% 53.1%",
    }

    // Atualiza cor primária global
    html.style.setProperty("--primary", colorMap[color] || colorMap["green"])

    // Atualiza variáveis do sidebar para refletir a cor primária
    html.style.setProperty("--sidebar-primary", colorMap[color] || colorMap["green"])
    html.style.setProperty("--sidebar-ring", colorMap[color] || colorMap["green"])
    html.style.setProperty("--sidebar-accent", colorMap[color] || colorMap["green"])

    localStorage.setItem("theme", newTheme)
    localStorage.setItem("primaryColor", color)
  }

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme)
    updateTheme(newTheme, primaryColor)
  }

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color)
    updateTheme(theme, color)
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return { theme, setTheme, toggleTheme, primaryColor, setPrimaryColor, mounted }
}
