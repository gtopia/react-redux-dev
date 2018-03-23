# React webpack boilerplate

## Start  
* Prerequisite  
    1. Install Node 8+ from [here](https://nodejs.org/en/)
    2. `git clone https://github.com/gtopia/react-webpack-boilerplate.git`
    3. `cd react-webpack-boilerplate`
    4. `npm install`

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
* Express
* ImmutableJS
* React
* React-router
* Redux
* Webpack


## Features  
* Babel
* CSS Autoprefixer
* CSS Sprite
* Commons Chunk
* Display errors with Redbox
* ES6
* Eslint
* Extract CSS
* File Hash
* HMR
* Image Compress
* Modularized HTML
* Sass
* Swiper
* Uglify code with Babili


## Change log  
* v2.0.0 : Refactor project, only leave a simple demo.
* v1.1.0 : Upgrade react, react-dom, immutable and prop-types to latest version for MIT license. Upgrade node-sass to v4.5.3 in order to compatible with Node 8.x.
* v1.0.0 : Update webpack entry libs.
* v0.5.0 : Upgrade react-router to v4. Upgrade react to v15.6.
* v0.4.6 : Upgrade webpack to v3.
* v0.4.5 : Add babel-plugin-transform-remove-console.
* v0.4.4 : Fixed React.PropTypes deprecated issue of React.
* v0.4.3 : Upgrade react-router to v2.x. Update react-router config.
* v0.4.2 : Remove art-template-loader.
* v0.4.1 : Import classnames for conditionally joining classNames together.
* v0.4.0 : Use webpack-spritesmith to make CSS sprite.
* v0.3.0 : Add image-webpack-loader to compress images.
* v0.2.0 : Add file hash when bundling for production.
* v0.1.4 : Remove base tag from index HTML, update publicPath.
* v0.1.3 : Replace tmodjs with art-template for performance issue.
* v0.1.2 : Optimize bundling, add utils and external libs.
* v0.1.1 : Use BabiliPlugin instead of UglifyJsPlugin to minify ES6 code.
* v0.1.0 : Upgrade webpack to v2.
* v0.0.2 : Update webpack config.
* v0.0.1 : First commit.
