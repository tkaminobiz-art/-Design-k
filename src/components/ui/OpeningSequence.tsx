import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface OpeningSequenceProps {
    onComplete: () => void;
}

export const OpeningSequence = ({ onComplete }: OpeningSequenceProps) => {
    const [step, setStep] = useState<'boot' | 'flash' | 'reveal' | 'complete'>('boot');

    useEffect(() => {
        // Timeline
        const bootTime = 2000;
        const flashTime = 3800; // Extended (was 2500) -> Adds 1.3s to "DESIGN K" display
        const revealTime = 5300; // Shifted (was 4000) -> Keeps reveal duration consistent

        setTimeout(() => setStep('flash'), bootTime);
        setTimeout(() => setStep('reveal'), flashTime);
        setTimeout(() => {
            setStep('complete');
            setTimeout(onComplete, 500); // Allow exit animation to finish
        }, revealTime);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {step !== 'complete' && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-[#F4F4F4] text-primary overflow-hidden flex items-center justify-center"
                    exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
                >
                    {/* STEP 1: BOOT SEQUENCE (System Logic) */}
                    {step === 'boot' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="font-mono text-xs md:text-sm text-accent tracking-[0.3em] flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    SYSTEM_BOOT
                                </motion.div>
                                <div className="h-px w-24 bg-accent/30" />
                                <Typewriter text="RE:EDITING_REALITY..." />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: LOGO FLASH (Brand Identity) */}
                    {step === 'flash' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.0, opacity: 1 }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative z-10"
                            >
                                <img
                                    src="/design_k_logo.png"
                                    alt="DESIGN K"
                                    className="w-48 md:w-80 h-auto object-contain drop-shadow-2xl"
                                />
                            </motion.div>

                            {/* Kinetic Lines (Architectural) */}
                            <motion.div
                                className="absolute top-1/2 left-0 w-full h-px bg-black/5"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            />
                            <motion.div
                                className="absolute left-1/2 top-0 h-full w-px bg-black/5"
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            />
                        </div>
                    )}

                    {/* STEP 3: REVEAL (The Canvas) */}
                    {step === 'reveal' && (
                        <div className="absolute inset-0 bg-[#F4F4F4] flex items-center justify-center">
                            <motion.div
                                className="font-sans font-bold text-6xl md:text-9xl text-white tracking-tighter opacity-50"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1 }} // Zoom through effect
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            >
                                DESIGN K
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Simple Typewriter Helper
const Typewriter = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState("");

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplay(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);
        return () => clearInterval(timer);
    }, [text]);

    return <span>{display}<span className="animate-pulse">_</span></span>;
};
