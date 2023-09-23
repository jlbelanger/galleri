# Galleri

Galleri is a databaseless vanilla JavaScript and vanilla PHP photo gallery. Image data is read from the filesystem and cached in JSON files, and authentication is handled through HTTP basic auth.

## Demo

https://www.brendabelanger.com/

## Features

- upload and delete images from a web interface
- group images into folders and subfolders
- create image thumbnails automatically
- watermark images automatically
- resize images automatically
- load images with infinite scroll
- (optional) view images in a lightbox
- specify image alt tags
- add arbitrary data to images and folders

## Requirements

- Apache (other servers would presumably work too, but I've only tested with Apache)
- PHP (tested with version 7.4)
- [Composer](https://getcomposer.org/)

## Setup

Run:

``` bash
composer create-project jlbelanger/galleri-project my-gallery --repository '{"type":"vcs","url":"git@github.com:jlbelanger/galleri-project.git"}' --stability dev
```

The setup script will prompt you to configure various settings.

If you are using nginx or a server other than Apache, you can delete `public/.htaccess`, and you will need to update your server's configuration to handle error pages, authentication, and redirects.

## Configuration

### PHP

PHP configuration options are defined in [`.env.example`](https://github.com/jlbelanger/galleri-project/blob/main/.env.example). Make your changes in the `.env` file created by the setup script; changes made in `.env.example` will have no effect.

### JS

JS configuration options are defined in [`public/index.html`](https://github.com/jlbelanger/galleri-project/blob/main/public/index.html). Make your changes in the `public/index.html` file created by the setup script.

### SCSS

SCSS configuration options are defined in [`scss/utilities/_variables.scss`](https://github.com/jlbelanger/galleri/blob/main/scss/utilities/_variables.scss). To override these settings, re-define the variables in the SCSS file in the `scss` folder, then follow the instructions below to compile the SCSS changes.

In your project directory, run the following command to install SCSS dependencies:

``` bash
yarn install
```

Then, to re-compile the `public/*.min.css` file whenever changes are made to the `scss/*.scss` files, run the following command:

``` bash
yarn start
```

Alternately, to re-compile the `public/*.min.css` file once, without watching for changes, run:

``` bash
yarn build
```

## Development

If you want to make changes to the base Galleri package (rather than just changing configuration settings):

### Requirements

- [Composer](https://getcomposer.org/)
- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- Web server with PHP

### Setup

``` bash
# Clone the repo
git clone https://github.com/jlbelanger/galleri.git
cd galleri

# Configure the environment settings
cp cypress.config.example.js cypress.config.js
cp cypress.env.example.json cypress.env.json

# Install dependencies
yarn install
composer install
```

Create a Galleri project using the regular [setup](#setup). Then, in the project folder's `composer.json` file, change `repositories`:

``` json
"repositories": [
	{
		"type": "path",
		"url": "../galleri",
		"options": {
			"symlink": true
		}
	}
]
```

In the project folder's `package.json` file, change the galleri line in `dependencies`:

``` json
"dependencies": {
	"@jlbelanger/galleri": "link:../galleri"
}
```

In the project folder, run:

``` bash
composer update jlbelanger/galleri
yarn install
```

### Run

In the `galleri` folder, run:

``` bash
yarn start
```

In the project folder, run:

``` bash
yarn start
```

### Lint

In the `galleri` folder, run:

``` bash
./vendor/bin/phpcs
yarn lint
```

### Test

In the `galleri` folder, run:

``` bash
./vendor/bin/phpunit
yarn test:cypress
```

### Package

In the `galleri` folder, run:

``` bash
yarn build
```

## Minimal setup

Create an HTML file. Include the Galleri CSS and JS files, an empty element, and a JS call to `Galleri.init()`, passing in a CSS selector for the empty element in which the gallery should be displayed.

``` html
<link rel="stylesheet" href="galleri.min.css">
<div id="galleri"></div>
<script src="galleri.min.js"></script>
<script>Galleri.init({ selector: '#galleri' });</script>
```

To enable authentication and allow images to be managed from the frontend, also include a `<button>` with the attribute `data-action="authenticate"`.

``` html
<button data-action="authenticate" type="button"></button>
```

Create a `composer.json` file and add `jlbelanger/galleri` as a dependency.

Create a PHP file that calls `Jlbelanger\Galleri\Router::load()`.

``` php
<?php

require_once realpath(__DIR__ . '/../vendor/autoload.php');

// Optional: You can set the environment variables another way if you choose.
// If you don't want to use a .env file, run `composer remove vlucas/phpdotenv` and remove the two lines below.
$dotenv = Dotenv\Dotenv::createImmutable(realpath(__DIR__ . '/../'));
$dotenv->load();

Jlbelanger\Galleri\Router::load();
```

## Credits

- Debounce: https://davidwalsh.name/javascript-debounce-function
- Favicon: https://useiconic.com/open
- Masonry grid: https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
- Normalize: https://github.com/necolas/normalize.css
