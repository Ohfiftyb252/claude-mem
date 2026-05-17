# Decorations and Visual Polish

## SurroundingRectangle

```python
highlight = SurroundingRectangle(
    equation[2],
    color=YELLOW,
    buff=0.15,
    corner_radius=0.1,
    stroke_width=2
)
self.play(Create(highlight))
self.wait(1)
self.play(FadeOut(highlight))
```

### Around part of an equation

```python
eq = MathTex(r"E", r"=", r"m", r"c^2")
box = SurroundingRectangle(eq[2:], color=YELLOW, buff=0.1)
label = Text("mass-energy", font_size=18, font="Menlo", color=YELLOW)
label.next_to(box, DOWN, buff=0.2)
self.play(Create(box), FadeIn(label))
```

## BackgroundRectangle

```python
bg = BackgroundRectangle(equation, fill_opacity=0.7, buff=0.2, color=BLACK)
self.play(FadeIn(bg), Write(equation))

label.set_stroke(BLACK, width=5, background=True)
```

## Brace and BraceLabel

```python
brace = Brace(equation[2:4], DOWN, color=YELLOW)
brace_label = brace.get_text("these terms", font_size=20)
self.play(GrowFromCenter(brace), FadeIn(brace_label))

brace = BraceBetweenPoints(point_a, point_b, direction=UP)
```

## Arrows for Annotation

```python
arrow = Arrow(
    start=label.get_bottom(),
    end=target.get_top(),
    color=YELLOW,
    stroke_width=2,
    buff=0.1,
    max_tip_length_to_length_ratio=0.15
)
self.play(GrowArrow(arrow), FadeIn(label))

arrow = CurvedArrow(
    start_point=source.get_right(),
    end_point=target.get_left(),
    angle=PI/4,
    color=PRIMARY
)
```

## DashedLine and DashedVMobject

```python
asymptote = DashedLine(
    axes.c2p(2, -3), axes.c2p(2, 3),
    color=YELLOW, dash_length=0.15
)

dashed_circle = DashedVMobject(Circle(radius=2, color=BLUE), num_dashes=30)
```

## Angle and RightAngle Markers

```python
line1 = Line(ORIGIN, RIGHT * 2)
line2 = Line(ORIGIN, UP * 2 + RIGHT)
angle = Angle(line1, line2, radius=0.5, color=YELLOW)
right_angle = RightAngle(line1, Line(ORIGIN, UP * 2), length=0.3, color=WHITE)
```

## Cross (strikethrough)

```python
cross = Cross(old_equation, color=RED, stroke_width=4)
self.play(Create(cross))
```

## Color Highlighting Workflow

### Method 1: At creation with t2c

```python
text = Text("The gradient is negative here", t2c={"gradient": BLUE, "negative": RED})
```

### Method 2: set_color_by_tex after creation

```python
eq = MathTex(r"\nabla L = -\frac{\partial L}{\partial w}")
eq.set_color_by_tex(r"\nabla", BLUE)
eq.set_color_by_tex(r"\partial", RED)
```

## The annotation lifecycle

Annotations should follow a rhythm:
1. **Appear** — draw attention (Create, GrowFromCenter)
2. **Hold** — viewer reads and understands (self.wait)
3. **Disappear** — clear the stage (FadeOut)
