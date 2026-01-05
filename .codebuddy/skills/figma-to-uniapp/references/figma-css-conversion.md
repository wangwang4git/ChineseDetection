# Figma to CSS Conversion Rules

## Unit Conversion

### px to rpx

uni-app uses `rpx` (responsive pixel) as the responsive unit. The design standard is 750rpx = screen width.

**Conversion Formula:**
```
rpx = px * 2  (for 375px design width)
rpx = px * (750 / design_width)
```

**Examples (375px design):**
| Figma (px) | uni-app (rpx) |
|------------|---------------|
| 10px | 20rpx |
| 12px | 24rpx |
| 14px | 28rpx |
| 16px | 32rpx |
| 20px | 40rpx |
| 24px | 48rpx |
| 32px | 64rpx |
| 100px | 200rpx |
| 375px | 750rpx |

**Exceptions (keep as px):**
- 1px borders (hairline)
- Box shadows (can use rpx or px)

## Layout Conversion

### Auto Layout → Flexbox

| Figma Property | CSS Property |
|----------------|--------------|
| Direction: Horizontal | `flex-direction: row` |
| Direction: Vertical | `flex-direction: column` |
| Alignment: Top Left | `align-items: flex-start; justify-content: flex-start` |
| Alignment: Top Center | `align-items: flex-start; justify-content: center` |
| Alignment: Top Right | `align-items: flex-start; justify-content: flex-end` |
| Alignment: Center Left | `align-items: center; justify-content: flex-start` |
| Alignment: Center | `align-items: center; justify-content: center` |
| Alignment: Center Right | `align-items: center; justify-content: flex-end` |
| Alignment: Bottom Left | `align-items: flex-end; justify-content: flex-start` |
| Alignment: Bottom Center | `align-items: flex-end; justify-content: center` |
| Alignment: Bottom Right | `align-items: flex-end; justify-content: flex-end` |
| Gap: 10 | `gap: 20rpx` |
| Padding: 16 | `padding: 32rpx` |
| Space Between | `justify-content: space-between` |

### Constraints → CSS Positioning

| Figma Constraint | CSS |
|------------------|-----|
| Left & Right (fixed width) | `width: [value]rpx` |
| Left & Right (stretch) | `width: 100%` or `flex: 1` |
| Top & Bottom (fixed height) | `height: [value]rpx` |
| Top & Bottom (stretch) | `height: 100%` or `flex: 1` |
| Center | `margin: auto` or flex centering |

## Visual Properties

### Fill → Background

| Figma Fill | CSS |
|------------|-----|
| Solid color | `background-color: #RRGGBB` |
| Linear gradient | `background: linear-gradient(angle, color1, color2)` |
| Image fill | `background-image: url()` |
| Opacity | `opacity: 0.5` or `background-color: rgba()` |

### Stroke → Border

| Figma Stroke | CSS |
|--------------|-----|
| Inside stroke | `border: 1px solid #color; box-sizing: border-box` |
| Outside stroke | `outline: 1px solid #color` or box-shadow |
| Center stroke | `border: 1px solid #color` |
| Dashed | `border-style: dashed` |

### Effects → CSS Effects

| Figma Effect | CSS |
|--------------|-----|
| Drop shadow | `box-shadow: x y blur spread color` |
| Inner shadow | `box-shadow: inset x y blur spread color` |
| Layer blur | `filter: blur(Xpx)` |
| Background blur | `backdrop-filter: blur(Xpx)` |

### Corner Radius

| Figma | CSS |
|-------|-----|
| All corners: 8 | `border-radius: 16rpx` |
| Individual corners | `border-radius: TL TR BR BL` |
| Smoothing (iOS style) | Not directly supported, approximate with larger radius |

## Typography

### Text Styles

| Figma Property | CSS Property |
|----------------|--------------|
| Font family | `font-family` |
| Font size | `font-size: [size * 2]rpx` |
| Font weight | `font-weight: [100-900]` |
| Line height | `line-height: [value * 2]rpx` or ratio |
| Letter spacing | `letter-spacing: [value]rpx` |
| Text align | `text-align: left/center/right` |
| Text decoration | `text-decoration: underline/line-through` |
| Text transform | `text-transform: uppercase/lowercase` |

### Font Weight Mapping

| Figma | CSS |
|-------|-----|
| Thin | 100 |
| Extra Light | 200 |
| Light | 300 |
| Regular | 400 |
| Medium | 500 |
| Semi Bold | 600 |
| Bold | 700 |
| Extra Bold | 800 |
| Black | 900 |

### Text Overflow

```css
/* Single line ellipsis */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line ellipsis (2 lines) */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

## Color Conversion

### Figma Color to CSS

| Figma Format | CSS Format |
|--------------|------------|
| #RRGGBB | `#RRGGBB` |
| RGBA(r, g, b, a) | `rgba(r, g, b, a)` |
| Opacity 50% | `rgba(r, g, b, 0.5)` |

### Gradient Conversion

**Figma Linear Gradient:**
```
Angle: 180° (top to bottom)
Stops: #FF0000 at 0%, #0000FF at 100%
```

**CSS:**
```css
background: linear-gradient(180deg, #FF0000 0%, #0000FF 100%);
```

**Angle Conversion:**
- Figma 0° = CSS 0° (bottom to top)
- Figma 90° = CSS 90° (left to right)
- Figma 180° = CSS 180° (top to bottom)
- Figma 270° = CSS 270° (right to left)

## Image Modes

### Figma Fill Mode → uni-app Image Mode

| Figma | uni-app `mode` |
|-------|----------------|
| Fill | `aspectFill` |
| Fit | `aspectFit` |
| Crop | `aspectFill` with overflow hidden |
| Tile | Use CSS `background-repeat` |
| Original | `widthFix` or `heightFix` |

## Shadow Conversion

**Figma Shadow:**
```
X: 0, Y: 4, Blur: 12, Spread: 0
Color: #000000 10%
```

**CSS:**
```css
box-shadow: 0 8rpx 24rpx 0 rgba(0, 0, 0, 0.1);
```

Note: Multiply X, Y, Blur, Spread by 2 for rpx conversion.

## Blend Modes

| Figma Blend Mode | CSS `mix-blend-mode` |
|------------------|----------------------|
| Normal | `normal` |
| Multiply | `multiply` |
| Screen | `screen` |
| Overlay | `overlay` |
| Darken | `darken` |
| Lighten | `lighten` |
| Color Dodge | `color-dodge` |
| Color Burn | `color-burn` |
| Hard Light | `hard-light` |
| Soft Light | `soft-light` |
| Difference | `difference` |
| Exclusion | `exclusion` |
| Hue | `hue` |
| Saturation | `saturation` |
| Color | `color` |
| Luminosity | `luminosity` |

**Note:** Blend modes may not work consistently across all uni-app platforms.
