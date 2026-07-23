/**
 * main.js - NEXUS 个人品牌展示站主逻辑
 * 整合所有子系统，管理页面生命周期
 * 无外部依赖，原生 ES6
 */

// ============================================================
// 1. 数据层
// ============================================================

/** 技能数据 - 基于简历 */
const SKILLS_DATA = [
  // AI & Research
  { name: 'Python 基础语法教学', category: 'frontend', level: 88, icon: '🐍' },
  { name: 'Prompt Engineering', category: 'frontend', level: 92, icon: '🧠' },
  { name: '大模型调优 (LLM)', category: 'frontend', level: 85, icon: '🤖' },
  { name: 'Kimi / AI 工具链', category: 'frontend', level: 95, icon: '⚡' },
  { name: 'AIGC 产品应用', category: 'frontend', level: 90, icon: '🎭' },

  // Data & Systems
  { name: '数据集构建与策划', category: 'backend', level: 88, icon: '📊' },
  { name: '模型评估标注', category: 'backend', level: 90, icon: '🎯' },
  { name: '对话式 AI 系统', category: 'backend', level: 82, icon: '💬' },
  { name: '教学流程设计', category: 'backend', level: 85, icon: '📋' },

  // Creative & Education
  { name: 'AI 课件制作', category: 'design', level: 95, icon: '🎨' },
  { name: '微信公众号运营', category: 'design', level: 88, icon: '📱' },
  { name: '活动策划组织', category: 'design', level: 85, icon: '✨' },
  { name: '跨部门沟通协调', category: 'design', level: 90, icon: '🤝' },

  // Tools & Soft Skills
  { name: 'WPS / Office 精通', category: 'tools', level: 95, icon: '💻' },
  { name: '即梦 AI 创作', category: 'tools', level: 90, icon: '🌟' },
  { name: '宣传海报设计', category: 'tools', level: 85, icon: '🖼️' },
  { name: 'WorkBuddy 熟练使用', category: 'tools', level: 90, icon: '🤖' },
  { name: 'AI 编程', category: 'tools', level: 88, icon: '⌨️' },
  { name: '英语 (CET-6)', category: 'tools', level: 85, icon: '🌏' },
  { name: '信息降维表达', category: 'tools', level: 88, icon: '💡' },
  { name: '多任务并行管理', category: 'tools', level: 85, icon: '⚙️' },
];

/** 作品数据 - 基于简历真实项目 */
const PORTFOLIO_DATA = [
  {
    id: 1,
    title: '亲子活动乡村振兴小程序',
    description: '"互联网+"大学生创新创业大赛校级培育项目（AI+创业），我作为技术核心成员参与全程。从 2022 年 2 月到 10 月，历时 8 个月，深入走访调研乡村家庭，洞察亲子活动市场的真实痛点——城市家庭渴望自然体验，乡村缺乏标准化服务。我负责小程序的技术实现部分，将抽象的需求转化为可落地的产品功能。项目通过层层筛选最终荣获校级培育项目，这是我第一次深刻体会到：<strong>AIGC 复合型人才的价值，在于将技术跨界落地为真实场景的解法</strong>。',
    tags: ['小程序', '创新创业', '乡村振兴', '产品设计'],
    icon: '🌾',
    category: '创新创业',
    image: 'assets/images/portfolio-1.jpg',
    url: '#',
    github: '#',
  },
  {
    id: 2,
    title: 'AI 对话式模型优化与 Q&A',
    description: '在博智感知交互研究中心与香港中文大学教授合作的核心研究项目（AI+研究）。作为项目研究学员，我深度参与 AIGC 聊天机器人调优全流程：负责问答数据集策划与构建、模型评估与标注，系统性优化对话式 AI 的交互体验。项目成果显著——问答系统准确性从 80% 提升至 85%。实习期间累计输出<strong>2 万字+技术文档</strong>（含项目报告、会议纪要、技术简报及 PPT），为模型训练和性能优化奠定了坚实基础。这段经历让我从"AIGC 使用者"正式蜕变为"AIGC 调优者"——复合型人才的技术深度就此扎根。',
    tags: ['AI', 'LLM', 'NLP', '数据集构建'],
    icon: '🤖',
    category: 'AI 研究',
    image: 'assets/images/portfolio-2.jpg',
    url: '#',
    github: '#',
  },
  {
    id: 3,
    title: '德城街道公益暑托班 AI 课程',
    description: '街道团委牵头的零门槛公益暑托班项目（AI+公益），面向 6-21 岁青少年，覆盖 50+ 名学生，解决"课程多元、师资不足、安全可控"三大痛点。作为返乡大学生志愿者，我担任<strong>青少年 AIGC 课程主讲老师 & AI 启蒙模块负责人</strong>。用即梦+Kimi 3 天生成 10 套 AIGC 互动课件，现场授课 5 场，确保每个学生都能听懂、学会。项目成果：AI 课件复用率 80%，课堂满意度 50%+，街道公众号单篇阅读破 5000。这个项目让我坚信：<strong>好的 AIGC 传播者，必须先是一个好的跨界故事讲述者</strong>。',
    tags: ['AI 教育', '公益', '课件', '志愿'],
    icon: '🎓',
    category: '教育公益',
    image: 'assets/images/portfolio-3.jpg',
    url: '#',
    github: '#',
  },
  {
    id: 4,
    title: 'NEXUS 个人品牌展示站',
    description: '你正在浏览的这座"数字神殿"，正是我用原生 JavaScript 从零打造的 AIGC 复合型人才品牌载体（AI+创意）。多模式 Canvas 粒子系统（星云/流光/矩阵/爆发）、3D 倾斜卡片交互、自定义赛博朋克光标、打字机效果、滚动显现动画——没有任何前端框架，只有对细节的极致追求。这不仅是一个网站，更是我<strong>"用 AIGC 思维表达自我"</strong>的设计哲学的实体化呈现。每一行代码、每一个动画、每一抹光效，都是复合型人才对"技术美学"的跨界诠释。',
    tags: ['前端', '创意', '个人', '赛博朋克'],
    icon: '⚡',
    category: '创意开发',
    image: 'assets/images/portfolio-4.jpg',
    url: '#',
    github: '#',
  },
];

/** 经历数据 - 基于简历真实经历 */
const EXPERIENCE_DATA = [
  {
    id: 1,
    type: 'work',
    title: 'AIGC 课程负责人',
    company: '深圳市游志文娱科技有限公司',
    period: '2026.01 - 2026.05',
    description: '执掌 AIGC 课程体系之牛耳，以复合型人才的体系化思维编织从科普到提效的完整课程梯度。我既是课程架构的<strong>设计师</strong>，也是多场景授课的<strong>交付者</strong>——为青少年点燃 AIGC 启蒙之火（AI+教育），为银发族架设跨越数字鸿沟的桥梁（AI+普惠），为企业团队锻造效率跃迁的利刃（AI+提效）。这不是一份工作，而是一场让 AIGC 能力向万业流淌的跨界实验。',
    highlights: [
      '主导 AIGC 课程框架搭建，梳理课程梯度、内容模块与教学标准，为 C 端青少年/老年科普课、B 端企业 AI 提效课落地提供体系化支撑',
      '针对青少年、老年群体认知差异定制授课方案，降低 AI 工具使用门槛，累计覆盖学员超 50 人次',
      '为企业定制办公提效类 AI 培训方案，助力客户团队人均工作效率提升 20%',
      '负责 AIGC 课程体系搭建与多场景授课交付，覆盖 To C 普惠教育、To B 企业培训两类业务线',
    ],
  },
  {
    id: 2,
    type: 'work',
    title: '教学事务助理',
    company: '深圳市那位科技有限公司',
    period: '2025.02 - 2025.12',
    description: '深度参与 AIGC 大模型工具的课程化落地，横跨教学、技术、运营三大领域——这正是复合型人才的典型战场。我不仅是教学助手，更是连接技术团队与学员需求的"翻译官"：将复杂的模型原理降维为学员能听懂的语言（AI+教育），将一线教学反馈精准传递给研发团队（AI+产品）。在支持性角色中发挥工具与方法的实际应用价值，将流程优化思路与业务痛点深度结合。',
    highlights: [
      '协助人工智能大模型工具开发，完成课程调研、会议组织及教学事务统筹',
      '协助教师完成大模型应用课程交付，解决学员技术问题，课程满意度 80%+',
      '参与教学流程优化，提升教学管理效率，确保教学事务有序进行',
      '协助课程调研、会议组织、教学事务统筹，保障 100+ 课时顺利交付',
    ],
  },
  {
    id: 3,
    type: 'work',
    title: 'AI 研究助理实习生',
    company: '博智感知交互研究中心',
    period: '2024.07 - 2024.09',
    description: '与香港中文大学教授深度合作，进入 AIGC 对话式研究的最前沿（AI+研究）。我系统学习了从 Transformer 架构到 RLHF 对齐的完整技术链路，并在真实的研究项目中贡献了自己的力量。这段经历让我从"AIGC 使用者"蜕变为"AIGC 调优者"——复合型人才的另一块拼图就此补齐，更获得了<strong>港中文优秀实习生</strong>的荣誉认可。',
    highlights: [
      '与香港中文大学教授合作完成对话式 AI 入门课程，系统掌握对话式 AI 基础原理',
      '参与 AI 聊天机器人性能调优和问答数据集构建',
      '协助团队进行模型评估与标注，提升问答系统准确性和用户体验',
      '问答系统准确性从 80% 提升至 85%，获港中文优秀实习生荣誉',
    ],
  },
  {
    id: 4,
    type: 'work',
    title: '青少年 AI 课程主讲老师 & AI 启蒙模块负责人',
    company: '德城街道爱心公益暑托班（返乡志愿者）',
    period: '2024.07 - 2024.08',
    description: '作为一名返乡大学生志愿者，我将最前沿的 AIGC 知识带回了家乡（AI+公益）。街道团委牵头，面向 6-21 岁青少年打造零门槛公益暑托班，解决"课程多元、师资不足、安全可控"三大痛点。面对 50+ 名学生，我不仅是一名老师，更是一个"造梦者"——用 AIGC 课件激发孩子们对科技的好奇心，用互动游戏点燃他们对未来的想象力。这是 AIGC 复合型人才将技术红利反哺社会的最佳注脚。',
    highlights: [
      '用即梦+Kimi 3 天生成 10 套 AI 互动课件，搭建课程复用体系',
      '担任"AI 主讲老师"现场授课 5 场，覆盖 50+ 名青少年学生',
      'AI 课件复用率 80%，课堂满意度 50%+，确保学生掌握核心知识',
      '街道公众号单篇阅读量破 5000，引发社区广泛关注',
    ],
  },
  {
    id: 5,
    type: 'campus',
    title: '运营技术部成员',
    company: '学院易班学生工作站',
    period: '2023.09 - 2024.09',
    description: '在学院易班运营技术部，我负责公众号内容运营与互动内容制作（AI+内容）。这一年里，我将技术思维融入内容创作，用数据驱动内容优化——这是复合型人才"左手技术、右手人文"的早期演练。每一篇推文、每一个互动问答，都是我用 AIGC 思维与用户对话的方式。',
    highlights: [
      '协助学院易班公众号原创内容撰写与排版设计，涵盖校园活动报道、政策解读等',
      '策划并制作公众号互动题目（知识问答、趣味测试等），通过内容创新提升用户参与度',
      '协同团队完成公众号日常更新与素材整理，配合运营数据基础统计',
      '助力内容传播效果优化，提升平台用户粘性与信息触达效率',
    ],
  },
  {
    id: 6,
    type: 'campus',
    title: '宣传部部长',
    company: '学院党群志愿服务队',
    period: '2022.09 - 2023.09',
    description: '担任学院党群志愿服务队宣传部部长，统筹宣传工作全流程。从政策宣传内容的精准撰写，到微信公众号的运营管理，再到团队协作的高效推进——这段经历让我从"执行者"成长为"管理者"。我学会了如何将抽象的政策方针转化为青年学生易懂的语言，如何带领团队高效完成任务，更获评<strong>学院优秀干部</strong>。',
    highlights: [
      '精准解读党的红色政策方针，结合学院场景转化为青年学生易懂的宣传文稿',
      '统筹公众号内容策划、排版发布与粉丝互动，优化选题与推送节奏',
      '协调宣传部成员完成宣传物料制作、活动现场报道，保障日常宣传高效落地',
      '获评学院优秀干部，助力学院党群志愿服务影响力持续提升',
    ],
  },
  {
    id: 7,
    type: 'education',
    title: '计算机科学与技术 本科',
    company: '广州华商学院',
    period: '2021.09 - 2025.06',
    description: '大学四年，我从一个对编程充满好奇的新生，成长为能够独立承担 AIGC 项目的复合型人才。绩点排名全专业前 25% 的背后，是无数个在图书馆和实验室度过的日夜。核心课程包括 Python 程序设计、人工智能基础、数据结构、计算机网络——这些知识构筑了我 AIGC 技术大厦的地基。我不仅学到了技术，更学会了如何学习、如何协作、如何将 AIGC 知识跨界转化为价值。',
    highlights: [
      '绩点排名全专业前 25%，学习能力优秀，抗压能力强',
      '核心课程：Python 程序设计、人工智能基础、数据结构、计算机网络',
      '大学英语 6 级（CET-6），具备优秀的听说写能力',
      '参与校级 DeepSeek 模型师资培训会，持续追踪大模型技术前沿',
      '获评深圳市优秀共青团员',
    ],
  },
  {
    id: 8,
    type: 'education',
    title: '高中',
    company: '北京大学附属中学深圳学校',
    period: '2018.09 - 2021.06',
    description: '在深圳这片创新热土上完成高中学业，北附深校的开放氛围与严谨学风为我打下了坚实的学术根基，也播下了对科技与人文双重探索的种子。',
    highlights: [
      '系统完成高中阶段全科学习，奠定扎实的理科与文科基础',
      '在校期间培养独立思考与批判性思维能力',
      '初步接触编程与信息技术，萌生对计算机科学的兴趣',
    ],
  },
  {
    id: 9,
    type: 'education',
    title: '初中',
    company: '深圳市福田区外国语学校',
    period: '2015.09 - 2018.06',
    description: '外国语学校的多元文化氛围与国际化视野，让我在少年时代便接触到更广阔的世界，语言能力与跨文化交流意识在此萌芽。',
    highlights: [
      '完成初中阶段义务教育课程，学业表现优良',
      '在外语特色环境中提升英语听说读写能力',
      '参与各类校园文化活动，培养团队协作与表达能力',
    ],
  },
  {
    id: 10,
    type: 'education',
    title: '小学',
    company: '深圳市福田区梅林小学',
    period: '2009.09 - 2015.06',
    description: '在梅林小学度过六年启蒙时光，这里是我认知世界的起点，也是好奇心与求知欲最初被点燃的地方。',
    highlights: [
      '完成小学阶段基础教育，养成良好学习习惯',
      '在老师的引导下建立对知识的热爱与探索精神',
      '参与多项课外活动，全面发展个人兴趣',
    ],
  },
];

// ============================================================
// 2. 工具函数
// ============================================================

/** 防抖 */
function debounce(fn, delay = 200) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/** 节流 */
function throttle(fn, interval = 100) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/** 复制到剪贴板 */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // 降级方案
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

/** 显示 Toast 提示 */
function showToast(message, type = 'success', duration = 2500) {
  const existing = document.querySelector('.nexus-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `nexus-toast nexus-toast--${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(0, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 255, 255, 0.3);
    color: #00ffff;
    padding: 12px 28px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 99999;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    pointer-events: none;
  `;
  document.body.appendChild(toast);

  // 触发入场动画
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/** 平滑滚动到指定元素 */
function smoothScrollTo(target, offset = 80) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ============================================================
// 3. 导航栏
// ============================================================

class NavManager {
  constructor() {
    this.navbar = document.querySelector('.nav');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('section[id]');
    this.scrollTimer = null;
    this._init();
  }

  _init() {
    if (!this.navbar) return;

    // 导航点击平滑滚动
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          smoothScrollTo(href, 80);
          // 关闭移动端菜单
          const menuToggle = document.querySelector('.nav__toggle');
          const navMenu = document.querySelector('.nav__links');
          if (menuToggle && navMenu) {
            menuToggle.classList.remove('nav__toggle--active');
            navMenu.classList.remove('nav__links--open');
          }
        }
      });
    });

    // 滚动监听 - 高亮当前 section + 毛玻璃效果
    window.addEventListener('scroll', throttle(() => {
      this._updateActiveSection();
      this._updateGlassmorphism();
    }, 100), { passive: true });

    // 初始状态
    this._updateGlassmorphism();
  }

  _updateActiveSection() {
    const scrollY = window.pageYOffset;
    let currentSection = '';

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('nav__link--active');
      }
    });
  }

  _updateGlassmorphism() {
    const scrollY = window.pageYOffset;
    if (scrollY > 50) {
      this.navbar.classList.add('nav--scrolled');
    } else {
      this.navbar.classList.remove('nav--scrolled');
    }
  }
}

// ============================================================
// 4. 技能模块
// ============================================================

class SkillsManager {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.activeCategory = 'all';
    this._init();
  }

  _init() {
    if (!this.container) return;
    this._renderFilters();
    this._renderSkills();
  }

  _renderFilters() {
    const categories = ['all', 'frontend', 'backend', 'design', 'tools'];
    const labels = { all: '全部', frontend: 'AIGC & 教育', backend: '数据 & 系统', design: '创意 & 跨界', tools: '工具 & 技能' };
    const filterContainer = document.querySelector('.skills-filter');
    if (!filterContainer) return;

    filterContainer.innerHTML = categories.map(cat => `
      <button class="skills-filter__btn ${cat === this.activeCategory ? 'active' : ''}"
              data-category="${cat}">
        ${labels[cat]}
      </button>
    `).join('');

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.skills-filter__btn');
      if (!btn) return;
      const category = btn.dataset.category;
      this.activeCategory = category;
      filterContainer.querySelectorAll('.skills-filter__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this._renderSkills();
    });
  }

  _renderSkills() {
    const filtered = this.activeCategory === 'all'
      ? SKILLS_DATA
      : SKILLS_DATA.filter(s => s.category === this.activeCategory);

    this.container.innerHTML = filtered.map(skill => `
      <div class="skill-card reveal-scale" data-delay="0.05">
        <div class="skill-card__icon">${skill.icon}</div>
        <h3 class="skill-card__name">${skill.name}</h3>
        <div class="skill-card__bar">
          <div class="skill-card__bar-fill" style="width: ${skill.level}%"></div>
        </div>
        <span class="skill-card__level">${skill.level}%</span>
      </div>
    `).join('');

    // 筛选后重新渲染的卡片不会被 scrollReveal 重新观察，需手动触发显示
    // 加上 stagger 延迟让卡片逐个浮现
    requestAnimationFrame(() => {
      this.container.querySelectorAll('.skill-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.05}s`;
        card.classList.add('reveal-scale--visible');
      });
    });
  }
}

// ============================================================
// 5. 作品模块
// ============================================================

class PortfolioManager {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this._init();
  }

  _init() {
    if (!this.container) return;
    this._render();
    this._enableWheelScroll();
  }

  _enableWheelScroll() {
    this.container.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) < 5) return;
      const maxScroll = this.container.scrollWidth - this.container.clientWidth;
      if (maxScroll <= 0) return;
      const atStart = this.container.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = this.container.scrollLeft >= maxScroll && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      this.container.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  _render() {
    this.container.innerHTML = PORTFOLIO_DATA.map(project => `
      <div class="portfolio-card tilt-card reveal" data-delay="0.05">
        <div class="portfolio-card__image">
          <div class="portfolio-card__placeholder" style="
            background: linear-gradient(135deg, hsla(${project.id * 60}, 80%, 30%, 0.3), hsla(${project.id * 60 + 60}, 80%, 20%, 0.3));
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
          ">
            <div style="font-size: 64px; line-height: 1;">${project.icon}</div>
            <div style="
              font-family: var(--font-mono);
              font-size: 11px;
              color: rgba(0, 255, 255, 0.6);
              letter-spacing: 0.15em;
              text-transform: uppercase;
              padding: 4px 12px;
              border: 1px solid rgba(0, 255, 255, 0.2);
              border-radius: 999px;
              background: rgba(0, 255, 255, 0.05);
            ">${project.category}</div>
          </div>
        </div>
        <div class="portfolio-card__body">
          <div class="portfolio-card__tags">
            ${project.tags.map(tag => `<span class="portfolio-card__tag">${tag}</span>`).join('')}
          </div>
          <h3 class="portfolio-card__title">${project.title}</h3>
          <p class="portfolio-card__desc">${project.description}</p>
          <div class="portfolio-card__links">
            <a href="${project.url}" class="portfolio-card__link" target="_blank" rel="noopener">
              <span>预览</span>
            </a>
            <a href="${project.github}" class="portfolio-card__link" target="_blank" rel="noopener">
              <span>源码</span>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// ============================================================
// 6. 经历模块
// ============================================================

class ExperienceManager {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this._init();
  }

  _init() {
    if (!this.container) return;
    this._render();
  }

  _render() {
    this.container.innerHTML = EXPERIENCE_DATA.map(exp => `
      <div class="experience-card experience-card--${exp.type} reveal" data-delay="0.05">
        <div class="experience-card__dot"></div>
        <div class="experience-card__line"></div>
        <div class="experience-card__content">
          <span class="experience-card__type experience-card__type--${exp.type}">${exp.type === 'work' ? '工作' : exp.type === 'education' ? '教育' : '校园'}</span>
          <span class="experience-card__period">${exp.period}</span>
          <h3 class="experience-card__title">${exp.title}</h3>
          <p class="experience-card__company">${exp.company}</p>
          <p class="experience-card__desc">${exp.description}</p>
          <ul class="experience-card__highlights">
            ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }
}

// ============================================================
// 7. 开场序列
// ============================================================

class OpeningSequence {
  constructor(options = {}) {
    this.loaderEl = document.querySelector(options.loader || '.intro');
    this.progressBar = document.querySelector(options.progressBar || '.intro__loader-bar');
    this.progressText = document.querySelector(options.progressText || '.intro__loader-text');
    this.taglineEl = document.querySelector(options.tagline || '.intro__tagline');
    this.duration = options.duration || 1200;
    this.particleSystem = null;
    this._resolve = null;
    this._promise = null;
  }

  setParticleSystem(ps) {
    this.particleSystem = ps;
  }

  start() {
    this._promise = new Promise(resolve => {
      this._resolve = resolve;
      this._run();
    });
    // 点击跳过
    if (this.loaderEl) {
      this._skipHandler = () => this.skip();
      this.loaderEl.addEventListener('click', this._skipHandler);
    }
    return this._promise;
  }

  skip() {
    if (this._skipped) return;
    this._skipped = true;
    if (this.loaderEl) {
      this.loaderEl.style.transition = 'opacity 0.3s ease';
      this.loaderEl.style.opacity = '0';
      setTimeout(() => {
        this.loaderEl.style.display = 'none';
        document.body.classList.add('page-loaded');
        if (this._resolve) this._resolve();
      }, 300);
    }
  }

  async _run() {
    if (!this.loaderEl) {
      this._resolve();
      return;
    }

    this.loaderEl.style.display = 'flex';
    this.loaderEl.style.opacity = '1';

    // 阶段1: 粒子汇聚效果（让粒子系统使用 nebula 模式）
    await this._delay(500);

    // 阶段2: 打字机显示 tagline
    if (this.taglineEl) {
      const taglineText = this.taglineEl.getAttribute('data-text') || 'NEXUS\nWhere Ideas Converge';
      const tw = new Typewriter(this.taglineEl, taglineText, 80, true);
      tw.start();

      // 等待打字机完成
      await new Promise(resolve => {
        // 轮询检查打字机是否完成
        const check = () => {
          if (!tw.running || tw.currentIndex >= tw.fullText.length) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        setTimeout(check, 500);
      });
    }

    // 阶段3: 进度条动画
    if (this.progressBar) {
      await this._animateProgress(this.progressBar, this.progressText);
    }

    // 阶段4: 爆发转场
    await this._delay(300);
    if (this.particleSystem) {
      this.particleSystem.burst(
        window.innerWidth / 2,
        window.innerHeight / 2,
        '#00ffff'
      );
    }

    // 淡出 loader
    this.loaderEl.style.transition = 'opacity 0.6s ease';
    this.loaderEl.style.opacity = '0';

    await this._delay(600);
    this.loaderEl.style.display = 'none';

    // 触发页面入场动画
    document.body.classList.add('page-loaded');

    // 移除点击跳过监听器
    if (this.loaderEl && this._skipHandler) {
      this.loaderEl.removeEventListener('click', this._skipHandler);
    }

    this._resolve();
  }

  _animateProgress(bar, textEl) {
    return new Promise(resolve => {
      let progress = 0;
      const step = () => {
        progress += Math.random() * 6 + 1;
        if (progress > 100) progress = 100;

        bar.style.width = `${progress}%`;
        if (textEl) textEl.textContent = `${Math.floor(progress)}%`;

        if (progress < 100) {
          // 模拟加载不均匀的速度
          const delay = 80 + Math.random() * 60;
          setTimeout(step, delay);
        } else {
          resolve();
        }
      };
      step();
    });
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================
// 8. 键盘快捷键
// ============================================================

class KeyboardShortcuts {
  constructor() {
    this._init();
  }

  _init() {
    document.addEventListener('keydown', (e) => {
      // 忽略输入框内的快捷键
      if (e.target.matches('input, textarea, [contenteditable]')) return;

      switch (e.key.toLowerCase()) {
        case 'h':
          e.preventDefault();
          this._toggleHelpMenu();
          break;
        case 'm':
          e.preventDefault();
          this._toggleMobileMenu();
          break;
        case 'escape':
          this._closeModals();
          break;
      }
    });
  }

  _toggleHelpMenu() {
    let helpMenu = document.querySelector('.nexus-help-menu');
    if (helpMenu) {
      helpMenu.remove();
      return;
    }

    helpMenu = document.createElement('div');
    helpMenu.className = 'nexus-help-menu';
    helpMenu.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(10, 10, 30, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 16px;
      padding: 32px;
      z-index: 100001;
      min-width: 300px;
      color: #e0e0e0;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    helpMenu.innerHTML = `
      <h3 style="color: #00ffff; margin-bottom: 20px; font-size: 18px;">快捷键</h3>
      <div style="display: grid; gap: 12px;">
        <div style="display: flex; justify-content: space-between;">
          <span>按 <kbd style="background: rgba(0,255,255,0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(0,255,255,0.3);">H</kbd></span>
          <span style="color: #aaa;">显示/隐藏帮助</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>按 <kbd style="background: rgba(0,255,255,0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(0,255,255,0.3);">M</kbd></span>
          <span style="color: #aaa;">打开/关闭菜单</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>按 <kbd style="background: rgba(0,255,255,0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(0,255,255,0.3);">ESC</kbd></span>
          <span style="color: #aaa;">关闭弹窗</span>
        </div>
      </div>
      <button class="nexus-help-close" style="
        margin-top: 20px;
        background: rgba(0,255,255,0.1);
        border: 1px solid rgba(0,255,255,0.3);
        color: #00ffff;
        padding: 8px 24px;
        border-radius: 6px;
        cursor: pointer;
        width: 100%;
        font-size: 14px;
      ">关闭</button>
    `;

    document.body.appendChild(helpMenu);

    helpMenu.querySelector('.nexus-help-close').addEventListener('click', () => {
      helpMenu.remove();
    });

    // 点击外部关闭
    helpMenu.addEventListener('click', (e) => {
      if (e.target === helpMenu) helpMenu.remove();
    });
  }

  _toggleMobileMenu() {
    const menuToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__links');
    if (menuToggle && navMenu) {
      menuToggle.classList.toggle('nav__toggle--active');
      navMenu.classList.toggle('nav__links--open');
    }
  }

  _closeModals() {
    document.querySelectorAll('.nexus-help-menu').forEach(el => el.remove());
  }
}

// ============================================================
// 9. 回到顶部
// ============================================================

class BackToTop {
  constructor() {
    this.btn = document.querySelector('.back-to-top');
    if (!this.btn) {
      this._createButton();
    }
    this._init();
  }

  _createButton() {
    this.btn = document.createElement('button');
    this.btn.className = 'back-to-top';
    this.btn.setAttribute('aria-label', '回到顶部');
    this.btn.innerHTML = '↑';
    this.btn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 255, 255, 0.3);
      color: #00ffff;
      font-size: 20px;
      cursor: pointer;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(this.btn);
  }

  _init() {
    if (!this.btn) return;

    window.addEventListener('scroll', throttle(() => {
      if (window.pageYOffset > 400) {
        this.btn.style.opacity = '1';
        this.btn.style.transform = 'translateY(0)';
        this.btn.style.pointerEvents = 'auto';
      } else {
        this.btn.style.opacity = '0';
        this.btn.style.transform = 'translateY(20px)';
        this.btn.style.pointerEvents = 'none';
      }
    }, 100), { passive: true });

    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================================
// 10. 背景音乐（可选）
// ============================================================

class BackgroundMusic {
  constructor(src) {
    this.src = src;
    this.audio = null;
    this.isPlaying = false;
    this.btn = null;
    this._init();
  }

  _init() {
    if (!this.src) return;

    this.audio = document.createElement('audio');
    this.audio.src = this.src;
    this.audio.loop = true;
    this.audio.volume = 0.3;

    this.btn = document.createElement('button');
    this.btn.className = 'music-toggle';
    this.btn.setAttribute('aria-label', '切换背景音乐');
    this.btn.innerHTML = '♫';
    this.btn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 84px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(0, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 255, 255, 0.3);
      color: #00ffff;
      font-size: 18px;
      cursor: pointer;
      z-index: 9999;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(this.btn);

    this.btn.addEventListener('click', () => this.toggle());
  }

  toggle() {
    if (!this.audio) return;
    if (this.isPlaying) {
      this.audio.pause();
      this.btn.style.opacity = '0.5';
    } else {
      this.audio.play().catch(() => {});
      this.btn.style.opacity = '1';
    }
    this.isPlaying = !this.isPlaying;
  }

  destroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.btn && this.btn.parentNode) {
      this.btn.parentNode.removeChild(this.btn);
    }
  }
}

// ============================================================
// 11. 控制台彩蛋
// ============================================================

function printConsoleEasterEgg() {
  const ascii = `
    %c
    ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
    ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
    ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
    ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
    ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
    ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
  `;

  const style = [
    'color: #00ffff; font-size: 12px; font-weight: bold;',
    'color: #888; font-size: 14px;',
  ];

  console.log(ascii, style[0]);
  console.log('%cHey, nice to meet you here.', 'color: #00ffff; font-size: 16px; font-weight: bold;');
  console.log('%cBuilt with love by 詹昊霖', 'color: #666; font-size: 12px;');
}

// ============================================================
// 12. 主初始化
// ============================================================

class App {
  constructor() {
    this.particleSystem = null;
    this.destroyFns = [];
    this._init();
  }

  async _init() {
    // 打印控制台彩蛋
    printConsoleEasterEgg();

    // 初始化粒子系统（性能优化版）
    this.particleSystem = new ParticleSystem('particle-canvas', 'nebula', {
      connectionDistance: 120,
      mouseRadius: 100,
    });
    this.destroyFns.push(() => this.particleSystem.destroy());

    // 初始化自定义光标（延迟加载，让 loader 先显示）
    try {
      const destroyCursor = initCustomCursor();
      if (destroyCursor) this.destroyFns.push(destroyCursor);
    } catch (e) {
      console.warn('[NEXUS] Custom cursor init failed:', e);
    }

    // 初始化导航栏
    new NavManager();

    // 初始化技能模块
    new SkillsManager('.skills-grid');

    // 初始化作品模块
    new PortfolioManager('.portfolio-grid');

    // 初始化经历模块
    new ExperienceManager('.experience-timeline');

    // 初始化键盘快捷键
    new KeyboardShortcuts();

    // 初始化回到顶部
    new BackToTop();

    // 背景音乐（可选 - 需要提供音频文件路径）
    // new BackgroundMusic('assets/audio/background.mp3');

    // 开场序列
    const opening = new OpeningSequence({
      loader: '.intro',
      progressBar: '.intro__loader-bar',
      progressText: '.intro__loader-text',
      tagline: '.intro__tagline',
    });
    opening.setParticleSystem(this.particleSystem);

    await opening.start();

    // 开场后延迟初始化 tilt 和 scrollReveal
    setTimeout(() => {
      this._initPostLoad();
    }, 100);
  }

  async _initPostLoad() {
    // 初始化 3D 倾斜卡片
    try {
      const destroyTilt = initTiltCards('.tilt-card');
      if (destroyTilt) this.destroyFns.push(destroyTilt);
    } catch (e) {
      console.warn('[NEXUS] Tilt cards init failed:', e);
    }

    // 初始化滚动显现动画
    try {
      const destroyReveal = initScrollReveal({
        threshold: 0.15,
        once: true,
      });
      if (destroyReveal) this.destroyFns.push(destroyReveal);
    } catch (e) {
      console.warn('[NEXUS] ScrollReveal init failed:', e);
    }

    // Hero 打字机效果
    try {
      const heroSub = document.getElementById('hero-subtitle');
      if (heroSub) {
        const heroTw = new Typewriter(heroSub, '以 AIGC 为笔，以教育为墨，书写人与技术共生的诗篇。用每一次 Prompt，架起 AIGC 与教育之间的桥梁。', 65, true);
        heroTw.start();
      }
    } catch (e) {
      console.warn('[NEXUS] Hero typewriter failed:', e);
    }

    // 绑定复制功能
    this._bindCopyButtons();
  }

  _bindCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        copyToClipboard(text).then(() => {
          showToast('已复制到剪贴板', 'success');
        }).catch(() => {
          showToast('复制失败，请手动复制', 'error');
        });
      });
    });

    // 邮箱复制
    const emailBtn = document.querySelector('.copy-email');
    if (emailBtn) {
      emailBtn.addEventListener('click', () => {
        const email = emailBtn.getAttribute('data-email') || 'hello@nexus.dev';
        copyToClipboard(email).then(() => {
          showToast('邮箱地址已复制', 'success');
        });
      });
    }
  }

  destroy() {
    this.destroyFns.forEach(fn => {
      try { fn(); } catch (e) { /* ignore */ }
    });
    this.destroyFns = [];
  }
}

// ============================================================
// 入口
// ============================================================

// 等待 DOM 就绪
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.nexusApp = new App();
  });
} else {
  window.nexusApp = new App();
}

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (window.nexusApp) {
    window.nexusApp.destroy();
  }
});