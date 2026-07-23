/**
 * customCursor - 自定义光标系统
 * 创建发光圆点光标 + 跟随圆点，hover 链接/按钮时放大
 * 移动端自动禁用
 * 页面离开窗口时隐藏
 * 无外部依赖，原生 ES6
 */
function initCustomCursor() {
  // 移动端检测
  const isMobile = 'ontouchstart' in window
    || navigator.maxTouchPoints > 0
    || window.matchMedia('(pointer: coarse)').matches;

  if (isMobile) return;

  // 创建主光标 - 发光圆点
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor-dot';
  cursor.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99999;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00ffff;
    mix-blend-mode: difference;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease, background 0.2s ease;
    will-change: transform;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  `;

  // 创建跟随圆点 - 半透明，延迟跟随
  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';
  follower.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 99998;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1.5px solid rgba(0, 255, 255, 0.4);
    background: rgba(0, 255, 255, 0.08);
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease, border-color 0.3s ease;
    will-change: transform;
  `;

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  // 隐藏默认光标
  document.body.style.cursor = 'none';
  // 确保所有元素的默认光标也被隐藏
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    *, *::before, *::after {
      cursor: none !important;
    }
    a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]) {
      cursor: none !important;
    }
  `;
  document.head.appendChild(styleEl);

  // 光标位置
  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;
  let rafId = null;
  let isVisible = false;
  let isHovering = false;

  // 平滑跟随动画
  function animate() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    if (document.hidden) {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    }

    rafId = requestAnimationFrame(animate);
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }

    // 检测鼠标下的元素
    const target = e.target;
    const isInteractive = target.matches('a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), .tilt-card, .clickable')
      || target.closest('a, button, [role="button"], .tilt-card');

    if (isInteractive && !isHovering) {
      isHovering = true;
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.background = 'rgba(0, 255, 255, 0.15)';
      cursor.style.border = '1.5px solid rgba(0, 255, 255, 0.6)';
      cursor.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
      follower.style.width = '40px';
      follower.style.height = '40px';
      follower.style.borderColor = 'rgba(0, 255, 255, 0.6)';
      follower.style.background = 'rgba(0, 255, 255, 0.12)';
    } else if (!isInteractive && isHovering) {
      isHovering = false;
      cursor.style.width = '8px';
      cursor.style.height = '8px';
      cursor.style.background = '#00ffff';
      cursor.style.border = 'none';
      cursor.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
      follower.style.width = '24px';
      follower.style.height = '24px';
      follower.style.borderColor = 'rgba(0, 255, 255, 0.4)';
      follower.style.background = 'rgba(0, 255, 255, 0.08)';
    }
  }

  function onMouseDown() {
    // 点击时缩小然后爆发
    cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    follower.style.transform = 'translate(-50%, -50%) scale(0.6)';
    setTimeout(() => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
  }

  function onMouseUp() {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  }

  function onVisibilityChange() {
    if (document.hidden) {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    } else {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }
  }

  function onWindowBlur() {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  }

  function onWindowFocus() {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  }

  // 初始隐藏
  cursor.style.opacity = '0';
  follower.style.opacity = '0';

  // 绑定事件
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mousedown', onMouseDown, { passive: true });
  document.addEventListener('mouseup', onMouseUp, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('focus', onWindowFocus);

  // 启动动画
  rafId = requestAnimationFrame(animate);

  // 返回清理函数
  return function destroy() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('blur', onWindowBlur);
    window.removeEventListener('focus', onWindowFocus);

    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
    if (follower.parentNode) follower.parentNode.removeChild(follower);
    if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);

    document.body.style.cursor = '';
  };
}

// initCustomCursor available globally