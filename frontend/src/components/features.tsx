'use client'; // Required for Framer Motion in Next.js App Router

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Shield, Users } from 'lucide-react';
import GradientText from './gradient-text';

export default function FeaturesSection() {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 30 },
        visible: (index: number) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { delay: index * 0.2, duration: 0.5, ease: 'easeOut' },
        }),
        hover: { 
            scale: 1.1, 
            boxShadow: '0px 10px 25px rgba(64, 121, 255, 0.4)', 
            transition: { duration: 0.3 } 
        }, // Glow effect with hover
    };

    const features = [
        {
            icon: MessageCircle,
            title: 'AI Responses',
            description: 'Get instant, accurate answers powered by advanced AI',
        },
        {
            icon: Shield,
            title: 'Enterprise-Grade Security',
            description: 'Your data is encrypted and secure',
        },
        {
            icon: Users,
            title: 'User Roles',
            description:
                'Separate admin and employee access for better control',
        },
    ];

    return (
        <section
            id="features"
            className="md:flex flex-col items-center justify-center p-4 h-[70vh] bg-gray-950/90 rounded-md mb-20 mx-20"
        >
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-4xl font-semibold text-center mb-16"
            >
                <GradientText
                    colors={[
                        '#40ffaa',
                        '#4079ff',
                        '#40ffaa',
                        '#4079ff',
                        '#40ffaa',
                    ]}
                    animationSpeed={3}
                    showBorder={false}
                >
                    Features
                </GradientText>
            </motion.h2>

            <div className="grid w-full md:flex md:justify-around md:items-center grid-cols-1 md:grid-cols-3 gap-10">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        custom={index} // Stagger animation
                    >
                        <Card className="bg-slate-200 flex flex-col items-center justify-center md:w-[320px] md:h-[280px] text-center shadow-lg transition-all duration-300 rounded-2xl p-6 border border-gray-300">
                            <CardContent className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="flex items-center justify-center"
                                >
                                    <feature.icon className="h-14 w-14 text-blue-500 mb-4" />
                                </motion.div>
                                <h3 className="text-2xl font-semibold mb-3 text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
