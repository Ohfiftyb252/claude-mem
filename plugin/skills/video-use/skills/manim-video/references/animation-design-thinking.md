# Animation Design Thinking

How to decide WHAT to animate and HOW to structure it — before writing any code.

## Should I animate this?

**Animate when:**
- A sequence unfolds over time (algorithm steps, derivation, pipeline stages)
- Spatial relationships change (transformation, deformation, rotation)
- Something is built from parts (construction, assembly, accumulation)
- You're comparing states (before/after, method A vs method B)
- Temporal evolution is the point (training curves, wave propagation, gradient descent)

**Show static when:**
- The concept is a single labeled diagram
- Motion would distract from spatial layout
- The viewer needs to study it carefully (dense table, reference chart)

**Rule of thumb:** If you'd explain it with "first X, then Y, then Z" — animate it. If you'd explain it by pointing at parts of one picture — show it static.

## Decomposing a concept into animation

### Step 1: Write the narration first

Before any code, write what the narrator would say. This determines:
- **Order** — what concept comes first
- **Duration** — how long each idea gets
- **Visuals** — what the viewer must SEE when they HEAR each sentence

### Step 2: Identify visual beats

```
"Consider a function f of x."         → [BEAT: axes + curve appear]
"At this point..."                     → [BEAT: dot appears on curve]
"...the slope is positive."            → [BEAT: tangent line drawn]
"So the gradient tells us to go left." → [BEAT: arrow points left, dot moves]
```

### Step 3: Choose the right tool per beat

| Visual need | Manim approach |
|-------------|----------------|
| Object appears for first time | `Create`, `Write`, `FadeIn`, `GrowFromCenter` |
| Object transforms into another | `Transform`, `ReplacementTransform`, `FadeTransform` |
| Attention drawn to existing object | `Indicate`, `Circumscribe`, `Flash`, `ShowPassingFlash` |
| Continuous relationship maintained | `add_updater`, `always_redraw`, `ValueTracker` |
| Object leaves the scene | `FadeOut`, `Uncreate`, `ShrinkToCenter` |

## Pacing: the universal mistake is too fast

| Content type | Minimum on-screen time |
|-------------|----------------------|
| New equation appearing | 2.0s animation + 2.0s pause |
| New concept label | 1.0s animation + 1.0s pause |
| Key insight ("aha moment") | 2.5s animation + 3.0s pause |
| Supporting annotation | 0.8s animation + 0.5s pause |
| Scene transition (FadeOut all) | 0.5s animation + 0.3s pause |

**No wait = the viewer is always behind you.** They're still reading the equation when you've already started transforming it.

## Narration synchronization

### The "see then hear" principle

The visual should appear slightly BEFORE the narration describes it. When the viewer sees a circle appear and THEN hears "consider a circle," the visual primes their brain for the concept.

## Common design mistakes

1. **Animating everything at once.** The viewer can track 1-2 simultaneous animations.
2. **No visual hierarchy.** Everything at the same opacity/size/color means nothing stands out.
3. **Equations without context.** An equation appearing alone means nothing. Show the geometric interpretation first.
4. **Skipping the "why."** Showing HOW without WHY.
5. **Identical pacing throughout.** Vary it.
6. **Forgetting the audience.** Decide who's watching in the planning phase.
