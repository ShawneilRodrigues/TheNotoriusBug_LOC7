"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Users, BarChart, MessageSquare, Settings } from "lucide-react"

export default function AdminDashboard() {
  const [chatInput, setChatInput] = useState("")

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Chat input:", chatInput)
    setChatInput("")
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <motion.aside 
        initial={{ x: -250 }} 
        animate={{ x: 0 }} 
        transition={{ duration: 0.5 }} 
        className="w-1/5 bg-blue-950 shadow-lg p-4"
      >
        <h2 className="text-2xl font-bold text-gray-200">Admin Dashboard</h2>
        <nav className="mt-6 flex flex-col gap-4">
          {[{ icon: Upload, label: "Upload & Manage", href: "#upload" },
            { icon: MessageSquare, label: "Train AI", href: "#train" },
            { icon: Users, label: "Company Users", href: "#users" },
            { icon: Settings, label: "Chatbot Customization", href: "#customize" },
            { icon: BarChart, label: "Analytics", href: "#analytics" },
          ].map((item, index) => (
            <Link key={index} href={item.href} className="flex items-center px-4 py-3 rounded-lg transition-all hover:bg-white hover:text-blue-900">
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.aside>
      <motion.main 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }} 
        className="flex-1 bg-gray-950/80 p-8 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[{ title: "Total Employees", value: "150" },
            { title: "Uploaded Documents", value: "45" },
            { title: "Chatbot Interactions", value: "1,234" },
          ].map((stat, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }}>
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList className="flex gap-2">
            <TabsTrigger value="upload">Upload & Manage</TabsTrigger>
            <TabsTrigger value="train">Train AI</TabsTrigger>
            <TabsTrigger value="users">Company Users</TabsTrigger>
            <TabsTrigger value="customize">Chatbot Customization</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" >
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <p className="text-gray-500 ml-3">Drag & drop files here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="train">
            <Card>
              <CardHeader>
                <CardTitle>Train AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Train your AI model using uploaded data.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Company Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage your company's users here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customize">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Customization</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Customize chatbot responses and behavior.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>View analytics related to AI interactions.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="absolute bottom-0 left-0 w-full p-4">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <Input
                  placeholder="Ask the AI..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}
