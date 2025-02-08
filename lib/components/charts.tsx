"use client"

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"
// import { Card } from "@/components/ui/card"
import { ChartContainer,ChartConfig } from "@/components/ui/chart"
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig



const spiderData = [
  { subject: "PM2.5", A: 65, B: 85 },
  { subject: "O3", A: 59, B: 49 },
  { subject: "SO2", A: 80, B: 90 },
  { subject: "CO", A: 81, B: 39 },
  { subject: "NO2", A: 56, B: 85 },
  { subject: "PM10", A: 55, B: 53 },
  { subject: "Pb", A: 48, B: 24 },
]

const lineData = Array.from({ length: 20 }, () => ({
  value: Math.floor(Math.random() * 100),
}))


export function SpiderChart() {
  return (
    <ChartContainer className="h-[300px]" config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={spiderData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar name="Current" dataKey="A" stroke="#295bff" fill="#295bff" fillOpacity={0.5} />
          <Radar name="Previous" dataKey="B" stroke="#613eea" fill="#613eea" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export function LineChart({ color = "blue" }) {
  return (
    <ChartContainer className="h-[100px]" config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={lineData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color === "blue" ? "#295bff" : "#4ab5ff"}
            strokeWidth={2}
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


