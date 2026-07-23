/**
 * ParticleSystem - 多模式 Canvas 粒子系统
 * 支持 nebula / flow / matrix / burst 四种模式
 * 无外部依赖，原生 ES6
 */
class ParticleSystem {
  constructor(canvasId, mode = 'nebula', options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`[ParticleSystem] Canvas #${canvasId} not found`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.mode = mode;
    this.options = Object.assign({
      particleCount: 100,
      connectionDistance: 150,
      connectionColor: 'rgba(0, 255, 255, 0.3)',
      mouseRadius: 100,
      burstDuration: 2000,
      gravity: 0.02,
      maxSpeed: 2,
      fadeSpeed: 0.02,
    }, options);

    // 状态
    this.particles = [];
    this.running = false;
    this.paused = false;
    this.animId = null;
    this.connectEnabled = false;
    this.mouse = { x: -1000, y: -1000, active: false };
    this.clock = 0;
    this.resizeTimer = null;

    // 绑定方法
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);

    this._init();
  }

  _init() {
    this._setupCanvas();
    this._initParticles();
    this._bindEvents();
    this.running = true;
    this._animate();
  }

  _setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
  }

  _initParticles() {
    this.particles = [];
    const count = this._getParticleCount();
    for (let i = 0; i < count; i++) {
      this.particles.push(this._createParticle());
    }
  }

  _getParticleCount() {
    switch (this.mode) {
      case 'nebula': return 60;   // 性能优化：大幅降低粒子数
      case 'flow': return 40;
      case 'matrix': return 50;
      case 'burst': return 0;
      default: return 60;
    }
  }

  _createParticle() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const base = {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.3,
      life: 1,
      maxLife: 1,
    };

    switch (this.mode) {
      case 'nebula':
        return {
          ...base,
          color: `hsla(${180 + Math.random() * 60}, 80%, 60%, ${base.alpha})`,
          hue: 180 + Math.random() * 60,
          sat: 80,
          light: 60,
        };
      case 'flow':
        return {
          ...base,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
          amplitude: 20 + Math.random() * 40,
          baseY: Math.random() * h * 0.6 + h * 0.2,
          color: `hsla(${240 + Math.random() * 60}, 80%, 60%, 0.3)`,
          hue: 240 + Math.random() * 60,
          size: 2 + Math.random() * 4,
        };
      case 'matrix':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 1 + Math.random() * 3,
          char: Math.random() > 0.5 ? '0' : '1',
          size: 12 + Math.random() * 8,
          alpha: 0.3 + Math.random() * 0.7,
          brightness: Math.random(),
          fade: 0,
        };
      case 'burst':
        return {
          ...base,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: 2 + Math.random() * 4,
          life: 1,
          maxLife: 1,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
          hue: Math.random() * 360,
        };
      default:
        return base;
    }
  }

  _bindEvents() {
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseleave', this._onMouseLeave);
    this.canvas.addEventListener('click', this._onClick);
    window.addEventListener('resize', this._onResize);
    document.addEventListener('visibilitychange', this._onVisibilityChange);
  }

  _onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
  }

  _onMouseLeave() {
    this.mouse.active = false;
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  _onClick(e) {
    if (this.mode === 'nebula') {
      this.burst(e.clientX, e.clientY);
    }
  }

  _onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.resize();
    }, 200);
  }

  _onVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  // ============ 公开 API ============

  setMode(mode) {
    if (mode === this.mode) return;
    this.mode = mode;
    this._initParticles();
  }

  burst(x, y, color) {
    const prevMode = this.mode;
    this.mode = 'burst';
    this.particles = [];
    const count = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x: x || this.canvas.width / 2,
        y: y || this.canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        alpha: 1,
        life: 1,
        maxLife: 1,
        color: color || `hsl(${Math.random() * 360}, 80%, 60%)`,
        hue: color ? 180 : Math.random() * 360,
      });
    }
    // 2秒后恢复原模式
    setTimeout(() => {
      if (this.mode === 'burst') {
        this.mode = prevMode;
        this._initParticles();
      }
    }, this.options.burstDuration);
  }

  connect() {
    this.connectEnabled = !this.connectEnabled;
    return this.connectEnabled;
  }

  destroy() {
    this.running = false;
    this.paused = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseleave', this._onMouseLeave);
    this.canvas.removeEventListener('click', this._onClick);
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.mode === 'matrix') {
      // 矩阵模式需要重新初始化列
      this._initParticles();
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  // ============ 动画循环 ============

  _animate() {
    if (!this.running) return;
    this.animId = requestAnimationFrame(() => this._animate());

    if (this.paused) return;

    this.clock++;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.mode) {
      case 'nebula':
        this._updateNebula();
        break;
      case 'flow':
        this._updateFlow();
        break;
      case 'matrix':
        this._updateMatrix();
        break;
      case 'burst':
        this._updateBurst();
        break;
    }
  }

  // ============ Nebula 模式 ============

  _updateNebula() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // 鼠标吸引（简化计算）
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = this.options.mouseRadius * this.options.mouseRadius;
        if (distSq < radiusSq && distSq > 1) {
          const inv = 0.002 / Math.sqrt(distSq);
          p.vx += dx * inv;
          p.vy += dy * inv;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // 阻尼
      p.vx *= 0.99;
      p.vy *= 0.99;

      // 边界回弹
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // 性能优化：用简单的 arc + fillStyle 替代径向渐变
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light + 20}%, ${p.alpha})`;
      ctx.fill();
    }

    // 连线仅在开启时绘制（默认关闭以提升性能）
    if (this.connectEnabled) {
      this._drawConnections();
    }
  }

  _drawConnections() {
    const maxDist = this.options.connectionDistance;
    const maxDistSq = maxDist * maxDist;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  // ============ Flow 模式 ============

  _updateFlow() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    for (const p of this.particles) {
      p.phase += 0.02 * p.speed;
      p.x += 1.5 * p.speed;
      p.y = p.baseY + Math.sin(p.phase) * p.amplitude;

      if (p.x > w + 20) {
        p.x = -20;
        p.baseY = Math.random() * h * 0.6 + h * 0.2;
        p.phase = Math.random() * Math.PI * 2;
      }

      // 性能优化：用简单 arc 替代径向渐变
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.5)`;
      ctx.fill();
    }

    // 在粒子间绘制光带连线
    if (this.connectEnabled) {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 40000) {
            const alpha = (1 - Math.sqrt(distSq) / 200) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(150, 100, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }
  }

  // ============ Matrix 模式 ============

  _updateMatrix() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 半透明覆盖实现拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, w, h);

    for (const p of this.particles) {
      p.y += p.speed;
      p.fade += 0.01;

      if (p.y > h) {
        p.y = -10;
        p.x = Math.random() * w;
        p.char = Math.random() > 0.5 ? '0' : '1';
        p.speed = 1 + Math.random() * 3;
        p.alpha = 0.3 + Math.random() * 0.7;
        p.fade = 0;
      }

      // 鼠标划过高亮
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          p.alpha = 1;
          p.fade = 0;
        }
      }

      ctx.font = `${p.size}px "Courier New", monospace`;
      ctx.fillStyle = `rgba(0, 255, 65, ${Math.max(0.1, p.alpha - p.fade)})`;
      ctx.fillText(p.char, p.x, p.y);

      // 偶尔在下方加一个较淡的字符
      if (Math.random() < 0.1) {
        ctx.fillStyle = `rgba(0, 255, 65, ${Math.max(0.05, p.alpha - p.fade - 0.3)})`;
        ctx.fillText(p.char, p.x + (Math.random() - 0.5) * 2, p.y + p.size);
      }
    }
  }

  // ============ Burst 模式 ============

  _updateBurst() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.particles = this.particles.filter(p => {
      p.vx *= 0.98; // 速度衰减
      p.vy *= 0.98;
      p.vy += this.options.gravity; // 重力
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.005; // 生命周期递减
      p.alpha = Math.max(0, p.life);

      if (p.alpha <= 0) return false;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue + (1 - p.life) * 60}, 80%, 60%, ${p.alpha})`;
      this.ctx.fill();
      return true;
    });
  }
}

// ParticleSystem available globally