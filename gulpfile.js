var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify'),
  browserSync = require('browser-sync').create(),
  browserSync_dist = require('browser-sync').create(),
  htmlmin = require('gulp-htmlmin'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  uglifyjs = require('uglify-js'),
  pump = require('pump'),
  imagemin = require('gulp-imagemin'),
  cssnano = require('gulp-cssnano'),
  cleanCSS = require('gulp-clean-css'),
  gutil = require('gulp-util'),
  inject = require('gulp-inject'),
  concat = require('gulp-concat'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  runSequence = require('run-sequence'),
  minifier = require('gulp-uglify');
gulp.task('styles', function () {
  return gulp.src('src/assets/styles/sass/style.scss').pipe(sourcemaps.init()).pipe(sass({
    sourceComments: 'map',
    sourceMap: 'sass',
    outputStyle: 'expanded'
  }).on('error', sass.logError)).pipe(autoprefixer({
    browsers: ['> 5%']
  })).pipe(sourcemaps.write('maps')).pipe(gulp.dest('src/assets/styles/css/')).pipe(notify({
    message: 'Styles task complete'
  })).pipe(browserSync.reload({
    stream: true
  }));
});
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'src',
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
});
gulp.task('watch', ['browserSync', 'styles'], function () {
    // Watch .scss files
  gulp.watch('src/assets/styles/sass/*.scss', ['styles']);
    // Watch .js files
  gulp.watch('src/assets/scripts/**/*.js', browserSync.reload);
    // Watch image files
  gulp.watch('src/sassets/images/**/*', browserSync.reload);
    // Watch HTML files
  gulp.watch('src/**/*.html', browserSync.reload);
});
