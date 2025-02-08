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
    hover: {
      scale: 1.1,
      boxShadow: "0px 10px 20px rgba(64, 121, 255, 0.4)",
      transition: { duration: 0.3 },
    }, // Glow effect with hover
  };

  return (
    <section className="md:flex flex-col items-center justify-center p-4 h-[70vh] bg-gray-950/90 rounded-md mx-20">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-semibold text-center mb-16"
      >
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
        >
          How it works?
        </GradientText>
      </motion.h2>

      <div className="grid w-full md:flex md:justify-around md:items-center grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Admin Uploads Files",
            description: "Securely upload company policies and documents.",
          },
          {
            title: "AI Trains",
            description: "Our AI processes and learns from your data.",
          },
          {
            title: "Employees Chat",
            description: "Instant answers to employee queries.",
          },
        ].map((step, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index} // Pass index for staggered delay
          >
            <Card className="bg-slate-200 flex flex-col items-center justify-center md:w-[320px] md:h-[280px] text-center shadow-lg transition-all duration-300 rounded-2xl p-6 border border-gray-300">
              <CardContent className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-5xl font-bold text-blue-500 mb-4"
                >
                  {index + 1}
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
