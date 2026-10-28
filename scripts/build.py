#!/usr/bin/env python3
"""Static Site Builder & Validator for TP-Link MCP Showcase.

Reads `data/metadata.json` and `data/tools.json`, validates schemas,
and builds an optimized static web package for Cloudflare Pages.

Author: Dulith Divisekara (SLIIT Malabe)
"""

import json
import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
METADATA_FILE = DATA_DIR / "metadata.json"
TOOLS_FILE = DATA_DIR / "tools.json"
HTML_FILE = ROOT_DIR / "index.html"


def validate_data():
    print(f"Validating {METADATA_FILE.name}...")
    if not METADATA_FILE.exists():
        raise FileNotFoundError(f"Missing {METADATA_FILE}")
    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        meta = json.load(f)
    assert "name" in meta, "Missing 'name' in metadata.json"
    assert "version" in meta, "Missing 'version' in metadata.json"

    print(f"Validating {TOOLS_FILE.name}...")
    if not TOOLS_FILE.exists():
        raise FileNotFoundError(f"Missing {TOOLS_FILE}")
    with open(TOOLS_FILE, "r", encoding="utf-8") as f:
        tools = json.load(f)
    assert isinstance(tools, list), "tools.json must be a JSON array"
    assert len(tools) >= 18, f"Expected at least 18 tools, found {len(tools)}"

    for t in tools:
        assert "name" in t, f"Tool missing 'name': {t}"
        assert "category" in t, f"Tool {t['name']} missing 'category'"
        assert "description" in t, f"Tool {t['name']} missing 'description'"
        assert "parameters" in t, f"Tool {t['name']} missing 'parameters'"

    print(f"Successfully validated {len(tools)} tools and metadata v{meta['version']}.")
    return meta, tools


def render_tool_html(t):
    badge_colors = {
        "Diagnostics": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "Cellular": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "SMS": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        "Wi-Fi": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "System": "bg-red-500/10 text-red-400 border-red-500/20",
        "Tuning": "bg-teal-500/10 text-teal-400 border-teal-500/20",
    }
    badge_class = badge_colors.get(t.get("category", "Diagnostics"), "bg-slate-500/10 text-slate-400 border-white/10")

    param_count = len(t.get("parameters", []))
    param_text = f"{param_count} param{'s' if param_count != 1 else ''}" if param_count > 0 else "0 params"

    return f"""        <div class="glass-card rounded-xl p-5 tool-card cursor-pointer group" data-name="{t['name']}" data-cat="{t['category']}" onclick="openToolModal('{t['name']}')">
          <div class="flex items-center justify-between mb-3">
            <code class="text-sm font-bold font-mono text-tplink-cyan group-hover:text-white transition-colors">{t['name']}</code>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono border {badge_class}">{t['category']}</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed mb-4">{t['description']}</p>
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/5 pt-3">
            <span>{param_text}</span>
            <span class="text-tplink-cyan group-hover:underline flex items-center gap-1">
              Inspect Schema
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>"""


def build():
    meta, tools = validate_data()
    print("Pre-rendering tools into index.html...")

    if not HTML_FILE.exists():
        print(f"Warning: {HTML_FILE} does not exist yet. Will create.")
        return

    content = HTML_FILE.read_text(encoding="utf-8")

    # Injected pre-rendered grid
    grid_html = "\n".join([render_tool_html(t) for t in tools])

    start_tag = '<!-- TOOLS_GRID_START -->'
    end_tag = '<!-- TOOLS_GRID_END -->'
    if start_tag in content and end_tag in content:
        parts = content.split(start_tag)
        pre = parts[0] + start_tag + "\n"
        post = "\n        " + end_tag + parts[1].split(end_tag)[1]
        new_content = pre + grid_html + post
        HTML_FILE.write_text(new_content, encoding="utf-8")
        print(f"[✓] Successfully injected {len(tools)} pre-rendered tools into {HTML_FILE.name}")
    else:
        print("Note: TOOLS_GRID markers not found in index.html; client-side JS hydration will render dynamically.")


if __name__ == "__main__":
    build()
