"use client"; // Required for Framer Motion in Next.js App Router

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import GradientText from "./gradient-text";

export default function HowItWorksSection() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 }, // Initial state
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: index * 0.2, duration: 0.5, ease: "easeOut" }, // Staggered animation
    }),
    hover: { scale: 1.05, transition: { duration: 0.2 } }, // Hover effect
  };

  return (
    <section className="md:flex flex-col items-center justify-center md:h-[60vh] p-4 mb-20">
      <h2 className="text-4xl font-semibold text-center mb-16">
        <GradientText>Features</GradientText>
      </h2>

      <div className="grid w-full md:flex md:justify-between md:items-center grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Admin Uploads Files", description: "Securely upload company policies and documents" },
          { title: "AI Trains", description: "Our AI processes and learns from your data" },
          { title: "Employees Chat", description: "Instant answers to employee queries" },
        ].map((step, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index} // Pass index for staggered delay
          >
            <Card className="bg-slate-200 flex items-center justify-center md:w-[300px] md:h-[250px] text-center shadow-md">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-500 mb-4">{index + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
