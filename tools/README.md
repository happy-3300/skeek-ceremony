# Regenerating assets/lines-lit.png

The glowing building lines are traced from the original 3x background so they match it pixel for pixel.

    node tools/trace-lines-page.js assets-3x/background.png /tmp/trace.html 3
    node tools/chrome-run.js file:///tmp/trace.html /tmp/lit
    pngquant --quality=85-100 --speed 1 --strip --force --output assets/lines-lit.png /tmp/lit/lines-lit.png
    node build.js

# Regenerating assets/icons/*

Each landmark SVG is split into sun / building / shadow PNGs (shadows converted from multiply blend to plain transparency).

    node tools/icon-layers-page.js assets-3x/icons-svg /tmp/icons.html
    node tools/chrome-run.js file:///tmp/icons.html /tmp/ic
    for f in /tmp/ic/*.png; do pngquant --quality=88-100 --speed 1 --strip --force --output assets/icons/$(basename "$f") "$f"; done
    node build.js

# Regenerating assets/ribbons.png + assets/lines.png

The background is split so the building lines can fade out while the ribbons stay.

    node tools/split-background-page.js assets-3x/background.png /tmp/split.html
    node tools/chrome-run.js file:///tmp/split.html /tmp/split
    for f in ribbons lines; do pngquant --quality=88-100 --speed 1 --strip --force --output assets/$f.png /tmp/split/$f.png; done

# Regenerating assets/labels/* (landmark names)

The designer's label SVGs use live text (Brando Arabic, Iowan Old Style Bold). The fonts live in
assets-3x/fonts (not committed) and are only used to render the PNGs; the page itself needs no fonts.
Only Brando Arabic *Text* (regular) is available, so the Arabic is emboldened with a 0.32-unit outline to match SemiBold.

    export FONTCONFIG_FILE=$PWD/assets-3x/fonts/fonts.conf
    node tools/labels-page.js assets-3x/labels-svg /tmp/labels.html 3 0.32
    node tools/chrome-run.js file:///tmp/labels.html /tmp/lab
    for f in /tmp/lab/*.png; do pngquant --quality=88-100 --speed 1 --strip --force --output assets/labels/$(basename "$f") "$f"; done
    node build.js
