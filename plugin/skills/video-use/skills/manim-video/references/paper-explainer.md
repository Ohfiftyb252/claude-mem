# Paper Explainer Workflow

How to turn a research paper into an animated explainer video.

## Why animate a paper?

A research paper is optimized for precision and completeness. A video is optimized for understanding and retention. The translation is NOT "read the paper aloud with pictures" — it's "extract the core insight and make it feel obvious through visual storytelling."

## Who is watching?

| Audience | Prerequisites | Pacing | Depth |
|----------|--------------|--------|-------|
| General public | None | Slow, many analogies | Intuition only, skip proofs |
| Undergrad students | Basic math/CS | Medium, some formalism | Key equations, skip derivations |
| Grad students / researchers | Domain knowledge | Faster, more notation | Full equations, sketch proofs |

## The 5-minute template

| Section | Duration | Purpose |
|---------|----------|---------|
| **Hook** | 0:00-0:30 | Surprising result or provocative question |
| **Problem** | 0:30-1:30 | What was broken/missing before this paper |
| **Key insight** | 1:30-3:00 | The core idea, explained visually |
| **How it works** | 3:00-4:00 | Method/algorithm, simplified |
| **Evidence** | 4:00-4:30 | Key result that proves it works |
| **Implications** | 4:30-5:00 | Why it matters, what it enables |

### What to skip

- Related work survey → one sentence
- Implementation details → skip unless they're the contribution
- Ablation studies → show one chart at most
- Proofs → show the key step, not the full proof
- Hyperparameter tuning → skip entirely

## Pre-code workflow

### Gate 1: Narration script

Write the full narration before any code. Every sentence maps to a visual beat.

### Gate 2: Scene list

Break the narration into scenes. Each scene is one Manim class.

### Gate 3: Style constants

```python
BG = "#0D1117"
PRIMARY = "#58C4DD"
SECONDARY = "#83C167"
ACCENT = "#FFFF00"
HIGHLIGHT = "#FF6B6B"
MONO = "Menlo"

MODEL_COLOR = PRIMARY
DATA_COLOR = SECONDARY
BASELINE_COLOR = HIGHLIGHT
RESULT_COLOR = ACCENT
```

## First-principles equation explanation

### The "what would you do?" pattern

1. Pose the problem in plain language
2. Ask what the simplest solution would be
3. Show why it doesn't work (animate the failure)
4. Introduce the paper's solution as the fix
5. THEN show the equation — it now feels earned

### Equation reveal strategy

```python
# Show equation dimmed first (full destination)
eq = MathTex(r"Attention(Q,K,V) = softmax\left(\frac{QK^T}{\sqrt{d_k}}\right)V")
eq.set_opacity(0.15)
self.play(FadeIn(eq))

# Highlight Q, K, V one at a time
for part, color, label_text in [
    (r"Q", PRIMARY, "Query: what am I looking for?"),
    (r"K", SECONDARY, "Key: what do I contain?"),
    (r"V", ACCENT, "Value: what do I output?"),
]:
    eq.set_color_by_tex(part, color)
    label = Text(label_text, font_size=18, color=color, font=MONO)
```

## Building architecture diagrams

### The progressive build pattern

```python
def make_box(label, color, width=2.0, height=0.8):
    box = RoundedRectangle(corner_radius=0.1, width=width, height=height,
                           color=color, fill_opacity=0.1, stroke_width=1.5)
    text = Text(label, font_size=18, font=MONO, color=color).move_to(box)
    return Group(box, text)

encoder = make_box("Encoder", PRIMARY)
decoder = make_box("Decoder", SECONDARY).next_to(encoder, RIGHT, buff=1.5)
arrow = Arrow(encoder.get_right(), decoder.get_left(), color=DIM, stroke_width=1.5)

self.play(FadeIn(encoder))
self.wait(1)
self.play(GrowArrow(arrow))
self.play(FadeIn(decoder))
```

## Domain-specific patterns

### ML papers
- Show data flow through the model (animated pipeline)
- Training curves with `ValueTracker`
- Attention heatmaps as colored grids
- Loss landscape as 3D surface with gradient descent dot

### Physics/math papers
- Use `LinearTransformationScene` for linear algebra
- Vector fields with `ArrowVectorField` / `StreamLines`
- Wave equations with time-parameterized plots

### Systems/architecture papers
- Pipeline diagrams built progressively
- `ShowPassingFlash` for data flow along arrows

## Common mistakes

1. **Trying to cover the whole paper.** A 5-minute video can explain ONE core insight well.
2. **Reading the abstract as narration.** Rewrite in conversational language.
3. **Showing notation without meaning.** Never show a symbol without first showing what it represents visually.
4. **Skipping the motivation.** The Problem section is what makes the viewer care.
5. **Identical pacing throughout.** Vary energy across sections.
