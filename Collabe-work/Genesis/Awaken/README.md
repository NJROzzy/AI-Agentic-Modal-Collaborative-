# Awaken

Genesis gave us a neuron built from nothing but math. Awaken is the next step — taking that foundation and building something that can actually **reason, decide, and act.**

This is our first agent, built from scratch: not the model weights, but the loop, the tools, and the decisions that turn a language model into something that *does* things instead of just answering questions.

## The Idea

An LLM alone just talks. An **agent** thinks in steps: it decides what to do, does it, looks at what happened, and decides what to do next — looping until the task is actually finished. That loop, and the tools plugged into it, are what we're building by hand this week.

## Scope (One Week Sprint)

Kept tight on purpose — a working, demo-able agent by the end of the week, not an open-ended research project.

- [ ] Core reasoning loop: **think → act → observe → repeat**
- [ ] 2–3 tools the agent can actually call
- [ ] Basic memory across steps within a task
- [ ] Error handling for failed tool calls / bad decisions
- [ ] One polished end-to-end demo scenario

## Architecture (Draft)

```
Awaken/
├── README.md
├── agent/
│   ├── loop.py          # the think → act → observe cycle
│   ├── tools/            # individual tool implementations
│   └── memory.py         # tracks state across steps
├── notebooks/
│   └── experiments.ipynb
└── demo/
    └── demo_scenario.py
```

*(Subject to change once Day 1 architecture planning actually happens.)*

## The Genesis Connection

Where it makes sense, Awaken pulls from what Genesis already built — e.g. one of the agent's tools may call our own hand-built neural network for a small classification step, so the agent is genuinely reasoning with code we wrote from raw math, not just external libraries.

## Roadmap

| Day | Focus |
|-----|-------|
| 1 | Scope, architecture, tool selection, env setup |
| 2 | Core reasoning loop (no tools yet) |
| 3 | First tool wired in |
| 4 | Remaining tools + memory |
| 5 | Error handling & robustness |
| 6 | Demo scenario + polish |
| 7 | Buffer + writeup |

## Status

⚡ Day 1 — scoping the architecture before writing the first line of the loop.