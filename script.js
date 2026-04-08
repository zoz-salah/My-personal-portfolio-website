/* ============================================================
   ZIAD SALAH PORTFOLIO — script.js
   ============================================================ */

// ─── SET CURRENT YEAR IN FOOTER ─────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();


// ─── NAVBAR: SCROLL SHADOW + ACTIVE LINK ────────────────────
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Add shadow when scrolled
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight the nav link whose section is in view
  let current = '';
  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


// ─── HAMBURGER MENU (mobile) ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});


// ─── SMOOTH SCROLL for all anchor links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});


// ─── SCROLL-TRIGGERED ANIMATIONS ────────────────────────────
// Elements with [data-animate] fade in when they enter the viewport
const animatables = document.querySelectorAll('[data-animate], .timeline-item, .project-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for cards
      const delay = entry.target.closest('.projects-grid') ? i * 80 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animatables.forEach(el => observer.observe(el));



// ─── ANIMATED GREETING (cycles through languages then stops) ───
(function() {
  const greetings = [
    "Hello",      // English
    "Hola",       // Spanish
    "Ciao",       // Italian
    "Bonjour",    // French
    "Konnichiwa", // Japanese
    "Guten Tag",  // German
    "Ni Hao",     // Chinese
    "Namaste",    // Hindi
    "Olá",        // Portuguese
    "اهلا",       // Arabic
    "Hello"       // back to English (final)
  ];

  let index = 0;
  const greetingSpan = document.getElementById('animated-greeting');
  if (!greetingSpan) return;

  const intervalTime = 250; // milliseconds between changes (adjust for speed)
  const interval = setInterval(() => {
    greetingSpan.textContent = greetings[index];
    index++;
    if (index >= greetings.length) {
      clearInterval(interval); // stop animation
    }
  }, intervalTime);
})();


// ─── CUSTOM CURSOR (smooth trailing dot) ───────────────────
(function() {
  if (window.innerWidth < 768) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;
  // Configuration (edit these values as you like)
  const CONFIG = {
    color: 'rgba(200, 241, 53, 0.4)',   // 40% opacity      // accent color (same as your theme)
    dotSize: 8,            // radius of the dot in pixels
    lag: 12,               // higher = more lag / smoother trailing
    zIndex: 9999
  };

  let canvas, ctx;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: height / 2 };

  class Dot {
    constructor(x, y, size, lag) {
      this.pos = { x, y };
      this.size = size;
      this.lag = lag;
    }

    moveTowards(targetX, targetY, context) {
      // Ease towards cursor position
      this.pos.x += (targetX - this.pos.x) / this.lag;
      this.pos.y += (targetY - this.pos.y) / this.lag;

      context.fillStyle = CONFIG.color;
      context.beginPath();
      context.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  const dot = new Dot(width / 2, height / 2, CONFIG.dotSize, CONFIG.lag);

  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function updateAndDraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    dot.moveTowards(cursor.x, cursor.y, ctx);
  }

  function animate() {
    updateAndDraw();
    requestAnimationFrame(animate);
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'custom-cursor-canvas';
    ctx = canvas.getContext('2d');

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = CONFIG.zIndex;
    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    animate();
  }

  init();
})();




// ─── CONTACT FORM (demo handler) ────────────────────────────
// function handleFormSubmit(e) {
//   e.preventDefault();

//   const form = document.getElementById('contactForm');
//   const note = document.getElementById('formNote');
//   const btn  = form.querySelector('button[type="submit"]');

//   // Simulate sending
//   btn.textContent = 'Sending…';
//   btn.disabled = true;

//   setTimeout(() => {
//     note.textContent = '✓ Message sent! I\'ll get back to you soon.';
//     btn.textContent  = 'Send Message';
//     btn.disabled = false;
//     form.reset();

//     // ✏️ NOTE: To actually send emails, replace this timeout block with a real
//     //          fetch() call to Formspree or EmailJS. See the HTML comment in the form.

//     setTimeout(() => { note.textContent = ''; }, 5000);
//   }, 1200);
// }

// ============================================================
//  SPLASH CURSOR — WebGL Fluid Effect
// ============================================================
// (function () {
//   // إنشاء الـ canvas وإضافته للصفحة
//   const canvas = document.createElement('canvas');
//   canvas.id = 'fluid';
//   canvas.style.cssText = `
//     position: fixed;
//     top: 0; left: 0;
//     width: 100vw; height: 100vh;
//     pointer-events: none;
//     z-index: 9999;
//     display: block;
//   `;
//   document.body.appendChild(canvas);

//   // ── إعدادات التأثير (عدّلها زي ما تحب) ──────────────────
//   const config = {
//     SIM_RESOLUTION:       128,
//     DYE_RESOLUTION:       1440,
//     DENSITY_DISSIPATION:  3.5,
//     VELOCITY_DISSIPATION: 2,
//     PRESSURE:             0.1,
//     PRESSURE_ITERATIONS:  20,
//     CURL:                 3,
//     SPLAT_RADIUS:         0.2,
//     SPLAT_FORCE:          6000,
//     SHADING:              true,
//     COLOR_UPDATE_SPEED:   10,
//     TRANSPARENT:          true,
//     BACK_COLOR: { r: 0, g: 0, b: 0, a: 0 },
//   };

//   function pointerPrototype() {
//     this.id = -1; this.texcoordX = 0; this.texcoordY = 0;
//     this.prevTexcoordX = 0; this.prevTexcoordY = 0;
//     this.deltaX = 0; this.deltaY = 0;
//     this.down = false; this.moved = false; this.color = [0,0,0];
//   }
//   let pointers = [new pointerPrototype()];

//   // ── WebGL Setup ───────────────────────────────────────────
//   const params = { alpha:true, depth:false, stencil:false, antialias:false, preserveDrawingBuffer:false };
//   let gl = canvas.getContext('webgl2', params);
//   const isWebGL2 = !!gl;
//   if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

//   let halfFloat, supportLinearFiltering;
//   if (isWebGL2) {
//     gl.getExtension('EXT_color_buffer_float');
//     supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
//   } else {
//     halfFloat = gl.getExtension('OES_texture_half_float');
//     supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
//   }
//  gl.clearColor(0,0,0,0);
//   const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;

//   function getSupportedFormat(gl, internalFormat, format, type) {
//     if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
//       if (internalFormat === gl.R16F)  return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
//       if (internalFormat === gl.RG16F) return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
//       return null;
//     }
//     return { internalFormat, format };
//   }
//   function supportRenderTextureFormat(gl, internalFormat, format, type) {
//     const tex = gl.createTexture();
//     gl.bindTexture(gl.TEXTURE_2D, tex);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
//     const fbo = gl.createFramebuffer();
//     gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
//     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
//     return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
//   }

//   let formatRGBA, formatRG, formatR;
//   if (isWebGL2) {
//     formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
//     formatRG   = getSupportedFormat(gl, gl.RG16F,   gl.RG,   halfFloatTexType);
//     formatR    = getSupportedFormat(gl, gl.R16F,    gl.RED,  halfFloatTexType);
//   } else {
//     formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
//     formatRG   = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
//     formatR    = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
//   }

//   // ── Shader helpers ────────────────────────────────────────
//   function compileShader(type, src, keywords) {
//     if (keywords) src = keywords.map(k => '#define '+k+'\n').join('') + src;
//     const s = gl.createShader(type);
//     gl.shaderSource(s, src); gl.compileShader(s);
//     return s;
//   }
//   function createProgram(vs, fs) {
//     const p = gl.createProgram();
//     gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
//     return p;
//   }
//   function getUniforms(program) {
//     const u = {}, n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
//     for (let i=0; i<n; i++) { const name = gl.getActiveUniform(program, i).name; u[name] = gl.getUniformLocation(program, name); }
//     return u;
//   }
//   class Program {
//     constructor(vs, fs) { this.program = createProgram(vs,fs); this.uniforms = getUniforms(this.program); }
//     bind() { gl.useProgram(this.program); }
//   }
//   class Material {
//     constructor(vs, fsSrc) { this.vs=vs; this.fsSrc=fsSrc; this.programs={}; this.activeProgram=null; this.uniforms={}; }
//     setKeywords(kw) {
//       const hash = kw.join(',');
//       if (!this.programs[hash]) { const fs=compileShader(gl.FRAGMENT_SHADER,this.fsSrc,kw); this.programs[hash]=createProgram(this.vs,fs); }
//       if (this.programs[hash]===this.activeProgram) return;
//       this.uniforms = getUniforms(this.programs[hash]);
//       this.activeProgram = this.programs[hash];
//     }
//     bind() { gl.useProgram(this.activeProgram); }
//   }

//   // ── Vertex shader ─────────────────────────────────────────
//   const baseVS = compileShader(gl.VERTEX_SHADER, `
//     precision highp float;
//     attribute vec2 aPosition;
//     varying vec2 vUv,vL,vR,vT,vB;
//     uniform vec2 texelSize;
//     void main(){
//       vUv=aPosition*.5+.5; vL=vUv-vec2(texelSize.x,0.); vR=vUv+vec2(texelSize.x,0.);
//       vT=vUv+vec2(0.,texelSize.y); vB=vUv-vec2(0.,texelSize.y);
//       gl_Position=vec4(aPosition,0.,1.);
//     }`);

//   // ── Fragment shaders ──────────────────────────────────────
//   const copyFS       = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
//   const clearFS      = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
//   const splatFS      = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+splat,1.);}`);
//   const advectionFS  = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize,dyeTexelSize;uniform float dt,dissipation;vec4 bilerp(sampler2D s,vec2 uv,vec2 ts){vec2 st=uv/ts-.5;vec2 iuv=floor(st);vec2 fuv=fract(st);vec4 a=texture2D(s,(iuv+vec2(.5,.5))*ts);vec4 b=texture2D(s,(iuv+vec2(1.5,.5))*ts);vec4 c=texture2D(s,(iuv+vec2(.5,1.5))*ts);vec4 d=texture2D(s,(iuv+vec2(1.5,1.5))*ts);return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);}void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;gl_FragColor=texture2D(uSource,coord)/(1.+dissipation*dt);}`, supportLinearFiltering?null:['MANUAL_FILTERING']);
//   const divergenceFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`);
//   const curlFS       = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){gl_FragColor=vec4(.5*(texture2D(uVelocity,vR).y-texture2D(uVelocity,vL).y-texture2D(uVelocity,vT).x+texture2D(uVelocity,vB).x),0.,0.,1.);}`);
//   const vorticityFS  = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+.0001;f*=curl*C;f.y*=-1.;vec2 v=texture2D(uVelocity,vUv).xy+f*dt;gl_FragColor=vec4(clamp(v,-1000.,1000.),0.,1.);}`);
//   const pressureFS   = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){gl_FragColor=vec4((.25*(texture2D(uPressure,vL).x+texture2D(uPressure,vR).x+texture2D(uPressure,vB).x+texture2D(uPressure,vT).x-texture2D(uDivergence,vUv).x)),0.,0.,1.);}`);
//   const gradSubFS    = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){vec2 v=texture2D(uVelocity,vUv).xy-vec2(texture2D(uPressure,vR).x-texture2D(uPressure,vL).x,texture2D(uPressure,vT).x-texture2D(uPressure,vB).x);gl_FragColor=vec4(v,0.,1.);}`);
//   const displaySrc   = `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform vec2 texelSize;void main(){vec3 c=texture2D(uTexture,vUv).rgb;#ifdef SHADING float dx=length(texture2D(uTexture,vR).rgb)-length(texture2D(uTexture,vL).rgb);float dy=length(texture2D(uTexture,vT).rgb)-length(texture2D(uTexture,vB).rgb);vec3 n=normalize(vec3(dx,dy,length(texelSize)));float d=clamp(dot(n,vec3(0.,0.,1.))+.7,.7,1.);c*=d;#endif float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`;

//   // ── Blit quad ─────────────────────────────────────────────
//   gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
//   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
//   gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
//   gl.enableVertexAttribArray(0);
//   const blit = (target, clear=false) => {
//     if (target==null) { gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER,null); }
//     else { gl.viewport(0,0,target.width,target.height); gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo); }
//     if (clear) { gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); }
//     gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
//   };

//   // ── Programs ──────────────────────────────────────────────
//   const copyProg      = new Program(baseVS, copyFS);
//   const clearProg     = new Program(baseVS, clearFS);
//   const splatProg     = new Program(baseVS, splatFS);
//   const advProg       = new Program(baseVS, advectionFS);
//   const divProg       = new Program(baseVS, divergenceFS);
//   const curlProg      = new Program(baseVS, curlFS);
//   const vortProg      = new Program(baseVS, vorticityFS);
//   const presProg      = new Program(baseVS, pressureFS);
//   const gradProg      = new Program(baseVS, gradSubFS);
//   const displayMat    = new Material(baseVS, displaySrc);
//   if (config.SHADING) displayMat.setKeywords(['SHADING']); else displayMat.setKeywords([]);

//   // ── FBO helpers ───────────────────────────────────────────
//   function createFBO(w,h,internalFormat,format,type,param){
//     gl.activeTexture(gl.TEXTURE0);
//     const tex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tex);
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,param);
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,param);
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
//     gl.texImage2D(gl.TEXTURE_2D,0,internalFormat,w,h,0,format,type,null);
//     const fbo=gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
//     gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
//     gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
//     return { texture:tex, fbo, width:w, height:h, texelSizeX:1/w, texelSizeY:1/h,
//              attach(id){ gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D,tex); return id; } };
//   }
//   function createDoubleFBO(w,h,iF,f,t,p){
//     let f1=createFBO(w,h,iF,f,t,p), f2=createFBO(w,h,iF,f,t,p);
//     return { width:w, height:h, texelSizeX:f1.texelSizeX, texelSizeY:f1.texelSizeY,
//              get read(){return f1;}, set read(v){f1=v;}, get write(){return f2;}, set write(v){f2=v;},
//              swap(){ const tmp=f1; f1=f2; f2=tmp; } };
//   }

//   function getRes(res){ const ar=Math.max(gl.drawingBufferWidth/gl.drawingBufferHeight,gl.drawingBufferHeight/gl.drawingBufferWidth); const mn=Math.round(res),mx=Math.round(res*ar); return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx}; }
//   function scalePR(v){ return Math.floor(v*(window.devicePixelRatio||1)); }

//   let dye,velocity,divergence,curl,pressure;
//   function initFBOs(){
//     const sR=getRes(config.SIM_RESOLUTION), dR=getRes(config.DYE_RESOLUTION);
//     const tt=halfFloatTexType, filt=supportLinearFiltering?gl.LINEAR:gl.NEAREST;
//     gl.disable(gl.BLEND);
//     dye      = dye      ? resizeD(dye,      dR.width,dR.height,formatRGBA.internalFormat,formatRGBA.format,tt,filt) : createDoubleFBO(dR.width,dR.height,formatRGBA.internalFormat,formatRGBA.format,tt,filt);
//     velocity = velocity ? resizeD(velocity, sR.width,sR.height,formatRG.internalFormat,  formatRG.format,  tt,filt) : createDoubleFBO(sR.width,sR.height,formatRG.internalFormat,  formatRG.format,  tt,filt);
//     divergence = createFBO(sR.width,sR.height,formatR.internalFormat,formatR.format,tt,gl.NEAREST);
//     curl       = createFBO(sR.width,sR.height,formatR.internalFormat,formatR.format,tt,gl.NEAREST);
//     pressure   = createDoubleFBO(sR.width,sR.height,formatR.internalFormat,formatR.format,tt,gl.NEAREST);
//   }
//   function resizeFBO(t,w,h,iF,f,tp,p){ const n=createFBO(w,h,iF,f,tp,p); copyProg.bind(); gl.uniform1i(copyProg.uniforms.uTexture,t.attach(0)); blit(n); return n; }
//   function resizeD(t,w,h,iF,f,tp,p){ if(t.width===w&&t.height===h)return t; t.read=resizeFBO(t.read,w,h,iF,f,tp,p); t.write=createFBO(w,h,iF,f,tp,p); t.width=w; t.height=h; t.texelSizeX=1/w; t.texelSizeY=1/h; return t; }
//   gl.clearColor(0,0,0,0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
//   initFBOs();

//   // ── Color helpers ─────────────────────────────────────────
//   function HSVtoRGB(h,s,v){ let r,g,b; const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s); switch(i%6){case 0:r=v,g=t,b=p;break;case 1:r=q,g=v,b=p;break;case 2:r=p,g=v,b=t;break;case 3:r=p,g=q,b=v;break;case 4:r=t,g=p,b=v;break;case 5:r=v,g=p,b=q;break;} return {r,g,b}; }
//   function generateColor(){ const c=HSVtoRGB(Math.random(),1,1); return {r:c.r*.15,g:c.g*.15,b:c.b*.15}; }

//   // ── Splat ─────────────────────────────────────────────────
//   function splat(x,y,dx,dy,color){
//     splatProg.bind();
//     gl.uniform1i(splatProg.uniforms.uTarget,velocity.read.attach(0));
//     gl.uniform1f(splatProg.uniforms.aspectRatio,canvas.width/canvas.height);
//     gl.uniform2f(splatProg.uniforms.point,x,y);
//     gl.uniform3f(splatProg.uniforms.color,dx,dy,0);
//     let r=config.SPLAT_RADIUS/100; if(canvas.width/canvas.height>1) r*=canvas.width/canvas.height;
//     gl.uniform1f(splatProg.uniforms.radius,r);
//     blit(velocity.write); velocity.swap();
//     gl.uniform1i(splatProg.uniforms.uTarget,dye.read.attach(0));
//     gl.uniform3f(splatProg.uniforms.color,color.r,color.g,color.b);
//     blit(dye.write); dye.swap();
//   }

//   // ── Pointer helpers ───────────────────────────────────────
//   function pDown(p,id,px,py){ p.id=id; p.down=true; p.moved=false; p.texcoordX=px/canvas.width; p.texcoordY=1-py/canvas.height; p.prevTexcoordX=p.texcoordX; p.prevTexcoordY=p.texcoordY; p.deltaX=0; p.deltaY=0; p.color=generateColor(); }
//   function pMove(p,px,py,color){ p.prevTexcoordX=p.texcoordX; p.prevTexcoordY=p.texcoordY; p.texcoordX=px/canvas.width; p.texcoordY=1-py/canvas.height; const ar=canvas.width/canvas.height; p.deltaX=(p.texcoordX-p.prevTexcoordX)*(ar<1?ar:1); p.deltaY=(p.texcoordY-p.prevTexcoordY)/(ar>1?ar:1); p.moved=Math.abs(p.deltaX)>0||Math.abs(p.deltaY)>0; p.color=color; }

//   // ── Event listeners ───────────────────────────────────────
//   window.addEventListener('mousemove', e => {
//     const p=pointers[0], px=scalePR(e.clientX), py=scalePR(e.clientY);
//     pMove(p, px, py, p.color||generateColor());
//   });
//   window.addEventListener('mousedown', e => {
//     const p=pointers[0], px=scalePR(e.clientX), py=scalePR(e.clientY);
//     pDown(p,-1,px,py);
//     const c=generateColor(); c.r*=10; c.g*=10; c.b*=10;
//     splat(p.texcoordX,p.texcoordY,10*(Math.random()-.5),30*(Math.random()-.5),c);
//   });
//   window.addEventListener('touchstart', e => { const t=e.targetTouches[0],p=pointers[0]; pDown(p,t.identifier,scalePR(t.clientX),scalePR(t.clientY)); }, {passive:true});
//   window.addEventListener('touchmove',  e => { const t=e.targetTouches[0],p=pointers[0]; pMove(p,scalePR(t.clientX),scalePR(t.clientY),p.color); }, {passive:true});

//   // ── Simulation loop ───────────────────────────────────────
//   let lastT = Date.now(), colorTimer = 0;
//   function update(){
//     const now=Date.now(), dt=Math.min((now-lastT)/1000, 0.016666); lastT=now;

//     // resize canvas if needed
//     const w=scalePR(canvas.clientWidth), h=scalePR(canvas.clientHeight);
//     if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; initFBOs(); }

//     // update colors periodically
//     colorTimer+=dt*config.COLOR_UPDATE_SPEED;
//     if(colorTimer>=1){ colorTimer=0; pointers.forEach(p=>p.color=generateColor()); }

//     // apply pointer movement
//     pointers.forEach(p=>{ if(p.moved){ p.moved=false; splat(p.texcoordX,p.texcoordY,p.deltaX*config.SPLAT_FORCE,p.deltaY*config.SPLAT_FORCE,p.color); } });

//     // fluid simulation steps
//     gl.disable(gl.BLEND);
//     curlProg.bind(); gl.uniform2f(curlProg.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY); gl.uniform1i(curlProg.uniforms.uVelocity,velocity.read.attach(0)); blit(curl);
//     vortProg.bind(); gl.uniform2f(vortProg.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY); gl.uniform1i(vortProg.uniforms.uVelocity,velocity.read.attach(0)); gl.uniform1i(vortProg.uniforms.uCurl,curl.attach(1)); gl.uniform1f(vortProg.uniforms.curl,config.CURL); gl.uniform1f(vortProg.uniforms.dt,dt); blit(velocity.write); velocity.swap();
//     divProg.bind(); gl.uniform2f(divProg.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY); gl.uniform1i(divProg.uniforms.uVelocity,velocity.read.attach(0)); blit(divergence);
//     clearProg.bind(); gl.uniform1i(clearProg.uniforms.uTexture,pressure.read.attach(0)); gl.uniform1f(clearProg.uniforms.value,config.PRESSURE); blit(pressure.write); pressure.swap();
//     presProg.bind(); gl.uniform2f(presProg.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY); gl.uniform1i(presProg.uniforms.uDivergence,divergence.attach(0));
//     for(let i=0;i<config.PRESSURE_ITERATIONS;i++){ gl.uniform1i(presProg.uniforms.uPressure,pressure.read.attach(1)); blit(pressure.write); pressure.swap(); }
//     gradProg.bind(); gl.uniform2f(gradProg.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY); gl.uniform1i(gradProg.uniforms.uPressure,pressure.read.attach(0)); gl.uniform1i(gradProg.uniforms.uVelocity,velocity.read.attach(1)); blit(velocity.write); velocity.swap();
//     advProg.bind(); gl.uniform2f(advProg.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY); gl.uniform2f(advProg.uniforms.dyeTexelSize,velocity.texelSizeX,velocity.texelSizeY); const vId=velocity.read.attach(0); gl.uniform1i(advProg.uniforms.uVelocity,vId); gl.uniform1i(advProg.uniforms.uSource,vId); gl.uniform1f(advProg.uniforms.dt,dt); gl.uniform1f(advProg.uniforms.dissipation,config.VELOCITY_DISSIPATION); blit(velocity.write); velocity.swap();
//     gl.uniform2f(advProg.uniforms.dyeTexelSize,dye.texelSizeX,dye.texelSizeY); gl.uniform1i(advProg.uniforms.uVelocity,velocity.read.attach(0)); gl.uniform1i(advProg.uniforms.uSource,dye.read.attach(1)); gl.uniform1f(advProg.uniforms.dissipation,config.DENSITY_DISSIPATION); blit(dye.write); dye.swap();

//     // render
//     gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
//     displayMat.bind();
//     if(config.SHADING) gl.uniform2f(displayMat.uniforms.texelSize,1/gl.drawingBufferWidth,1/gl.drawingBufferHeight);
//     gl.uniform1i(displayMat.uniforms.uTexture,dye.read.attach(0));
//     blit(null);

//     requestAnimationFrame(update);
//   }
//   update();
// })();