/**
 * scrollReveal - 滚动显现动画
 * 使用 IntersectionObserver 观察元素，进入视口时添加 .visible 类
 * 支持 data-delay 属性实现 stagger 延迟
 * 无外部依赖，原生 ES6
 */
function initScrollReveal(options = {}) {
  const defaults = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
    once: true,
    selector: '.reveal, .reveal-left, .reveal-right, .reveal-scale',
  };

  const config = Object.assign({}, defaults, options);
  const elements = document.querySelectorAll(config.selector);

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.getAttribute('data-delay')) || 0;

        if (delay > 0) {
          el.style.transitionDelay = `${delay}s`;
        }

        // 添加 visible 类触发动画
        // CSS 使用 .reveal--visible / .reveal-left--visible 等双横线命名
        requestAnimationFrame(() => {
          const baseClass = Array.from(el.classList).find(c => c.startsWith('reveal'));
          if (baseClass) {
            el.classList.add(baseClass + '--visible');
          } else {
            el.classList.add('visible');
          }
        });

        // 如果只触发一次，取消观察
        if (config.once) {
          observer.unobserve(el);
        }
      } else if (!config.once) {
        // 如果允许重复触发，离开视口时移除 visible
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: config.threshold,
    rootMargin: config.rootMargin,
  });

  elements.forEach(el => {
    // 确保元素初始为不可见
    // 由 CSS 控制 .reveal / .reveal-left / .reveal-right / .reveal-scale 的初始状态
    observer.observe(el);
  });

  // 返回清理函数
  return function destroy() {
    observer.disconnect();
  };
}

// initScrollReveal available globally