# Vendored fonts

Terminal Core ships its two typefaces instead of depending on whatever a host
has installed, so product surfaces and the Playwright visual baselines render
identical glyphs on every machine. Both are licensed under the SIL Open Font
License 1.1, which permits bundling and subsetting; neither declares a
Reserved Font Name. The license texts ship next to the fonts in `dist/fonts/`.

| File | Source | License |
|---|---|---|
| `InterVariable.woff2` | Inter 4.1, `web/InterVariable.woff2` from `Inter-4.1.zip` (github.com/rsms/inter releases, sha256 `9883fdd4…6b11e`) | `OFL-Inter.txt` |
| `JetBrainsMonoVariable.woff2` | JetBrains Mono 2.304, `fonts/variable/JetBrainsMono[wght].ttf` from `JetBrainsMono-2.304.zip` (github.com/JetBrains/JetBrainsMono releases, sha256 `6f6376c6…f7bbf`) | `OFL-JetBrainsMono.txt` |

Both files are the upstream variable fonts limited to the weights the design
system uses (400–600) and to Latin, Latin Extended, punctuation, arrows,
math, box-drawing and common symbols. Other scripts fall back to the next
family in `--mtc-font-sans` / `--mtc-font-mono`. They were produced with
fontTools 4.60.1:

```sh
FT="uvx --from fonttools[woff]==4.60.1"
RANGES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF,U+2116,U+2190-21FF,U+2200-22FF,U+2300-23FF,U+2500-25FF,U+2600-26FF,U+2700-27BF"
$FT fonttools varLib.instancer InterVariable.woff2 wght=400:600 -o inter.ttf
$FT pyftsubset inter.ttf --unicodes="$RANGES" --layout-features='*' --flavor=woff2 --output-file=InterVariable.woff2
$FT fonttools varLib.instancer 'JetBrainsMono[wght].ttf' wght=400:600 -o mono.ttf
$FT pyftsubset mono.ttf --unicodes="$RANGES" --layout-features='*' --flavor=woff2 --output-file=JetBrainsMonoVariable.woff2
```

Changing either file changes every visual baseline; regenerate them in the
same commit.
