"use client"

import { useState } from "react"
import { Users, CalendarDays } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// types
type ChartSubject = "training" | "game"

type DashboardClientProps = {
  activePlayers: number
  activeCoaches: number
  trainingSessionsThisMonth: number
  leagueGamesThisMonth: number
  trainingMonthly: any[]
  gameMonthly: any[]
}

export function DashboardClient({
  activePlayers,
  activeCoaches,
  trainingSessionsThisMonth,
  leagueGamesThisMonth,
  trainingMonthly,
  gameMonthly,
}: DashboardClientProps) {

  const [subject, setSubject] = useState<ChartSubject>("training")

  const isTraining = subject === "training"
  const currentData = isTraining ? trainingMonthly : gameMonthly

  const chartTitle = isTraining ? "Training attendance" : "Game attendance"
  const chartDescription = isTraining
    ? "Total training attendance by month this year"
    : "Total game attendance by month this year"

  const areaColor = isTraining ? "#3156ff" : "#6D28D9"
  const chartKey = subject

  // ... ⬆️ ülejäänud sinu UI kood (chart + pills) jääb täpselt samaks
  // Kopeerime selle hiljem siia, kui server-pool töötab.

  return (
    <>YOUR UI GOES HERE — paneme kohe!</>
  )
}