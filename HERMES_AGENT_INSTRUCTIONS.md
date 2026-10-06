# Hermes Agent MCP Integration Guide for OmniTube AI Studio

This document explains how to hook your **Hermes Agent** (or any Model Context Protocol compliant client) to OmniTube AI Studio to autonomously create, edit, optimize, and distribute short-form video content.

---

## 1. MCP Server Overview

OmniTube AI Studio exposes a Model Context Protocol (MCP) JSON-RPC 2.0 endpoint at:
```
POST /api/mcp
GET  /api/mcp (SSE / Status)
```

The MCP server provides standard MCP methods:
- `initialize`
- `tools/list`
- `tools/call`
- `ping`

---

## 2. Hermes Configuration

To connect Hermes to OmniTube AI Studio, add the following configuration to your Hermes Agent configuration file (e.g., `~/.hermes/config.json`, `hermes.config.json`, or your agent's MCP tool manifest):

```json
{
  "mcpServers": {
    "omnitube-studio": {
      "url": "http://localhost:3000/api/mcp",
      "transport": "http",
      "headers": {
        "Content-Type": "application/json",
        "User-Agent": "hermes-agent"
      }
    }
  }
}
```

If your Hermes agent runs as a Node.js CLI process with stdio bridge, you can use the built-in MCP CLI proxy:
```json
{
  "mcpServers": {
    "omnitube-studio": {
      "command": "node",
      "args": ["-e", "fetch('http://localhost:3000/api/mcp', {method:'POST', body: process.argv[1]})"]
    }
  }
}
```

---

## 3. Available MCP Tools for Hermes

Your Hermes Agent has direct access to the following 7 core production tools:

### `generate_short_script`
Generates a complete high-retention short-form video script with scene breakdowns, B-roll visual generation prompts, on-screen kinetic captions, SFX cues, and camera zooms.
- **Parameters**:
  - `topic` *(string, required)*: The topic or angle for the video.
  - `channelNiche` *(string, optional)*: Target channel niche (e.g., `"AI & Future Tech"`, `"SaaS & Growth"`).
  - `tone` *(string, optional)*: Pacing tone (e.g., `"High-Energy & Viral"`, `"Curiosity Gap"`, `"No-BS Breakdown"`).
  - `durationSeconds` *(number, optional)*: Desired duration in seconds (default: 58).

### `analyze_keyword_trends`
Finds the highest-ranked breakout topics, search volume velocity, and viral hook templates for a specific niche.
- **Parameters**:
  - `niche` *(string, required)*: Industry or content niche.

### `benchmark_competitors`
Reverse-engineers top industry creators (e.g., Alex Hormozi, Jenny Hoyos, MKBHD) to extract their retention curves, visual cut rhythms, and opening hook formulas.
- **Parameters**:
  - `niche` *(string, required)*: Content niche to benchmark.

### `update_voice_instructions`
Sets custom voice delivery instructions and calibrates acoustic synthesis parameters for speech generation.
- **Parameters**:
  - `customInstructions` *(string, required)*: Prompt instructions for how the AI should deliver voiceover (e.g., `"Speak with punchy viral cadence, zero awkward pauses, emphasize punch keywords"`).
  - `cadenceMultiplier` *(number, optional)*: Pacing speed multiplier (0.8 to 1.4).

### `synthesize_speech`
Synthesizes speech in the user's calibrated cloned voice for any words or script text with phonetic lip-sync metadata.
- **Parameters**:
  - `text` *(string, required)*: Text to speak.
  - `customInstructions` *(string, optional)*: Specific delivery guidance.

### `render_export_video`
Initiates a hardware video encoding job using Cloud GPU (RunPod / Modal / AWS G5) or local canvas rendering.
- **Parameters**:
  - `projectId` *(string, required)*: ID of the project to render.
  - `resolution` *(string, optional)*: `"1080x1920"` or `"720x1280"`.
  - `fps` *(number, optional)*: Target framerate (default: 30 or 60).

### `schedule_crosspost`
Schedules or immediately distributes the rendered video across YouTube Shorts, TikTok, and Instagram Reels.
- **Parameters**:
  - `projectId` *(string, required)*: ID of the video project.
  - `platforms` *(array of strings, required)*: `["youtube", "tiktok", "instagram"]`.
  - `scheduledTime` *(string, optional)*: Publish time (e.g., `"Tomorrow at 6:30 PM EST"`).

---

## 4. Hermes System Prompt Directive

When delegating tasks to Hermes, provide Hermes with this system directive:

```text
You are Hermes, an autonomous short-form video production agent hooked into OmniTube AI Studio via Model Context Protocol (MCP).
Your mission is to maximize viewer retention (>85% APV) and view velocity for the user's YouTube channels.

Rules:
1. Always craft hooks that stop thumbs in the first 1.5 seconds (pattern disruption, counter-intuitive insight, high-stakes curiosity).
2. Cut dead air every 1.5–2 seconds by structuring scenes into tight 3-8 second blocks.
3. Automatically leverage the user's uploaded digital twin photo model and calibrated voice instructions.
4. When asked to create content, invoke 'generate_short_script' and 'schedule_crosspost'.
```

---

## 5. Direct API Testing Example

You can test the MCP endpoint directly with `curl`:

```bash
# List available tools
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'

# Generate a script via Hermes MCP
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "generate_short_script",
      "arguments": {
        "topic": "The $0 Local DeepSeek Setup That Surpasses OpenAI",
        "channelNiche": "Artificial Intelligence & Future Tech",
        "tone": "High-Energy & Viral"
      }
    }
  }'
```
