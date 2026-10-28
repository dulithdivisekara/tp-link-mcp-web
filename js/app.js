/**
 * TP-Link MCP Showcase Application Engine
 * Script-driven UI for real-time tool filtering, schema inspection, theme switching, and agent config export.
 * Author: Dulith Divisekara (SLIIT Malabe)
 */

let allTools = [];
let currentCategory = 'all';

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load tools data dynamically
async function initApp() {
  try {
    const res = await fetch('data/tools.json');
    if (res.ok) {
      allTools = await res.json();
    }
  } catch (err) {
    console.warn('Local data fetch failed, using pre-rendered fallback:', err);
  }
}

// Category filter
function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.dataset.cat === cat) {
      btn.className = 'cat-pill shrink-0 px-3 py-1 rounded-full text-xs font-mono font-medium bg-tplink-teal/20 text-tplink-teal dark:text-tplink-cyan border border-tplink-teal/40';
    } else {
      btn.className = 'cat-pill shrink-0 px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-black/5 dark:border-white/5';
    }
  });
  filterTools();
}

// Filter tools based on query & category
function filterTools() {
  const query = (document.getElementById('tool-search')?.value || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.tool-card');

  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const cat = card.dataset.cat || '';
    const text = card.textContent.toLowerCase();

    const matchesQuery = !query || name.includes(query) || text.includes(query);
    const matchesCat = currentCategory === 'all' || cat === currentCategory;

    card.style.display = (matchesQuery && matchesCat) ? 'block' : 'none';
  });
}

// Tool Schema Modal
function openToolModal(toolName) {
  const tool = allTools.find(t => t.name === toolName);
  if (!tool) return;

  const modal = document.getElementById('tool-modal');
  const title = document.getElementById('modal-title');
  const badge = document.getElementById('modal-category');
  const desc = document.getElementById('modal-desc');
  const paramsList = document.getElementById('modal-params');
  const promptBox = document.getElementById('modal-prompt');

  title.textContent = tool.name;
  badge.textContent = tool.category;
  desc.textContent = tool.description;
  promptBox.textContent = `"${tool.example_prompt}"`;

  paramsList.innerHTML = '';
  if (!tool.parameters || tool.parameters.length === 0) {
    paramsList.innerHTML = '<div class="text-xs text-slate-500 dark:text-slate-400 italic">No parameters required (zero-argument tool).</div>';
  } else {
    tool.parameters.forEach(p => {
      const pDiv = document.createElement('div');
      pDiv.className = 'p-3 rounded-lg bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 text-xs';
      pDiv.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <span class="font-mono text-tplink-teal dark:text-tplink-cyan font-bold">${p.name}</span>
            <span class="px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-400">${p.type}</span>
          </div>
          <span class="text-[10px] font-mono ${p.required ? 'text-amber-500' : 'text-slate-500'}">${p.required ? 'Required' : 'Optional'}</span>
        </div>
        <p class="text-slate-700 dark:text-slate-300 text-[11px]">${p.description}</p>
      `;
      paramsList.appendChild(pDiv);
    });
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeToolModal() {
  const modal = document.getElementById('tool-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Claude / Antigravity / Docker config tabs
const clientConfigs = {
  claude: `{
  "mcpServers": {
    "tplink-router": {
      "command": "npx",
      "args": ["-y", "@dulith/tplink-mcp"],
      "env": {
        "TPLINK_ROUTER_IP": "192.168.1.1",
        "TPLINK_PASSWORD": "your_router_password"
      }
    }
  }
}`,
  antigravity: `{
  "mcpServers": {
    "tplink": {
      "command": "python3",
      "args": ["-m", "tplink_mcp.server"],
      "env": {
        "TPLINK_ROUTER_IP": "192.168.1.1",
        "TPLINK_PASSWORD": "your_router_password"
      }
    }
  }
}`,
  docker: `docker run -d \\
  --name tplink-mcp \\
  --restart unless-stopped \\
  -e TPLINK_ROUTER_IP="192.168.1.1" \\
  -e TPLINK_PASSWORD="your_router_password" \\
  ghcr.io/dulithdivisekara/tplink-mcp:latest`
};

function setConfigTab(client) {
  document.getElementById('config-snippet').textContent = clientConfigs[client];
  document.querySelectorAll('.cfg-tab').forEach(b => {
    b.className = 'cfg-tab shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';
  });
  const active = document.getElementById('tab-' + client);
  if (active) {
    active.className = 'cfg-tab shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-tplink-teal/20 text-tplink-teal dark:text-tplink-cyan border border-tplink-teal/40';
  }
}

function copyConfigSnippet() {
  const text = document.getElementById('config-snippet').textContent;
  navigator.clipboard.writeText(text);
  alert('Configuration copied to clipboard!');
}

function copyHeroCmd() {
  const text = document.getElementById('hero-cmd').textContent;
  navigator.clipboard.writeText(text);
  const btn = document.getElementById('hero-copy-btn');
  btn.innerHTML = `<svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span class="text-emerald-500">Copied!</span>`;
  setTimeout(() => {
    btn.innerHTML = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>`;
  }, 2000);
}

// Close modal on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeToolModal();
});

// Init on DOM ready
initTheme();
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
