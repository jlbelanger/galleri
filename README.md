# Robroy Photo Gallery

Robroy Photo Gallery is a databaseless vanilla JavaScript and vanilla PHP photo gallery. Image data is read from the filesystem, and authentication is handled through HTTP basic auth.

## Demo

https://robroy.jennybelanger.com/

## Features

- allows uploading and deleting images from a web interface
- automatically creates thumbnails
- automatically watermarks images
- automatically resizes images
- loads images with infinite scroll

## Dependencies

- Apache (other servers would presumably work too, but I've only tested with Apache)
- PHP (tested with version 7.4)
- [Composer](https://getcomposer.org/)

## Setup

Clone the Robroy repo (or download a ZIP of the code from Github):

``` bash
git clone https://github.com/jlbelanger/robroy.git
```

Then, delete everything except the `demo` folder.

You will also eventually want to delete the images in `demo/public/images`, but you can leave them for now to test if the code is working.

Choose one of the HTML to files to keep (either `public/dark.html`, `public/light.html`, or `public/minimal.html`), and then delete all other HTML files in `public`. Rename your chosen HTML file to `index.html`. You should also delete `public/dark.min.css` and `scss/dark.scss` or `public/light.min.css` and `scss/light.scss` if you aren't using their corresponding HTML files.

All the following commands should be run in the `demo` folder.

To create a user, run the following command, replacing `USERNAME` with the username you want to use. You will be prompted to set a password for your new user.

``` bash
htpasswd -c .htpasswd USERNAME
```

Optionally, you can run this command for each additional user you want to create:

``` bash
htpasswd .htpasswd ANOTHER_USERNAME
```

Make copies of the example settings files:

``` bash
cp .env.example .env
cp public/.htaccess.example public/.htaccess
rm public/.htaccess.example
```

Then update the settings in `demo/.env` and `demo/public/.htaccess`.

Download the PHP dependencies:

``` bash
composer install
```

Then, if you visit `index.html` on an Apache server running PHP, you should now be able to upload images.

## How it works

In the HTML file, you need to include the Robroy CSS and JS files, an empty element, and a JS call to `Robroy.default.init()`, passing in a CSS selector for the empty element in which the gallery should be displayed.

``` html
<link rel="stylesheet" type="text/css" href="robroy.min.css">
<div id="robroy"></div>
<script src="robroy.min.js"></script>
<script>Robroy.default.init({ selector: '#robroy' });</script>
```

If you want to enable authentication and allow managing images from the frontend, you'll need a `<button>` with the attribute `data-action="authenticate"`.

``` html
<button data-action="authenticate" type="button"></button>
```

You'll also need a PHP file that calls `Jlbelanger\Robroy\Router::load()`.

``` php
<?php

require_once realpath(__DIR__ . '/../vendor/autoload.php');

// Optional: You can set the environment variables another way if you choose.
$dotenv = Dotenv\Dotenv::create(realpath(__DIR__ . '/../'));
$dotenv->load();

Jlbelanger\Robroy\Router::load();
```

## Configuration

### PHP

All available PHP configuration options are defined in `demo/.env.example`. However, you will need to copy this file to `demo/.env` (as described in the setup instruction) and make your changes in that file rather than in the example file.

### JS

All available JS configuration options are defined in `demo/public/dark.html` and `demo/public/light.html`.

### SCSS

All available SCSS configuration options are defined in `scss/utilities/_variables.scss`. However, to override these settings, you will need to re-define the variables in one of the SCSS files in `demo/scss`.

Follow the instructions below to compile the SCSS changes.

In the `demo` directory, run the following command to install SCSS dependencies:

``` bash
yarn install
```

Then, to re-compile the `demo/public/*.min.css` files whenever there are changes in `demo/scss/*.scss`, run the following command:

``` bash
yarn watch
```

Alternately, to compile the SCSS files without watching for changes, run:

``` bash
yarn build
```

## Development

If you want to contibute to the Robroy Photo Gallery repo, the following commands may come in handy.

The following commands should be run in the top-level `robroy` directory.

### Install

``` bash
yarn install
composer install
```

### Compile CSS/JS

``` bash
yarn watch
```

### Lint

``` bash
./vendor/bin/phpcs

yarn lint
```

### Test

``` bash
./vendor/bin/phpunit
```

### Deploy

Note: The deploy script included in this repo depends on other scripts that only exist in my private repos. If you want to deploy this repo, you'll have to create your own script.

``` bash
./deploy.sh
```

## Credits

- Debounce: https://davidwalsh.name/javascript-debounce-function
- Favicon: https://useiconic.com/open
- Lightbox: https://github.com/banthagroup/fslightbox
- Masonry grid: https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
- Normalize: https://github.com/necolas/normalize.css
- Placeholder images: https://placehold.it/
