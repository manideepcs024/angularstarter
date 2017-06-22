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


//copy html templates
gulp.task('copyhtml', function () {
  return gulp.src('./src/templates/**/*').pipe(gulp.dest('dist/templates'))
});
// minfy copied html files...
gulp.task('htmlmin', function () {
  // , './careers/**/*.html'
  return gulp.src(['./dist/**/*.html']).pipe(htmlmin({
    collapseWhitespace: true
  })).pipe(gulp.dest('dist'));
});
//minify all js files
gulp.task('minify-js', function (cb) {
  // the same options as described above
  var options = {
    mangle: false,
    compress: {
      drop_console: true
    },
    output: {}
  };
  pump([
    gulp.src(['./src/core/**/**/*.js', './src/components/**/**/*.js', '!./src/templates/*.js'], {
      base: './src/'
    }),
    minifier(options, uglifyjs).on('error', gutil.log),
    gulp.dest('./dist/')
  ], cb);
});
//minfy images
//Image minification
gulp.task('minify-image', function (cb) {
  return gulp.src(['./src/assets/images/**/**/**/*.+(png|jpg|JPG|jpeg|gif|svg)']).pipe(imagemin({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  })).pipe(gulp.dest('./dist/assets/images'));
});
gulp.task('clean', function () {
  return del.sync('dist');
});
// copy videos
gulp.task('copyassets', function (cb) {
  return gulp.src(['./src/assets/fonts/**/**/*/', './src/assets/videos/*'], {
    base: './src/'
  }).pipe(gulp.dest('./dist/'));
});
//minify index//minify  main index.html
gulp.task('minify-index', function (cb) {
  pump([
    gulp.src('./dist/index.html'),
    htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }),
    gulp.dest('./dist/')
  ], cb);
})
//combines all angular js files and moving in to one....
gulp.task('use-ref', function (cb) {
  var options = {
    mangle: false,
    compress: {
      drop_console: true
    },
    output: {}
  };
  pump([
    gulp.src('./src/index.html').pipe(useref()).pipe(gulpif('*.js', minifier(options, uglifyjs))).pipe(gulpif('*.css', cleanCSS())),
    gulp.dest('./dist/')
  ], cb);
});
//gulp final task
gulp.task('production', function (cb) {
  runSequence('clean', ['copyassets', 'copyhtml', 'htmlmin', 'minify-image', 'use-ref', ], 'minify-index', cb);
});
gulp.task('browserSyncDist', function () {
  browserSync.init({
    server: {
      baseDir: 'dist',
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
});
gulp.task('watch_dist', ['browserSyncDist'], function () {
  // Watch .js files
  gulp.watch('dist/assets/scripts/**/*.js', browserSync.reload);
  // Watch image files
  gulp.watch('dist/sassets/images/**/*', browserSync.reload);
  // Watch HTML files
  gulp.watch('dist/**/*.html', browserSync.reload);
});
