# PyTorch Engine

A joint workspace for building foundational understanding of **PyTorch** — the first shared project under our agentic AI/ML collaboration. This is where NJR and SA work through core PyTorch concepts together before applying them to more advanced agentic and ML systems.

## Purpose

Before diving into complex agentic pipelines or applied ML systems, this folder is dedicated to strengthening the fundamentals of PyTorch — tensors, autograd, neural network building blocks, training loops, and the underlying mechanics that power modern ML models. The goal is to build a solid shared foundation that both contributors can build on for future collaborative work.

## Scope

- Core PyTorch fundamentals (tensors, operations, autograd)
- Neural network basics (`nn.Module`, layers, activations)
- Loss functions and optimizers
- Training loops and model evaluation basics
- Small hands-on exercises and notebooks to reinforce concepts

## Structure
PyTorch_Engine/
├── README.md
├── requirements.txt
├── .venv/ (local only, not committed)
└── notebooks/
└── week1_tensors_foundations.ipynb


Notebooks are organized by week (`week1_...`, `week2_...`) to track progress and pace through the foundations together.

## Environment Setup

This project uses its own isolated virtual environment, scoped to this folder only.

```bash
cd PyTorch_Engine
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Dependencies are tracked in `requirements.txt` and should be updated (`pip freeze > requirements.txt`) whenever new packages are installed, so both contributors stay in sync.

**Hardware note:** Developed primarily on an M1 MacBook Pro using PyTorch's `mps` backend for GPU acceleration. NVIDIA/CUDA-specific work (e.g. Jetson) will be handled separately once relevant.

## Approach

- **Foundations first** — no jumping ahead to advanced architectures until the basics are solid
- **Hands-on learning** — concepts are explored through code, not just theory
- **Shared progress** — since this is joint work, contributions here should stay understandable and buildable-on by both NJR and SA

## Status

🚧 Week 1 in progress — working through tensor fundamentals before moving to autograd, `nn.Module`, and training loops.