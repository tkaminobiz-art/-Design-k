import { motion, AnimatePresence } from "framer-motion";
import { type KeywordDetail, DEFAULT_PROFILE, STREAM_KEYWORDS } from "../../lib/constants";
import { ScrambleText } from "./ScrambleText";

interface ContentLayerProps {
    selectedDetail: KeywordDetail | null;
    onSelect?: (keyword: string) => void;
}

const ContentLayer = ({ selectedDetail, onSelect }: ContentLayerProps) => {
    const displayData = selectedDetail || DEFAULT_PROFILE;
    const isMessage = displayData.layout === 'poem';

    // === GLOBAL ANIMATION VARIANTS ===
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
        }
    };

    return (
        <div className="fixed inset-0 z-10 w-full h-full pointer-events-none">
            {/* FLOATING NAVIGATION (Right Side Vertical) */}
            <div className="absolute top-0 right-0 h-full flex flex-col justify-center items-end pr-8 md:pr-12 z-50 pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mb-8 flex flex-col items-end"
                >
                    <h2 className="font-display text-[10px] tracking-[0.3em] text-accent/70 mb-4 writing-vertical-rl text-orientation-mixed rotate-180">INDEX_SYSTEM</h2>
                </motion.div>

                <nav className="flex flex-col gap-5 items-end">
                    {/* Philosophy Trigger */}
                    <NavButton
                        label="00. PHILOSOPHY"
                        isActive={selectedDetail?.context === "The Re-Editor"}
                        onClick={() => onSelect && onSelect('MESSAGE')}
                    />

                    {STREAM_KEYWORDS.map((keyword, i) => {
                        return (
                            <NavButton
                                key={keyword}
                                label={`${(i + 1).toString().padStart(2, '0')}. ${keyword}`}
                                isActive={false} // Simple highlight logic can be added if needed
                                onClick={() => onSelect && onSelect(keyword)}
                            />
                        );
                    })}
                </nav>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden p-8 md:p-24 pointer-events-auto no-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={displayData.context || "home"}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full min-h-full relative"
                    >
                        {/* === LAYOUT SWITCHER === */}

                        {/* 1. POEM / PHILOSOPHY */}
                        {isMessage ? (
                            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                                <motion.div
                                    variants={itemVariants}
                                    className="writing-vertical-rl text-orientation-upright text-primary text-sm md:text-base tracking-[0.3em] leading-loose font-serif h-[70vh] flex flex-wrap gap-12"
                                >
                                    {displayData.description.split('\n\n').map((block, i) => (
                                        <p key={i} className="whitespace-pre-wrap text-justify opacity-80 hover:opacity-100 transition-opacity duration-500">
                                            {block}
                                        </p>
                                    ))}
                                </motion.div>
                            </div>

                        ) : displayData.images ? (
                            // 2. WORKS / MASONRY
                            <div className="w-full max-w-7xl mx-auto pt-16 pr-32"> {/* Added padding-right to avoid nav overlaps */}
                                <motion.div variants={itemVariants} className="mb-20">
                                    <h1 className="font-display text-6xl md:text-9xl text-primary/10 font-bold tracking-tighter fixed top-4 left-8 pointer-events-none z-0">
                                        WORKS
                                    </h1>
                                    <h2 className="font-display text-4xl md:text-6xl text-primary font-bold relative z-10">
                                        <ScrambleText text={displayData.context} />
                                    </h2>
                                    <div className="h-1 w-24 bg-accent mt-4" />
                                </motion.div>

                                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                    {displayData.images.map((src, i) => (
                                        <motion.div
                                            key={i}
                                            variants={itemVariants}
                                            className="break-inside-avoid relative mb-8 group cursor-pointer"
                                            whileHover={{ y: -5, scale: 1.01 }}
                                        >
                                            <div className="overflow-hidden rounded-sm">
                                                <img
                                                    src={src}
                                                    alt={`Work ${i}`}
                                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="font-mono text-[10px] text-accent tracking-widest">PROJECT_0{i + 1}</span>
                                                <span className="font-display text-xs text-primary font-bold">VIEW DETAILS</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        ) : (
                            // 3. CORPORATE / STANDARD
                            <div className="relative w-full max-w-5xl mx-auto pt-8 md:pt-16">

                                {/* === BRANDING HEADER === */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-12 mb-16 border-b border-gray-200 pb-12"
                                >
                                    {/* Logo Mark */}
                                    <div className="relative group">
                                        <motion.img
                                            src="/design_k_logo.png"
                                            alt="Design K Logo"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 0.9 }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className="w-32 md:w-48 h-auto object-contain group-hover:opacity-100 transition-opacity shadow-lg"
                                        />
                                    </div>

                                    {/* Corporate Name */}
                                    <div className="flex flex-col">
                                        <h2 className="font-display text-5xl md:text-7xl text-primary font-bold tracking-tight leading-none">
                                            DESIGN K
                                        </h2>
                                        <span className="font-sans text-xs text-accent mt-3 tracking-[0.3em] font-medium opacity-80">
                                            STRATEGY / DESIGN / ENGINEERING
                                        </span>
                                    </div>
                                </motion.div>

                                {/* === PERSONAL PROFILE === */}
                                <motion.div variants={itemVariants} className="mb-16 pl-4 border-l-2 border-accent">
                                    {displayData.logo ? (
                                        <img
                                            src={displayData.logo}
                                            alt={displayData.context}
                                            className="w-64 md:w-96 h-auto object-contain mix-blend-multiply"
                                        />
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="font-mono text-[9px] text-gray-400 mb-3 block tracking-widest">{displayData.clearance}</span>
                                            <h1 className="font-sans text-4xl md:text-6xl text-primary font-medium tracking-tight">
                                                {displayData.context}
                                            </h1>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                                    {/* Metadata Column */}
                                    <motion.div variants={itemVariants} className="md:col-span-4 font-mono text-xs text-primary/60 space-y-6">
                                        <MetaItem label="ROLE" value={displayData.role} />
                                        <MetaItem label="ORIGIN" value={displayData.origin} />
                                        <MetaItem label="DATE" value={displayData.date || 'UNKNOWN'} />
                                    </motion.div>

                                    {/* Description Column */}
                                    <motion.div variants={itemVariants} className="md:col-span-8">
                                        <div className="prose prose-lg text-primary font-sans font-light leading-loose whitespace-pre-line text-justify">
                                            {displayData.description}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* MOBILE HEADER */}
            <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center md:hidden bg-canvas/90 backdrop-blur-sm z-50 border-b border-black/5">
                <span className="font-display text-sm font-bold text-primary">DESIGN K</span>
                <span className="font-mono text-[10px] text-primary/50">ARCHITECTURAL_WHITE</span>
            </div>
        </div>
    );
};

// === SUB-COMPONENTS ===

const MetaItem = ({ label, value }: { label: string, value?: string }) => (
    <div className="group">
        <span className="block text-accent mb-1 text-[9px] tracking-widest opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <span className="w-1 h-1 bg-accent rounded-full" /> {label}
        </span>
        <span className="font-sans font-medium text-sm">{value}</span>
    </div>
);

const NavButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ x: -5 }}
            className={`
                text-xs md:text-sm font-display tracking-widest transition-all duration-300 relative group text-right
                ${isActive ? 'text-accent font-bold' : 'text-primary/40 hover:text-primary'}
            `}
        >
            <span className="relative z-10">{label}</span>
            {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full"
                />
            )}
        </motion.button>
    );
};

export default ContentLayer;
