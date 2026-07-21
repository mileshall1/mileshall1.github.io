(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (!themeToggle) return;
    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    themeToggle.querySelector('span').textContent = isLight ? '☾' : '☼';
    themeToggle.querySelector('b').textContent = isLight ? 'DARK' : 'LIGHT';
  }

  setTheme(initialTheme);
  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  });

  const commandTrigger = document.getElementById('command-trigger');
  const commandBackdrop = document.getElementById('command-backdrop');
  const commandInput = document.getElementById('command-input');
  const commandItems = [...document.querySelectorAll('#command-list > button, #command-list > a')];
  const timelineEntries = [...document.querySelectorAll('.timeline-entry')];
  const timelineExpandAll = document.getElementById('timeline-expand-all');
  const assistantLauncher = document.getElementById('assistant-launcher');
  const assistantPanel = document.getElementById('assistant-panel');
  const assistantClose = document.getElementById('assistant-close');
  const assistantForm = document.getElementById('assistant-form');
  const assistantInput = document.getElementById('assistant-input');
  const assistantMessages = document.getElementById('assistant-messages');

  const portfolioAnswers = [
    { keys: ['dell', 'internship', 'work', 'experience'], answer: 'Miles is a Software Engineering Intern at Dell Technologies, where he is developing an internal AI assistant for the Client Solutions Group. His work uses Ollama, vector embeddings, ChromaDB, Memgraph, and semantic retrieval pipelines.' },
    { keys: ['building', 'current', 'progress', 'budgetmaxxing', 'stattrack'], answer: 'Miles is currently building BudgetMaxxing, a student-focused financial insights platform, and StatTrack, an NBA game tracker with an Express REST API. Both are clearly marked as works in progress.' },
    { keys: ['best', 'favorite', 'project', 'bucket'], answer: 'A great place to start is Bucket. It won 1st Place Overall and the AI/ML Track at HackHounds 2025. CMDFlow is another strong technical project, combining FastAPI, MongoDB, shell capture, JWT authentication, and AI summaries.' },
    { keys: ['project', 'projects', 'built'], answer: 'Miles’s featured work includes Bucket, CMDFlow, HuzzHub, LeBronAI, Two-Minute Draft Games, BudgetMaxxing, and StatTrack. Open the Projects tab to explore each build and its source or live demo.' },
    { keys: ['skill', 'stack', 'technology', 'language', 'code'], answer: 'Miles works with Java, JavaScript, Python, C, Bash/Zsh, R, and Assembly. His toolkit includes React, Next.js, FastAPI, Express, PostgreSQL, MongoDB, Firebase, Docker, Gemini, Ollama, ChromaDB, and Memgraph.' },
    { keys: ['school', 'education', 'loyola', 'degree', 'gpa'], answer: 'Miles is pursuing a B.S. in Computer Science at Loyola University Maryland with minors in Finance and Data Science. He expects to graduate in May 2027 and is a Hyman Science Scholar with a 3.37 GPA.' },
    { keys: ['outside', 'hobby', 'basketball', 'lebron', 'personal'], answer: 'Outside of engineering, Miles is a big basketball and LeBron fan. He is also interested in finance, entrepreneurship, and building stronger student communities.' },
    { keys: ['leadership', 'colorstack', 'community'], answer: 'Miles serves as Vice President of ColorStack at Loyola. He has helped organize workshops for 30+ technology students, including sessions on data structures, interviews, career development, and academic growth.' },
    { keys: ['contact', 'email', 'hire', 'reach'], answer: 'You can reach Miles at mileshall423@gmail.com, connect on LinkedIn at linkedin.com/in/miles-hall1, or explore his work at github.com/mileshall1.' },
    { keys: ['resume', 'résumé', 'cv'], answer: 'Miles’s résumé is available from the top-right title bar, the Explorer sidebar, the command palette, and the contact section.' },
    { keys: ['who', 'about', 'miles'], answer: 'Miles Hall is a Computer Science student and software engineer focused on full-stack products, intelligent retrieval systems, applied AI, and secure, useful software.' },
  ];

  function setAssistant(open) {
    assistantPanel?.classList.toggle('open', open);
    assistantPanel?.setAttribute('aria-hidden', String(!open));
    assistantLauncher?.setAttribute('aria-expanded', String(open));
    if (open) window.setTimeout(() => assistantInput?.focus(), 250);
  }

  function getAssistantAnswer(question) {
    const normalized = question.toLowerCase();
    if (['outside', 'hobby', 'basketball', 'lebron', 'personal'].some(key => normalized.includes(key))) {
      return 'Outside of engineering, Miles is a big basketball and LeBron fan. He is also interested in finance, entrepreneurship, and building stronger student communities.';
    }
    let best = null;
    let score = 0;
    portfolioAnswers.forEach(item => {
      const itemScore = item.keys.reduce((total, key) => total + (normalized.includes(key) ? 1 : 0), 0);
      if (itemScore > score) { best = item; score = itemScore; }
    });
    return best?.answer || 'I can help with Miles’s projects, Dell experience, technical skills, education, leadership, interests, résumé, or contact details. Try asking about one of those topics.';
  }

  function addAssistantMessage(text, type) {
    const row = document.createElement('div');
    row.className = type === 'user' ? 'user-message' : 'bot-message';
    if (type === 'bot') row.innerHTML = '<span>◇</span>';
    const message = document.createElement('p');
    message.textContent = text;
    row.appendChild(message);
    assistantMessages.appendChild(row);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  }

  function askAssistant(question) {
    const clean = question.trim();
    if (!clean) return;
    addAssistantMessage(clean, 'user');
    assistantInput.value = '';
    const typing = document.createElement('div');
    typing.className = 'bot-message bot-typing';
    typing.innerHTML = '<span>◇</span><p><i></i><i></i><i></i></p>';
    assistantMessages.appendChild(typing);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
    window.setTimeout(() => { typing.remove(); addAssistantMessage(getAssistantAnswer(clean), 'bot'); }, 520);
  }

  assistantLauncher?.addEventListener('click', () => setAssistant(!assistantPanel.classList.contains('open')));
  assistantClose?.addEventListener('click', () => setAssistant(false));
  assistantForm?.addEventListener('submit', event => { event.preventDefault(); askAssistant(assistantInput.value); });
  document.querySelectorAll('#assistant-prompts button').forEach(button => button.addEventListener('click', () => askAssistant(button.textContent)));

  function setTimelineEntry(entry, expanded) {
    const toggle = entry.querySelector('.timeline-toggle');
    entry.classList.toggle('expanded', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.querySelector('i').textContent = expanded ? '−' : '+';
  }

  timelineEntries.forEach(entry => entry.querySelector('.timeline-toggle')?.addEventListener('click', () => {
    setTimelineEntry(entry, !entry.classList.contains('expanded'));
    const allExpanded = timelineEntries.every(item => item.classList.contains('expanded'));
    timelineExpandAll?.setAttribute('aria-pressed', String(allExpanded));
    if (timelineExpandAll) timelineExpandAll.textContent = allExpanded ? 'Collapse all −' : 'Expand all +';
  }));

  timelineExpandAll?.addEventListener('click', () => {
    const expand = timelineExpandAll.getAttribute('aria-pressed') !== 'true';
    timelineEntries.forEach(entry => setTimelineEntry(entry, expand));
    timelineExpandAll.setAttribute('aria-pressed', String(expand));
    timelineExpandAll.textContent = expand ? 'Collapse all −' : 'Expand all +';
  });


  function setCommandPalette(open) {
    if (!commandBackdrop || !commandTrigger) return;
    commandBackdrop.classList.toggle('open', open);
    commandBackdrop.setAttribute('aria-hidden', String(!open));
    commandTrigger.setAttribute('aria-expanded', String(open));
    if (open) {
      commandInput.value = '';
      commandItems.forEach(item => item.hidden = false);
      window.setTimeout(() => commandInput.focus(), 40);
    } else commandTrigger.focus();
  }

  commandTrigger?.addEventListener('click', () => setCommandPalette(true));
  commandBackdrop?.addEventListener('click', event => { if (event.target === commandBackdrop) setCommandPalette(false); });
  commandInput?.addEventListener('input', () => {
    const query = commandInput.value.toLowerCase();
    commandItems.forEach(item => item.hidden = !item.textContent.toLowerCase().includes(query));
  });
  document.querySelectorAll('[data-command="section"]').forEach(item => item.addEventListener('click', () => {
    openSection(item.dataset.target);
    setCommandPalette(false);
  }));
  document.querySelector('[data-command="theme"]')?.addEventListener('click', () => {
    themeToggle.click();
    setCommandPalette(false);
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setCommandPalette(!commandBackdrop.classList.contains('open'));
    }
    if (event.key === 'Escape' && commandBackdrop?.classList.contains('open')) setCommandPalette(false);
  });

  const command = document.getElementById('typed-command');
  const output = document.getElementById('command-output');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!command || reduceMotion) {
    if (command) command.textContent = 'cat current-focus.txt';
    if (output) output.textContent = 'AI systems · full-stack engineering · secure software';
  }

  const lines = [
    ['whoami', 'Miles Hall — software engineer, CS student, lifelong builder'],
    ['cat current-focus.txt', 'AI systems · full-stack engineering · secure software'],
    ['git status --short', 'M  the_future.js'],
  ];
  let line = 0;

  function type(text, index = 0) {
    if (index <= text.length) {
      command.textContent = text.slice(0, index);
      window.setTimeout(() => type(text, index + 1), 55);
    } else {
      output.textContent = lines[line][1];
      window.setTimeout(erase, 2400);
    }
  }

  function erase() {
    const text = command.textContent;
    if (text.length) {
      command.textContent = text.slice(0, -1);
      window.setTimeout(erase, 26);
    } else {
      output.textContent = '';
      line = (line + 1) % lines.length;
      window.setTimeout(() => type(lines[line][0]), 400);
    }
  }

  if (command && !reduceMotion) type(lines[0][0]);

  const sections = [...document.querySelectorAll('.code-section')];
  const navLinks = [...document.querySelectorAll('.activity-bar a[href^="#"], .explorer a[href^="#"], .back-home[href^="#"], .tab[href^="#"]')];
  const scrollRoot = document.querySelector('.editor-scroll');
  const breadcrumbFile = document.querySelector('.crumb-path b');
  const progressBar = document.getElementById('editor-progress-bar');
  const desktop = document.querySelector('.desktop');

  if (desktop && !reduceMotion) {
    desktop.addEventListener('pointermove', event => {
      const rect = desktop.getBoundingClientRect();
      desktop.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      desktop.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });
  }

  scrollRoot?.addEventListener('scroll', () => {
    const max = scrollRoot.scrollHeight - scrollRoot.clientHeight;
    const progress = max > 0 ? scrollRoot.scrollTop / max : 0;
    if (progressBar) progressBar.style.transform = `scaleY(${progress})`;
  }, { passive: true });

  document.querySelectorAll('.project-card').forEach(card => card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--card-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--card-y', `${event.clientY - rect.top}px`);
  }));

  function setActiveSection(id) {
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    const section = document.getElementById(id);
    if (breadcrumbFile && section?.dataset.file) breadcrumbFile.textContent = section.dataset.file;
  }

  function openSection(id, behavior = 'smooth') {
    const section = document.getElementById(id);
    if (!section || !scrollRoot) return;
    scrollRoot.scrollTo({ top: section.offsetTop, behavior });
    window.scrollTo(0, 0);
    if (window.location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
    setActiveSection(id);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openSection(link.getAttribute('href').slice(1));
    });
  });

  window.addEventListener('popstate', () => openSection(window.location.hash.slice(1) || 'home', 'auto'));

  const initialSection = window.location.hash.slice(1);
  if (initialSection) window.requestAnimationFrame(() => openSection(initialSection, 'auto'));

  if ('IntersectionObserver' in window && scrollRoot) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      setActiveSection(visible.target.id);
    }, { root: scrollRoot, threshold: [0.2, 0.55] });
    sections.forEach(section => observer.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { root: scrollRoot, threshold: 0.08 });
    document.querySelectorAll('.project-card, .timeline article, .skill-grid > div, .education-card, .github-snapshot').forEach(item => {
      item.classList.add('reveal-item');
      revealObserver.observe(item);
    });
  }
})();
