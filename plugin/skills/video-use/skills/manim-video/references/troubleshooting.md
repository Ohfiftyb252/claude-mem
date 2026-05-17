# Troubleshooting

## LaTeX Errors

### "! LaTeX Error: File not found"
```bash
# macOS — install full TeX distribution
brew install --cask mactex

# Linux
sudo apt-get install texlive-full
```

### "! Undefined control sequence"
```python
# WRONG: Python string escape
MathTex("\frac{1}{2}")

# RIGHT: Raw string
MathTex(r"\frac{1}{2}")
```

### Missing packages
```python
# Add extra packages via tex_template
from manim import TexTemplate
template = TexTemplate()
template.add_to_preamble(r"\usepackage{physics}")
MathTex(r"\dv{f}{x}", tex_template=template)
```

## Animation Errors

### "ValueError: The target mobject has no points"
The mobject you're transforming into is empty or has zero area.
```python
# Check that the target has visible content
target = MathTex(r"x^2")  # must be non-empty
self.play(Transform(source, target))
```

### "AttributeError: ... has no attribute 'animate'"
The object is not a Mobject. Usually happens when you try to animate a Python object instead of a Manim one.

### "TypeError: VGroup accepts only VMobjects"
```python
# WRONG: Text is a Mobject, not VMobject
group = VGroup(circle, Text("label"))

# RIGHT: Use Group for mixed types
group = Group(circle, Text("label"))
```

### Animation plays but nothing moves
You likely forgot to add the mobject to the scene first:
```python
self.add(circle)  # add first
self.play(circle.animate.shift(RIGHT))  # then animate
```

## Common Mistakes

### Forgetting background color
```python
# Every scene must set this
self.camera.background_color = BG
```

### Text too small
```python
# Minimum readable size
font_size=18  # never go below this
```

### Text overlap
```python
# Don't write new text on top of old
self.play(ReplacementTransform(old_text, new_text))  # transforms properly
# NOT: self.play(Write(new_text))  # overlaps
```

### Edge text clipping
```python
label.to_edge(DOWN, buff=0.5)  # minimum buff=0.5, never less
```

### Hard cuts between scenes
```python
# ALWAYS fade out before next scene
self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)
self.wait(0.3)
```

## Performance

### Rendering too slow
- Use `-ql` (480p 15fps) for iteration
- Only use `-qh` for final output
- Avoid `always_redraw` on complex mobjects — prefer `add_updater`

### LaTeX compilation slow
- Cache is in `~/.cache/manim/` — don't delete it
- Complex expressions with many submobjects take longer

## Debugging

### Preview a single frame
```bash
manim -ql --format=png -s script.py SceneName
```

### See the full error
Manim sometimes swallows errors. Run with verbose logging:
```bash
manim -ql script.py SceneName --verbosity DEBUG
```

### Test one scene at a time
Never try to debug all scenes at once. Isolate the problem scene and iterate on it alone.
