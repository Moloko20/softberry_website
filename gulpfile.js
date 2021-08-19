const { src, dest, watch, series, parallel } = require('gulp');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const gulpif = require('gulp-if');
const terser = require('gulp-terser');
const isProd = process.env.NODE_ENV === 'production';
const tsts = require('./gulp-ts');

const project_folder = path.resolve(__dirname, './dist');
const source_folder = path.resolve(__dirname, './src');
const paths = {
    build: {
        html: path.join(project_folder, '/'),
        css: path.join(project_folder, '/css/'),
        js: path.join(project_folder, '/js/'),
        img: path.join(project_folder, '/img/'),
        fonts: path.join(project_folder, '/fonts/'),
    },
    src: {
        html: path.join(source_folder, '/html/index.html'),
        css: path.join(source_folder, '/sass/main.sass'),
        img: path.join(source_folder, '/img/**/*'),
        ts: path.join(source_folder, '/ts/main.ts'),
    },
    watch: {
        html: path.join(source_folder, '/html/**/*.html').replace(/\\/g, '/'),
        css: path.join(source_folder, '/sass/**/*.sass').replace(/\\/g, '/'),
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
            sass({
                outputStyle: 'expanded',
            })
        )
        .on('error', function (err) {
            console.error(err.stack);

            this.emit('end');
        })
        .pipe(gulpif(isProd, postcss()))
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
    return (
        src(paths.src.ts)
            .pipe(tsts())
            .on('error', function (err) {
                console.error(err.stack);

                this.emit('end');
            })
            .pipe(source('main.js'))
            // .pipe(terser())
            .pipe(dest(paths.build.js))
            .pipe(browsersync.stream())
    );
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
