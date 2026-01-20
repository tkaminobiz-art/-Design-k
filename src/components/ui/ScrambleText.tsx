import { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_/-.[]';

export const ScrambleText = ({ text, duration = 1000, className = "" }: { text: string, duration?: number, className?: string }) => {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        let startTime = Date.now();
        let interval: any;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            if (progress === 1) {
                setDisplayText(text);
                clearInterval(interval);
                return;
            }

            const scrambled = text.split('').map((char) => {
                if (char === ' ') return ' ';
                // As progress increases, the probability of showing the correct char increases
                if (Math.random() < progress) return char;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');

            setDisplayText(scrambled);
        };

        interval = setInterval(animate, 30);
        return () => clearInterval(interval);
    }, [text, duration]);

    return <span className={className}>{displayText}</span>;
};
