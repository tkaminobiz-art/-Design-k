import { useEffect, useRef } from "react";
import { Application, Geometry, Mesh, GlProgram, Shader } from "pixi.js";

export const DigitalFlowBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (appRef.current) {
            appRef.current.destroy({ removeView: true }, { children: true, texture: true, textureSource: true });
            appRef.current = null;
        }

        const app = new Application();

        const init = async () => {
            await app.init({
                resizeTo: window,
                backgroundAlpha: 1,
                backgroundColor: 0xF4F4F4,
                preference: 'webgl',
                antialias: false, // Turn off MSAA for shader textures (saves GPU)
                autoDensity: false, // Disable auto-scaling for CSS pixels
                resolution: 1, // Force 1:1 pixel ratio for performance (Fluid is soft anyway)
            });

            if (!containerRef.current) return;
            containerRef.current.appendChild(app.canvas);
            appRef.current = app;

            // === EXPLICIT GEOMETRY & MESH ===
            // Instead of using a Sprite + Filter (which relies on hidden geometry),
            // We define a raw Quad with explicit attributes.
            // This guarantees the Vertex Shader gets exactly what we promise it.

            const geometry = new Geometry({
                attributes: {
                    aPosition: [
                        -1, -1, // Bottom Left
                        1, -1, // Bottom Right
                        1, 1, // Top Right
                        -1, 1, // Top Left
                    ],
                    aUV: [
                        0, 0, // Bottom Left
                        1, 0, // Bottom Right
                        1, 1, // Top Right
                        0, 1, // Top Left
                    ]
                },
                indexBuffer: [0, 1, 2, 0, 2, 3]
            });

            // === ROBUST WEBGL1 SHADER ===
            const vertexSrc = `
                attribute vec2 aPosition;
                attribute vec2 aUV;
                varying vec2 vUV;
                
                void main() {
                    vUV = aUV;
                    // Draw a Full Screen Quad directly in NDC (Normalized Device Coordinates)
                    // No projection matrix needed if we just want to fill the screen
                    gl_Position = vec4(aPosition, 0.0, 1.0);
                }
            `;

            const fragmentSrc = `
                precision mediump float;
                varying vec2 vUV;
                uniform float uTime;
                uniform vec2 uResolution;

                // --- NOISE ---
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy) );
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i); 
                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                        + i.x + vec3(0.0, i1.x, 1.0 ));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m ;
                    m = m*m ;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                float fbm(vec2 x) {
                    float v = 0.0;
                    float a = 0.5;
                    vec2 shift = vec2(100.0);
                    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
                    for (int i = 0; i < 2; ++i) { // Optimized: Reduced octaves from 3 to 2
                        v += a * snoise(x);
                        x = rot * x * 2.0 + shift;
                        a *= 0.5;
                    }
                    return v;
                }

                void main() {
                    vec2 st = vUV;
                    // Correct Aspect Ratio
                    float aspect = uResolution.x / uResolution.y;
                    st.x *= aspect;
                    
                    st *= 3.0; // Scale

                    float t = uTime * 0.5; // Increased shader speed (was 0.1)

                    vec2 q = vec2(0.);
                    q.x = fbm( st + 0.00*t );
                    q.y = fbm( st + vec2(1.0));

                    vec2 r = vec2(0.);
                    r.x = fbm( st + 4.0*q + vec2(1.7,9.2)+ 0.15*t );
                    r.y = fbm( st + 4.0*q + vec2(8.3,2.8)+ 0.126*t );

                    float f = fbm( st + 4.0*r );

                    // COLORS - ARCHITECTURAL WHITE / ETHER (High Contrast Edition)
                    // We need deeper shadows to make the white liquid visible against the light background.
                    
                    vec3 color = mix(
                        vec3(0.92, 0.93, 0.94),    // Base: Light Grey (Shadows) - Increased darkness for visibility
                        vec3(1.0, 1.0, 1.0),       // Top: Pure White (Highlights)
                        clamp(f*f*2.5, 0.0, 1.0)
                    );

                    // Secondary flows - Metallic Silver/Blue tint
                    // Using darker grey-blue to create definition
                    color = mix(color, vec3(0.80, 0.82, 0.85), clamp(length(q), 0.0, 1.0) * 0.6);
                    
                    // Deepen creases
                    color = mix(color, vec3(0.70, 0.70, 0.75), clamp(r.x, 0.0, 1.0) * 0.4);
                    
                    // Final specular highlight
                    // color = mix(color, vec3(1.0), 0.4); // Removed global wash to preserve contrast

                    // Vignette
                    vec2 uv = gl_FragCoord.xy / uResolution.xy;
                    float v = 1.0 - smoothstep(0.6, 1.8, length(uv - 0.5));

                    gl_FragColor = vec4(color * v, 1.0);
                }
            `;

            const glProgram = new GlProgram({
                vertex: vertexSrc,
                fragment: fragmentSrc,
                name: 'explicit-mesh-shader'
            });

            const shader = new Shader({
                glProgram,
                resources: {
                    uniforms: {
                        uTime: { value: 0.0, type: 'f32' },
                        uResolution: { value: [window.innerWidth, window.innerHeight], type: 'vec2<f32>' },
                    }
                }
            });

            const mesh = new Mesh({ geometry, shader });
            app.stage.addChild(mesh);

            let time = 0;
            app.ticker.add((ticker) => {
                time += ticker.deltaTime * 0.05; // Increased base speed (was 0.01)
                shader.resources.uniforms.uniforms.uTime = time;
                // Add redundant update path for safety against v8 API quirks
                // @ts-ignore
                if (shader.resources.uTime) shader.resources.uTime = time;
            });

            const onResize = () => {
                app.renderer.resize(window.innerWidth, window.innerHeight);
                shader.resources.uniforms.uniforms.uResolution = [window.innerWidth, window.innerHeight];
            };
            window.addEventListener('resize', onResize);
        };

        init();

        return () => {
            if (appRef.current) {
                appRef.current.destroy({ removeView: true }, { children: true, texture: true, textureSource: true });
                appRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 bg-[#F4F4F4]"
        />
    );
};
