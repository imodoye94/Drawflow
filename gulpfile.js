const fs = require('fs/promises');
const gulp = require('gulp');
const CleanCSS = require('clean-css');

gulp.task('css', async () => {
  const sourceCss = await fs.readFile('src/drawflow.css', 'utf8');
  const minified = new CleanCSS().minify(sourceCss);

  if (minified.errors.length) {
    throw new Error(minified.errors.join('\n'));
  }

  await fs.writeFile('dist/drawflow.min.css', minified.styles);
});

gulp.task('style', async () => {
  const css = await fs.readFile('dist/drawflow.min.css', 'utf8');
  const escapedCss = css.replace(/`/g, '\\`');
  const styleModule = `import { css } from "lit-element";\nexport const style = css\`${escapedCss}\`;\n`;
  await fs.writeFile('dist/drawflow.style.js', styleModule);
});

gulp.task('default', gulp.series('css', 'style'));
