import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function section(markdown, heading) {
  const match = markdown.match(new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |$)`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function bullets(markdown) {
  return markdown.split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function parseStages(markdown) {
  const headings = [...markdown.matchAll(/^## 阶段 (\d+)：(.+)$/gm)];
  return headings.map((match, index) => {
    const start = match.index + match[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    const body = markdown.slice(start, end);
    const lessons = [...body.matchAll(/^- \*\*(S\d{2}-L\d{2})\*\* (.+?)（(课程|来源)：(.+?)）$/gm)]
      .map((lesson) => ({ id: lesson[1], title: lesson[2], sourceType: lesson[3], source: lesson[4] }));
    return {
      number: Number(match[1]),
      id: `S${String(match[1]).padStart(2, '0')}`,
      title: match[2].trim(),
      lessons,
    };
  });
}

function tableRows(markdown) {
  return markdown.split('\n')
    .filter((line) => /^\|.+\|$/.test(line.trim()))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length && !cells.every((cell) => /^-+$/.test(cell)));
}

function parseStageProgress(markdown) {
  return new Map(tableRows(markdown)
    .filter((cells) => /^\d+\s/.test(cells[0] ?? ''))
    .map((cells) => [Number(cells[0].match(/^\d+/)[0]), {
      status: cells[1] || '未开始',
      startedAt: cells[2] || '',
      completedAt: cells[3] || '',
      mastery: cells[4] || '',
      note: cells[5] || '',
    }]));
}

function parseLessonProgress(markdown) {
  return new Map(tableRows(markdown)
    .filter((cells) => /^S\d{2}-L\d{2}$/.test(cells[0] ?? ''))
    .map((cells) => [cells[0], {
      status: cells[1] || '未开始',
      notebook: cells[2] || '',
      notes: cells[3] || '',
      evidence: cells[4] || '',
      updatedAt: cells[5] || '',
    }]));
}

function parseLinks(markdown) {
  return [...markdown.matchAll(/^- \[([^\]]+)\]\(([^)]+)\)\n\s{2}(.+)$/gm)]
    .map((match) => ({ label: match[1], href: match[2], description: match[3] }));
}

function parseGlossary(markdown) {
  return [...markdown.matchAll(/^\*\*(.+?)\*\*:\n([^\n]+)\n_Avoid_: ([^\n]+)$/gm)]
    .map((match) => ({ term: match[1], definition: match[2], avoid: match[3] }));
}

function parseInterviewSections(markdown) {
  const sections = [...markdown.matchAll(/^## (.+)$/gm)];
  return sections.map((sectionMatch, sectionIndex) => {
    const start = sectionMatch.index + sectionMatch[0].length;
    const end = sections[sectionIndex + 1]?.index ?? markdown.length;
    const body = markdown.slice(start, end).trim();
    const questionHeadings = [...body.matchAll(/^### (.+)$/gm)];
    const questions = questionHeadings.length
      ? questionHeadings.map((questionMatch, questionIndex) => {
        const answerStart = questionMatch.index + questionMatch[0].length;
        const answerEnd = questionHeadings[questionIndex + 1]?.index ?? body.length;
        return {
          question: questionMatch[1].trim(),
          answer: body.slice(answerStart, answerEnd).trim(),
        };
      })
      : bullets(body).map((question) => ({ question, answer: '' }));
    return { title: sectionMatch[1].trim(), questions };
  });
}

function renderInlineMarkdown(value) {
  return escapeHtml(value).replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderQuizAnswer(markdown) {
  if (!markdown) return '<p class="quiz-answer-empty">本题答案尚未记录。</p>';
  const lines = markdown.split('\n');
  const output = [];
  for (let index = 0; index < lines.length;) {
    if (!lines[index].trim()) {
      index += 1;
      continue;
    }
    if (lines[index].startsWith('- ')) {
      const items = [];
      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(`<li>${renderInlineMarkdown(lines[index].slice(2))}</li>`);
        index += 1;
      }
      output.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    output.push(`<p>${renderInlineMarkdown(lines[index])}</p>`);
    index += 1;
  }
  return output.join('');
}

function listFiles(directory, extensions) {
  const absolute = join(root, directory);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(absolute, entry.name);
      if (entry.isDirectory()) return [];
      if (!extensions.some((extension) => entry.name.endsWith(extension))) return [];
      return [{
        name: entry.name,
        href: relative(root, path),
        updatedAt: statSync(path).mtime,
      }];
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

function linkValue(value, fallbackLabel) {
  if (!value) return '<span class="empty">—</span>';
  const markdownLink = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  const href = markdownLink?.[2] ?? value;
  const label = markdownLink?.[1] ?? fallbackLabel ?? basename(value);
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

const missionMarkdown = read('MISSION.md');
const roadmapMarkdown = read('roadmap.md');
const stageProgress = parseStageProgress(read('progress-tracker.md'));
const lessonProgress = parseLessonProgress(read('lesson-progress.md'));
const stages = parseStages(roadmapMarkdown).map((stage) => ({
  ...stage,
  progress: stageProgress.get(stage.number) ?? { status: '未开始' },
  lessons: stage.lessons.map((lesson) => ({
    ...lesson,
    progress: lessonProgress.get(lesson.id) ?? { status: '未开始' },
  })),
}));

const stageStatuses = new Set(['未开始', '理解中', '实现中', '待验收', '已掌握']);
const lessonStatuses = new Set(['未开始', '理解中', '实现中', '已完成']);
const roadmapLessonIds = new Set(stages.flatMap((stage) => stage.lessons.map((lesson) => lesson.id)));
const progressLessonIds = new Set(lessonProgress.keys());
const learningRecords = listFiles('learning-records', ['.md']);

if (stages.length !== 16) throw new Error(`Expected 16 stages, found ${stages.length}`);
for (const stage of stages) {
  if (!stageStatuses.has(stage.progress.status)) throw new Error(`Invalid stage status: ${stage.id} ${stage.progress.status}`);
  if (!stage.lessons.length) throw new Error(`Stage has no planned Lessons: ${stage.id}`);
  if (stage.progress.status === '已掌握' && !learningRecords.some((record) => record.name.startsWith(`${stage.id}-`))) {
    throw new Error(`Missing Learning Record for mastered stage: ${stage.id}`);
  }
  for (const lesson of stage.lessons) {
    if (!progressLessonIds.has(lesson.id)) throw new Error(`Missing lesson-progress row: ${lesson.id}`);
    if (!lessonStatuses.has(lesson.progress.status)) throw new Error(`Invalid Lesson status: ${lesson.id} ${lesson.progress.status}`);
  }
}
for (const lessonId of progressLessonIds) {
  if (!roadmapLessonIds.has(lessonId)) throw new Error(`Unknown lesson-progress row: ${lessonId}`);
}

const mission = {
  why: section(missionMarkdown, 'Why').replaceAll('\n', ' '),
  success: bullets(section(missionMarkdown, 'Success looks like')),
  constraints: bullets(section(missionMarkdown, 'Constraints')),
};
const resources = parseLinks(read('RESOURCES.md'));
const mainCourse = resources.find((item) => /^课程[：:]/.test(item.label));
const glossary = parseGlossary(read('CONTEXT.md'));
const interviewMarkdown = read('interview-question-bank.md');
const interviewSections = parseInterviewSections(interviewMarkdown);
const quizData = interviewSections.map((section) => ({
  title: section.title,
  questions: section.questions.map((item) => ({
    question: item.question,
    answerHtml: renderQuizAnswer(item.answer),
  })),
}));
const quizDataJson = JSON.stringify(quizData).replaceAll('<', '\\u003c');
const totalQuestions = interviewSections.reduce((sum, item) => sum + item.questions.length, 0);
const artifacts = {
  lessons: listFiles('lessons', ['.html']),
  notes: listFiles('notes', ['.md']),
  records: learningRecords,
  references: listFiles('reference', ['.html']),
};
const implementationRepoPath = resolve(root, '..', 'mini-react18');
const implementationRepoExists = existsSync(implementationRepoPath);
const masteredStages = stages.filter((stage) => stage.progress.status === '已掌握').length;
const completedLessons = stages.flatMap((stage) => stage.lessons).filter((lesson) => lesson.progress.status === '已完成').length;
const totalLessons = stages.flatMap((stage) => stage.lessons).length;
const currentStage = stages.find((stage) => stage.progress.status !== '已掌握') ?? stages.at(-1);
const currentLesson = currentStage.lessons.find((lesson) => lesson.progress.status !== '已完成') ?? currentStage.lessons.at(-1);
const stagePercent = Math.round((masteredStages / stages.length) * 100);

const statusClass = (status) => `status status-${status}`;
const artifactRows = [
  ['可选教学材料', artifacts.lessons, 'lessons/'],
  ['Notes', artifacts.notes, 'notes/'],
  ['Learning Records', artifacts.records, 'learning-records/'],
  ['Reference', artifacts.references, 'reference/'],
];

const stageMarkup = stages.map((stage) => `
  <details class="stage" data-status="${escapeHtml(stage.progress.status)}" ${stage.number === currentStage.number ? 'open' : ''}>
    <summary>
      <span class="stage-index">${String(stage.number).padStart(2, '0')}</span>
      <span class="stage-title">${escapeHtml(stage.title)}</span>
      <span class="${statusClass(stage.progress.status)}"><i></i>${escapeHtml(stage.progress.status)}</span>
      <span class="stage-count">${stage.lessons.filter((lesson) => lesson.progress.status === '已完成').length}/${stage.lessons.length}</span>
      <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 7.5 5 5 5-5"/></svg>
    </summary>
    <div class="lesson-table" role="table" aria-label="${escapeHtml(stage.title)} Lessons">
      <div class="lesson-head" role="row">
        <span>Lesson / 主题</span><span>状态</span><span>课程 / 来源</span><span>掌握证据</span>
      </div>
${stage.lessons.map((lesson) => `
        <div class="lesson-row ${lesson.id === currentLesson.id ? 'is-current' : ''}" role="row">
          <div>
            <strong>${escapeHtml(lesson.id)}</strong>
            <span>${escapeHtml(lesson.title)}</span>
          </div>
          <span class="${statusClass(lesson.progress.status)}"><i></i>${escapeHtml(lesson.progress.status)}</span>
          ${lesson.sourceType === '课程' && mainCourse
            ? `<a class="source-link" href="${escapeHtml(mainCourse.href)}">${escapeHtml(lesson.source)}</a>`
            : `<span>${escapeHtml(lesson.source)}</span>`}
          <div class="evidence-links">
            ${linkValue(lesson.progress.notes, 'Notes')}
            ${linkValue(lesson.progress.evidence, '实现')}
          </div>
        </div>`).join('')}
    </div>
  </details>`).join('');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark light">
  <title>React Learning Hub</title>
  <script>
    (() => {
      let savedTheme = null;
      try { savedTheme = localStorage.getItem('react-learning-hub-theme'); } catch {}
      const theme = savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    })();
  </script>
  <style>
    :root {
      --bg: #050c11;
      --surface: #0a1319;
      --surface-strong: #0e1a21;
      --text: #f1f4f5;
      --muted: #8f9ca3;
      --faint: #52616a;
      --line: #263640;
      --line-strong: #3a4d57;
      --cyan: #35e6f4;
      --lime: #8cd85a;
      --blue: #4eb6ff;
      --amber: #ffbd45;
      --orange: #ff824c;
      --header-bg: rgba(5, 12, 17, .94);
      --sans: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      --mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      --max: 1180px;
    }
    :root[data-theme="light"] {
      --bg: #f5f8f9;
      --surface: #edf2f4;
      --surface-strong: #e2e9ec;
      --text: #10191e;
      --muted: #55656d;
      --faint: #84939a;
      --line: #c7d3d8;
      --line-strong: #91a3ab;
      --cyan: #007d88;
      --lime: #43871f;
      --blue: #086da8;
      --amber: #9a6200;
      --orange: #b54b1c;
      --header-bg: rgba(245, 248, 249, .94);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: var(--sans);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
    a:focus-visible, button:focus-visible, summary:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
    .shell { width: min(calc(100% - 40px), var(--max)); margin: 0 auto; }
    .site-header {
      position: sticky; top: 0; z-index: 20;
      border-bottom: 1px solid var(--line);
      background: var(--header-bg);
      backdrop-filter: blur(14px);
    }
    .nav { min-height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
    .brand { font: 700 15px/1 var(--mono); letter-spacing: .06em; white-space: nowrap; }
    .brand span { color: var(--cyan); }
    .nav-actions { min-width: 0; display: flex; align-items: center; gap: 26px; }
    .nav-links { display: flex; align-items: stretch; gap: 30px; min-height: 64px; }
    .nav-links a { display: grid; place-items: center; color: var(--muted); font-size: 14px; border-bottom: 2px solid transparent; }
    .nav-links a:hover, .nav-links a.active { color: var(--text); border-color: var(--cyan); }
    .repo-link, .theme-toggle {
      width: 38px; height: 38px; padding: 0; flex: 0 0 auto;
      display: grid; place-items: center;
      color: var(--text); background: transparent;
      border: 1px solid var(--line-strong); border-radius: 2px;
      cursor: pointer;
    }
    .repo-link:hover, .theme-toggle:hover { color: var(--cyan); border-color: var(--cyan); background: var(--surface); }
    .repo-link svg { width: 18px; height: 18px; fill: currentColor; }
    .theme-toggle svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
    .theme-toggle .icon-sun { display: none; }
    :root[data-theme="light"] .theme-toggle .icon-sun { display: block; }
    :root[data-theme="light"] .theme-toggle .icon-moon { display: none; }
    main > section { scroll-margin-top: 84px; }
    .hero { padding: 92px 0 68px; border-bottom: 1px solid var(--line); }
    h1 { margin: 0; max-width: 880px; font-size: clamp(48px, 7.2vw, 92px); line-height: .98; letter-spacing: -.055em; font-weight: 760; }
    .hero-copy { margin: 28px 0 0; color: var(--muted); font: 17px/1.6 var(--mono); }
    .hero-grid { margin-top: 72px; display: grid; grid-template-columns: 1fr 1.15fr; gap: 64px; align-items: end; }
    .label { margin: 0 0 8px; color: var(--muted); font: 12px/1.4 var(--mono); text-transform: uppercase; letter-spacing: .12em; }
    .current-title { margin: 0 0 22px; color: var(--cyan); font: 600 clamp(24px, 3vw, 34px)/1.25 var(--mono); }
    .next-action { display: inline-flex; align-items: center; gap: 12px; border: 1px solid var(--cyan); padding: 12px 17px; color: var(--cyan); font: 600 14px/1 var(--mono); }
    .next-action:hover { background: var(--cyan); color: var(--bg); }
    .progress-panel { padding-left: 42px; border-left: 1px solid var(--line-strong); }
    .progress-number { font: 600 17px/1.3 var(--mono); }
    .progress-number strong { color: var(--cyan); font-size: 24px; }
    .progress-track { height: 8px; margin: 26px 0 18px; background: var(--surface-strong); overflow: hidden; }
    .progress-track span { display: block; height: 100%; width: ${stagePercent}%; background: var(--cyan); }
    .legend { display: flex; flex-wrap: wrap; gap: 10px 22px; color: var(--muted); font: 12px/1.4 var(--mono); }
    .legend span, .status { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
    .legend i, .status i { width: 8px; height: 8px; border-radius: 50%; background: var(--faint); flex: 0 0 auto; }
    .status-理解中 i { background: var(--blue); }
    .status-实现中 i { background: var(--amber); }
    .status-待验收 i { background: var(--orange); }
    .status-已掌握 i, .status-已完成 i { background: var(--lime); }
    .section { padding: 78px 0; border-bottom: 1px solid var(--line); }
    .section-heading { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 30px; }
    h2 { margin: 0; font-size: clamp(30px, 4vw, 46px); line-height: 1.08; letter-spacing: -.035em; }
    .section-note { margin: 0; max-width: 520px; color: var(--muted); font-size: 14px; }
    .filters { display: flex; flex-wrap: wrap; gap: 0; margin-bottom: 18px; }
    .filter { appearance: none; border: 1px solid var(--line); border-right: 0; background: transparent; color: var(--muted); padding: 10px 15px; font: 12px/1 var(--mono); cursor: pointer; }
    .filter:last-child { border-right: 1px solid var(--line); }
    .filter:hover, .filter.active { color: var(--cyan); border-color: var(--cyan); }
    .filter.active + .filter { border-left-color: var(--cyan); }
    .stage { border: 1px solid var(--line); border-bottom: 0; }
    .stage:last-child { border-bottom: 1px solid var(--line); }
    .stage[hidden] { display: none; }
    .stage summary { min-height: 62px; display: grid; grid-template-columns: 54px minmax(0, 1fr) 110px 52px 18px; gap: 18px; align-items: center; padding: 0 18px; cursor: pointer; list-style: none; }
    .stage summary::-webkit-details-marker { display: none; }
    .stage summary:hover { background: var(--surface); }
    .stage[open] { border-left-color: var(--cyan); }
    .stage[open] summary { background: var(--surface); border-bottom: 1px solid var(--line); }
    .stage-index { color: var(--muted); font: 14px/1 var(--mono); }
    .stage-title { font-weight: 600; }
    .stage-count { color: var(--muted); font: 12px/1 var(--mono); text-align: right; }
    summary svg { width: 18px; stroke: var(--muted); fill: none; stroke-width: 1.6; transition: transform .2s ease; }
    details[open] summary svg { transform: rotate(180deg); }
    .status { color: var(--muted); font: 12px/1 var(--mono); }
    .lesson-table { padding: 0 18px 18px; background: var(--surface); }
    .lesson-head, .lesson-row { display: grid; grid-template-columns: minmax(260px, 1.5fr) 105px minmax(180px, .8fr) minmax(120px, .6fr); gap: 18px; align-items: center; }
    .lesson-head { min-height: 48px; color: var(--muted); border-bottom: 1px solid var(--line); font: 11px/1.3 var(--mono); text-transform: uppercase; letter-spacing: .08em; }
    .lesson-row { min-height: 72px; border-bottom: 1px solid var(--line); }
    .lesson-row:last-child { border-bottom: 0; }
    .lesson-row.is-current { margin: 0 -10px; padding: 0 10px; border: 1px solid var(--cyan); }
    .lesson-row > div:first-child { display: grid; gap: 4px; }
    .lesson-row strong { color: var(--cyan); font: 600 12px/1 var(--mono); }
    .lesson-row > div:first-child span { font-size: 14px; }
    .source-link { color: var(--muted); font: 12px/1.5 var(--mono); }
    .source-link:hover, .evidence-links a:hover { color: var(--cyan); }
    .evidence-links { display: flex; gap: 12px; font: 12px/1.5 var(--mono); }
    .empty { color: var(--faint); }
    .metric-strip { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--line); margin-bottom: 28px; }
    .metric { padding: 24px; border-right: 1px solid var(--line); }
    .metric:last-child { border-right: 0; }
    .metric strong { display: block; color: var(--cyan); font: 600 32px/1 var(--mono); }
    .metric span { color: var(--muted); font-size: 13px; }
    .evidence-table { border-top: 1px solid var(--line); }
    .evidence-row { min-height: 58px; display: grid; grid-template-columns: 1fr 110px 150px; gap: 20px; align-items: center; border-bottom: 1px solid var(--line); }
    .evidence-row > * { min-width: 0; }
    .evidence-row span { color: var(--muted); font: 12px/1.4 var(--mono); }
    .evidence-row span:last-child { overflow-wrap: anywhere; }
    .repo-state { color: ${implementationRepoExists ? 'var(--lime)' : 'var(--muted)'} !important; }
    .interview-grid { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--line); }
    .interview-item { display: flex; width: 100%; justify-content: space-between; gap: 20px; padding: 17px 0; border: 0; border-bottom: 1px solid var(--line); background: transparent; color: var(--text); font: inherit; text-align: left; cursor: pointer; }
    .interview-item:nth-child(odd) { padding-right: 28px; border-right: 1px solid var(--line); }
    .interview-item:nth-child(even) { padding-left: 28px; }
    .interview-item span { color: var(--muted); font: 12px/1.5 var(--mono); }
    .interview-item:hover strong, .interview-item:focus-visible strong { color: var(--cyan); }
    .interview-item:focus-visible { outline: 2px solid var(--cyan); outline-offset: -2px; }
    .interview-item:target { background: color-mix(in srgb, var(--cyan) 8%, transparent); }
    .quiz-dialog { width: min(calc(100% - 32px), 720px); max-height: min(820px, calc(100vh - 32px)); padding: 0; border: 1px solid var(--line-strong); background: var(--surface); color: var(--text); box-shadow: 0 24px 80px #0009; }
    .quiz-dialog::backdrop { background: #02070bcc; backdrop-filter: blur(3px); }
    .quiz-header { display: flex; align-items: start; justify-content: space-between; gap: 20px; padding: 24px 28px; border-bottom: 1px solid var(--line); }
    .quiz-header p { margin: 0 0 5px; color: var(--cyan); font: 11px/1.4 var(--mono); letter-spacing: .12em; text-transform: uppercase; }
    .quiz-header h2 { margin: 0; font-size: 20px; }
    .quiz-close { flex: 0 0 auto; width: 36px; height: 36px; border: 1px solid var(--line); background: transparent; color: var(--muted); font-size: 24px; line-height: 1; cursor: pointer; }
    .quiz-close:hover, .quiz-close:focus-visible { border-color: var(--cyan); color: var(--cyan); }
    .quiz-body { padding: 30px 28px 18px; }
    .quiz-progress { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 22px; color: var(--muted); font: 11px/1.5 var(--mono); }
    .quiz-question { min-height: 72px; margin: 0; font-size: clamp(22px, 4vw, 30px); line-height: 1.35; }
    .quiz-answer { margin-top: 24px; padding: 20px; border-left: 3px solid var(--cyan); background: var(--surface-strong); color: var(--muted); }
    .quiz-answer[hidden] { display: none; }
    .quiz-answer p { margin: 0 0 12px; }
    .quiz-answer p:last-child { margin-bottom: 0; }
    .quiz-answer ul { margin: 0; padding-left: 20px; }
    .quiz-answer li + li { margin-top: 7px; }
    .quiz-answer code { color: var(--text); font: .9em/1.5 var(--mono); }
    .quiz-answer-empty { color: var(--faint); }
    .quiz-actions { display: flex; align-items: center; gap: 10px; padding: 18px 28px 28px; }
    .quiz-action { min-height: 40px; padding: 0 16px; border: 1px solid var(--line); background: transparent; color: var(--text); font: 12px/1 var(--mono); cursor: pointer; }
    .quiz-action:hover:not(:disabled), .quiz-action:focus-visible { border-color: var(--cyan); color: var(--cyan); }
    .quiz-action:disabled { color: var(--faint); cursor: not-allowed; }
    .quiz-answer-toggle { margin-right: auto; border-color: var(--cyan); color: var(--cyan); }
    .resource-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
    h3 { margin: 0 0 18px; font-size: 20px; }
    .plain-list { border-top: 1px solid var(--line); }
    .plain-row { display: grid; grid-template-columns: minmax(140px, .7fr) 1.3fr; gap: 24px; padding: 18px 0; border-bottom: 1px solid var(--line); }
    .plain-row strong, .plain-row a { color: var(--cyan); font: 600 12px/1.5 var(--mono); }
    .plain-row p { margin: 0; color: var(--muted); font-size: 13px; }
    .plain-row small { display: block; margin-top: 7px; color: var(--faint); }
    footer { padding: 30px 0 48px; color: var(--faint); font: 11px/1.6 var(--mono); }
    @media (max-width: 820px) {
      .shell { width: min(calc(100% - 28px), var(--max)); }
      .nav { min-height: 56px; }
      .nav-links { display: none; }
      .nav-actions { gap: 0; }
      .repo-link, .theme-toggle { width: 36px; height: 36px; }
      .hero { padding: 66px 0 48px; }
      .hero-grid { margin-top: 48px; grid-template-columns: 1fr; gap: 34px; }
      .progress-panel { padding: 28px 0 0; border-left: 0; border-top: 1px solid var(--line-strong); }
      .section { padding: 58px 0; }
      .section-heading { align-items: start; flex-direction: column; }
      .stage summary { grid-template-columns: 40px minmax(0, 1fr) 18px; gap: 10px; padding: 0 12px; }
      .stage summary .status, .stage-count { display: none; }
      .lesson-head { display: none; }
      .lesson-row { grid-template-columns: 1fr auto; padding: 16px 0; gap: 12px; }
      .lesson-row .source-link, .lesson-row .evidence-links { grid-column: 1 / -1; }
      .lesson-row.is-current { padding: 15px 10px; }
      .metric-strip { grid-template-columns: repeat(2, 1fr); }
      .metric:nth-child(2) { border-right: 0; }
      .metric:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
      .evidence-row { grid-template-columns: 1fr auto; }
      .evidence-row span:last-child { grid-column: 1 / -1; }
      .interview-grid, .resource-grid { grid-template-columns: 1fr; gap: 50px; }
      .interview-item:nth-child(n) { padding-left: 0; padding-right: 0; border-right: 0; }
      .quiz-header { padding: 20px; }
      .quiz-body { padding: 24px 20px 14px; }
      .quiz-actions { padding: 14px 20px 20px; flex-wrap: wrap; }
      .quiz-answer-toggle { width: 100%; margin-right: 0; }
      .quiz-action:not(.quiz-answer-toggle) { flex: 1; }
      .plain-row { grid-template-columns: 1fr; gap: 8px; }
    }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } summary svg { transition: none; } }
    @media print {
      :root, :root[data-theme] { --bg: #fff; --surface: #fff; --surface-strong: #eee; --text: #111; --muted: #555; --faint: #777; --line: #bbb; --line-strong: #777; --cyan: #007b8a; }
      .site-header, .filters, .next-action, .repo-link, .theme-toggle { display: none; }
      .hero, .section { padding: 28px 0; }
      details { break-inside: avoid; }
      details > * { display: block !important; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="shell nav">
      <a class="brand" href="#overview"><span>REACT</span> / LEARNING HUB</a>
      <div class="nav-actions">
        <nav class="nav-links" aria-label="主导航">
          <a class="active" href="#overview">总览</a>
          <a href="#roadmap">学习路线</a>
          <a href="#evidence">学习成果</a>
          <a href="#interview">面试题</a>
          <a href="#resources">术语与资源</a>
        </nav>
        <a class="repo-link" href="https://github.com/Kiokku/react-learning-hub" target="_blank" rel="noopener noreferrer" aria-label="打开 react-learning-hub GitHub 仓库" title="GitHub 仓库">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.03c-3.2.7-3.88-1.37-3.88-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.17.92-.25 1.9-.38 2.88-.39.98 0 1.96.14 2.88.39 2.2-1.48 3.16-1.17 3.16-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.77 1.06.77 2.13v3.15c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>
        </a>
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="切换主题" title="切换主题">
          <svg class="icon-sun" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>
          <svg class="icon-moon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/></svg>
        </button>
      </div>
    </div>
  </header>
  <main>
    <section class="hero" id="overview">
      <div class="shell">
        <h1>从实现中理解 React</h1>
        <p class="hero-copy">React 18 深度实现 · React 19/19.2 差异理解</p>
        <div class="hero-grid">
          <div>
            <p class="label">当前学习</p>
            <p class="current-title">阶段 ${String(currentStage.number).padStart(2, '0')} · ${escapeHtml(currentStage.title)}</p>
            <p class="label">下一步动作</p>
            <a class="next-action" href="#roadmap">→ 开始 ${escapeHtml(currentLesson.id)}</a>
          </div>
          <div class="progress-panel">
            <div class="progress-number"><strong>${masteredStages}</strong> / ${stages.length} 阶段已掌握</div>
            <div class="progress-track" aria-label="总体进度 ${stagePercent}%"><span></span></div>
            <div class="legend">
              ${['未开始', '理解中', '实现中', '待验收', '已掌握'].map((status) => `<span class="${statusClass(status)}"><i></i>${status}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="roadmap">
      <div class="shell">
        <div class="section-heading">
          <div><p class="label">Curriculum</p><h2>学习路线</h2></div>
          <p class="section-note">${escapeHtml(mission.why)}</p>
        </div>
        <div class="filters" aria-label="按阶段状态筛选">
          ${['全部', '未开始', '理解中', '实现中', '待验收', '已掌握'].map((status, index) => `<button class="filter ${index === 0 ? 'active' : ''}" type="button" data-filter="${status}">${status}</button>`).join('')}
        </div>
        <div id="stage-list">${stageMarkup}</div>
      </div>
    </section>

    <section class="section" id="evidence">
      <div class="shell">
        <div class="section-heading">
          <div><p class="label">Evidence</p><h2>掌握证据</h2></div>
          <p class="section-note">课程看完不等于掌握。实现、测试和追问记录共同构成证据。</p>
        </div>
        <div class="metric-strip">
          <div class="metric"><strong>${completedLessons}</strong><span>已完成 Lesson / ${totalLessons}</span></div>
          <div class="metric"><strong>${artifacts.lessons.length}</strong><span>可选教学材料</span></div>
          <div class="metric"><strong>${artifacts.records.length}</strong><span>Learning Records</span></div>
          <div class="metric"><strong>${totalQuestions}</strong><span>面试问题</span></div>
        </div>
        <div class="evidence-table">
          ${artifactRows.map(([label, files, path]) => `<div class="evidence-row"><strong>${label}</strong><span>${files.length} 项</span><span>${files.length ? files.slice(-1)[0].name : `${path} 暂无成果`}</span></div>`).join('')}
          <div class="evidence-row"><strong>mini-react18 实现仓库</strong><span class="repo-state">${implementationRepoExists ? '已创建' : '待创建'}</span><span>${escapeHtml(implementationRepoPath)}</span></div>
        </div>
      </div>
    </section>

    <section class="section" id="interview">
      <div class="shell">
        <div class="section-heading">
          <div><p class="label">Interview</p><h2>面试准备</h2></div>
          <p class="section-note">题库按机制持续积累；最终目标是 1 分钟回答、3 分钟回答和两轮追问都能成立。</p>
        </div>
        <div class="interview-grid">
          ${interviewSections.map((item, index) => `<button class="interview-item" id="interview-section-${index + 1}" type="button" data-quiz-section="${index}" aria-haspopup="dialog"><strong>${escapeHtml(item.title)}</strong><span>${item.questions.length} 题</span></button>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="resources">
      <div class="shell">
        <div class="section-heading">
          <div><p class="label">Reference</p><h2>术语与资源</h2></div>
          <p class="section-note">统一语言，优先使用课程、React 官方文档和官方源码。</p>
        </div>
        <div class="resource-grid">
          <div>
            <h3>项目术语</h3>
            <div class="plain-list">
              ${glossary.map((item) => `<div class="plain-row"><strong>${escapeHtml(item.term)}</strong><p>${escapeHtml(item.definition)}<small>避免：${escapeHtml(item.avoid)}</small></p></div>`).join('')}
            </div>
          </div>
          <div>
            <h3>可信资源</h3>
            <div class="plain-list">
              ${resources.map((item) => `<div class="plain-row"><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)} ↗</a><p>${escapeHtml(item.description)}</p></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <dialog class="quiz-dialog" id="quiz-dialog" aria-labelledby="quiz-title">
    <div class="quiz-header">
      <div>
        <p>Interview Quiz</p>
        <h2 id="quiz-title"></h2>
      </div>
      <button class="quiz-close" type="button" data-quiz-close aria-label="关闭 Quiz">×</button>
    </div>
    <div class="quiz-body">
      <div class="quiz-progress"><span id="quiz-counter" aria-live="polite"></span><span>先回答，再查看参考答案</span></div>
      <h3 class="quiz-question" id="quiz-question"></h3>
      <div class="quiz-answer" id="quiz-answer" hidden></div>
    </div>
    <div class="quiz-actions">
      <button class="quiz-action quiz-answer-toggle" type="button" data-quiz-answer aria-expanded="false">查看答案</button>
      <button class="quiz-action" type="button" data-quiz-previous>上一题</button>
      <button class="quiz-action" type="button" data-quiz-next>下一题</button>
    </div>
  </dialog>
  <footer>
    <div class="shell">由仓库文件生成 · ${escapeHtml(new Date().toLocaleString('zh-CN', { hour12: false }))} · 学习进度来自仓库，localStorage 仅保存主题偏好</div>
  </footer>
  <script>
    const themeKey = 'react-learning-hub-theme';
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const setTheme = (theme, persist = false) => {
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      const currentLabel = theme === 'dark' ? '深色' : '浅色';
      const nextLabel = theme === 'dark' ? '浅色' : '深色';
      themeToggle.setAttribute('aria-label', '当前为' + currentLabel + '模式，切换到' + nextLabel + '模式');
      themeToggle.setAttribute('title', '当前为' + currentLabel + '模式，切换到' + nextLabel + '模式');
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
      if (persist) {
        try { localStorage.setItem(themeKey, theme); } catch {}
      }
    };
    setTheme(document.documentElement.dataset.theme);
    themeToggle.addEventListener('click', () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
    const filters = [...document.querySelectorAll('.filter')];
    const stages = [...document.querySelectorAll('.stage')];
    filters.forEach((button) => button.addEventListener('click', () => {
      filters.forEach((item) => item.classList.toggle('active', item === button));
      const filter = button.dataset.filter;
      stages.forEach((stage) => { stage.hidden = filter !== '全部' && stage.dataset.status !== filter; });
    }));
    const quizData = ${quizDataJson};
    const quizDialog = document.querySelector('#quiz-dialog');
    const quizTitle = document.querySelector('#quiz-title');
    const quizCounter = document.querySelector('#quiz-counter');
    const quizQuestion = document.querySelector('#quiz-question');
    const quizAnswer = document.querySelector('#quiz-answer');
    const quizAnswerToggle = document.querySelector('[data-quiz-answer]');
    const quizPrevious = document.querySelector('[data-quiz-previous]');
    const quizNext = document.querySelector('[data-quiz-next]');
    let activeQuizSection = 0;
    let activeQuizQuestion = 0;
    let quizTrigger = null;
    const renderQuiz = () => {
      const section = quizData[activeQuizSection];
      const item = section.questions[activeQuizQuestion];
      quizTitle.textContent = section.title;
      quizCounter.textContent = '第 ' + (activeQuizQuestion + 1) + ' / ' + section.questions.length + ' 题';
      quizQuestion.textContent = item.question;
      quizAnswer.innerHTML = item.answerHtml;
      quizAnswer.hidden = true;
      quizAnswerToggle.textContent = '查看答案';
      quizAnswerToggle.setAttribute('aria-expanded', 'false');
      quizPrevious.disabled = activeQuizQuestion === 0;
      quizNext.textContent = activeQuizQuestion === section.questions.length - 1 ? '完成' : '下一题';
    };
    document.querySelectorAll('[data-quiz-section]').forEach((button) => {
      button.addEventListener('click', () => {
        activeQuizSection = Number(button.dataset.quizSection);
        activeQuizQuestion = 0;
        quizTrigger = button;
        renderQuiz();
        quizDialog.showModal();
      });
    });
    document.querySelector('[data-quiz-close]').addEventListener('click', () => quizDialog.close());
    quizDialog.addEventListener('click', (event) => {
      if (event.target === quizDialog) quizDialog.close();
    });
    quizDialog.addEventListener('close', () => quizTrigger?.focus());
    quizAnswerToggle.addEventListener('click', () => {
      quizAnswer.hidden = !quizAnswer.hidden;
      quizAnswerToggle.textContent = quizAnswer.hidden ? '查看答案' : '隐藏答案';
      quizAnswerToggle.setAttribute('aria-expanded', String(!quizAnswer.hidden));
    });
    quizPrevious.addEventListener('click', () => {
      if (activeQuizQuestion === 0) return;
      activeQuizQuestion -= 1;
      renderQuiz();
    });
    quizNext.addEventListener('click', () => {
      const questions = quizData[activeQuizSection].questions;
      if (activeQuizQuestion === questions.length - 1) {
        quizDialog.close();
        return;
      }
      activeQuizQuestion += 1;
      renderQuiz();
    });
    const sections = [...document.querySelectorAll('main > section[id]')];
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === '#' + visible.target.id));
      }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .25, .6] });
      sections.forEach((section) => observer.observe(section));
    }
  </script>
</body>
</html>`;

writeFileSync(join(root, 'learning-hub.html'), html);
console.log(`Generated learning-hub.html with ${stages.length} stages and ${totalLessons} Lessons.`);
