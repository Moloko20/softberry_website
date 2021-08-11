const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const imagemin = require('gulp-imagemin');

let project_folder = path.resolve(__dirname, './dist');
let source_folder = path.resolve(__dirname, './src');
let paths = {
  build: {
    html: path.join(project_folder, '/'),
    css: path.join(project_folder, '/css/'),
    js: path.join(project_folder, '/js/'),
    img: path.join(project_folder, '/img/'),
    fonts: path.join(project_folder, '/fonts/'),
  },
  src: {
    html: path.join(source_folder, '/*.html'),
    css: path.join(source_folder, '/scss/style.scss'),
    img: path.join(source_folder, '/img/**/*'),
    fonts: path.join(source_folder, '/fonts/*.ttf'),
    ts: path.join(source_folder, '/ts/main.ts'),
  },
  watch: {
    html: path.join(source_folder, '/**/*.html').replace(/\\/g, '/'),
    css: path.join(source_folder, '/scss/**/*.scss').replace(/\\/g, '/'),
    ts: path.join(source_folder, '/ts/**/*.ts').replace(/\\/g, '/'),
    img: path.join(source_folder, '/img/**/*').replace(/\\/g, '/'),
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

function img() {
  return src(paths.src.img)
    .pipe(imagemin())
    .pipe(dest(paths.build.img))
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
  watch([paths.watch.css], css);
  watch([paths.watch.ts], ts);
  watch([paths.watch.html], html);
  watch([paths.watch.img], img);
}

async function clean() {
  if (fs.existsSync(project_folder)) {
    return await fs.rmSync(project_folder, {
      recursive: true,
      force: true,
    });
  }
}

let build = series(clean, parallel(css, html, ts, img));
let watchAll = series(build, watchFiles);

exports.img = img;
exports.ts = ts;
exports.css = css;
exports.html = html;
exports.watch = watchAll;
exports.default = build;
