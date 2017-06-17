# Frontend boilerplate

This is a boilerplate designed primarily for **beginners** learning web development.
It's built for developing with HTML (including partials), SASS and ES6.

### Requirements
- Node
- Npm

### Instructions
- Clone or download the repository
- Run `npm install`
- Read [this](#how-to-use-this)

### Who should use this?
If you're beginning your journer in web development
and don't know where to start as far as optimising your webpages. This is a
boilerplate that will handle a lot of these tasks. All you need to do is code!

### How to use this?
Firstly, take a look at the [directory structure](#file-structure).
The `src` directory should be used to develop the application.
When you want to optimise your website, it will be located in the
`dist` directory. How exactly this is done is explained [here](#tasks-explained).

**The most important thing to do** when you developing using this boilerplate
is to `open the terminal` and point to its location using `cd *file path*`, once
the terminal is open at the required path. Run the command `gulp watch`.

This will allow you to develop the application with live reloading, reflecting
the changes made to your HTML, CSS and Javascript files. This is similar to
online code editors like Codepen.

### Motivations for creating the boilerplate
Having completed a few based web development projects, I decided that I needed
to utilise more best practices. Whilst searching, I regularly came across terms
such as those minification, purification and module bundling etc...

I was totally confused, and decided I would learn about some of these processes.
I settled on using `gulp` to learn about these tasks.

After playing around with gulp for a couple of weeks, I decided it might benefit
others to leave this out there for people who might have been in my position.

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

The magic of this boilerplate is all in `gulpfile.js`. This performs all of the
tasks via `gulp *task*` commands ran in the terminal (given its pointing at
the project directory).
So for example, to perform a task called `html-minify`, run `gulp html-minify`
in the terminal.

The tasks can be broken down into those associated with:

- HTML
- CSS
- Javascript
- Images

As well as this, I have provided a task that will deploy the web application to
github pages (useful for showcasing work for your portfolio). More on this
[here](#others).

#### HTML
If you look in the `src/html/` directory you will notice a `partials` folder.
This is a simple way of breaking up your HTML files into components, for example
if you wanted to neaten up all of your script tags etc..

An example of how to use it is shown below...

`index.html`

``` html

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title></title>
</head>

<body>

    <!-- Ths data attribute can be accessed in the partial file as @@data -->
    <partial src="_partial1.html" data="partial data transfer"></partial>

</body>

</html>

```

`_partial1.html`

``` html
<div class="partial">

    <!-- This will print "partial data transfer" -->
    <div>@@data</div>

</div>

```

There is a task that will take these partials and embed them into your main html
pages located in the `dist` directory.

For optimisation, a HTML minification has beena added. This will
remove whitespace in your HTML files, helping to speed up your pages.

#### CSS
If you look at the [directory structure](#file-structure) above, you will notice
their is a `sass` folder in the src directory and `css` folder in dist.
This is because I prefer (and you may also) to write my CSS using the SASS preprocessor.

When beginning with SASS, it can be confusing on how best to optimise your styles,
therefore I have set up the SASS directory with the commonly used
7-1 architecture pattern.
More details on this can be found [here](https://scotch.io/tutorials/aesthetic-sass-1-architecture-and-style-organization).

The SASS compile task handles many things that will make your workflow easier.
Firstly it has an **autoprefixer** which means no more code like below needs to be written.

``` css
-webkit-transform: translate(100px) rotate(20deg);
-moz-transform: translate(100px) rotate(20deg);
-ms-transform: translate(100px) rotate(20deg);
```

It also has a **bulk imports** for SASS, which allow you to import entire
directories instead of each individual file.
The following code shown in `main.sass` will import all files located in the base directory.

``` sass
@import 'base/*'
```

**Sourcemaps** are also created, this is important as it will trace back the
code to its original file, helping when debugging in the browser.

The SASS will be compiled and minified into the dist directory as `main.min.css`.

Possibly my favourite features of this boilerplate is the purification task.
This is run with the command `gulp build`.
It will locate unused CSS by analysing the HTML and Javascript files and remove
it from the main stylesheet i.e `main.min.css`.
If you use libraries such as bootstrap, this can reduce your CSS file massively.

#### Javscript
After a lot of research, I recently made the commitment to using ES6 moving forward
because of this, I have set up the boilerplate to use it also.
If you are unfamiliar with the newer version of Javascript, I highly recommend you read up on it.
The javascript task will essentially convert the ES6 you write into
'regular' Javascript that web browsers can understand,
allowing you to capitalise on new features in ES6.

#### Images
For the images, I have provided two options.

Firstly, you can simply use the images, which will be
optimised via minification (the original images will be located in the src
directory, and the optimised versions found in the dist directory).
This will reduce the size of your images without affecting their quality. Saving
on valuable memory.

The second option, is to use sprites. These will essentially combine all of the
images in the src/img directory into a single image file, sort of like a mosaic.
With this large sprite file, an associated CSS/SASS file will be generated.

This stylesheet will produce the necessary CSS to dissect the sprite file into
each seperate image. The result of using the sprite file, is fewer requests
to retrieve files and a much faster website depending on how many images are used.

I have set the sprite generating tasks to work with SASS, therefore all you
need to do to use the images this way is to apply the name of the file as
a class attribute to your HTML tag.

For example, the following code will produce `image-1.png` as
if you used an `img` tag.

``` html
<div class="image-1"></div>
```

The SASS generated is located here `src/sass/helpers/_sprite-sheet.sass`.

I have abstracted this by creating the `src/sass/helpers/_sprite.sass` file
which imports the necessary code (from the confusing sprite_sheet).

#### Others
There is a deploy task which when run using `gulp deploy` will add the webpage
to github pages, this can be viewed at the following
url `username.github.io/repo-name`. This will let you host your static
projects on github.

I recommend running the `gulp build` task before deploying,
as this will ensure all your code is optmised and ready to go.
