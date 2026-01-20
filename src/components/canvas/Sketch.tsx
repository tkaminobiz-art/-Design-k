import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { GlitchFilter } from 'pixi-filters';
import { STREAM_KEYWORDS, COLORS } from '../../lib/constants';

// --- CONFIG ---
const FONT_FAMILIES = {
    sans: 'Oswald',
    serif: 'Noto Serif JP'
};

const PHYSICS_CONFIG = {
    density: 0.1,    // Good weight
    restitution: 0.5, // Semi-elastic crash
    friction: 0.8,    // High friction (concrete)
};

interface SketchProps {
    onKeywordSelect: (keyword: string) => void;
}

const Sketch = ({ onKeywordSelect }: SketchProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const glitchRef = useRef<GlitchFilter | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const init = async () => {
            if (appRef.current) return;

            // --- PIXI SETUP ---
            const app = new PIXI.Application();
            await app.init({
                background: COLORS.bg,
                resizeTo: window,
                antialias: true,
                autoDensity: true,
                resolution: window.devicePixelRatio || 1,
            });

            if (containerRef.current) {
                containerRef.current.appendChild(app.canvas);
                appRef.current = app;
            }

            // --- FILTERS (Glitch) ---
            // NOTE: Disabled temporarily for stability verification
            /*
            const glitchFilter = new GlitchFilter({
                slices: 10,
                offset: 15,
                direction: 0,
                fillMode: 2, // Loop
                average: false,
                seed: 0,
                red: new PIXI.Point(2, 2),
                green: new PIXI.Point(-10, 4),
                blue: new PIXI.Point(10, -4),
            });
            glitchFilter.enabled = false; 
            */

            const mainStage = new PIXI.Container();
            app.stage.addChild(mainStage);
            // mainStage.filters = [glitchFilter];
            // glitchRef.current = glitchFilter;


            // --- MATTER.JS SETUP (Heavy Physics) ---
            const engine = Matter.Engine.create();
            engine.world.gravity.y = 2.0;
            engineRef.current = engine;

            // Walls 
            const wallOptions = { isStatic: true, friction: 1.0, restitution: 0.2 };
            const floor = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 150, window.innerWidth, 300, wallOptions);
            const leftWall = Matter.Bodies.rectangle(-150, window.innerHeight / 2, 300, window.innerHeight * 4, wallOptions);
            const rightWall = Matter.Bodies.rectangle(window.innerWidth + 150, window.innerHeight / 2, 300, window.innerHeight * 4, wallOptions);
            Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);


            // --- LAYERS ---
            const physicsContainer = new PIXI.Container();
            const streamContainer = new PIXI.Container();
            streamContainer.x = app.screen.width / 2;
            streamContainer.alpha = 0.6; // DIM THE CHAOS for Layer readability

            mainStage.addChild(streamContainer);
            mainStage.addChild(physicsContainer);


            // --- STREAM STATE ---
            const words = [...STREAM_KEYWORDS, ...STREAM_KEYWORDS, ...STREAM_KEYWORDS];
            const fontSizeBase = Math.min(window.innerWidth * 0.15, 160);
            const lineHeight = fontSizeBase * 1.2;
            const wordSprites: PIXI.Text[] = [];

            words.forEach((word, index) => {
                const isSerif = Math.random() > 0.6;
                const fontFamily = isSerif ? FONT_FAMILIES.serif : FONT_FAMILIES.sans;
                const fontWeight = isSerif ? '900' : '700';

                const style = new PIXI.TextStyle({
                    fontFamily: [fontFamily, 'sans-serif'],
                    fontSize: fontSizeBase,
                    fontWeight: fontWeight,
                    fill: COLORS.text,
                    align: 'center',
                    padding: 20,
                });

                const text = new PIXI.Text({ text: word, style });
                text.anchor.set(0.5);
                text.y = index * lineHeight;

                text.eventMode = 'static';
                text.cursor = 'pointer';
                text.on('pointerdown', () => {
                    const globalPos = text.getGlobalPosition();
                    spawnPhysicsWord(word, globalPos.x, globalPos.y, style.clone());
                    text.visible = false;
                    // Callback to React Layer
                    onKeywordSelect(word);

                    setTimeout(() => { text.visible = true; }, 4000);
                });

                streamContainer.addChild(text);
                wordSprites.push(text);
            });


            // --- PHYSICS SPAWN LOGIC ---
            const physicsObjects: { body: Matter.Body, sprite: PIXI.Text }[] = [];

            const spawnPhysicsWord = (word: string, x: number, y: number, style: PIXI.TextStyle) => {
                style.fill = Math.random() > 0.8 ? COLORS.danger : COLORS.accent;

                const sprite = new PIXI.Text({ text: word, style });
                sprite.anchor.set(0.5);
                sprite.x = x;
                sprite.y = y;
                sprite.scale.set(0.8);
                physicsContainer.addChild(sprite);

                const metrics = PIXI.CanvasTextMetrics.measureText(word, style);
                const width = metrics.width * 0.8;
                const height = metrics.height * 0.6;

                const body = Matter.Bodies.rectangle(x, y, width, height, {
                    ...PHYSICS_CONFIG,
                    angle: (Math.random() - 0.5) * 0.2
                });

                Matter.Composite.add(engine.world, body);
                physicsObjects.push({ body, sprite });

                triggerCrashEffect();
            };

            const triggerCrashEffect = () => {
                // if (!glitchRef.current) return;
                // glitchRef.current.enabled = true;
                // glitchRef.current.slices = Math.floor(Math.random() * 20) + 5;
                // glitchRef.current.offset = Math.random() * 50 + 20;

                // setTimeout(() => {
                //    if (glitchRef.current) glitchRef.current.enabled = false;
                // }, 200);
            };


            // --- GAME LOOP ---
            let scrollY = 0;
            let speed = 4.0;
            let targetSpeed = 4.0;

            const handleWheel = (e: WheelEvent) => {
                e.preventDefault();
                targetSpeed += e.deltaY * 0.1;
                targetSpeed = Math.min(Math.max(targetSpeed, 2.0), 30.0);
            };

            const handleOrientation = (event: DeviceOrientationEvent) => {
                const { gamma } = event;
                if (gamma !== null && engineRef.current) {
                    engineRef.current.world.gravity.x = Math.max(-1, Math.min(1, gamma / 45));
                }
            };

            // Mouse gravity tracking (desktop)
            const handleMouseMove = (event: MouseEvent) => {
                if (engineRef.current) {
                    const center = window.innerWidth / 2;
                    const gravityX = (event.clientX - center) / center;
                    engineRef.current.world.gravity.x = gravityX;
                }
            };


            window.addEventListener('wheel', handleWheel, { passive: false });
            window.addEventListener('deviceorientation', handleOrientation);
            window.addEventListener('mousemove', handleMouseMove);

            let elapsed = 0;
            app.ticker.add((ticker) => {
                elapsed += ticker.deltaTime;

                Matter.Engine.update(engine, ticker.deltaTime * 16.66);
                physicsObjects.forEach(({ body, sprite }) => {
                    sprite.x = body.position.x;
                    sprite.y = body.position.y;
                    sprite.rotation = body.angle;
                });

                speed += (targetSpeed - speed) * 0.05;
                if (Math.abs(targetSpeed) > 4.0) {
                    targetSpeed += (4.0 - targetSpeed) * 0.02;
                }

                scrollY -= speed * ticker.deltaTime;
                const totalHeight = words.length * lineHeight;

                if (scrollY < -totalHeight) scrollY += totalHeight;
                if (scrollY > 0) scrollY -= totalHeight;

                streamContainer.y = scrollY + (app.screen.height / 2);

                const stress = Math.abs(speed * 0.01);
                streamContainer.skew.y = Math.max(-0.8, Math.min(0.8, speed * 0.01));
                streamContainer.scale.y = 1 + stress;

                if (Math.random() > 0.98) {
                    mainStage.alpha = 0.8 + Math.random() * 0.2;
                } else {
                    mainStage.alpha = 1.0;
                }
            });
        };

        if (!appRef.current) init();

        return () => {
            window.removeEventListener('wheel', () => { });
            window.removeEventListener('deviceorientation', () => { });
            window.removeEventListener('mousemove', () => { });
            if (appRef.current) {
                appRef.current.destroy(true, { children: true, texture: true });
                appRef.current = null;
            }
            if (engineRef.current) Matter.Engine.clear(engineRef.current);
        };
    }, [onKeywordSelect]);

    return <div ref={containerRef} className="fixed inset-0 w-full h-full z-0 touch-none bg-black" />;
};

export default Sketch;
