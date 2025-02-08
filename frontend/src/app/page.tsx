import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MessageCircle, Shield, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">AISupportAgent</div>
          <div className="space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link href="#features" className="text-gray-600 hover:text-gray-800">
              Features
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-800">
              Contact Us
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Your AI-Powered Enterprise Support Agent</h1>
          <p className="text-xl text-gray-600 mb-8">Empower your employees with instant, accurate support</p>
          <Button asChild size="lg">
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Admin Uploads Files", description: "Securely upload company policies and documents" },
              { title: "AI Trains", description: "Our AI processes and learns from your data" },
              { title: "Employees Chat", description: "Instant answers to employee queries" },
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-blue-500 mb-4">{index + 1}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="features" className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "AI Responses",
                description: "Get instant, accurate answers powered by advanced AI",
              },
              { icon: Shield, title: "Enterprise-Grade Security", description: "Your data is encrypted and secure" },
              {
                icon: Users,
                title: "User Roles",
                description: "Separate admin and employee access for better control",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-600">Email: support@aisupportagent.com</p>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Twitter
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Facebook
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-600">© 2023 AISupportAgent. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

