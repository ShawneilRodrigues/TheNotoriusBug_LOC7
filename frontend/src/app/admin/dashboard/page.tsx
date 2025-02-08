"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Users, BarChart, MessageSquare, Settings } from "lucide-react"

export default function AdminDashboard() {
  const [chatInput, setChatInput] = useState("")

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically call your API to get AI response
    console.log("Chat input:", chatInput)
    setChatInput("")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-6">
          {[
            { icon: Upload, label: "Upload & Manage", href: "#upload" },
            { icon: MessageSquare, label: "Train AI", href: "#train" },
            { icon: Users, label: "Company Users", href: "#users" },
            { icon: Settings, label: "Chatbot Customization", href: "#customize" },
            { icon: BarChart, label: "Analytics", href: "#analytics" },
          ].map((item, index) => (
            <Link key={index} href={item.href} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
              <item.icon className="h-5 w-5 mr-2" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { title: "Total Employees", value: "150" },
            { title: "Uploaded Documents", value: "45" },
            { title: "Chatbot Interactions", value: "1,234" },
          ].map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">Upload & Manage</TabsTrigger>
            <TabsTrigger value="train">Train AI</TabsTrigger>
            <TabsTrigger value="users">Company Users</TabsTrigger>
            <TabsTrigger value="customize">Chatbot Customization</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="train" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Train AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p>AI training options and controls will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p>A table listing employees and their roles will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customize" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Customization</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Chatbot customization options will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Chatbot usage analytics and insights will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Chatbot testing area */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Chatbot Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <Input
                placeholder="Type your question here..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

