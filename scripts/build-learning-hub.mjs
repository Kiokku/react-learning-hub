import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const repo = 'https://github.com/Kiokku/react-learning-hub';
const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

// Repository links keep the published guide independent of local Markdown files.
function inline(value) {
  return value.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g).map((part) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const url = /^(https?:|#)/.test(link[2]) ? link[2]
        : `${repo}/blob/main/${link[2].replace(/^\.\//, '').split('/').map(encodeURIComponent).join('/')}`;
      return `<a href="${escapeHtml(url)}">${escapeHtml(link[1])}</a>`;
    }
    if (part.startsWith('`')) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
    if (part.startsWith('**')) return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
    return escapeHtml(part);
  }).join('');
}

// The guide sources use headings, paragraphs, lists and fenced prompts.
function prose(markdown) {
  const lines = markdown.split('\n');
  const output = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim() || /^# /.test(line)) { index += 1; continue; }
    if (line.startsWith('```')) {
      const code = [];
      while (++index < lines.length && !lines[index].startsWith('```')) code.push(lines[index]);
      output.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{2,3}) (.+)$/);
    if (heading) {
      const level = heading[1].length + 1;
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }
    if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d/.test(line);
      const pattern = ordered ? /^\d+\. / : /^- /;
      const items = [];
      while (index < lines.length && pattern.test(lines[index])) {
        let item = lines[index++].replace(pattern, '');
        while (index < lines.length && /^ {2}\S/.test(lines[index])) item += ` ${lines[index++].trim()}`;
        items.push(`<li>${inline(item)}</li>`);
      }
      const tag = ordered ? 'ol' : 'ul';
      output.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }
    const paragraph = [line];
    while (++index < lines.length && lines[index].trim() && !/^(#|```|- |\d+\. )/.test(lines[index])) paragraph.push(lines[index]);
    output.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return output.join('\n');
}

const stages = read('roadmap.md').split(/^## 阶段 /m).slice(1).map((block) => {
  const heading = block.match(/^(\d+)：(.+)/);
  return {
    number: Number(heading[1]), title: heading[2],
    lessons: block.split(/^### /m).slice(1).map((body) => {
      const lesson = body.match(/^(S\d{2}-L\d{2}) · (.+)/);
      return { id: lesson[1], title: lesson[2], fields: [...body.matchAll(/^- ([^：]+)：(.+)$/gm)].map((field) => [field[1], field[2]]) };
    }),
  };
});
const lessons = stages.flatMap((stage) => stage.lessons);
const ids = new Set(lessons.map((lesson) => lesson.id));
if (stages.length !== 16 || lessons.length !== 49 || ids.size !== 49) throw new Error('Expected 16 stages and 49 unique mechanism IDs.');
for (const stage of stages) {
  if (!stage.lessons.length) throw new Error(`Empty stage: ${stage.number}`);
  for (const lesson of stage.lessons) {
    for (const field of ['核心问题', '关键机制', '前置依赖', '建议实验', '延伸材料']) {
      if (!lesson.fields.some(([key]) => key === field)) throw new Error(`Missing ${field}: ${lesson.id}`);
    }
    if (!lesson.fields.some(([key]) => key === '课程' || key === '来源')) throw new Error(`Missing source: ${lesson.id}`);
    const dependencies = lesson.fields.find(([key]) => key === '前置依赖')[1].match(/S\d{2}-L\d{2}/g) ?? [];
    for (const dependency of dependencies) {
      if (!ids.has(dependency)) throw new Error(`Unknown prerequisite: ${dependency}`);
    }
  }
}
const stageMarkup = stages.map((stage) => `
  <details class="stage" id="S${String(stage.number).padStart(2, '0')}" ${stage.number === 1 ? 'open' : ''}>
    <summary><span class="stage-index">${String(stage.number).padStart(2, '0')}</span><span>${escapeHtml(stage.title)}</span><span class="stage-count">${stage.lessons.length} 个主题</span><span class="arrow" aria-hidden="true">⌄</span></summary>
    <div class="stage-body">${stage.lessons.map((lesson) => `
      <article class="lesson" id="${lesson.id}">
        <h3><a href="#${lesson.id}">${lesson.id}</a> ${escapeHtml(lesson.title)}</h3>
        <dl>${lesson.fields.map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${key === '前置依赖'
          ? escapeHtml(value).replace(/S\d{2}-L\d{2}/g, (id) => `<a href="#${id}">${id}</a>`)
          : inline(value)}</dd></div>`).join('')}</dl>
      </article>`).join('')}
    </div>
  </details>`).join('');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark light">
  <meta name="description" content="在 CourseX 中理解 React 源码与设计思想的路线图和说明书。设计问题、课程映射、独立验证与画布沉淀。">
  <title>React Learning Hub · 路线图与学习说明</title>
  <script>
    (() => {
      let theme;
      try { theme = localStorage.getItem('react-learning-hub-theme'); } catch {}
      document.documentElement.dataset.theme = theme === 'light' || theme === 'dark'
        ? theme : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    })();
  </script>
  <style>
    :root { --bg:#050c11; --surface:#0a1319; --text:#f1f4f5; --muted:#9aa8af; --line:#263640; --cyan:#35e6f4; --sans:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; --mono:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace; color-scheme:dark; }
    :root[data-theme="light"] { --bg:#f5f8f9; --surface:#edf2f4; --text:#10191e; --muted:#55656d; --line:#c7d3d8; --cyan:#007d88; color-scheme:light; }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; scroll-padding-top:100px; }
    body { margin:0; background:var(--bg); color:var(--text); font:16px/1.8 var(--sans); -webkit-font-smoothing:antialiased; }
    a { color:var(--cyan); text-decoration:none; overflow-wrap:anywhere; }
    a:hover { text-decoration:underline; }
    a:focus-visible, button:focus-visible, summary:focus-visible { outline:2px solid var(--cyan); outline-offset:4px; }
    .shell { width:min(calc(100% - 40px),1180px); margin:0 auto; }
    header { position:sticky; top:0; z-index:10; border-bottom:1px solid var(--line); background:var(--bg); }
    .nav { min-height:64px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
    .brand { font:700 15px/1.4 var(--mono); color:var(--text); white-space:nowrap; }
    .brand span { color:var(--cyan); }
    nav { display:flex; gap:26px; align-items:center; }
    nav a { color:var(--muted); font-size:14px; }
    button { border:1px solid var(--line); color:var(--text); background:var(--surface); font:inherit; cursor:pointer; padding:6px 12px; }
    button:hover { border-color:var(--cyan); }
    section { padding:70px 0; border-bottom:1px solid var(--line); }
    .hero { padding:80px 0 60px; }
    h1 { max-width:1120px; margin:0; font-size:clamp(42px,6.6vw,80px); line-height:1.2; letter-spacing:-.05em; }
    .hero-copy { max-width:760px; color:var(--muted); font-size:18px; margin:26px 0; }
    .actions { display:flex; gap:14px; flex-wrap:wrap; margin-top:30px; }
    .action { display:inline-block; border:1px solid var(--cyan); padding:10px 18px; }
    .action:hover { background:var(--surface); text-decoration:none; }
    .secondary { border-color:var(--line); color:var(--text); }
    h2 { font-size:clamp(28px,4vw,42px); line-height:1.3; margin:0 0 18px; letter-spacing:-.03em; }
    .intro { max-width:820px; color:var(--muted); margin-bottom:30px; }
    .boundary { border-left:2px solid var(--cyan); padding-left:22px; max-width:850px; color:var(--muted); }
    .stage { border:1px solid var(--line); border-bottom:0; }
    .stage:last-child { border-bottom:1px solid var(--line); }
    summary { display:grid; grid-template-columns:42px 1fr auto 20px; gap:16px; align-items:center; padding:18px 20px; cursor:pointer; list-style:none; }
    summary::-webkit-details-marker { display:none; }
    summary:hover, .stage[open] summary { background:var(--surface); }
    .stage-index, .stage-count { color:var(--muted); font:12px/1.5 var(--mono); }
    .arrow { text-align:center; }
    .stage[open] .arrow { transform:rotate(180deg); }
    .stage-body { border-top:1px solid var(--line); padding:0 24px; }
    .lesson { padding:26px 0; scroll-margin-top:100px; }
    .lesson + .lesson { border-top:1px solid var(--line); }
    .lesson:target { border-left:2px solid var(--cyan); padding-left:18px; }
    .lesson h3 { margin:0 0 18px; font-size:19px; line-height:1.6; }
    .lesson h3 a { font:600 13px/1.6 var(--mono); margin-right:10px; }
    dl { margin:0; }
    dl > div { display:grid; grid-template-columns:90px 1fr; gap:18px; margin-top:10px; }
    dt { color:var(--muted); font-size:13px; }
    dd { margin:0; min-width:0; }
    .prose { max-width:850px; }
    .prose h3 { margin:36px 0 12px; font-size:24px; }
    .prose h4 { margin:28px 0 10px; font-size:18px; }
    .prose p, .prose li { color:var(--muted); }
    .prose strong { color:var(--text); }
    .prose ul, .prose ol { padding-left:24px; }
    .prose li { margin:8px 0; }
    code { font:.9em/1.8 var(--mono); color:var(--cyan); }
    pre { padding:22px; border:1px solid var(--line); background:var(--surface); white-space:pre-wrap; overflow-wrap:anywhere; }
    pre code { color:var(--text); }
    footer { padding:30px 0 48px; color:var(--muted); font-size:13px; }
    .skip { position:absolute; left:16px; top:-100px; background:var(--bg); padding:8px; }
    .skip:focus { top:8px; z-index:20; }
    @media(max-width:820px) {
      .shell { width:calc(100% - 28px); }
      .nav { flex-wrap:wrap; gap:10px; padding:14px 0; }
      nav { gap:18px; flex-wrap:wrap; }
      nav a { font-size:13px; }
      section { padding:44px 0; }
      .hero { padding:48px 0 40px; }
      summary { grid-template-columns:28px 1fr 18px; padding:16px 12px; gap:10px; }
      .stage-count { display:none; }
      .stage-body { padding:0 14px; }
      dl > div { grid-template-columns:1fr; gap:2px; margin-top:16px; }
      .lesson:target { padding-left:10px; }
      pre { padding:16px; }
      html { scroll-padding-top:145px; }
      .lesson { scroll-margin-top:145px; }
    }
    @media(prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } }
    @media print { :root, :root[data-theme] { --bg:#fff; --surface:#fff; --text:#111; --muted:#444; --line:#bbb; --cyan:#005963; } header,.actions { display:none; } section { padding:24px 0; } details > * { display:block!important; } }
  </style>
</head>
<body>
  <a class="skip" href="#roadmap">跳至学习路线</a>
  <header><div class="shell nav">
    <a class="brand" href="#overview"><span>REACT</span> / LEARNING HUB</a>
    <nav aria-label="主导航"><a href="#roadmap">学习路线</a><a href="#workflow">学习方法</a><a href="#resources">资料来源</a><button type="button" data-theme-toggle>切换主题</button></nav>
  </div></header>
  <main>
    <section class="hero" id="overview"><div class="shell">
      <h1>从源码与实验中，<br>理解 React 为什么这样设计。</h1>
      <p class="hero-copy">在 CourseX 中探索问题、验证解释、留下知识。这里提供路线和方法；经过打磨的理解，将逐步成为 React, Explained. 的教学素材。</p>
      <p>React 18 实现主线 · React 19/19.2 差异补充</p>
      <div class="actions"><a class="action" href="#S01-L01">从 JSX 问题开始</a><a class="action secondary" href="#workflow">阅读四步学习方法</a></div>
    </div></section>
    <section id="roadmap"><div class="shell">
      <h2>围绕设计问题的学习路线</h2>
      <p class="intro">16 个阶段、49 个机制主题，保留知识依赖与课程映射。可以沿路线学习，也可以回访疑问；每个主题不要求另外填写记录。</p>
      <p class="boundary">在你部署的 CourseX 中按课程章节名进入画板。稳定章节链接尚待核查；主画布绑定、对话卡片和结构化导出属于规划能力，以实际版本为准。当前可用已有画板手动沉淀。</p>
      <p class="intro">阶段 0 用于准备环境，阶段 15 用于整合与解释。S14-L06、S15-L03 保留原 ID，面试用途改为可选。React 19/19.2 侧重 Demo 与版本比较，范围不扩展到 RSC 基础设施、SSR 实现或 React Compiler。</p>
      <div>${stageMarkup}</div>
    </div></section>
    <section id="workflow"><div class="shell"><h2>提出问题 → 探索 → 验证 → 沉淀</h2><div class="prose">${prose(read('workflow.md'))}</div></div></section>
    <section id="resources"><div class="shell"><h2>课程、源码与证据来源</h2><div class="prose">${prose(read('RESOURCES.md'))}</div></div></section>
  </main>
  <footer><div class="shell">由路线、学习方法和资源文件生成 · <a href="${repo}">项目说明</a> · <a href="${repo}/tree/main/archive">历史归档</a><br>学习内容留在 CourseX；本页不跟踪个人进度，浏览器仅保存主题偏好。</div></footer>
  <script>
    const toggle = document.querySelector('[data-theme-toggle]');
    const setTheme = (theme) => {
      document.documentElement.dataset.theme = theme;
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.textContent = theme === 'dark' ? '切换浅色' : '切换深色';
    };
    setTheme(document.documentElement.dataset.theme);
    toggle.addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(theme);
      try { localStorage.setItem('react-learning-hub-theme', theme); } catch {}
    });
    const revealHash = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (!target) return;
      const stage = target.closest('details');
      if (stage) stage.open = true;
      target.scrollIntoView({ block: 'start' });
    };
    window.addEventListener('hashchange', revealHash);
    document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      const stage = target?.closest('details');
      if (stage) stage.open = true;
      if (link.hash === location.hash) revealHash();
    }));
    if (location.hash) revealHash();
  </script>
</body>
</html>`;

if (process.argv.includes('--check')) {
  if (read('learning-hub.html') !== html) throw new Error('learning-hub.html is stale. Run node scripts/build-learning-hub.mjs.');
  console.log('learning-hub.html matches the guide sources.');
} else {
  writeFileSync(join(root, 'learning-hub.html'), html);
  console.log(`Generated guide with ${stages.length} stages and ${lessons.length} mechanisms.`);
}
