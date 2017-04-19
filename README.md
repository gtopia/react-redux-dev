# React Redux Dev

## Start  
* Prerequisite  
    `npm install`  

* Develop locally with HMR  
    `npm run dev`  
    _This command won't generate any folder under root directory._  

* Check bundling with detail info under watch mode  
    `npm run build-dev`  
    _This command will generate 'build' folder under root directory._  

* Bundle for publish  
    `npm run build`  
    _This command will generate 'dist' folder under root directory._  


## Tech stack  
* React
* Redux
* ImmutableJS
* Express
* Webpack2


## Features  
* Art Template
* CSS Autoprefixer
* Commons Chunk
* Display errors with Redbox
* ES6
* Eslint
* Extract CSS
* File Hash
* HMR
* Modularized HTML
* Sass
* Uglify code with Babili


## TODO  
* CSS Sprite
* Image Compress


## Change Log  
* tagv0.08 : Add file hash when bundling for production.
* tagv0.07 : Remove base tag from index HTML, update publicPath.
* tagv0.06 : Replace tmodjs with art-template for performance issue.
* tagv0.05 : Optimize bundling, add utils and external libs.
* tagv0.04 : Use BabiliPlugin instead of UglifyJsPlugin to minify ES6 code.
* tagv0.03 : Upgrade webpack to v2.
* tagv0.02 : Update webpack config.
* tagv0.01 : First commit.
