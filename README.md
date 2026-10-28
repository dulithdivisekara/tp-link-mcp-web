# 🌐 TP-Link Router MCP Server — Official Web Showcase

<p align="center">
  <img src="https://raw.githubusercontent.com/modelcontextprotocol/specification/main/assets/mcp.svg" width="80" alt="MCP Logo" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/TP-Link_logo_2016.svg" width="130" alt="TP-Link Logo" />
</p>

<p align="center">
  <strong>The official documentation and interactive schema catalog for the TP-Link 4G/5G Router Model Context Protocol (MCP) Server.</strong>
</p>

<p align="center">
  <a href="https://tp-link-mcp.dulith.me"><img src="https://img.shields.io/badge/Live_Showcase-tp--link--mcp.dulith.me-00A499?style=for-the-badge&logo=cloudflare" alt="Live Demo" /></a>
  <a href="https://github.com/dulithdivisekara/tplink-mcp"><img src="https://img.shields.io/badge/MCP_Server-Repository-8B5CF6?style=for-the-badge&logo=github" alt="MCP Repo" /></a>
  <a href="https://tp-link-cli.dulith.me"><img src="https://img.shields.io/badge/Companion_CLI-tp--link--cli.dulith.me-10B981?style=for-the-badge&logo=gnometerminal" alt="CLI Showcase" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</p>

---

## ⚡ Overview

This repository hosts the official web frontend for the **Universal TP-Link Router MCP Server**. Built with a script-driven, schema-first architecture, it provides an interactive tool explorer, live search, and 1-click configuration generators for AI agent frameworks (Claude Desktop, Google Antigravity, Cursor, and Docker).

- **Live URL**: [https://tp-link-mcp.dulith.me](https://tp-link-mcp.dulith.me)
- **Fallback URL**: [https://tp-link-mcp.pages.dev](https://tp-link-mcp.pages.dev)
- **Author**: [Dulith Divisekara](https://dulith.me) (IT Undergraduate @ SLIIT Malabe, Sri Lanka)
- **Origin**: Designed to empower autonomous AI agents to optimize carrier-grade 4G/LTE/5G router connections (tested on Hutch Sri Lanka 20Mbps Unlimited plan).

---

## 🛠️ Script-Driven Architecture

Unlike static HTML sites, this project separates content and schema data into structured JSON files:

```text
tp-link-mcp-web/
├── data/
│   ├── metadata.json       # Version, author, stats, and links
│   └── tools.json          # Complete 18-tool registry with parameters & prompts
├── js/
│   └── app.js              # Client-side search, filtering, and schema modal engine
├── scripts/
│   └── build.py            # Static generator: validates schemas and pre-renders HTML
├── index.html              # High-performance, Mintlify-styled web template
├── .github/workflows/      # Automated Cloudflare Pages deployment CI
└── README.md
```

### Adding or Updating Tools
To introduce new tools, update `data/tools.json` and run the build script:
```bash
python3 scripts/build.py
```
Or use the central upstream orchestrator in [`tplink-router-builder`](https://github.com/dulithdivisekara/tplink-router-builder) to automatically re-extract tool signatures from Python docstrings!

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dulithdivisekara/tp-link-mcp-web.git
   cd tp-link-mcp-web
   ```

2. **Validate schemas and pre-render**:
   ```bash
   python3 scripts/build.py
   ```

3. **Start local preview server**:
   ```bash
   python3 -m http.server 8080
   # Open http://localhost:8080 in your browser
   ```

---

## ☁️ Deployment

The project deploys to **Cloudflare Pages** with custom domain routing:
```bash
npx wrangler pages deploy . --project-name tp-link-mcp --branch main
```

---

## 📜 License

Released under the [MIT License](LICENSE). Free for personal, academic, and commercial use.
