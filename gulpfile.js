var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  cache = require('gulp-cache'),
  ftp = require('vinyl-ftp'),
  gutil = require('gulp-util'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify')

// Сервер и автообновление страницы Browsersync
gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'app',
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  })
})

// Минификация пользовательских скриптов проекта и JS библиотек в один файл
gulp.task('js', function () {
  return gulp
    .src([
      'app/libs/jquery/dist/jquery.min.js',
      'app/js/common.js', // Всегда в конце
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify()) // Минимизировать весь js (на выбор)
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('sass', function () {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleanCSS()) // Опционально, закомментировать при отладке
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('imagemin', function () {
  return gulp
    .src('app/img/**/*')
    .pipe(cache(imagemin())) // Cache Images
    .pipe(gulp.dest('dist/img'))
})

gulp.task('removedist', function () {
  return del(['dist'], { force: true }) // Удаляем папку dist перед сборкой
})
gulp.task('clearcache', function () {
  return cache.clearAll()
})

gulp.task('buildFiles', function () {
  return gulp.src(['app/*.html', 'app/.htaccess']).pipe(gulp.dest('dist'))
})
gulp.task('buildCss', function () {
  return gulp.src(['app/css/main.min.css']).pipe(gulp.dest('dist/css'))
})
gulp.task('buildJs', function () {
  return gulp.src(['app/js/scripts.min.js']).pipe(gulp.dest('dist/js'))
})
gulp.task('buildFonts', function () {
  return gulp.src(['app/fonts/**/*']).pipe(gulp.dest('dist/fonts'))
})
gulp.task('buildPhp', function () {
  return gulp.src(['app/php/*.php']).pipe(gulp.dest('dist/php'))
})

gulp.task(
  'build',
  gulp.series(
    'removedist',
    'imagemin',
    'sass',
    'js',
    'buildFiles',
    'buildCss',
    'buildJs',
    'buildFonts',
    'buildPhp'
  )
)

gulp.task('deploy', function () {
  var conn = ftp.create({
    host: 'grid2.saviv.site', //hosting address
    user: 'a0388634', //hosting username
    password: 'revidaekec', // host pass
    parallel: 10,
    log: gutil.log,
  })

  var globs = ['dist/**', 'dist/.htaccess']
  return gulp.src(globs, { buffer: false }).pipe(conn.dest('/domains/saviv.site/public_html/grid2')) //path to host folder
})

gulp.task('code', function () {
  return (
    gulp.src('app/**/*.html').pipe(browserSync.reload({ stream: true })),
    gulp.src('app/php/*.php').pipe(browserSync.reload({ stream: true }))
  )
})

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'))
  gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'))
  gulp.watch(['app/*.html', 'app/php/*.php'], gulp.parallel('code'))
})

gulp.task('default', gulp.parallel('sass', 'js', 'browser-sync', 'watch'))
