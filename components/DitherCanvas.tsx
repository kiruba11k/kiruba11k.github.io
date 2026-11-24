"use client";

import { useEffect, useRef } from "react";
import { usePrefs, useReducedMotion } from "@/lib/prefs";

/**
 * Procedural "Vice Coast" sunset rendered in a WebGL fragment shader.
 * The scene outputs a single brightness value which is then either
 *  - ordered-dithered (8x8 Bayer) into a 6-colour palette at a coarse pixel grid, or
 *  - read back at cell resolution and drawn as ASCII glyphs on a 2D canvas.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uDither;
uniform vec3 uP0;uniform vec3 uP1;uniform vec3 uP2;uniform vec3 uP3;uniform vec3 uP4;uniform vec3 uP5;

float hash(float n){return fract(sin(n*127.1)*43758.5453);}
float bayer2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}
float bayer4(vec2 a){return bayer2(.5*a)*.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(.5*a)*.25+bayer2(a);}

float palm(vec2 p, vec2 base, float h, float lean, float sway){
  float m=0.;
  float t=clamp((p.y-base.y)/h,0.,1.);
  float cx=base.x+lean*t*t;
  if(p.y>base.y&&p.y<base.y+h&&abs(p.x-cx)<.0075*(1.15-t*.45))m=1.;
  vec2 top=vec2(base.x+lean,base.y+h);
  vec2 q=p-top;
  q.x+=sway*q.y;
  q.y+=2.4*q.x*q.x;
  float r=length(q);
  float a=atan(q.y,q.x);
  float petal=pow(abs(sin(a*3.5+.6+sway*2.)),7.);
  if(r<.15*petal&&q.y>-.07)m=1.;
  if(r<.012)m=1.;
  return m;
}

float scene(vec2 uv){
  float aspect=uRes.x/uRes.y;
  vec2 p=vec2(uv.x*aspect,uv.y);
  float hz=.34;
  vec2 mo=(uMouse-.5);
  vec2 sun=vec2(aspect*.68+mo.x*.04,hz+.17-uScroll*.22+mo.y*.02);
  float l;
  if(p.y>hz){
    float y=(p.y-hz)/(1.-hz);
    l=mix(.74,.12,pow(y,.7));
    float d=length(p-sun);
    l+=.22*exp(-d*d*9.);
    // sun with retro scan cuts
    if(d<.17){
      float band=(sun.y-p.y)/.17;
      float cut=step(.0,band)*step(fract(band*6.-uTime*.25),band*.55);
      l=mix(.97,.84,clamp(band*.5+.5,0.,1.));
      if(cut>.5)l=.6;
    }
    // drifting cloud streaks
    float c=sin(p.x*3.+uTime*.05)*.5+sin(p.x*7.3-uTime*.08)*.3;
    float cy=hz+.42+c*.03;
    if(abs(p.y-cy)<.006+.004*sin(p.x*11.))l=mix(l,.5,.6);
    // skyline
    float col=floor(p.x*34.);
    float bh=.02+hash(col)*.09+step(.86,hash(col+7.))*.1;
    if(p.y<hz+bh){
      l=.07;
      vec2 w=fract(vec2(p.x*34.*4.,p.y*90.));
      float lit=step(.62,hash(floor(p.x*136.)+floor(p.y*90.)*13.+floor(uTime*.3)));
      if(w.x<.45&&w.y<.4&&p.y<hz+bh-.01)l=mix(l,.56,lit);
    }
  }else{
    float y=(hz-p.y)/hz;
    l=mix(.3,.1,pow(y,.6));
    float wave=sin(p.y*220.-uTime*1.6+sin(p.x*9.)*2.)*.5+.5;
    float spread=.04+y*.22;
    float rx=abs(p.x-sun.x);
    if(rx<spread&&wave>.55+rx/spread*.4)l=mix(.9,.55,y);
    if(fract(p.y*60.+sin(p.x*4.+uTime*.3))<.05)l+=.06;
  }
  // palms
  float sw=sin(uTime*.7)*.04;
  float m=palm(p,vec2(aspect*.08,.0),.62,.09,sw);
  m=max(m,palm(p,vec2(aspect*.15,.0),.46,.05,sw*1.3));
  m=max(m,palm(p,vec2(aspect*.93,.0),.5,-.07,-sw));
  if(m>.5)l=.0;
  // cursor flashlight
  vec2 mp=vec2(uMouse.x*aspect,uMouse.y);
  float md=length(p-mp);
  l+=.28*exp(-md*md*28.)*(m>.5?.6:1.);
  // vignette
  vec2 v=uv-.5;
  l*=1.-dot(v,v)*.55;
  return clamp(l,0.,1.);
}

vec3 pal(float i){
  vec3 c=uP0;
  c=mix(c,uP1,step(.5,i));c=mix(c,uP2,step(1.5,i));c=mix(c,uP3,step(2.5,i));
  c=mix(c,uP4,step(3.5,i));c=mix(c,uP5,step(4.5,i));
  return c;
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float l=scene(uv);
  if(uDither<.5){gl_FragColor=vec4(l,l,l,1.);return;}
  float v=l*5.;
  float i=floor(v)+step(bayer8(gl_FragCoord.xy),fract(v));
  gl_FragColor=vec4(pal(i),1.);
}`;

const PALETTES = {
  night: ["#0b0614", "#2a0f3e", "#6c1d6f", "#e0367a", "#ff8a42", "#ffe2a1"],
  day: ["#2a1630", "#8a2f5f", "#e5577f", "#ff9a5c", "#ffd28c", "#fbf3e6"]
};
const RAMP = " .,:;-=+*cox%#&@";
const PIXEL = 3;
const CELL_W = 9;
const CELL_H = 15;

function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

export default function DitherCanvas({ className }: { className?: string }) {
  const glRef = useRef<HTMLCanvasElement>(null);
  const asciiRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const { theme, render } = usePrefs();
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = glRef.current; const ascii = asciiRef.current;
    if (!canvas || !ascii) return;
    const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: false, premultipliedAlpha: false });
    if (!gl) { fallbackRef.current?.removeAttribute("hidden"); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { fallbackRef.current?.removeAttribute("hidden"); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uScroll = u("uScroll"), uDither = u("uDither");
    const palette = PALETTES[theme];
    palette.forEach((c, i) => gl.uniform3fv(u("uP" + i), hex(c)));

    const ctx = ascii.getContext("2d")!;
    const mouse = { x: .62, y: .55, tx: .62, ty: .55 };
    let w = 0, h = 0, cols = 0, rows = 0, pixels = new Uint8Array(0);
    let raf = 0, visible = true, last = 0;
    const start = performance.now();
    const isAscii = render === "ascii";

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      if (isAscii) {
        cols = Math.ceil(w / CELL_W); rows = Math.ceil(h / CELL_H);
        canvas.width = cols; canvas.height = rows;
        pixels = new Uint8Array(cols * rows * 4);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ascii.width = Math.round(w * dpr); ascii.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } else {
        canvas.width = Math.ceil(w / PIXEL); canvas.height = Math.ceil(h / PIXEL);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const drawAscii = () => {
      gl.readPixels(0, 0, cols, rows, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      const paper = theme === "day";
      ctx.fillStyle = paper ? palette[5] : palette[0];
      ctx.fillRect(0, 0, w, h);
      ctx.font = `600 ${CELL_H - 3}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";
      const buckets: number[][] = [[], [], [], [], [], []];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const v = pixels[((rows - 1 - r) * cols + c) * 4] / 255;
        if (v < .03) continue;
        buckets[Math.min(5, Math.floor(v * 6))].push(r * cols + c, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)));
      }
      buckets.forEach((b, i) => {
        ctx.fillStyle = paper ? palette[Math.max(0, Math.min(3, 4 - i))] : palette[Math.max(1, i)];
        for (let k = 0; k < b.length; k += 2) {
          const cell = b[k];
          ctx.fillText(RAMP[b[k + 1]], (cell % cols) * CELL_W, Math.floor(cell / cols) * CELL_H);
        }
      });
    };

    const frame = (now: number) => {
      raf = 0;
      const interval = isAscii ? 50 : 33;
      if (now - last >= interval || reduced) {
        last = now;
        mouse.x += (mouse.tx - mouse.x) * .12; mouse.y += (mouse.ty - mouse.y) * .12;
        gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uScroll, Math.min(1, window.scrollY / Math.max(1, h)));
        gl.uniform1f(uDither, isAscii ? 0 : 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (isAscii) drawAscii();
      }
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
      if (reduced) { mouse.x = mouse.tx; mouse.y = mouse.ty; kick(); }
    };
    const onScroll = () => { if (reduced) kick(); };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick(); });
    io.observe(canvas.parentElement!);
    const ro = new ResizeObserver(() => { resize(); kick(); });
    ro.observe(canvas.parentElement!);
    const onVis = () => { if (!document.hidden) kick(); };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    resize(); kick();

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteProgram(prog); gl.deleteBuffer(buf);
    };
  }, [theme, render, reduced]);

  return <div className={"dither-stage " + (className ?? "")} data-render={render} aria-hidden="true">
    <canvas ref={glRef} className="dither-gl" />
    <canvas ref={asciiRef} className="dither-ascii" />
    <div ref={fallbackRef} className="dither-fallback" hidden />
  </div>;
}
