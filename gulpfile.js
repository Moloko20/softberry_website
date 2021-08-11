const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

let project_folder = path.resolve(__dirname, './dist');
let source_folder = path.resolve(__dirname, './src');
let paths = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/script.js',
    img: source_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}',
    fonts: source_folder + '/fonts/*.ttf',
    ts: source_folder + '/ts/main.ts',
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    ts: source_folder + '/ts/**/*.ts',
    img: source_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}',
  },
  clean: project_folder,
};

function html() {
  return src(paths.src.html)
    .pipe(fileinclude())
    .pipe(dest(paths.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(paths.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded',
      })
    )
    .pipe(dest(paths.build.css))
    .pipe(browsersync.stream());
}

function ts() {
  return browserify(paths.src.ts)
    .plugin(tsify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(dest(paths.build.js))
    .pipe(browsersync.stream());
}

function watchFiles() {
  browsersync.init({
    server: {
      baseDir: project_folder,
    },
    port: 3000,
    notify: false,
  });
  watch([paths.watch.html], html);
  watch([paths.watch.css], css);
  watch([paths.watch.ts], ts);
}

async function clean() {
  if (fs.existsSync(project_folder)) {
    return await fs.rmSync(project_folder, {
      recursive: true,
      force: true,
    });
  }
}

let build = series(clean, parallel(css, html, ts));
let watchAll = series(build, watchFiles);

exports.ts = ts;
exports.css = css;
exports.html = html;
exports.watch = watchAll;
exports.default = build;
