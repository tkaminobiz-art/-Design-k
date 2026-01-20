import { useRef, useEffect } from 'react';

type ArtMode = 'PHILOSOPHY' | 'STRUCTURE' | 'ORGANIC' | 'DEFAULT';

interface GenerativeArtProps {
    mode?: ArtMode;
}

const THEMES: Record<ArtMode, {
    palette: string[];
    shapes: ('rect' | 'circle' | 'line' | 'arc' | 'polygon')[];
    density: number;
    speedMod: number;
    composite: GlobalCompositeOperation[];
}> = {
    PHILOSOPHY: {
        palette: ['#E6FF00', '#FF3300', '#00FFFF', '#FFFFFF', '#FF00FF', '#333333'],
        shapes: ['rect', 'circle', 'line', 'arc', 'polygon'],
        density: 80,
        speedMod: 1.0,
        composite: ['screen', 'overlay']
    },
    STRUCTURE: {
        palette: ['#00FFFF', '#FFFFFF', '#0033FF', '#333333', '#111111'],
        shapes: ['rect', 'line'],
        density: 50,
        speedMod: 0.5,
        composite: ['source-over', 'screen']
    },
    ORGANIC: {
        palette: ['#E6FF00', '#FF9900', '#FFFFFF', '#222222', '#550000'],
        shapes: ['circle', 'arc'],
        density: 60,
        speedMod: 0.7,
        composite: ['multiply', 'screen'] // Experimental mix
    },
    DEFAULT: {
        palette: ['#E6FF00', '#FFFFFF', '#333333'],
        shapes: ['rect', 'line', 'circle'],
        density: 40,
        speedMod: 0.8,
        composite: ['source-over']
    }
};

interface Fragment {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    speedX: number;
    speedY: number;
    type: 'rect' | 'circle' | 'line' | 'arc' | 'polygon';
    rotation: number;
    rotationSpeed: number;
}

export const GenerativeArt = ({ mode = 'DEFAULT' }: GenerativeArtProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let fragments: Fragment[] = [];

        const theme = THEMES[mode] || THEMES.DEFAULT;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initFragments();
        };

        const initFragments = () => {
            fragments = [];
            const count = theme.density; // Increased density
            for (let i = 0; i < count; i++) {
                const shape = theme.shapes[Math.floor(Math.random() * theme.shapes.length)];

                fragments.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    w: Math.random() * 300 + 10,
                    h: Math.random() * 300 + 10,
                    color: theme.palette[Math.floor(Math.random() * theme.palette.length)],
                    speedX: (Math.random() - 0.5) * 0.5 * theme.speedMod,
                    speedY: (Math.random() - 0.5) * 0.5 * theme.speedMod,
                    type: shape,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.005
                });
            }
        };

        const draw = () => {
            // "Trail" effect for subjectivity/dream-like state
            ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Soft clear

            fragments.forEach((f, i) => {
                ctx.save();
                ctx.translate(f.x, f.y);
                ctx.rotate(f.rotation);

                // Varied composite modes for "Experimental" feel
                ctx.globalCompositeOperation = theme.composite[i % theme.composite.length];
                ctx.globalAlpha = 0.4;

                ctx.fillStyle = f.color;
                ctx.strokeStyle = f.color;
                ctx.lineWidth = i % 3 === 0 ? 1 : 3;

                if (f.type === 'rect') {
                    ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
                } else if (f.type === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, f.w / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (f.type === 'line') {
                    ctx.beginPath();
                    ctx.moveTo(-f.w / 2, 0);
                    ctx.lineTo(f.w / 2, 0);
                    ctx.stroke();
                } else if (f.type === 'arc') {
                    ctx.beginPath();
                    ctx.arc(0, 0, f.w / 2, 0, Math.PI * (1 + Math.random())); // Partial arc
                    ctx.stroke();
                } else if (f.type === 'polygon') {
                    const sides = Math.floor(Math.random() * 3) + 3; // 3 to 5 sides
                    const radius = f.w / 2;
                    ctx.beginPath();
                    ctx.moveTo(radius * Math.cos(0), radius * Math.sin(0));
                    for (let j = 1; j <= sides; j++) {
                        ctx.lineTo(radius * Math.cos(j * 2 * Math.PI / sides), radius * Math.sin(j * 2 * Math.PI / sides));
                    }
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();

                // Move
                f.x += f.speedX;
                f.y += f.speedY;
                f.rotation += f.rotationSpeed;

                // Wrap
                if (f.x > canvas.width + 300) f.x = -300;
                if (f.x < -300) f.x = canvas.width + 300;
                if (f.y > canvas.height + 300) f.y = -300;
                if (f.y < -300) f.y = canvas.height + 300;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mode]); // Re-run when mode changes

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none transition-opacity duration-1000" />;
};
