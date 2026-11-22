# Regenerating assets/lines-lit.png

The glowing building lines are traced from the original 3x background so they match it pixel for pixel.

    node tools/trace-lines-page.js assets-3x/background.png /tmp/trace.html 3
    node tools/chrome-run.js file:///tmp/trace.html /tmp/lit
    pngquant --quality=85-100 --speed 1 --strip --force --output assets/lines-lit.png /tmp/lit/lines-lit.png
    node build.js
