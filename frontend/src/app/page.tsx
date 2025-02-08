'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HowItWorksSection from '@/components/how-it-works';
import FeaturesSection from '@/components/features';
import AnimatedContent from '@/components/animatedContent';
import LetterGlitch from '@/components/letterGlitchBackground';

export default function LandingPage() {
    return (
        <div className="relative min-h-screen bg-transparent overflow-hidden w-full flex flex-col">
            {/* ✅ Glitch Background with Gradient Fade */}
            <div className="absolute inset-0 -z-10 pointer-events-none w-screen">
                <LetterGlitch
                    glitchSpeed={50}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                />
                {/* ✅ Gradient Overlay Fix */}
                <div className="w-screen h-screen absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/50 to-black opacity-100" />
            </div>

            <header className="z-20 w-screen mx-auto px-0 py-6 absolute">
                <Navbar />
            </header>

            {/* ✅ Full-Width Main Section */}
            <main className="w-screen relative flex flex-col">
                <section className="w-screen text-center h-screen flex flex-col justify-center items-center p-4">
                    <AnimatedContent
                        distance={150}
                        direction="vertical"
                        reverse={false}
                        config={{ tension: 80, friction: 20 }}
                        initialOpacity={0.2}
                        animateOpacity
                        scale={1.1}
                        threshold={0.2}
                    >
                        <div className="w-full flex flex-col justify-center items-center">
                            <h1 className="text-5xl w-2/3 leading-normal font-bold text-white mb-6">
                                <div style={{ marginTop: '4rem' }}>
                                    Your AI-Powered Enterprise Support Agent
                                </div>
                            </h1>
                            <p className="text-xl bg-blue-800/40 text-white mb-8">
                                Empower your employees with instant, accurate
                                support
                            </p>
                            <Button
                                asChild
                                size="lg"
                            >
                                <Link href="/signup">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </AnimatedContent>
                </section>

                {/* ✅ Full-Width Sections */}
                <div className="w-screen">
                    <HowItWorksSection />
                </div>

                <div className="w-screen">
                    <FeaturesSection />
                </div>
            </main>

            <footer
                id="contact"
                className="w-auto mx-20 mb-10 rounded-md bg-gray-950/90 py-6"
            >
                <div className="container flex-col px-10 flex gap-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Contact Us
                            </h3>
                            <p className="text-gray-600">
                                Email: support@aisupportagent.com
                            </p>
                            <p className="text-gray-600">
                                Phone: (555) 123-4567
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-blue-800"
                                >
                                    Twitter
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-blue-800"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-blue-800"
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Legal</h3>
                            <div className="flex flex-col">
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-blue-800"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-blue-800"
                                >
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center text-center text-gray-200">
                        <h5 className="w-[320px] bg-blue-800/40">
                            © 2023 AISupportAgent. All rights reserved.
                        </h5>
                    </div>
                </div>
            </footer>
        </div>
    );
}
