"use client"

import { LineChart, SpiderChart} from "@/components/charts"
import DonutChart from "@/components/doughnutchart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ChartConfig } from "@/components/ui/chart"

const wasteData = [
  { name: "Organic", value: 30, color: "#295bff" },
  { name: "Plastic", value: 20, color: "#4ab5ff" },
  { name: "Paper", value: 15, color: "#613eea" },
  { name: "Metal", value: 25, color: "#b5e2ff" },
  { name: "Others", value: 10, color: "#9db2ce" },
]
const wasteConfig = {
  Organic: {
      label: "Organic",
      color: "#295bff",
  },
  Plastic: {
      label: "Plastic",
      color: "#4ab5ff",
  },
  Paper: {
      label: "Paper",
      color: "#613eea",
  },
  Metal: {
      label: "Metal",
      color: "#b5e2ff",
  },
  Others: {
      label: "Others",
      color: "#9db2ce",
  },
} satisfies ChartConfig

const energyData = [
  { name: "Solar", value: 40, color: "#295bff" },
  { name: "Wind", value: 30, color: "#4ab5ff" },
  { name: "Non-Renewable", value: 30, color: "#613eea" },
]

const energyConfig = {
  Solar: {
    label: "Solar",
    color: "#295bff",
  },
  Wind: {
    label: "Wind",
    color: "#4ab5ff",
  },
  "Non-Renewable": {
    label: "Non-Renewable",
    color: "#613eea",
  },
} satisfies ChartConfig


export default function AnalyticsPage() {
  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>AQI</CardTitle>
          </CardHeader>
          <CardContent>
            <SpiderChart />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ambient Noise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87db</div>
              <LineChart color="blue" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Water Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">63</div>
                <span className="text-green-500">↑ 15%</span>
              </div>
              <LineChart color="green" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Congestion</CardTitle>
          </CardHeader>
            <CardContent>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Main_file-FxZmcY9A5KpycMmsbTrAXyYkVOq0oO.png"
              alt="Traffic Map"
              className="w-full rounded-lg"
              width={800}
              height={450}
            />
            </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Waste Segregation</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={wasteData} config={wasteConfig}/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Energy Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={energyData} config={energyConfig} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

