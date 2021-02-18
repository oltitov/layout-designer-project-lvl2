const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();

const clean = () => {
  const del = require('del');

  return del([
    './src/css/*',
    './src/*.html',
  ]);
}

const pug = () => {
  const pug = require('gulp-pug');

  return src('./src/pug/*.pug')
    .pipe(pug())
    .pipe(dest('./src/'));
}

const scss = () => {
  const sass = require('gulp-sass');
  const sourcemaps = require('gulp-sourcemaps');

  sass.compiler = require('node-sass');

  return src('./src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./src/css/'))
    .pipe(browserSync.stream());
}

const local = () => {
  browserSync.init({
    server: {
      baseDir: './src',
      directory: true
    },
    port: 8080,
  });

  watch([
    './src/pug/**/*.pug',
  ], pug);
  watch('./src/*.html').on('change', browserSync.reload);

  watch('./src/scss/**/*.scss', scss);
}

exports.default = series(clean, parallel(pug, scss), local);
