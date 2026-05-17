# Updaters and Value Trackers

## The problem updaters solve

Normal animations are discrete: `self.play()` goes from state A to state B. Updaters let you declare a continuous relationship ONCE — Manim calls the updater every frame to enforce it.

## ValueTracker: an invisible steering wheel

```python
tracker = ValueTracker(0)        # invisible, stores 0.0
tracker.get_value()              # read: 0.0
tracker.set_value(5)             # write: jump to 5.0 instantly
tracker.animate.set_value(5)     # animate: smoothly interpolate to 5.0
```

### The three-step pattern

```python
# Step 1: Create tracker
x_tracker = ValueTracker(1)

# Step 2: Create dependent objects
dot = always_redraw(lambda: Dot(axes.c2p(x_tracker.get_value(), 0), color=YELLOW))
v_line = always_redraw(lambda: axes.get_vertical_line(
    axes.c2p(x_tracker.get_value(), func(x_tracker.get_value())), color=BLUE
))
label = always_redraw(lambda: DecimalNumber(x_tracker.get_value(), font_size=24)
    .next_to(dot, UP))

self.add(dot, v_line, label)

# Step 3: Animate the tracker — everything follows
self.play(x_tracker.animate.set_value(5), run_time=3)
```

## Types of updaters

### Lambda updater (most common)

```python
label.add_updater(lambda m: m.next_to(dot, UP, buff=0.2))

line.add_updater(lambda m: m.put_start_and_end_on(
    point_a.get_center(), point_b.get_center()
))
```

### Time-based updater (with dt)

```python
square.add_updater(lambda m, dt: m.rotate(0.5 * dt))
dot.add_updater(lambda m, dt: m.shift(RIGHT * 0.3 * dt))
```

### always_redraw: full rebuild every frame

```python
brace = always_redraw(Brace, square, UP)

area = always_redraw(lambda: axes.get_area(
    graph, x_range=[0, x_tracker.get_value()], color=BLUE, opacity=0.3
))

counter = always_redraw(lambda: Text(
    f"n = {int(x_tracker.get_value())}", font_size=24, font="Menlo"
).to_corner(UR))
```

**When to use which:**
- `add_updater` — position, color, opacity changes (cheap, preferred)
- `always_redraw` — when the shape/structure itself changes (expensive, use sparingly)

## DecimalNumber: showing live values

```python
tracker = ValueTracker(0)
number = DecimalNumber(0, font_size=48, num_decimal_places=1, color=PRIMARY)
number.add_updater(lambda m: m.set_value(tracker.get_value()))
number.add_updater(lambda m: m.next_to(dot, RIGHT, buff=0.3))

self.add(number)
self.play(tracker.animate.set_value(100), run_time=3)
```

## Removing updaters

```python
mobject.clear_updaters()

mobject.suspend_updating()
self.play(mobject.animate.shift(RIGHT))
mobject.resume_updating()
```

## Practical patterns

### Pattern 1: Dot tracing a function

```python
tracker = ValueTracker(0)
graph = axes.plot(np.sin, x_range=[0, 2*PI], color=PRIMARY)
dot = always_redraw(lambda: Dot(
    axes.c2p(tracker.get_value(), np.sin(tracker.get_value())),
    color=YELLOW
))

self.add(graph, dot)
self.play(tracker.animate.set_value(2*PI), run_time=6, rate_func=linear)
```

### Pattern 2: Connected diagram

```python
node_a = Dot(LEFT * 2, color=PRIMARY)
node_b = Dot(RIGHT * 2, color=SECONDARY)
edge = Line().add_updater(lambda m: m.put_start_and_end_on(
    node_a.get_center(), node_b.get_center()
))

self.add(node_a, node_b, edge)
self.play(node_a.animate.shift(UP * 2), run_time=2)
```

## Common mistakes

1. **Updater fights animation:** Suspend updating first if you want to animate against an updater.
2. **always_redraw for simple moves:** Use `add_updater` for position tracking — cheaper.
3. **Forgetting to add to scene:** Updaters only run on mobjects in the scene.
