var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    watch = require("gulp-watch"),
    minify = require('gulp-minify');


gulp.task('vendors', function () {

    return gulp.src([
        'bower_components/animate.css/animate.min.css',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/sweetalert/dist/sweetalert.css',
        'bower_components/sweetalert/dist/sweetalert.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/components-font-awesome/css/font-awesome.min.css',
        'bower_components/angular-loading-bar/build/loading-bar.min.js',
        'bower_components/angular-loading-bar/build/loading-bar.min.css',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/oclazyload/dist/ocLazyLoad.min.js',
        'bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css',
        'bower_components/metisMenu/dist/metisMenu.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'node_modules/metismenu/dist/metisMenu.min.js',
        'node_modules/jquery-slimscroll/jquery.slimscroll.min.js',
        'bower_components/PACE/pace.min.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/ng-tags-input/ng-tags-input.min.js',
        'bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css',
        'bower_components/ng-tags-input/ng-tags-input.min.css',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/marked/marked.min.js',
        'bower_components/angular-ui-mask/dist/mask.min.js',
        'bower_components/c3/c3.min.css',
        'bower_components/c3/c3.min.js',
        'bower_components/d3/d3.min.js',
        'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css',
        'bower_components/bootstrap-datepicker/dist/locales/bootstrap-datepicker.pt-BR.min.js',
    ])
        .pipe(gulp.dest('wwwroot/vendors'));
});

gulp.task('css', function () {

    gulp.src('src/css/patterns/*.*')
        .pipe(gulp.dest('wwwroot/css/patterns'));

    return gulp.src([
        'src/css/*.css',
    ])
        .pipe(gulp.dest('wwwroot/css'));
});

gulp.task('js:template', function () {
    return gulp.src('src/js/inspinia.js')
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/js'));
});

gulp.task('fonts', function () {
    return gulp.src([
        'src/fonts/**',
        'bower_components/material-design-iconic-font/dist/fonts/**'
    ])
        .pipe(gulp.dest('wwwroot/fonts'));
});

gulp.task("images", ['favicon'], function () {
    return gulp.src('src/images/*.*').pipe(gulp.dest('wwwroot/images'));
});

gulp.task('favicon', function () {
    return gulp.src('src/favicon.ico').pipe(gulp.dest('wwwroot'));
});

gulp.task('app', ['app:directives', 'app:services'], function () {

    return gulp.src(['src/app/app.js', 'src/app/config.js'])
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/app'));
});

gulp.task('app:directives', function () {

    gulp.src('src/app/directives/views/**.html')
        .pipe(gulp.dest('wwwroot/app/directives/views'));

    return gulp.src('src/app/directives/*.js')
        .pipe(concat('directives.js'))
        .pipe(gulp.dest('wwwroot/app/directives'));
});

gulp.task('app:services', function () {
    return gulp.src('src/app/services/*.js')
        .pipe(concat('services.js'))
        .pipe(gulp.dest('wwwroot/app/services'));
});

gulp.task('api:js', function () {
    return gulp.src('src/app/api/**/*.js')
        .pipe(concat('api.sharenews.js'))
        .pipe(uglify().on('error', function (e) { console.log('\x07', e.message, '\n', e.lineNumber); return this.end(); }))
        .pipe(gulp.dest('wwwroot/app/api'));
});

gulp.task('app:module-login', function () {

    return gulp.src([
        'src/app/login/login.module.js',
        'src/app/login/controllers/loginController.js',
        'src/app/login/services/loginService.js'
    ])
        .pipe(uglify())
        .pipe(concat('login.module.js'))
        .pipe(gulp.dest('wwwroot/app/login'));
});

gulp.task('app:template-module', function () {
    gulp.src('src/app/template/views/*.html')
        .pipe(gulp.dest('wwwroot/app/template/views'));

    gulp.src('src/app/template/*.js')
        .pipe(uglify())
        .pipe(concat('template.module.js'))
        .pipe(gulp.dest('wwwroot/app/template'));
});

gulp.task('app:unileste-module', function () {
    gulp.src([
        'src/app/unileste/config/*.js',
        'src/app/unileste/controllers/*.js',
    ])
        .pipe(concat('unileste.module.js'))
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/app/unileste'));

    return gulp.src('src/app/unileste/views/**')
        .pipe(gulp.dest('wwwroot/app/unileste/views'));
});

gulp.task('app:configAdmin-module', function () {
    gulp.src([
        'src/app/configAdmin/config/*.js',
        'src/app/configAdmin/controllers/*.js',
    ])
        .pipe(concat('configAdmin.module.js'))
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/app/configAdmin'));

    return gulp.src('src/app/configAdmin/views/**')
        .pipe(gulp.dest('wwwroot/app/configAdmin/views'));
});

gulp.task('app:blacklist-module', function () {
    gulp.src([
        'src/app/blacklist/config/*.js',
        'src/app/blacklist/controllers/*.js',
    ])
        .pipe(concat('blacklist.module.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('wwwroot/app/blacklist'));

    return gulp.src('src/app/blacklist/views/**')
        .pipe(gulp.dest('wwwroot/app/blacklist/views'));
});


gulp.task('app:perfil-module', function () {
    gulp.src([
        'src/app/perfil/config/*.js',
        'src/app/perfil/controllers/*.js',
    ])
        .pipe(concat('perfil.module.js'))
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/app/perfil'));

    return gulp.src('src/app/perfil/views/**')
        .pipe(gulp.dest('wwwroot/app/perfil/views'));
});

gulp.task('app:relatorios-module', function () {
    gulp.src([
        'src/app/relatorios/config/*.js',
        'src/app/relatorios/controllers/*.js',
    ])
        .pipe(concat('relatorios.module.js'))
        .pipe(uglify())
        .pipe(gulp.dest('wwwroot/app/relatorios'));

    return gulp.src('src/app/relatorios/views/**')
        .pipe(gulp.dest('wwwroot/app/relatorios/views'));
});

gulp.task('app:modules', [
    'app:module-login',
    'app:template-module',
    'app:unileste-module',
    'app:blacklist-module',
    'app:configAdmin-module',
    'app:perfil-module',
    'app:relatorios-module'
]);

gulp.task('watch', function () {
    return watch('src/app/**', function () {
        gulp.start('build:app');
    });
});

gulp.task('build:app', ['app', 'app:modules', 'api:js', 'js:template']);

gulp.task('build', ['vendors', 'css', 'fonts', 'images', 'build:app']);

gulp.task('clear', function () {
    return gulp.src('wwwroot/*')
        .pipe(clean({ force: true }));
});

gulp.task('default', function () {

    console.log('Tasks disponíveis:');

    for (var task in gulp.tasks) {
        console.log('-> ', task);
    }
});
