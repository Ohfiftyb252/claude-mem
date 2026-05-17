# Animations Reference

## Core Concept

An animation is a Python object that computes intermediate visual states of a mobject over time. Animations are objects passed to `self.play()`, not functions.

`run_time` controls seconds (default: 1). Always specify it explicitly for important animations.

## Creation Animations

```python
self.play(Create(circle))          # traces outline
self.play(Write(equation))         # simulates handwriting (for Text/MathTex)
self.play(FadeIn(group))           # opacity 0 -> 1
self.play(GrowFromCenter(dot))     # scale 0 -> 1 from center
self.play(DrawBorderThenFill(sq))  # outline first, then fill
```

## Removal Animations

```python
self.play(FadeOut(mobject))         # opacity 1 -> 0
self.play(Uncreate(circle))        # reverse of Create
self.play(ShrinkToCenter(group))   # scale 1 -> 0
```

## Transform Animations

```python
# Transform -- modifies the original in place
self.play(Transform(circle, square))
# After: circle IS the square (same object, new appearance)

# ReplacementTransform -- replaces old with new
self.play(ReplacementTransform(circle, square))
# After: circle removed, square on screen

# TransformMatchingTex -- smart equation morphing
eq1 = MathTex(r"a^2 + b^2")
eq2 = MathTex(r"a^2 + b^2 = c^2")
self.play(TransformMatchingTex(eq1, eq2))
```

**Critical**: After `Transform(A, B)`, variable `A` references the on-screen mobject. Variable `B` is NOT on screen. Use `ReplacementTransform` when you want to work with `B` afterwards.

## The .animate Syntax

```python
self.play(circle.animate.set_color(RED))
self.play(circle.animate.shift(RIGHT * 2).scale(0.5))  # chain multiple
```

## Additional Creation Animations

```python
self.play(GrowFromPoint(circle, LEFT * 3))     # scale 0 -> 1 from a specific point
self.play(GrowFromEdge(rect, DOWN))             # grow from one edge
self.play(SpinInFromNothing(square))            # scale up while rotating (default PI/2)
self.play(GrowArrow(arrow))                     # grows arrow from start to tip
```

## Movement Animations

```python
path = Arc(radius=2, angle=PI)
self.play(MoveAlongPath(dot, path), run_time=2)

self.play(Rotate(square, angle=PI / 2, about_point=ORIGIN), run_time=1.5)

self.play(Rotating(gear, angle=TAU, run_time=4, rate_func=linear))
```

## Emphasis Animations

```python
self.play(Indicate(mobject))             # brief yellow flash + scale
self.play(Circumscribe(mobject))         # draw rectangle around it
self.play(Flash(point))                  # radial flash
self.play(Wiggle(mobject))               # shake side to side
```

## Rate Functions

```python
self.play(FadeIn(mob), rate_func=smooth)          # default: ease in/out
self.play(FadeIn(mob), rate_func=linear)           # constant speed
self.play(FadeIn(mob), rate_func=rush_into)        # start slow, end fast
self.play(FadeIn(mob), rate_func=rush_from)        # start fast, end slow
self.play(FadeIn(mob), rate_func=there_and_back)   # animate then reverse
```

## Composition

```python
# Simultaneous
self.play(FadeIn(title), Create(circle), run_time=2)

# AnimationGroup with lag
self.play(AnimationGroup(*[FadeIn(i) for i in items], lag_ratio=0.2))

# LaggedStart
self.play(LaggedStart(*[Write(l) for l in lines], lag_ratio=0.3, run_time=3))

# Succession (sequential in one play call)
self.play(Succession(FadeIn(title), Wait(0.5), Write(subtitle)))
```

## Updaters

```python
tracker = ValueTracker(0)
dot = Dot().add_updater(lambda m: m.move_to(axes.c2p(tracker.get_value(), 0)))
self.play(tracker.animate.set_value(5), run_time=3)
```

## Subtitles

```python
# Method 1: standalone
self.add_subcaption("Key insight", duration=2)
self.play(Write(equation), run_time=2.0)

# Method 2: inline
self.play(Write(equation), subcaption="Key insight", subcaption_duration=2)
```

## Timing Patterns

```python
# Pause-after-reveal
self.play(Write(key_equation), run_time=2.0)
self.wait(2.0)

# Dim-and-focus
self.play(old_content.animate.set_opacity(0.3), FadeIn(new_content))

# Clean exit
self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)
self.wait(0.3)
```

## Reactive Mobjects: always_redraw()

```python
brace = always_redraw(Brace, square, UP)
self.add(brace)
self.play(square.animate.scale(2))  # brace auto-adjusts

h_line = always_redraw(lambda: axes.get_h_line(dot.get_left()))
label = always_redraw(lambda: Text("here", font_size=20).next_to(dot, UP, buff=0.2))
```

## TracedPath — Trajectory Tracing

```python
dot = Dot(color=YELLOW)
path = TracedPath(dot.get_center, stroke_color=YELLOW, stroke_width=2)
self.add(dot, path)
self.play(dot.animate.shift(RIGHT * 3 + UP * 2), run_time=2)

# Fading trail:
path = TracedPath(dot.get_center, dissipating_time=0.5, stroke_opacity=[0, 1])
```

## FadeTransform — Smoother Cross-Fades

```python
self.play(FadeTransform(circle, square))
self.play(FadeTransformPieces(group1, group2))
self.play(TransformFromCopy(source, target))
```

## ApplyMatrix — Linear Transformation Visualization

```python
matrix = [[2, 1], [1, 1]]
self.play(ApplyMatrix(matrix, number_plane), run_time=2)
self.play(ApplyMatrix([[0, -1], [1, 0]], square))  # 90-degree rotation
```

## squish_rate_func — Time-Window Staggering

```python
self.play(
    FadeIn(a, rate_func=squish_rate_func(smooth, 0, 0.5)),
    FadeIn(b, rate_func=squish_rate_func(smooth, 0.25, 0.75)),
    FadeIn(c, rate_func=squish_rate_func(smooth, 0.5, 1.0)),
    run_time=2
)
```

## ShowPassingFlash

```python
self.play(ShowPassingFlash(curve.copy().set_color(YELLOW), time_width=0.3))
```
