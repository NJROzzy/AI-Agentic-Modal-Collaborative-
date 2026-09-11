# Neural Net From Scratch

No PyTorch. No shortcuts. Just Python, NumPy, and the raw math that makes a neural network tick — built by hand so we actually understand what's happening before we let a framework do it for us.

This is round two of our collaboration — same mission, new challenge: **can we build a brain cell before we let a library build it for us?**

## The Challenge

Everyone starts with `nn.Linear`. We're starting one level below that — writing the forward pass, the loss, and the backward pass ourselves, using nothing but arrays and derivatives. If it feels a little uncomfortable at first, that's the point — that discomfort is exactly where the real understanding lives.

## Structure

Two of us, two notebooks, one shared foundation. Same problem, tackled independently — then compared.

```
NeuralNet_FromScratch/
├── README.md
└── notebooks/
    ├── njr_neuron_from_scratch.ipynb
    └── sa_neuron_from_scratch.ipynb
```

Build independently first. Compare notes after. Different approaches to the same problem usually teach more than one "correct" solution ever could.

## What We're Building (v1)

Kept deliberately small — this isn't about being fancy, it's about being *correct* and understood line by line:

- [ ] A single neuron (or tiny single-layer network) using plain Python/NumPy
- [ ] A manual **forward pass** — weighted sum + activation function
- [ ] A manual **loss calculation** — how wrong are we, exactly?
- [ ] Manual **gradient descent** — no autograd, we do the calculus ourselves
- [ ] Train it on something small and satisfying (a line, an AND/OR gate — something where you can *watch* it learn)

## Rules of Engagement

- **No `torch`, no `nn.Module`, no autograd.** If NumPy can't do it, we haven't earned it yet.
- **Independent first, compare second.** Build your own version before peeking at the other's notebook.
- **Comment the math, not just the code.** Future us (and each other) should be able to read *why*, not just *what*.

## Status

⚡ Just getting started — two neurons about to be born from nothing but math and stubbornness.
