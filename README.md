# Robroy Photo Gallery

Robroy Photo Gallery is a databaseless vanilla JavaScript and vanilla PHP photo gallery. Image data is read from the filesystem and cached in JSON files, and authentication is handled through HTTP basic auth.

## Demo

https://robroy.jennybelanger.com/

## Features

- upload and delete images from a web interface
- group images into folders and subfolders
- create thumbnails automatically
- watermark images automatically
- resize images automatically
- load images with infinite scroll
- specify image alt tags

## Requirements

- Apache (other servers would presumably work too, but I've only tested with Apache)
- PHP (tested with version 7.4)
- [Composer](https://getcomposer.org/)

## Setup

Run:

``` bash
composer create-project jlbelanger/robroy-project gallery2 --repository '{"type":"vcs","url":"git@github.com:jlbelanger/robroy-project.git"}' --stability dev
```

The setup script will prompt you to configure various settings.

## How it works

In the HTML file, you need to include the Robroy CSS and JS files, an empty element, and a JS call to `Robroy.default.init()`, passing in a CSS selector for the empty element in which the gallery should be displayed.

``` html
<link rel="stylesheet" href="robroy.min.css">
<div id="robroy"></div>
<script src="robroy.min.js"></script>
<script>Robroy.default.init({ selector: '#robroy' });</script>
```

If you want to enable authentication and allow managing images from the frontend, you'll also need a `<button>` with the attribute `data-action="authenticate"`.

``` html
<button data-action="authenticate" type="button"></button>
```

You'll also need a PHP file that calls `Jlbelanger\Robroy\Router::load()`.

``` php
<?php

require_once realpath(__DIR__ . '/../vendor/autoload.php');

// Optional: You can set the environment variables another way if you choose.
// If you don't want to use a .env file, run `composer remove vlucas/phpdotenv` and remove the two lines below.
$dotenv = Dotenv\Dotenv::createImmutable(realpath(__DIR__ . '/../'));
$dotenv->load();

Jlbelanger\Robroy\Router::load();
```

## Configuration

### PHP

PHP configuration options are defined in [`.env.example`](https://github.com/jlbelanger/robroy-project/blob/main/.env.example). Make your changes in the `.env` file created by the setup script (rather than in `.env.example`).

### JS

JS configuration options are defined in [`public/index.html`](https://github.com/jlbelanger/robroy-project/blob/main/public/index.html). Make your changes in the `public/index.html` file created by the setup script.

### SCSS

SCSS configuration options are defined in [`scss/utilities/_variables.scss`](https://github.com/jlbelanger/robroy/blob/main/scss/utilities/_variables.scss). To override these settings, re-define the variables in the SCSS file in the `scss` folder.

Follow the instructions below to compile the SCSS changes.

In your project directory, run the following command to install SCSS dependencies:

``` bash
yarn install
```

Then, to re-compile the `public/*.min.css` file whenever there are changes in `scss/*.scss`, run the following command:

``` bash
yarn watch
```

Alternately, to re-compile the `public/*.min.css` file without watching for changes, run:

``` bash
yarn build
```

## Development

### Requirements

- [Composer](https://getcomposer.org/)
- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- Web server with PHP

### Setup

``` bash
# Clone the repo
git clone https://github.com/jlbelanger/robroy.git
cd robroy

# Configure the environment settings
cp cypress.example.json cypress.json
cp cypress.env.example.json cypress.env.json

# Install dependencies
yarn install
composer install
```

Create a Robroy project using the regular setup steps above. Then, in the project folder's `composer.json` file, change `repositories`:

``` json
"repositories": [
	{
		"type": "path",
		"url": "../robroy",
		"options": {
			"symlink": true
		}
	}
]
```

In the project folder's `package.json` file, change the robroy line in `dependencies`:

``` json
	"dependencies": {
		"@jlbelanger/robroy": "link:../robroy"
	}
```

In the project folder, run:

``` bash
yarn install
composer update jlbelanger/robroy
```

### Run

In the `robroy` folder, run:

``` bash
yarn watch:js
```

In the project folder, run:

``` bash
yarn watch
```

### Lint

In the `robroy` folder, run:

``` bash
./vendor/bin/phpcs
yarn lint
```

### Test

In the `robroy` folder, run:

``` bash
./vendor/bin/phpunit
yarn test:cypress
```

### Package

In the `robroy` folder, run:

``` bash
yarn build
```

## Credits

- Debounce: https://davidwalsh.name/javascript-debounce-function
- Favicon: https://useiconic.com/open
- Lightbox: https://github.com/banthagroup/fslightbox
- Masonry grid: https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
- Normalize: https://github.com/necolas/normalize.css
