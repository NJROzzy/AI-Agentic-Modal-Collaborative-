# Live Link — NJR Project Log

A running log of what I'm building, learning, and contributing to. Newest entries go at the top of the **Log** section. This is a living document: update it whenever something ships, gets learned, or changes direction.

**Started:** 2026-10-09 · **Owner:** NJR · **Repo:** AI-Agentic-Modal-Collaborative (joint with SA)

---

## Tracks at a Glance

| # | Track | Goal | Status |
|---|-------|------|--------|
| 1 | **Building the AI Agentic System** | Build an agent from first principles: neuron → network → reasoning loop → tools → memory → multi-agent | 🟡 In progress (Genesis done, Awaken scoped) |
| 2 | **Evolution of AI Agents** | Understand how agents evolved, from rule-based systems to today's LLM agents, and why each step happened | ⚪ Not started |
| 3 | **Open Source Work** | Contribute to open-source AI/agent projects and publish our own work openly | ⚪ Not started |

Status key: ⚪ Not started · 🟡 In progress · 🟢 Done · 🔴 Blocked

---

## Track 1 — Building the AI Agentic System

**Goal:** Understand every layer of an agent by building it ourselves before relying on frameworks.

### Path

| Stage | Folder | What it is | Status |
|-------|--------|------------|--------|
| PyTorch Engine | `Collabe-work/PyTorch_Engine/` | PyTorch fundamentals: tensors, autograd, `nn.Module`, training loops | 🟡 Week 1 (tensors) |
| Genesis | `Collabe-work/Genesis/` | A neural net from scratch in NumPy (no torch, no autograd) | 🟢 Single neuron + XOR done |
| Awaken | `Collabe-work/Genesis/Awaken/` | First agent from scratch: think → act → observe loop, tools, memory | 🟡 Day 1, scoping |
| *Next* | — | Multi-agent systems, evaluation, deployment | ⚪ |

### Awaken milestones (one-week sprint)

- [ ] Day 1: Scope, architecture, tool selection, env setup
- [ ] Day 2: Core reasoning loop (no tools yet)
- [ ] Day 3: First tool wired in
- [ ] Day 4: Remaining tools + memory
- [ ] Day 5: Error handling & robustness
- [ ] Day 6: Demo scenario + polish
- [ ] Day 7: Buffer + writeup

### Artifacts so far

- `Collabe-work/Genesis/njr_neuron_from_scratch.ipynb`: single neuron, manual forward/backward pass
- `Collabe-work/Genesis/njr_xor_single_neuron.ipynb`: XOR on a single neuron (shows why one neuron can't solve it)
- `workspace/NJRProjects/xor-live-demo.html`: interactive live demo of the XOR experiment
- `workspace/NJRProjects/main.HTML`: "The Wild World of AI, ML & DL" explainer page

---

## Track 2 — Understanding the Evolution of AI Agents

**Goal:** Learn the history well enough to explain *why* modern agents look the way they do, and connect each era to something we build in Track 1.

### Study roadmap

- [ ] **Symbolic & rule-based agents** (1950s–80s): logic, search, planning (STRIPS), expert systems
- [ ] **Intelligent-agent framing** (1990s): perceive → decide → act, BDI agents, multi-agent systems
- [ ] **Learning agents**: reinforcement learning, from TD-learning to deep RL (DQN, AlphaGo)
- [ ] **Neural networks to Transformers**: perceptron → backprop → deep learning → attention
- [ ] **LLMs as reasoners**: prompting, chain-of-thought
- [ ] **LLM agents**: ReAct, tool use / function calling, retrieval (RAG), memory
- [ ] **Agent frameworks & protocols**: orchestration frameworks, Model Context Protocol (MCP), computer use
- [ ] **Multi-agent & autonomous systems**: planner/worker patterns, evaluation, safety

### Notes

*(Add a short note per era: key idea, key paper or system, and what it changed.)*

---

## Track 3 — Open Source Projects

**Goal:** Learn by reading and contributing to real codebases, and give back.

### Plan

- [ ] Pick 2–3 target projects (agent frameworks, PyTorch ecosystem, MCP servers, etc.)
- [ ] Read contributing guides; set up each project locally
- [ ] Start with docs fixes / `good first issue` labels
- [ ] Land a first merged PR
- [ ] Publish our own work (Genesis, Awaken) as clean, documented open source

### Contributions

| Date | Project | Type | Link | Status |
|------|---------|------|------|--------|
| — | — | — | — | — |

---

## Log

*Newest first. Format: date · track · what happened.*

### 2026-10-09
- **All tracks:** Created this Live Link log to track the three focus areas.

### 2026-09-14
- **Track 1:** Wrote the Awaken README, the first from-scratch agent sprint (reasoning loop, tools, memory).

### 2026-09-12
- **Track 1:** XOR on a single neuron notebook; built an interactive HTML live demo of it.

### 2026-09-11
- **Track 1:** Neuron-from-scratch notebook (manual forward pass, loss, gradient descent).

### 2026-09-10
- **Track 1:** Kicked off Genesis, a neural net from scratch with SA.

### 2026-09-08
- **Track 1:** Built the "Wild World of AI, ML & DL" HTML page.

### 2026-09-07
- **Track 1:** Started PyTorch Engine week 1 (tensor foundations); set up venv + requirements.

### 2026-09-05 → 09-06
- **Setup:** Created the collaborative repo with SA; set up personal workspaces and `Collabe-work/`.

---

## Entry Template

```markdown
### YYYY-MM-DD
- **Track N:** What I did / learned / shipped.
  - Link: path or URL
  - Next: what's coming up
```
