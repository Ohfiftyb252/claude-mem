# Production Quality Checklist

## Pre-Code Checklist

- [ ] Narration script written with visual beats marked
- [ ] Scene list with purpose, duration, and layout for each
- [ ] Color palette defined with meaning assignments
- [ ] `MONO = "Menlo"` set as the font constant
- [ ] Target resolution and aspect ratio decided

## Text Quality

```python
# RULE: buff >= 0.5 for edge text
label.to_edge(DOWN, buff=0.5)

# RULE: FadeOut previous before adding new at same position
self.play(ReplacementTransform(note1, note2))

# RULE: Set max width for any text that might be long
text = Text("This is a potentially long description", font_size=22, font=MONO)
if text.width > config.frame_width - 1.0:
    text.set_width(config.frame_width - 1.0)
```

## Spatial Layout

The visible frame is approximately 14.2 wide × 8.0 tall (default 16:9). With mandatory margins:

```
Usable area: x ∈ [-6.5, 6.5], y ∈ [-3.5, 3.5]
Top title zone: y ∈ [2.5, 3.5]
Bottom note zone: y ∈ [-3.5, -2.5]
Main content: y ∈ [-2.5, 2.5], x ∈ [-6.0, 6.0]
```

**Hard limit: 6 actively visible elements.** Beyond that, dim old elements to opacity 0.3 or split into two scenes.

## Animation Quality

### Tempo curve

```
Slow ──→ Medium ──→ FAST (climax) ──→ Slow (conclusion)
```

### Transition quality

Between scenes:
- **Clean exit**: `self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)`
- **Brief pause**: `self.wait(0.3)` after fadeout
- **Never hard-cut**: always animate the transition

## Color Quality

```python
# RULE: Structural elements (axes, grids) at opacity 0.15
# Context elements at 0.3-0.4
# Primary elements at 1.0

# Once a color is assigned a meaning, it keeps that meaning for the entire video
```

## Pre-Render Checklist

- [ ] All scenes render without errors at `-ql`
- [ ] Background color set in every scene (`self.camera.background_color = BG`)
- [ ] `add_subcaption()` on every significant animation
- [ ] No text smaller than font_size=18
- [ ] No text using proportional fonts (use monospace)
- [ ] buff >= 0.5 on all `.to_edge()` calls
- [ ] Clean exit (FadeOut all) at end of every scene
- [ ] `self.wait()` after every reveal
- [ ] Color constants used (no hardcoded hex strings in scene code)

## Post-Render Checklist

- [ ] Watch the complete video at 1x speed
- [ ] Every text label has enough time to be read
- [ ] Transitions between scenes are smooth
- [ ] Audio in sync with visuals
- [ ] First 5 seconds make the viewer want to keep watching
