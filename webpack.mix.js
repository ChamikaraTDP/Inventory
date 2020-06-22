const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.js('resources/js/app.js', 'public/js')
mix.js('resources/js/inventory.js', 'public/js')
    .js('resources/js/inventory/admin_panel.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css');


/*mix.js('resources/js/app.js', 'public/js')
    .babel([
    'resources/js/inventory/add_items.js',
    'resources/js/inventory/issue_items.js',
    'resources/js/inventory/navigation.js'], 'public/js/inventory.js')
    .sass('resources/sass/app.scss', 'public/css');*/

//mix.js('resources/js/inventory.js', 'public/js/inventory.js').babel('resources/js/inventory.js', 'public/js/inventory.js');

/*.js('resources/js/inventory.js', 'public/js')*/
