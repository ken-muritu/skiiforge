# OpenCode - Complete Documentation

> **Source:** https://opencode.ai/docs and all linked sub-pages
> **Compiled:** 2026-07-26
> **What is OpenCode:** OpenCode is an open-source AI coding agent. It runs as a terminal-based interface (TUI), a desktop app, or an IDE extension. It uses the AI SDK and supports 75+ LLM providers plus local models.

---

## Table of Contents

1. [Prerequisites & Install](#1-prerequisites--install)
2. [Configure (Providers)](#2-configure-providers)
3. [OpenCode Zen](#3-opencode-zen)
4. [Initialize a Project](#4-initialize-a-project)
5. [Usage - TUI Basics](#5-usage--tui-basics)
6. [Agents](#6-agents)
7. [Tools](#7-tools)
8. [Permissions](#8-permissions)

---

## 1. Prerequisites & Install

### Prerequisites
- A modern terminal emulator: WezTerm, Alacritty, Ghostty, or Kitty
- API key(s) for the LLM provider(s) you want to use

### Install

**Script (recommended):** `curl -fsSL https://opencode.ai/install | bash`

**Node.js:** `npm install -g opencode-ai`, `bun install -g opencode-ai`, `pnpm install -g opencode-ai`, `yarn global add opencode-ai`

**Homebrew (macOS/Linux):** `brew install anomalyco/tap/opencode`

**Arch Linux:** `sudo pacman -S opencode`, `paru -S opencode-bin`

**Windows:** `choco install opencode`, `scoop install opencode`, `npm install -g opencode-ai`, `mise use -g github:anomalyco/opencode`

**Docker:** `docker run -it --rm ghcr.io/anomalyco/opencode`

---

## 2. Configure (Providers)

OpenCode supports 75+ LLM providers via the AI SDK and Models.dev.

### Connecting
```bash
/connect   # In the TUI - opens provider picker
```

API keys stored in `~/.local/share/opencode/auth.json`.

### Base URL Override
```json
{ "$schema": "https://opencode.ai/config.json", "provider": { "anthropic": { "options": { "baseURL": "https://api.anthropic.com/v1" } } } }
```

### Hide Models (Blacklist / Whitelist)
```json
{ "provider": { "anthropic": { "blacklist": ["claude-opus-4-20250514"] } } }
```

### Custom Provider
Use `/connect` -> Other, then configure:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Provider",
      "options": { "baseURL": "https://api.myprovider.com/v1", "apiKey": "{env:MY_API_KEY}" },
      "models": { "my-model": { "name": "My Model", "limit": { "context": 200000, "output": 65536 } } }
    }
  }
}
```

### Provider Examples
- **Amazon Bedrock:** `AWS_PROFILE=my-profile opencode`
- **Azure OpenAI:** `/connect` then `AZURE_RESOURCE_NAME=XXX opencode`
- **Anthropic:** `/connect` -> Claude Pro/Max (opens browser)

### Troubleshooting
1. `opencode auth list` to verify credentials
2. Ensure provider ID in `/connect` matches ID in config
3. Use correct AI SDK package (`@ai-sdk/openai-compatible` for `/v1/chat/completions`, `@ai-sdk/openai` for `/v1/responses`)

---

## 3. OpenCode Zen

Curated tested/verified model+provider combinations.

### Setup
1. Sign in at opencode.ai/auth, add billing, copy API key
2. TUI: `/connect` -> OpenCode Zen -> paste key
3. `/models` to see curated models

### Key Models
- **OpenAI models:** GPT 5.6 Sol, GPT 5.5, GPT 5.4, GPT 5.3 Codex, etc.
- **Claude models:** Claude Opus 5, Claude Sonnet 5, Claude Haiku 4.5, etc.
- **Google models:** Gemini 3.6 Flash, Gemini 3.1 Pro, Gemini 3 Flash
- **Other providers:** Grok 4.5, DeepSeek V4 Pro, Qwen3.7 Plus, Kimi K2.7 Code, MiniMax M3, GLM 5.2

Full model list + metadata: `https://opencode.ai/zen/v1/models`

### Pricing (per 1M tokens)
| Model | Input | Output |
|---|---|---|
| Free tier (Big Pickle, DeepSeek V4 Flash Free, MiMo-V2.5 Free, etc.) | Free | Free |
| DeepSeek V4 Flash | $0.14 | $0.28 |
| Claude Sonnet 5 | $2.00 | $10.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Opus 5 | $5.00 | $25.00 |
| GPT 5.5 | $5.00 | $30.00 |
| GPT 5.5 Pro | $30.00 | $180.00 |

Above tier prices continue up to $50/$180 for top-tier models.

Zen API: `https://opencode.ai/zen/v1/responses` (OpenAI), `/v1/messages` (Anthropic)

### Teams
- Roles: Admin (manage models, members, keys, billing) / Member (own keys only)
- Admins can set monthly spending limits
- BYO key: Use your own OpenAI/Anthropic keys while accessing Zen models. Tokens billed by provider.

---

## 4. Initialize a Project

```bash
cd /path/to/project
opencode
```

Then run `/init` in the TUI. Scans repo and creates `AGENTS.md` with:
- Build, lint, and test commands
- Command order and verification steps
- Architecture and repo structure
- Project-specific conventions and setup quirks
- References to existing instruction sources (Cursor, Copilot rules)

If `AGENTS.md` exists, `/init` improves it in place.

---

## 5. Usage - TUI Basics

### Start
```bash
opencode                  # TUI for current directory
opencode /path/to/project # TUI for specific directory
```

### File References
```text
How is auth handled in @packages/functions/src/api/index.ts?
```
Configured references also appear in `@` autocomplete. Type `@alias` to attach reference root, or `@alias/` to search inside it.

### Bash Commands
Prefix with `!`:
```text
!ls -la
!git log --oneline -5
```

### Plan then Build
1. Press `TAB` to switch to Plan mode
2. Describe the feature in detail (can drag-drop images)
3. Press `TAB` again to switch to Build mode
4. Confirm and execute

### Undo / Redo
```bash
/undo   # Revert last message + all file changes (requires Git repo)
/redo   # Restore undone changes
```

### Share
```bash
/share   # Generates opncd.ai/s/<id> link
/unshare # Removes link and data
```

---

## 6. Agents

Two types: **primary** (you interact) and **subagent** (invoked by primary or `@mention`).

### Built-in Primary Agents
| Agent | Mode | Description |
|---|---|---|
| Build | primary | Default, all tools enabled |
| Plan | primary | Restricted - edits and bash set to ask. Analysis only |
| Compaction | primary | Hidden - compacts long context |
| Title | primary | Hidden - generates session titles |
| Summary | primary | Hidden - creates session summaries |

### Built-in Subagents
| Agent | Mode | Description |
|---|---|---|
| General | subagent | Full tool access (except todo). Multi-step tasks |
| Explore | subagent | Read-only codebase search |
| Scout | subagent | Read-only external docs/dependency research |

### Switching
- Primary: Press `TAB` to cycle
- Subagent: `@general help me search for this function`
- Subagent tree navigation: `<Leader>+Down` (first child), `Right`/`Left` (cycle), `Up` (parent)

### Agent Configuration (JSON)
```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/build.txt}",
      "permission": { "edit": "allow", "bash": "allow" }
    },
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-20250514",
      "permission": { "edit": "deny", "bash": "deny" }
    }
  }
}
```

### Agent Configuration (Markdown)
Filename becomes agent name: `review.md` -> `review` agent.
```markdown
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash: deny
---
You are in code review mode. Focus on code quality, bugs, performance, and security.
```

### Agent Options
| Option | Description |
|---|---|
| `temperature` | 0.0-1.0. Lower=focused, higher=creative |
| `top_p` | Alternative randomness control |
| `steps` | Max agentic iterations before forced stop |
| `mode` | `primary`, `subagent`, or `all` |
| `model` | Override model: `provider/model-id` |
| `prompt` | Custom system prompt file path |
| `permission` | Override permissions |
| `color` | Hex or theme color for UI |
| `disable` | Set `true` to disable |
| `hidden` | Hide from `@` autocomplete (subagent) |
| Additional fields | Provider-specific model options (e.g. `reasoningEffort`) |

`permission.task` controls which subagents a primary agent can invoke via Task tool. Supports glob patterns.

---

## 7. Tools

Built-in tools the LLM can invoke:
| Tool | Description | Permission Key |
|---|---|---|
| `bash` | Execute shell commands | `bash` |
| `read` | Read file contents | `read` |
| `write` | Create/overwrite files | `edit` |
| `edit` | Exact-string file edits | `edit` |
| `apply_patch` | Apply patch/diff files | `edit` |
| `grep` | Regex content search | `grep` |
| `glob` | Find files by glob pattern | `glob` |
| `list` | List directory contents | `list` |
| `lsp` | LSP server integration (experimental) | `lsp` |
| `webfetch` | Fetch web pages | `webfetch` |
| `websearch` | Search web via Exa AI (no API key needed) | `websearch` |
| `todowrite` | Manage todo lists | `todowrite` |
| `question` | Ask the user questions during execution | `question` |
| `skill` | Load a SKILL.md file | `skill` |

All tools enabled by default. Internally `grep` and `glob` use ripgrep and respect `.gitignore`. Create `.ignore` to include normally-ignored paths.

---

## 8. Permissions

Each permission resolves to: `allow`, `ask`, or `deny`.

### Global Permission Example
```json
{
  "permission": {
    "*": "ask",
    "bash": "allow",
    "edit": "deny"
  }
}
```

Set all at once: `"permission": "allow"`

### Auto Mode
```bash
opencode --auto   # Auto-approves non-denied requests
```

### Granular Rules (Object Syntax)
```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny",
      "grep *": "allow"
    },
    "edit": {
      "*": "deny",
      "packages/web/src/content/docs/*.mdx": "allow"
    }
  }
}
```

Rules: last matching rule wins. Put `"*"` first, specific rules after.

### Home Directory Expansion
Use `~/projects/*` or `$HOME/projects/*` in patterns.

### External Directory Permission
```json
{
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    },
    "edit": {
      "~/projects/personal/**": "deny"
    }
  }
}
```
References are auto-allowed through external-directory boundary. Normal permissions still apply.

### Available Permission Keys
| Key | Tools it gates |
|---|---|
| `read` | `read` |
| `edit` | `write`, `edit`, `apply_patch` |
| `glob` | `glob` |
| `grep` | `grep` |
| `list` | `list` |
| `bash` | `bash` |
| `task` | `task` |
| `external_directory` | Any tool touching paths outside worktree |
| `todowrite` | `todowrite`, `todoread` |
| `webfetch` | `webfetch` |
| `websearch` | `websearch` |
| `lsp` | `lsp` |
| `skill` | `skill` |
| `question` | `question` |
| `doom_loop` | Recovery prompts when agent appears stuck |

### Defaults
- Most tools: `allow`
- `doom_loop` and `external_directory`: `ask`
- `.env` files read: `deny` by default

### Ask Prompt Options
- `once` - approve just this request
- `always` - approve all matching (for the session)
- `reject` - deny

---

## 9. MCP Servers

Add external tools via Model Context Protocol. Supports local and remote servers. Note: Each adds to context - be careful with token-heavy servers like GitHub MCP.

### Local MCP Server
```json
{
  "mcp": {
    "mcp_everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
      "cwd": "/optional/working/dir",
      "environment": { "MY_ENV_VAR": "value" },
      "timeout": 5000
    }
  }
}
```

Options: `type` (required), `command` (required), `cwd`, `environment`, `enabled`, `timeout`.

### Remote MCP Server
```json
{
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "enabled": true,
      "headers": { "Authorization": "Bearer {env:MY_API_KEY}" },
      "oauth": { "clientId": "...", "clientSecret": "...", "scope": "tools:read" }
    }
  }
}
```

Options: `type` (required), `url` (required), `enabled`, `headers`, `oauth`, `timeout`.

### OAuth
- Automatic OAuth for most servers (no special config needed).
- Manual: `opencode mcp auth <server-name>`
- List: `opencode mcp list` / `opencode mcp auth list`
- Logout: `opencode mcp logout <server-name>`
- Debug: `opencode mcp debug <server-name>`
- Disable OAuth: set `oauth: false` for API-key servers.
- Auth stored in `~/.local/share/opencode/mcp-auth.json`.

### Global Tool Control
```json
{ "tools": { "my-mcp*": false } }        // Disable all MCPs with prefix
```

### Per-Agent MCP Control
```json
{
  "tools": { "my-mcp*": false },
  "agent": {
    "my-agent": { "tools": { "my-mcp*": true } }
  }
}
```

### Glob Patterns
- `*` matches zero or more of any character
- `?` matches exactly one character

### Example MCP Integrations
- **Sentry**: `type: remote`, `url: https://mcp.sentry.dev/mcp` - then `opencode mcp auth sentry`
- **Context7**: `type: remote`, `url: https://mcp.context7.com/mcp` - use `use context7` in prompts
- **Grep by Vercel**: `type: remote`, `url: https://mcp.grep.app` - use `use the gh_grep tool` in prompts

---

## 10. Custom Tools

Define your own functions the LLM can call.

### Location
- Project: `.opencode/tools/`
- Global: `~/.config/opencode/tools/`

### Basic Tool Definition
```typescript
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Query the project database",
  args: {
    query: tool.schema.string().describe("SQL query to execute"),
  },
  async execute(args) {
    return `Executed query: ${args.query}`
  },
})
```

The filename becomes the tool name.

### Multiple Tools per File
```typescript
import { tool } from "@opencode-ai/plugin"
export const add = tool({ /* ... */ })
export const multiply = tool({ /* ... */ })
// Creates tools: <filename>_add, <filename>_multiply
```

### Context Object
```typescript
async execute(args, context) {
  const { agent, sessionID, messageID, directory, worktree } = context
}
```
- `context.directory` - session working directory
- `context.worktree` - git worktree root

### Write Tool in Any Language (Python example)
```python
# tools/add.py
import sys
a = int(sys.argv[1])
b = int(sys.argv[2])
print(a + b)
```
```typescript
// tools/math.ts
import { tool } from "@opencode-ai/plugin"
import path from "path"
export default tool({
  description: "Add two numbers using Python",
  args: { a: tool.schema.number(), b: tool.schema.number() },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/add.py")
    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

### Name Collisions
Custom tools override same-name built-in tools. A file called `bash.ts` replaces the built-in `bash` tool.

---

## 11. Plugins

Plugins extend OpenCode by hooking into events. Can add tools, modify behavior, integrate with external services.

### Installation
**From npm:**
```json
{ "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"] }
```

**From local files:**
- Project: `.opencode/plugins/`
- Global: `~/.config/opencode/plugins/`

Add `package.json` to config directory for dependencies; OpenCode runs `bun install` at startup.

### Load Order
1. Global config
2. Project config
3. Global plugins
4. Project plugins

### Basic Plugin Structure
```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => { /* ... */ },
    "session.created": async (input) => { /* ... */ },
    "tui.toast.show": async (input) => { /* ... */ },
  }
}
```

The plugin function receives: `project`, `directory`, `worktree`, `client`, `$` (Bun shell API).

### Available Hooks (Events)
**Command:** `command.executed`
**File:** `file.edited`, `file.watcher.updated`
**Installation:** `installation.updated`
**LSP:** `lsp.client.diagnostics`, `lsp.updated`
**Message:** `message.part.removed`, `message.part.updated`, `message.removed`, `message.updated`
**Permission:** `permission.asked`, `permission.replied`
**Server:** `server.connected`
**Session:** `session.created`, `session.compacted`, `session.deleted`, `session.diff`, `session.error`, `session.idle`, `session.status`, `session.updated`
**Todo:** `todo.updated`
**Shell:** `shell.env`
**Tool:** `tool.execute.after`, `tool.execute.before`
**TUI:** `tui.prompt.append`, `tui.command.execute`, `tui.toast.show`
**Compaction (experimental):** `experimental.session.compacting`

### Structured Logging
```typescript
await client.app.log({
  body: { service: "my-plugin", level: "info", message: "Done", extra: { foo: "bar" } }
})
```
Levels: `debug`, `info`, `warn`, `error`.

---

## 12. Commands (Custom)

Create custom slash commands for repetitive tasks.

### Markdown File
Place in `~/.config/opencode/commands/` or `.opencode/commands/`:
```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.

Focus on the failing tests and suggest fixes.
```

Filename becomes command name: `test.md` -> `/test`

### JSON Config
```json
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

### Prompt Features
- **Arguments**: `$ARGUMENTS`, `$1`, `$2`, etc. `/component Button` -> `$ARGUMENTS = "Button"`, `$1 = "Button"`
- **Shell output**: Use `` !`npm test` `` to inject command output.
- **File refs**: `@src/components/Button.tsx`
- **Options**: `template` (required), `description`, `agent`, `model`, `subtask`

### Built-in Commands
`/init`, `/undo`, `/redo`, `/share`, `/help` - defining custom command with same name overrides built-in.

---

## 13. Formatters

Formatters run automatically after the LLM writes/edits files. **Disabled by default** - enable in config.

### Built-in Formatters
| Formatter | Extensions | Requirement |
|---|---|---|
| prettier | .js, .ts, .jsx, .tsx, .html, .css, .md, .json, .yaml + more | `prettier` in package.json |
| biome | .js, .ts, .jsx, .tsx, .html, .css, .md, .json, .yaml + more | `biome.json(c)` |
| ruff | .py, .pyi | `ruff` command |
| gofmt | .go | `gofmt` command |
| cargo-fmt | .rs | `cargo fmt` |
| rustfmt | .rs | `rustfmt` command |
| dart | .dart | `dart` command |
| shfmt | .sh, .bash | `shfmt` command |
| clang-format | .c, .cpp, .h, .hpp, .ino | `.clang-format` config |
| ktlint | .kt, .kts | `ktlint` command |
| terraform | .tf, .tfvars | `terraform` command |
| nixfmt | .nix | `nixfmt` command |
| ocamlformat | .ml, .mli | `ocamlformat` + `.ocamlformat` config |
| dfmt | .d | `dfmt` command |
| gleam | .gleam | `gleam` command |
| pint | .php | `laravel/pint` in composer.json |
| rubocop | .rb, .rake, .gemspec, .ru | `rubocop` command |
| standardrb | .rb, .rake, .gemspec, .ru | `standardrb` command |
| uv | .py, .pyi | `uv` command |
| zig | .zig, .zon | `zig` command |
| ormolu | .hs | `ormolu` command |

### Enable
```json
{ "formatter": true }   // All built-in
```
If `formatter` is omitted, all formatters are disabled.

### Configure
```json
{
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": { "NODE_ENV": "development" },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "custom-formatter": {
      "command": ["deno", "fmt", "$FILE"],
      "extensions": [".md"]
    }
  }
}
```

`$FILE` is replaced with the path to the file being formatted.

### Custom Formatter Properties
- `disabled` (boolean): disable the formatter
- `command` (string[]): required for custom formatters
- `environment` (object): env vars to set
- `extensions` (string[]): file extensions to handle

When enabled, OpenCode uses `prettier` for matching files if `prettier` is in `package.json`.

---

## 14. LSP Servers

Language Server Protocol integration for diagnostic feedback. Disabled by default; enable in config.

### Built-in LSP Servers (30+)
| Server | Extensions | Requirement |
|---|---|---|
| typescript | .ts, .tsx, .js, .jsx, .mjs, .cjs | `typescript` in package.json |
| pyright | .py, .pyi | `pyright` installed |
| gopls | .go | `go` available |
| rust-analyzer | .rs | `rust-analyzer` command |
| eslint | .ts, .tsx, .js, .vue, etc. | `eslint` in package.json |
| oxlint | .ts, .tsx, .js, .vue, .astro, .svelte | `oxlint` in package.json |
| clangd | .c, .cpp, .h, .hpp | Auto-installed |
| bash | .sh, .bash, .zsh, .ksh | Auto-installs bash-language-server |
| ruby-lsp (rubocop) | .rb, .rake | `ruby` and `gem` available |
| terraform | .tf, .tfvars | Auto-installs |
| vue | .vue | Auto-installs |
| svelte | .svelte | Auto-installs |
| astro | .astro | Auto-installs |
| sourcekit-lsp | .swift, .objc, .objcpp | `swift` installed |
| tinymist | .typ, .typc | Auto-installs |
| ... 30+ more | | |

### Enable
```json
{ "lsp": true }   // All built-in
```

### Configure
```json
{
  "lsp": {
    "rust": {
      "command": ["rust-analyzer"],
      "env": { "RUST_LOG": "debug" },
      "initialization": { "preferences": { "importModuleSpecifierPreference": "relative" } }
    },
    "typescript": { "disabled": true }
  }
}
```

### Server Entry Properties
- `disabled` (boolean): disable the server
- `command` (string[]): required unless only disabling
- `extensions` (string[]): file extensions
- `env` (object): environment variables
- `initialization` (object): server-specific init options

### Custom LSP Server
```json
{
  "lsp": {
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"],
      "initialization": { }
    }
  }
}
```

### Best Practices
LSP provides diagnostics as feedback. Language servers can get out of sync, use memory, and slow workflows. In many projects, it is better to have the agent run `lint`, `typecheck`, or other CLI tools directly via bash. Document those commands in AGENTS.md. Enable LSP when your project benefits from additional language-server feedback.

---

## 15. Themes

Themes are loaded in order (later overrides earlier):
1. Built-in (embedded in binary)
2. User: `~/.config/opencode/themes/*.json`
3. Project: `.opencode/themes/*.json`
4. CWD: `./.opencode/themes/*.json`

### Built-in Themes
`system`, `tokyonight`, `everforest`, `ayu`, `catppuccin`, `catppuccin-macchiato`, `gruvbox`, `kanagawa`, `nord`, `matrix`, `one-dark`

### System Theme
The `system` theme adapts to your terminal's color scheme. It generates a custom gray scale based on your terminal background, uses standard ANSI colors (0-15), and uses `none` for text/background to maintain terminal's native appearance.

### Use a Theme
```bash
/theme   # TUI picker
```
Or in `tui.json`:
```json
{ "$schema": "https://opencode.ai/tui.json", "theme": "tokyonight" }
```

### Custom Theme (Nord example)
```json
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "nord0": "#2E3440",
    "nord4": "#D8DEE9",
    "nord8": "#88C0D0",
    "nord11": "#BF616A",
    "nord14": "#A3BE8C"
  },
  "theme": {
    "primary": { "dark": "nord8", "light": "nord10" },
    "secondary": { "dark": "nord9", "light": "nord9" },
    "accent": { "dark": "nord7", "light": "nord7" },
    "error": { "dark": "nord11", "light": "nord11" },
    "warning": { "dark": "nord12", "light": "nord12" },
    "success": { "dark": "nord14", "light": "nord14" },
    "info": { "dark": "nord8", "light": "nord10" },
    "text": { "dark": "nord4", "light": "nord4" },
    "textMuted": { "dark": "nord3", "light": "nord3" },
    "background": { "dark": "nord0", "light": "nord6" },
    "backgroundPanel": { "dark": "nord1", "light": "nord5" },
    "backgroundElement": { "dark": "nord1", "light": "nord4" },
    "border": { "dark": "nord2", "light": "nord3" },
    "borderActive": { "dark": "nord3", "light": "nord2" },
    "borderSubtle": { "dark": "nord2", "light": "nord3" },
    "diffAdded": { "dark": "nord14", "light": "nord14" },
    "diffRemoved": { "dark": "nord11", "light": "nord11" },
    "diffContext": { "dark": "nord3", "light": "nord3" },
    "diffHunkHeader": { "dark": "nord3", "light": "nord3" },
    "diffHighlightAdded": { "dark": "nord14", "light": "nord14" },
    "diffHighlightRemoved": { "dark": "nord11", "light": "nord11" },
    "diffAddedBg": { "dark": "#3B4252", "light": "#E5E9F0" },
    "diffRemovedBg": { "dark": "#3B4252", "light": "#E5E9F0" },
    "diffContextBg": { "dark": "nord1", "light": "nord5" },
    "diffLineNumber": { "dark": "nord2", "light": "nord4" },
    "diffAddedLineNumberBg": { "dark": "#3B4252", "light": "#E5E9F0" },
    "diffRemovedLineNumberBg": { "dark": "#3B4252", "light": "#E5E9F0" },
    "markdownText": { "dark": "nord4", "light": "nord0" },
    "markdownHeading": { "dark": "nord8", "light": "nord10" },
    "markdownLink": { "dark": "nord9", "light": "nord9" },
    "markdownLinkText": { "dark": "nord7", "light": "nord7" },
    "markdownCode": { "dark": "nord14", "light": "nord14" },
    "markdownBlockQuote": { "dark": "nord3", "light": "nord3" },
    "markdownEmph": { "dark": "nord12", "light": "nord12" },
    "markdownStrong": { "dark": "nord13", "light": "nord13" },
    "markdownHorizontalRule": { "dark": "nord3", "light": "nord3" },
    "markdownListItem": { "dark": "nord8", "light": "nord10" },
    "markdownListEnumeration": { "dark": "nord7", "light": "nord7" },
    "markdownImage": { "dark": "nord9", "light": "nord9" },
    "markdownImageText": { "dark": "nord7", "light": "nord7" },
    "markdownCodeBlock": { "dark": "nord4", "light": "nord0" },
    "syntaxComment": { "dark": "nord3", "light": "nord3" },
    "syntaxKeyword": { "dark": "nord9", "light": "nord9" },
    "syntaxFunction": { "dark": "nord8", "light": "nord8" },
    "syntaxVariable": { "dark": "nord7", "light": "nord7" },
    "syntaxString": { "dark": "nord14", "light": "nord14" },
    "syntaxNumber": { "dark": "nord15", "light": "nord15" },
    "syntaxType": { "dark": "nord7", "light": "nord7" },
    "syntaxOperator": { "dark": "nord9", "light": "nord9" },
    "syntaxPunctuation": { "dark": "nord4", "light": "nord0" }
  }
}
```

### Theme Color Definitions
- Hex: `"#ffffff"`
- ANSI: `3` (0-255)
- Color references: `"primary"` or custom defs
- Dark/light: `{"dark": "#000", "light": "#fff"}`
- None: `"none"` (uses terminal default)

### Terminal Requirements
Check: `echo $COLORTERM` should output `truecolor` or `24bit`. Set `COLORTERM=truecolor` in shell profile if needed.

---

## 16. Keybinds

Configured in `tui.json`:
```json
{
  "$schema": "https://opencode.ai/tui.json",
  "leader_timeout": 2000,
  "keybinds": {
    "leader": "ctrl+x",
    "app_exit": "ctrl+c,ctrl+d,<leader>q",
    "session_new": "<leader>n",
    "session_list": "<leader>l",
    "session_interrupt": "escape",
    "session_compact": "<leader>c",
    "model_list": "<leader>m",
    "agent_list": "<leader>a",
    "agent_cycle": "tab",
    "agent_cycle_reverse": "shift+tab",
    "messages_copy": "<leader>y",
    "messages_undo": "<leader>u",
    "messages_redo": "<leader>r",
    "messages_toggle_conceal": "<leader>h",
    "editor_open": "<leader>e",
    "theme_list": "<leader>t",
    "sidebar_toggle": "<leader>b",
    "command_list": "ctrl+p",
    "help_show": "none",
    "docs_open": "none"
  }
}
```

### Leader Key
Default: `ctrl+x`. Many actions require leader first (e.g. `ctrl+x` then `n` for new session). `leader_timeout` controls wait time (default: 2000ms).

### Binding Values
- String: `"ctrl+p"` or multiple comma-separated: `"ctrl+c,ctrl+d"`
- Array: `["<leader>y", "ctrl+shift+c"]`
- Object: `{ "key": "ctrl+v", "preventDefault": false }`

### Disable
```json
"session_compact": "none"
```

### Desktop Prompt Shortcuts (built-in, not configurable)
- `ctrl+a`: Move to start of line
- `ctrl+e`: Move to end of line
- `ctrl+b`/`ctrl+f`: Back/forward one character
- `alt+b`/`alt+f`: Back/forward one word
- `ctrl+d`: Delete character under cursor
- `ctrl+k`: Kill to end of line
- `ctrl+u`: Kill to start of line
- `ctrl+w`: Kill previous word
- `ctrl+t`: Transpose characters
- `ctrl+g`: Cancel popovers / abort running response

### Windows Terminal Shift+Enter
Add to `settings.json`:
```json
{ "command": { "action": "sendInput", "input": "[13;2u" }, "id": "User.sendInput.ShiftEnterCustom" }
```
Add to keybindings:
```json
{ "keys": "shift+enter", "id": "User.sendInput.ShiftEnterCustom" }
```

---

## 17. Config Reference

### File Locations & Precedence
1. **Remote**: `.well-known/opencode` (org defaults)
2. **Global**: `~/.config/opencode/opencode.json`
3. **Custom path**: `OPENCODE_CONFIG` env var
4. **Project**: `opencode.json` (project root)
5. **`.opencode` dirs**: agents, commands, plugins
6. **Inline**: `OPENCODE_CONFIG_CONTENT`
7. **Managed**: `/etc/opencode/` (Linux), `/Library/Application Support/opencode/` (macOS)
8. **macOS MDM**: highest priority, not user-overridable

Configs are merged, not replaced. Non-conflicting settings preserved; conflicting keys overridden.

### Supported Format
JSON and JSONC (JSON with Comments). Schema: `https://opencode.ai/config.json`.

### TUI Config (tui.json)
```json
{
  "$schema": "https://opencode.ai/tui.json",
  "scroll_speed": 3,
  "scroll_acceleration": { "enabled": false },
  "diff_style": "auto",
  "mouse": true,
  "attention": { "enabled": true, "notifications": true, "sound": true, "volume": 0.4 }
}
```

Legacy keys `theme`, `keybinds`, `tui` in `opencode.json` are deprecated and migrated automatically.

Use `OPENCODE_TUI_CONFIG` to load a custom TUI config path.

### Server Config
```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "myproject.local",
    "cors": ["http://localhost:5173"]
  }
}
```

### Shell Config
```json
{ "shell": "pwsh" }  // or /bin/zsh, /bin/bash, cmd.exe
```

### Tools Config
```json
{ "tools": { "write": false, "bash": false } }
```

### Model Config
```json
{
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "provider": { }
}
```

### Plugin Config
```json
{ "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"] }
```

### Instructions Config
```json
{ "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"] }
```

### Disabled/Enabled Providers
```json
{ "disabled_providers": ["openai", "gemini"] }
{ "enabled_providers": ["anthropic", "openai"] }
```
If a provider is in both, `disabled_providers` takes priority.

### Experimental
```json
{ "experimental": {} }
```

### Variables in Config
```json
{ "model": "{env:OPENCODE_MODEL}" }
{ "provider": { "openai": { "options": { "apiKey": "{file:~/.secrets/openai-key}" } } } }
```

---

## 18. Rules (AGENTS.md)

`AGENTS.md` provides custom instructions to OpenCode, similar to Cursor rules.

### Initialize
```bash
/init   # Scans repo, asks questions, creates/updates AGENTS.md
```

### Example
```markdown
# SST v3 Monorepo Project

This is an SST v3 monorepo with TypeScript. The project uses bun workspaces.

## Project Structure
- packages/ - All workspace packages
- infra/ - Infrastructure definitions
- sst.config.ts - Main SST configuration

## Code Standards
- Use TypeScript with strict mode
- Shared code in packages/core
- Functions in packages/functions

## Monorepo Conventions
- Import shared modules using workspace names: @my-app/core/example
```

### Locations & Precedence
1. Local: traverses up from CWD (`AGENTS.md`, then `CLAUDE.md`)
2. Global: `~/.config/opencode/AGENTS.md`
3. Claude Code fallback: `~/.claude/CLAUDE.md`

AGENTS.md > CLAUDE.md.

### Claude Code Compatibility
- Project rules: `CLAUDE.md` (if no AGENTS.md)
- Global rules: `~/.claude/CLAUDE.md` (if no global AGENTS.md)
- Skills: `~/.claude/skills/`
- Disable: `OPENCODE_DISABLE_CLAUDE_CODE=1` (all), `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1` (prompt only), `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1` (skills only)

### Custom Instructions (external files)
```json
{
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    "https://raw.githubusercontent.com/my-org/shared-rules/main/style.md"
  ]
}
```

Remote URLs fetched with 5-second timeout.

### Referencing External Files in AGENTS.md
While OpenCode doesn't automatically parse `@` references in AGENTS.md, you can teach it to lazy-load:
```markdown
# TypeScript Project Rules

CRITICAL: When you encounter a file reference (e.g. @rules/general.md), use your Read tool to load it on a need-to-know basis. Do NOT preemptively load all references.

For TypeScript code style: @docs/typescript-guidelines.md
For React patterns: @docs/react-patterns.md
For API design: @docs/api-standards.md
```

---

## 19. References

Add local directories and Git repos as project references.
```json
{
  "$schema": "https://opencode.ai/config.json",
  "references": {
    "docs": {
      "path": "../product-docs",
      "description": "Product behavior and documentation conventions"
    },
    "sdk": {
      "repository": "anomalyco/opencode-sdk-js",
      "branch": "main",
      "description": "JavaScript SDK implementation details"
    }
  }
}
```

| Field | Local | Git | Description |
|---|---|---|---|
| `path` | Yes | No | Local directory path |
| `repository` | No | Yes | owner/repo shorthand or full URL |
| `branch` | No | Yes | Git branch/ref |
| `description` | Yes | Yes | When to use this reference |
| `hidden` | Yes | Yes | Hide from `@` autocomplete |

String shorthand for git: `"sdk": "anomalyco/opencode-sdk-js"` (no branch/description needed).

### Use References
```
@docs/README.md
@alias/path/to/file.ts
```

Agents receive resolved paths and descriptions in system context automatically. OpenCode automatically allows reference directories through its external-directory permission boundary.

---

## 20. Share

Create public links to conversations for collaboration.

### Modes
- **Manual** (default): `/share` to generate link.
- **Auto**: `{ "share": "auto" }` - all conversations shared automatically.
- **Disabled**: `{ "share": "disabled" }` - no sharing.

### Privacy
- Shared conversations stay public until `/unshare`.
- Don't share sensitive code, credentials, or proprietary data.
- For teams: disable sharing in project `opencode.json` and check into Git.

### Enterprise
- Can be disabled entirely or restricted to SSO-authenticated users.
- Supports self-hosted share infrastructure.

---

## 21. Server / HTTP API

Run `opencode serve` for a headless HTTP server.

### CLI
```bash
opencode serve --port 4096 --hostname 0.0.0.0 --mdns --cors http://localhost:5173
```
- `--mdns` enables mDNS service discovery (default domain: `opencode.local`)
- `--cors` can be passed multiple times

### Authentication
```bash
OPENCODE_SERVER_PASSWORD=your-password opencode serve
```
Username defaults to `opencode`, override with `OPENCODE_SERVER_USERNAME`.

### Key Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/doc` | OpenAPI 3.1 spec |
| GET | `/global/health` | Health check and version |
| GET | `/event` | SSE events stream |
| GET | `/project` | List all projects |
| GET | `/path` | Current path |
| GET | `/vcs` | VCS info |
| GET | `/provider` | List all providers |
| POST | `/provider/{id}/oauth/authorize` | OAuth authorize |
| GET | `/session` | List sessions |
| POST | `/session` | Create session |
| GET | `/session/:id` | Get session |
| DELETE | `/session/:id` | Delete session |
| POST | `/session/:id/message` | Send message |
| POST | `/session/:id/prompt_async` | Async prompt |
| GET | `/session/:id/message` | List messages |
| POST | `/session/:id/revert` | Revert message |
| POST | `/session/:id/unrevert` | Restore reverted |
| POST | `/session/:id/share` | Share |
| DELETE | `/session/:id/share` | Unshare |
| POST | `/session/:id/abort` | Abort |
| GET | `/find?pattern=` | Search text in files |
| GET | `/find/file?query=` | Find files by name |
| GET | `/find/symbol?query=` | Find symbols |
| GET | `/lsp` | LSP status |
| GET | `/formatter` | Formatter status |
| GET | `/mcp` | MCP status |
| POST | `/mcp` | Add MCP dynamically |
| GET | `/agent` | List agents |
| POST | `/log` | Write log entry |
| POST | `/tui/append-prompt` | Append text to prompt |
| POST | `/tui/submit-prompt` | Submit prompt |
| GET/POST | `/config` | Get/Patch config |
| POST | `/auth/:id` | Set auth credentials |

---

## 22. SDK (JS/TS)

```bash
npm install @opencode-ai/sdk
```

### Full Client
```typescript
import { createOpencode } from "@opencode-ai/sdk"
const { client, server } = await createOpencode({ port: 4096 })
```

Options: `hostname`, `port`, `signal`, `timeout`, `config`.

### Client-Only
```typescript
import { createOpencodeClient } from "@opencode-ai/sdk"
const client = createOpencodeClient({ baseUrl: "http://localhost:4096" })
```

Options: `baseUrl`, `fetch`, `parseAs`, `responseStyle` (`data` or `fields`), `throwOnError`.

### Key SDK Methods
| Method | Description |
|---|---|
| `session.create({ body })` | Create session with optional title |
| `session.list()` | List all sessions |
| `session.get({ path })` | Get session by ID |
| `session.children({ path })` | List child sessions |
| `session.delete({ path })` | Delete session |
| `session.update({ path, body })` | Update session title |
| `session.init({ path, body })` | Analyze app, create AGENTS.md |
| `session.abort({ path })` | Abort running session |
| `session.share({ path })` | Share session |
| `session.summarize({ path, body })` | Summarize session |
| `session.revert({ path, body })` | Revert message |
| `session.prompt({ path, body })` | Send prompt message |
| `session.message({ path, body })` | Send message |
| `session.command({ path, body })` | Execute slash command |
| `session.shell({ path, body })` | Run shell command |
| `find.text({ query })` | Search for text in files |
| `find.files({ query })` | Find files by name |
| `find.symbols({ query })` | Find workspace symbols |
| `file.read({ query })` | Read a file |
| `file.status({ query? })` | Get tracked file status |
| `tui.appendPrompt({ body })` | Append text to TUI prompt |
| `tui.submitPrompt()` | Submit prompt |
| `tui.openHelp()` | Open help dialog |
| `tui.openSessions()` | Open session selector |
| `tui.openThemes()` | Open theme selector |
| `tui.openModels()` | Open model selector |
| `tui.showToast({ body })` | Show toast notification |
| `app.log({ body })` | Write log entry |
| `app.agents()` | List available agents |
| `config.get()` | Get config info |
| `config.providers()` | List providers and defaults |
| `auth.set({ path, body })` | Set auth credentials |
| `event.subscribe()` | SSE stream |
| `global.health()` | Health check |

### Structured Output
```typescript
const result = await client.session.prompt({
  path: { id: sessionId },
  body: {
    parts: [{ type: "text", text: "Research Anthropic" }],
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: { company: { type: "string" }, founded: { type: "number" } },
        required: ["company", "founded"]
      },
      retryCount: 2
    }
  }
})
console.log(result.data.info.structured_output)
```

Output format types: `text` (default) or `json_schema`. If model fails after retries, response includes `StructuredOutputError`.

---

## 23. Ecosystem

### Popular Plugins
| Plugin | Description |
|---|---|
| opencode-daytona | Isolated sandbox sessions with git sync |
| opencode-helicone-session | Helicone session headers |
| opencode-type-inject | Auto-inject TypeScript/Svelte types |
| opencode-openai-codex-auth | Use ChatGPT Plus/Pro as provider |
| opencode-gemini-auth | Use existing Gemini plan |
| opencode-pty | Background processes in PTY |
| opencode-firecrawl | Web scraping via Firecrawl |
| opencode-wakatime | Track usage with Wakatime |
| opencode-skillful | Lazy-load prompts/skills on demand |
| opencode-supermemory | Persistent memory across sessions |
| oh-my-opencode | Background agents, LSP/AST/MCP tools |
| opencode-morph-fast-apply | 10x faster editing |
| opencode-scheduler | Schedule recurring jobs (cron) |
| micode | Structured Brainstorm -> Plan -> Implement |

### Projects
| Project | Description |
|---|---|
| kimaki | Discord bot to control sessions |
| opencode.nvim | Neovim plugin |
| OpenChamber | Desktop/Web/VS Code extension |
| OpenCode-Obsidian | Obsidian plugin |
| OpenWork | Claude Cowork alternative |
| CodeNomad | Desktop, Web, Mobile and Remote Client |

Full community list: https://github.com/awesome-opencode/awesome-opencode and https://opencode.cafe/

---

## 24. CLI & Environment Variables

### CLI Commands
```
opencode                    # Start TUI
opencode [project]          # TUI for specific directory
opencode run "prompt"       # Non-interactive
opencode run --attach http://localhost:4096 "prompt"  # Attach to server
opencode serve              # Headless HTTP server
opencode web                # Web client
opencode attach <url>       # Attach TUI to remote backend

opencode agent create       # Create agent interactively
opencode agent list         # List agents

opencode auth login         # Login to a provider
opencode auth list          # List auth'd providers
opencode auth logout        # Logout

opencode mcp add            # Add MCP server
opencode mcp list           # List MCP servers
opencode mcp auth <name>   # OAuth authenticate
opencode mcp logout <name>  # Remove credentials
opencode mcp debug <name>   # Debug OAuth

opencode models             # List models
opencode models --refresh   # Refresh cache from models.dev
opencode models anthropic   # Filter by provider
opencode models --verbose   # Include metadata

opencode session list        # List sessions
opencode session delete <id> # Delete session

opencode github install      # Install GitHub Actions workflow
opencode github run          # Run GitHub agent
```

### TUI Flags
| Flag | Short | Description |
|---|---|---|
| `--continue` | `-c` | Continue last session |
| `--session` | `-s` | Session ID |
| `--fork` | | Fork session when continuing |
| `--prompt` | | Prompt to use |
| `--model` | `-m` | provider/model |
| `--agent` | | Agent to use |
| `--auto` | | Auto-approve permissions |
| `--port` | | Port |
| `--hostname` | | Hostname |
| `--mdns` | | Enable mDNS |
| `--mdns-domain` | | mDNS domain |
| `--cors` | | CORS origins |

### run Flags
| Flag | Short | Description |
|---|---|---|
| `--continue` | `-c` | Continue last session |
| `--session` | `-s` | Session ID |
| `--fork` | | Fork session |
| `--share` | | Share session |
| `--model` | `-m` | provider/model |
| `--agent` | | Agent |
| `--file` | `-f` | Attach files |
| `--format` | | `json` or default |
| `--title` | | Session title |
| `--attach` | | Attach to server |
| `--dir` | | Working directory |
| `--variant` | | Model variant |
| `--thinking` | | Show thinking blocks |
| `--auto` | | Auto-approve |

### serve Flags
| Flag | Description |
|---|---|
| `--port` | Port (default 4096) |
| `--hostname` | Hostname (default 127.0.0.1) |
| `--mdns` | Enable mDNS |
| `--mdns-domain` | Custom mDNS domain |
| `--cors` | CORS origins |

### Environment Variables
| Variable | Description |
|---|---|
| `OPENCODE_CONFIG` | Config file path |
| `OPENCODE_TUI_CONFIG` | TUI config file path |
| `OPENCODE_CONFIG_DIR` | Config directory |
| `OPENCODE_CONFIG_CONTENT` | Inline JSON config |
| `OPENCODE_MODEL` | Override model ID |
| `OPENCODE_MODELS_URL` | Custom models URL |
| `OPENCODE_AUTO_SHARE` | Auto-share sessions |
| `OPENCODE_GIT_BASH_PATH` | Git Bash path (Windows) |
| `OPENCODE_DISABLE_AUTOUPDATE` | Disable auto-update |
| `OPENCODE_DISABLE_PRUNE` | Disable old data pruning |
| `OPENCODE_DISABLE_TERMINAL_TITLE` | Disable terminal title updates |
| `OPENCODE_PERMISSION` | Inline JSON permissions |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS` | Disable default plugins |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` | Disable auto LSP downloads |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | Enable experimental models |
| `OPENCODE_DISABLE_AUTOCOMPACT` | Disable automatic compaction |
| `OPENCODE_DISABLE_CLAUDE_CODE` | Disable all Claude Code compat |
| `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` | Disable ~/.claude/CLAUDE.md |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | Disable .claude/skills |
| `OPENCODE_DISABLE_MODELS_FETCH` | Disable fetching from remote |
| `OPENCODE_DISABLE_MOUSE` | Disable mouse capture |
| `OPENCODE_FAKE_VCS` | Fake VCS for testing |
| `OPENCODE_CLIENT` | Client identifier |
| `OPENCODE_ENABLE_EXA` | Enable Exa web search |
| `OPENCODE_SERVER_PASSWORD` | Basic auth password |
| `OPENCODE_SERVER_USERNAME` | Basic auth username |
| `OPENCODE_EXPERIMENTAL` | Enable all experimental |
| `OPENCODE_EXPERIMENTAL_OXFMT` | Enable oxfmt formatter |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | Enable experimental LSP tool |
| `OPENCODE_EXPERIMENTAL_LSP_TY` | Enable TY LSP for python |
| `OPENCODE_EXPERIMENTAL_SCOUT` | Enable Scout subagent |
| `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS` | Enable background subagents |
| `OPENCODE_EXPERIMENTAL_WORKSPACES` | Enable workspace support |

---

## 25. Enterprise

- **Share control**: Disable entirely, restrict to SSO-only, or self-host on own infrastructure.
- **Managed config**: Admin-controlled config at `/etc/opencode/` (Linux) or `/Library/Application Support/opencode/` (macOS).
- **macOS MDM**: Deploy `.mobileconfig` profiles for org-wide enforcement of permissions, share settings, server hostname, etc.
- **Remote config**: `.well-known/opencode` endpoint for organizational defaults (MCP servers, etc.).
- **Teams (Zen)**: Role-based access (Admin/Member), model allowlists, monthly spending limits per member, BYO key support.

---

## Getting Started Checklist

1. Install OpenCode: `curl -fsSL https://opencode.ai/install | bash`
2. Connect a provider: `/connect`
3. Initialize your first project: `cd /your/project && opencode && /init`
4. Customize: pick a theme (`/theme`), add keybinds in `tui.json`, set permissions.
5. Try: `How does auth work in @src/auth.ts?`
6. Build: Describe a feature in Plan mode (`Tab`), then Build mode.
7. Share with your team: `/share`

---

*This documentation was compiled from live docs at https://opencode.ai/docs and all sub-docs pages. OpenCode is MIT-licensed and open source on GitHub: https://github.com/anomalyco/opencode*
