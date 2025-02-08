"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageCircle, Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import GradientText from "@/components/gradient-text";
import DecryptedText from "@/components/decripted-text";
import { motion } from "framer-motion";
import HowItWorksSection from "@/components/how-it-works";
import FeaturesSection from "@/components/features";

// bg-gradient-to-b from-gray-50 to-white
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-200">
      <header className="min-w-full container mx-auto px-4 py-6">
        <Navbar />
      </header>

      <main className="container rounded-t-[200px] bg-[#E0E1E6] mx-auto px-4 py-12">
        <section className="text-center h-[60vh] flex flex-col justify-center items-center p-4 mb-20">
          <h1 className="text-5xl w-2/3 leading-normal font-bold text-gray-900 mb-6">
            <div style={{ marginTop: "4rem" }}>
              <DecryptedText
                text="Your AI-Powered Enterprise Support Agent"
                animateOn="view"
                revealDirection="center"
              />
            </div>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Empower your employees with instant, accurate support
          </p>
          <motion.div
      whileHover={{ scale: 1.05 }} // Slightly increase size on hover
      whileTap={{ scale: 0.95 }} // Slightly shrink on click
      transition={{ type: "spring", stiffness: 300, damping: 15 }} // Smooth spring effect
    >
      <Button asChild size="lg" className="relative overflow-hidden">
        <Link href="/signup">
          Get Started 
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </motion.div>

        </section>

        <HowItWorksSection />

        <FeaturesSection />
      </main>

      <footer id="contact" className="bg-slate-200 py-8">
        <div className="container py-4 px-10 md:flex-col flex gap-10 mx-auto">
          <div className="flex items-center md:justify-between justify-center gap-8">
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
          <div className="mt-8 flex justify-center text-center text-gray-600">
            <h5 className="w-[320px] bg-[#E0E1E6]">
              © 2023 AISupportAgent. All rights reserved.
            </h5>
          </div>
        </div>
      </footer>
    </div>
  );
}
