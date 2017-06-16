# Frontend boilerplate

This is a boilerplate designed primarily for **beginners** learning web development.
It's built for developing with HTML, SASS and ES6.

### Requirements
- Node
- Npm

### Instructions
- Clone or download the repository
- Run `npm install`

### Who should use this?
If you're beginning to start developing websites or web applications on your own
and terms like minification, sprites or asset optimisation confuse you.

### How to use this?
Have a look at the [directory structure](#file-structure). Use the `src` files
to develop the application. The optimised version will be created in the
`dist` directory. How exactly this is done is explained [here](#details).

The most important thing to do when you start developing using this boilerplate
is to `open the terminal` and point to its location using `cd *file path*`, once
the terminal is open at the required path. Run the command `gulp watch`.

This will allow you to develop the application with live reloading when changes
are made to HTML, CSS and Javascript files. It will also optimise newly added
images. Other tasks can be manually performed and are explained [here](#here).

### Motivations for creating the boilerplate
Having completed a few based web projects, I began to look at best practices online,
regularly caming across terms such as those mentioned above. I was totally confused,
and decided I would learn about some of these processes. I settled on using `gulp` to
perform these tasks. This started out as a knowledge gap filler, and turned into
a hands on gulp project. At the end of it, I figured this might benefit beginners
who were in my position.

### File Structure

```
├── dist/
|   └── css/
|   |   └── main.min.css
|   |   └── sprite.png
|   └── img/
|   |   └── image-1.png
|   |   └── image-2.png
|   |   └── image-3.png
|   └── js/
|   |   └── bundle.js
|   └── index.html
|   └── about.html
├── src/
|   ├── html/
|   |   └── partials/
|   |   |   └── _partials/_partial1.html
|   |   └── about.html
|   |   └── index.html
|   └── img/
|   |   └── image-1.png
|   |   └── image-2.png
|   |   └── image-3.png
|   └── js
|   |   └── module/
|   |   └── app.js
|   └── sass
|   |   └── base/
|   |   └── components/
|   |   └── helpers/
|   |   └── layout/
|   |   └── pages/
|   |   └── vendor/
|   |   └── main.sass
|   ├── README.md
├── .gitignore
├── gulpfile.js
├── package.json
├── README.md
```

### Tasks explained

The magic of the boilerplate is all in `gulpfile.js`. This performs all of the
tasks via `gulp *task*` commands run in the terminal (given its pointing at
the project directory). So for example, to perform a task called `html-minify`,
run `gulp html-minify` in the terminal.

The tasks can be broken down into those associated with:

- HTML
- CSS
- Javascript
- Images

Along with this, there is a task that handles deploying the web application to
github pages (useful for showcasing work for your portfolio). Implementing a
server with hot reloading is also handled here, this creates a
development environment similar to online platforms like codepen.

#### HTML
If you look in the `src/html/` directory you will notice a `partials` folder. This will allow you to split up your pages into components as you wish.
An example of this is shown here

`index.html`

``` html

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title></title>
</head>

<body>

    <partial src="_partial1.html" data="partial data transfer"></partial>

</body>

</html>

```

`_partial1.html`

``` html
<div class="partial">

    <div>@@data</div>

</div>

```

There is a task that will take these partials and embed them into your main html
pages located in the `dist` directory.

There is also a minification task, that will remove whitespace in your HTML files, and help to make your website run faster.

#### CSS
If you look at the [directory structure](#file-structure) above, you will notice
their is a `sass` folder in src and `css` folder in dist. This is because I prefer (and you may too) to write my CSS using SASS. When starting with SASS, it can be confusing on how best to optimise your workflow, therefore I have set up the SASS directory with a commonly use 7-1 architecture pattern. More details of this can be found [here](https://scotch.io/tutorials/aesthetic-sass-1-architecture-and-style-organization).

The SASS compile task handles many things that will help your workflow, firstly it has an **autoprefixer** which means no more code like below needs to be written.

``` css
-webkit-transform: translate(100px) rotate(20deg);
```

It also has a **bulk imports** for SASS, which allow you to import entire directories instead of each individual file. The following code shown in `main.sass` will import all files located in the base directory.

``` sass
@import 'base/*'
```

**Sourcemaps** are also created, this is especially important as it will trace back the code to its original file, helping when you debug in the browser.

The SASS will be compiled and minified into the dist directory as `main.min.css`.

One of the best features of the boilerplate with regards to how it handles your styles, is that I have set up a purification task that will be performed with the command `gulp build`. This will locate unused CSS and remove it from `main.min.css`. If you use libraries such as bootstrap, this can save up an overwhelming amount of code, speeding up your websites dramatically.

#### Javscript
Having done a lot of research, I decided to make the commitment to using ES6 from now on, and have set up the boilerplate to use it too. If you are unfamiliar with this, I highly recommend you read about it. The javascript task will essentially convert the ES6 you write into 'regular' Javascript that web browsers can understand, allowing you to capitalise on new features in ES6. Just like the CSS purification, I have set up a optimizer which is performed with `gulp build`.

#### Images
For the images, I have provided two options, firstly, you can simply use the images which will be minified from the src directory and located in the dist directory, this will reduce the size of your images without affecting their quality.

The second option, is to use sprites. These will essentially combine all of the images in the src/img directory into a single image file, sort of like a mosaic. Along with this large image file, an associated CSS/SASS file will be generated which will produce the necessary CSS to dissect the sprite file. The result of using this method, is fewer requests to retrieve files and a much faster website depending on how many images are used.

I have set the sprite generating tasks to work with SASS, therefore all you need to do to use the images via sprites, is to apply the name of the file as a class attribute. For example the following code will produce `image-1.png` as if you used an `img` tag.

``` html
<div class="image-1"></div>
```

The SASS generated is located here `src/sass/helpers/_sprite-sheet.sass`. I have abstracted this by creating the `src/sass/helpers/_sprite.sass` file which imports the necessary code (from the confusing sprite_sheet).

#### Others
There is a deploy task which when run using `gulp deploy` will add the webpage to github pages, this can be viewed at the following url `username.github.io/repo-name`. This will allow you to host your static projects helping to demonstrate your abilities to prospective employers.

I recommend running the `gulp build` task before deploying, as this will ensure all your code is optmised and ready to go.
