

# Typography Update: Outfit + Syne + Space Mono

## Summary
Replace the current font stack with three new fonts while preserving the "Aimee Farabee" signature font (Over the Rainbow).

| Role | Current | New |
|------|---------|-----|
| Headings | Rajdhani | **Outfit** |
| Body | IBM Plex Sans | **Outfit** |
| Taglines/Accent | Josefin Sans | **Syne** (Italic / Extra Bold) |
| Nav and UI | Titillium Web | **Space Mono** |
| Signature ("Aimee Farabee") | Over the Rainbow | **No change** |

## Files to Modify

### 1. `index.html`
- Update the Google Fonts `<link>` to load **Outfit** (400-800), **Inter** removed, **Syne** (500-800, italic), and **Space Mono** (400, 700).
- Remove Rajdhani, Josefin Sans, IBM Plex Sans, and Titillium Web from the import.
- Keep all other fonts (Orbitron, Press Start 2P, Fira Code, Montserrat, Over the Rainbow, Shadows Into Light, etc.).

### 2. `src/index.css` (lines 103-107)
Update CSS custom properties:
```
--font-title: "Outfit", sans-serif;
--font-subtitle: "Syne", sans-serif;
--font-body: "Outfit", sans-serif;
--font-mono: "Space Mono", monospace;
```

Update `.nav-link` class (line 192): change `'Titillium Web'` to `'Space Mono'`.

### 3. `tailwind.config.ts`
Update `fontFamily` entries and add aliases so existing classes keep working:
- `outfit` / `rajdhani` (alias) -> Outfit
- `syne` / `josefin` (alias) -> Syne
- `ibm` (alias) -> Outfit (body and headings share the same font)
- `"space-mono"` / `titillium` (alias) -> Space Mono
- `sans` (default) -> Outfit

All other font families (montserrat, retro, pixel, rainbow, shadows) remain untouched.

## What Stays the Same
- The "Aimee Farabee" NavLink uses `font-rainbow` (Over the Rainbow) -- completely unaffected.
- Orbitron, Press Start 2P, Fira Code, Montserrat, and decorative fonts are preserved.
- No component files need editing thanks to the aliasing strategy.

