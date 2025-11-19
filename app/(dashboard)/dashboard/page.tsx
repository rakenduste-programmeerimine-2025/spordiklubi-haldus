"use client"

import { TrendingUp, Users, CalendarDays } from "lucide-react"
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

// mock data
const chartData = [
  { week: "Week 1", activity: 210 },
  { week: "Week 2", activity: 280 },
  { week: "Week 3", activity: 320 },
  { week: "Week 4", activity: 260 },
]

const chartConfig = {
  activity: {
    label: "Training Activity",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export default function DashboardSection() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your club activity this month.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Training Activity</CardTitle>
            <CardDescription>Weekly breakdown for this month</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="w-full h-48"
            >
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, left: 20, right: 10, bottom: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="activity"
                  type="natural"
                  fill="blue"
                  fillOpacity={0.4}
                  stroke="blue"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>

          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  This month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  Week 1 – Week 4
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="grid gap-6 overflow-y-auto pr-2 max-h-[350px]">
          <Card className="bg-blue-50 border-l-4 border-blue-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Players</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">15</p>
              <p className="text-muted-foreground">
                Players currently registered
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-l-4 border-blue-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">3</p>
              <p className="text-muted-foreground">Scheduled for this week</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-l-4 border-blue-300">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">8</p>
              <p className="text-muted-foreground">
                Total training sessions & matches
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
