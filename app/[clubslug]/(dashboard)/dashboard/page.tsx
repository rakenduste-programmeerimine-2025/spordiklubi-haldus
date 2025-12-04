"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getDashboardStats } from "@/lib/api/dashboardApi"

import { Users, CalendarDays } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// ----------------- Types -----------------
type ChartSubject = "training" | "game"

type DashboardClientProps = {
  activePlayers: number
  activeCoaches: number
  trainingSessionsThisMonth: number
  leagueGamesThisMonth: number
  trainingMonthly: Array<{ label: string; activity: number }>
  gameMonthly: Array<{ label: string; activity: number }>
}

type DashboardStats = {
  activePlayers: number
  activeCoaches: number
  trainingSessions: number
  leagueGames: number
  trainingMonthly: Array<{ label: string; activity: number }>
  gameMonthly: Array<{ label: string; activity: number }>
}

// Chart config for shadcn chart
const chartConfig = {
  activity: {
    label: "Attendance",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

// ----------------- Metric pills -----------------

type MetricVariant =
  | "players"
  | "coaches"
  | "trainings"
  | "leagueGames"
  | "default"

function getVariantColors(variant: MetricVariant) {
  switch (variant) {
    case "players": {
      // green
      return {
        baseLight: "#BBF7D0",
        baseDark: "#16A34A",
        iconClass: "text-[#16A34A]",
      }
    }
    case "coaches": {
      // orange
      return {
        baseLight: "#FED7AA",
        baseDark: "#FB923C",
        iconClass: "text-[#FB923C]",
      }
    }
    case "trainings": {
      // blue
      return {
        baseLight: "#DBEAFE",
        baseDark: "#3156ff",
        iconClass: "text-[#3156ff]",
      }
    }
    case "leagueGames": {
      // purple
      return {
        baseLight: "#EDE9FE",
        baseDark: "#6D28D9",
        iconClass: "text-[#6D28D9]",
      }
    }
    default: {
      return {
        baseLight: "#E0E7FF",
        baseDark: "#3156ff",
        iconClass: "text-[#3156ff]",
      }
    }
  }
}

type IconType = React.ComponentType<{ className?: string }>

function MetricPill({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
}: {
  title: string
  value: number | string
  subtitle: string
  icon: IconType
  variant: MetricVariant
}) {
  const { baseLight, baseDark, iconClass } = getVariantColors(variant)

  return (
    <div className="relative">
      {/* dark arch */}
      <div
        className="absolute inset-0 rounded-[32px]"
        style={{ backgroundColor: baseDark }}
      />
      {/* light pill + content */}
      <div
        className="relative ml-2 rounded-[32px] px-6 py-4 md:px-7 md:py-5 shadow-sm transition-transform hover:-translate-y-0.5 flex flex-col gap-1.5"
        style={{ backgroundColor: baseLight }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm md:text-base font-semibold text-slate-900">
            {title}
          </p>
          <div className="h-7 w-7 flex items-center justify-center">
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </div>
        </div>
        <p
          className="text-3xl md:text-4xl text-slate-900 leading-tight font-light"
          style={{ fontWeight: 200 }}
        >
          {value}
        </p>
        <p className="text-[11px] md:text-xs text-slate-700">{subtitle}</p>
      </div>
    </div>
  )
}

// simple segmented control
function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { label: string; value: T }[]
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
      {options.map(option => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "px-3 md:px-4 py-1.5 text-xs md:text-sm rounded-full transition-all",
              isActive
                ? "bg-white shadow-sm text-slate-900"
                : "bg-transparent text-slate-500 hover:text-slate-800",
            ].join(" ")}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

// ----------------- Dashboard UI component -----------------

function DashboardClient({
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

  return (
    <div className="max-w-6xl mx-auto px-4 pt-2 pb-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back!</h1>
        <p className="text-slate-600">
          A quick overview of your team’s monthly activity and participation
        </p>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap gap-3">
        <SegmentedControl<ChartSubject>
          value={subject}
          onChange={setSubject}
          options={[
            { label: "Training", value: "training" },
            { label: "Games", value: "game" },
          ]}
        />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT: Chart card */}
        <Card className="rounded-[32px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2 space-y-1">
            <CardTitle className="text-base md:text-lg leading-snug">
              {chartTitle}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {chartDescription}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-1 pb-4">
            <ChartContainer
              key={chartKey}
              config={chartConfig}
              className="w-full h-60 mt-1"
            >
              <AreaChart
                data={currentData}
                accessibilityLayer
                margin={{ top: 10, left: 22, right: 22, bottom: 20 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  interval="preserveStartEnd"
                />

                <defs>
                  <linearGradient
                    id="attendanceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={areaColor}
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor={areaColor}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>

                <ChartTooltip
                  cursor={{ stroke: "#CBD5F5", strokeWidth: 1 }}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Area
                  dataKey="activity"
                  type="natural"
                  fill="url(#attendanceGradient)"
                  stroke={areaColor}
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive
                  animationDuration={500}
                  animationBegin={0}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="pt-0">
            <p className="text-xs md:text-sm text-slate-600">
              Based on players who marked themselves as going
            </p>
          </CardFooter>
        </Card>

        {/* RIGHT: Metric pills */}
        <div className="grid gap-4 md:grid-cols-2">
          <MetricPill
            title="Active players"
            value={activePlayers}
            subtitle="Registered team members"
            icon={Users}
            variant="players"
          />
          <MetricPill
            title="Active coaches"
            value={activeCoaches}
            subtitle="Coaches assigned to this team"
            icon={Users}
            variant="coaches"
          />
          <MetricPill
            title="Training sessions"
            value={trainingSessionsThisMonth}
            subtitle="Trainings scheduled this month"
            icon={CalendarDays}
            variant="trainings"
          />
          <MetricPill
            title="League games"
            value={leagueGamesThisMonth}
            subtitle="Games scheduled this month"
            icon={CalendarDays}
            variant="leagueGames"
          />
        </div>
      </div>
    </div>
  )
}

// ----------------- Page component (client-side data loading) -----------------

export default function DashboardPage() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error fetching user:", userError)
          throw userError
        }

        if (!user) {
          if (!isMounted) return
          setErrorMessage("You need to be signed in to view your club dashboard.")
          return
        }

        const {
          data: membership,
          error: membershipError,
        } = await supabase
          .from("member")
          .select("club_id")
          .eq("profile_id", user.id)
          .maybeSingle()

        if (membershipError || !membership?.club_id) {
          console.error("Membership error:", membershipError)
          if (!isMounted) return
          setErrorMessage("No club membership found for this account.")
          return
        }

        const clubId = membership.club_id

        const statsResult = await getDashboardStats(clubId)

        if (!isMounted) return
        setStats(statsResult)
      } catch (err) {
        console.error("Error loading dashboard stats:", err)
        if (isMounted) {
          setErrorMessage("Something went wrong loading your dashboard.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 text-sm text-slate-600">
        Loading dashboard...
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 text-sm text-slate-600">
        {errorMessage}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <DashboardClient
      activePlayers={stats.activePlayers}
      activeCoaches={stats.activeCoaches}
      trainingSessionsThisMonth={stats.trainingSessions}
      leagueGamesThisMonth={stats.leagueGames}
      trainingMonthly={stats.trainingMonthly}
      gameMonthly={stats.gameMonthly}
    />
  )
}