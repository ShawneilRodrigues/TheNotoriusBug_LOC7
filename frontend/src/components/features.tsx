"use client"; // Required for Framer Motion in Next.js App Router

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Shield, Users } from "lucide-react";
import GradientText from "./gradient-text";

export default function FeaturesSection() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: index * 0.2, duration: 0.5, ease: "easeOut" },
    }),
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const features = [
    { icon: MessageCircle, title: "AI Responses", description: "Get instant, accurate answers powered by advanced AI" },
    { icon: Shield, title: "Enterprise-Grade Security", description: "Your data is encrypted and secure" },
    { icon: Users, title: "User Roles", description: "Separate admin and employee access for better control" },
  ];

  return (
    <section id="features" className="md:flex flex-col items-center justify-center md:h-[60vh] p-4 mb-20">
      <h2 className="text-4xl font-semibold text-center mb-16">
        <GradientText>Features</GradientText>
      </h2>

      <div className="grid w-full md:flex md:justify-between md:items-center grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={index} // Stagger animation
          >
            <Card className="bg-slate-200 flex items-center justify-center md:w-[300px] md:h-[250px] text-center shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
