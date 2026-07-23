/**
 * Typewriter - 打字机效果类
 * 支持多行文本、光标闪烁、自定义速度
 * 无外部依赖，原生 ES6
 */
class Typewriter {
  constructor(element, text, speed = 80, cursor = true) {
    this.element = typeof element === 'string'
      ? document.querySelector(element)
      : element;
    if (!this.element) {
      console.warn('[Typewriter] Element not found');
      return;
    }

    this.fullText = text;
    this.speed = speed;
    this.showCursor = cursor;
    this.running = false;
    this.timer = null;
    this.currentIndex = 0;
    this.currentLine = 0;
    this.lines = text.split('\n');
    this.displayLines = [];
    this.charIndex = 0; // 全局字符索引
    this._onComplete = null;

    // 初始化容器
    this.element.style.display = 'inline-block';
    this.element.style.whiteSpace = 'pre-wrap';
    this._createCursor();
  }

  _createCursor() {
    if (!this.showCursor) return;
    this.cursorEl = document.createElement('span');
    this.cursorEl.className = 'typewriter-cursor';
    this.cursorEl.textContent = '|';
    this.cursorEl.style.cssText = `
      display: inline-block;
      animation: blink 0.8s step-end infinite;
      color: #00ffff;
      font-weight: 100;
      margin-left: 2px;
    `;
    this.element.appendChild(this.cursorEl);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.currentIndex = 0;
    this.charIndex = 0;
    this.displayLines = this.lines.map(() => '');
    this.element.innerHTML = '';
    this._type();
  }

  _type() {
    if (!this.running) return;

    // 计算当前总字符数
    let totalChars = 0;
    let lineIdx = 0;
    let colIdx = 0;

    for (let i = 0; i < this.lines.length; i++) {
      if (totalChars + this.lines[i].length > this.charIndex) {
        lineIdx = i;
        colIdx = this.charIndex - totalChars;
        break;
      }
      totalChars += this.lines[i].length + 1; // +1 for newline
      if (totalChars > this.charIndex) {
        lineIdx = i + 1;
        colIdx = 0;
        break;
      }
    }

    if (lineIdx >= this.lines.length) {
      // 完成
      this.running = false;
      if (this._onComplete) this._onComplete();
      return;
    }

    // 构建显示内容
    let html = '';
    for (let i = 0; i <= lineIdx; i++) {
      if (i < lineIdx) {
        html += this._escapeHtml(this.lines[i]) + '\n';
      } else {
        html += this._escapeHtml(this.lines[i].substring(0, colIdx + 1));
      }
    }

    this.element.innerHTML = html;
    this.charIndex++;

    // 随机延迟 80-120ms
    const delay = this.speed + (Math.random() - 0.5) * 40;
    this.timer = setTimeout(() => this._type(), delay);
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  onComplete(callback) {
    this._onComplete = callback;
    return this;
  }

  destroy() {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.cursorEl && this.cursorEl.parentNode) {
      this.cursorEl.parentNode.removeChild(this.cursorEl);
    }
    this.element.innerHTML = '';
  }
}

// Typewriter available globally