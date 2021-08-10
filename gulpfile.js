const { src, dest } = require('gulp');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const fs = require('fs');
const path = require('path');

let project_folder = path.resolve(__dirname, './dist');
let source_folder = path.resolve(__dirname, './app');
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
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}',
  },
  clean: project_folder,
};

function browserSync() {
  browsersync.init({
    server: {
      baseDir: project_folder,
    },
    port: 3000,
    notify: false,
  });
}

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

function watchFiles() {
  gulp.watch([paths.watch.html], html);
  gulp.watch([paths.watch.css], css);
}

async function clean() {
  return await fs.rmSync(project_folder, {
    recursive: true,
    force: true,
  });
}

let build = gulp.series(clean, gulp.parallel(css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
