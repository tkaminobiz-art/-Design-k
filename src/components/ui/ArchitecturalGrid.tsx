import { motion } from 'framer-motion';

export const ArchitecturalGrid = () => {
    // A subtle SVG overlay or pure CSS grid is handled in global CSS. 
    // This component adds dynamic "architectural" elements like crosshairs or floating labels.

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* CROSSHAIRS / REGISTRATION MARKS */}
            {/* Top Left */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-8 left-8 w-4 h-4 border-l border-t border-accent/50"
            />
            {/* Top Right */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-8 right-8 w-4 h-4 border-r border-t border-accent/50"
            />
            {/* Bottom Left */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 left-8 w-4 h-4 border-l border-b border-accent/50"
            />
            {/* Bottom Right */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 right-8 w-4 h-4 border-r border-b border-accent/50"
            />

            {/* RULER LINES (Horizontal) */}
            <div className="absolute top-[33%] left-0 w-full h-px bg-grid-line opacity-50" />
            <div className="absolute top-[66%] left-0 w-full h-px bg-grid-line opacity-50" />

            {/* RULER LINES (Vertical) */}
            <div className="absolute left-[33%] top-0 h-full w-px bg-grid-line opacity-50" />
            <div className="absolute left-[66%] top-0 h-full w-px bg-grid-line opacity-50" />

            {/* FLOATING DATA LABELS */}

        </div>
    );
};
