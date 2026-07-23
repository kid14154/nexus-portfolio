/**
 * tiltCards - 3D 倾斜卡片效果
 * 监听 mousemove，根据鼠标相对卡片中心位置计算旋转角度
 * 移动端自动禁用
 * 无外部依赖，原生 ES6
 */
function initTiltCards(selector = '.tilt-card') {
  // 移动端检测
  const isMobile = 'ontouchstart' in window
    || navigator.maxTouchPoints > 0
    || window.matchMedia('(pointer: coarse)').matches;

  if (isMobile) return;

  const cards = document.querySelectorAll(selector);
  if (!cards.length) return;

  // 为所有卡片父容器添加 perspective
  cards.forEach(card => {
    const parent = card.parentElement;
    if (parent) {
      parent.style.perspective = '1000px';
    }
    card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';
  });

  let rafId = null;
  let activeCard = null;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;

  // 平滑动画循环
  function animateTilt() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;

    if (activeCard) {
      activeCard.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    }

    if (Math.abs(currentRotateX - targetRotateX) > 0.01
      || Math.abs(currentRotateY - targetRotateY) > 0.01) {
      rafId = requestAnimationFrame(animateTilt);
    } else {
      rafId = null;
    }
  }

  function onMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 计算鼠标相对中心位置（-1 到 1）
    const relX = (e.clientX - centerX) / (rect.width / 2);
    const relY = (e.clientY - centerY) / (rect.height / 2);

    // 计算旋转角度（范围 ±15deg）
    targetRotateY = relX * 15;
    targetRotateX = -relY * 15;

    if (activeCard !== card) {
      activeCard = card;
      currentRotateX = targetRotateX;
      currentRotateY = targetRotateY;
    }

    if (!rafId) {
      rafId = requestAnimationFrame(animateTilt);
    }

    // 光晕效果
    const shineX = (relX + 1) / 2 * 100;
    const shineY = (relY + 1) / 2 * 100;
    card.style.setProperty('--shine-x', `${shineX}%`);
    card.style.setProperty('--shine-y', `${shineY}%`);
  }

  function onMouseLeave(e) {
    const card = e.currentTarget;
    targetRotateX = 0;
    targetRotateY = 0;

    if (!rafId) {
      rafId = requestAnimationFrame(animateTilt);
    }

    // 重置光晕
    card.style.setProperty('--shine-x', '50%');
    card.style.setProperty('--shine-y', '50%');
  }

  cards.forEach(card => {
    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave, { passive: true });
  });

  // 返回清理函数
  return function destroy() {
    cards.forEach(card => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
      card.style.transform = '';
      card.style.transition = '';
      card.style.transformStyle = '';
      card.style.willChange = '';
    });
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

// initTiltCards available globally