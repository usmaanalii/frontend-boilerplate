# Frontend boilerplate

This is a boilerplate designed primarily for **beginners** learning web development.
It's built for developing with HTML, SASS and ES6.

#### Requirements
- Node
- Npm

#### Instructions
- Clone or download the repository
- Run `npm install`

#### Who should use this?
If you're beginning to start developing websites or web applications on your own
and terms like minification, sprites or asset optimisation confuse you.

#### How to use this?
Have a look at the [directory structure](#file-structure). Use the `src` files
to develop the application. The optimised version will be created in the
`dist` directory. How exactly this is done is explained [here](#details).

The most important thing to do when you start developing using this boilerplate
is to `open the terminal` and point to its location using `cd *file path*`, once
the terminal is open at the required path. Run the command `gulp watch`.

This will allow you to develop the application with live reloading when changes
are made to HTML, CSS and Javascript files. It will also optimise newly added
images. Other tasks can be manually performed and are explained [here](#here).

#### Motivations for creating the boilerplate
Having completed a few based web projects, I began to look at best practices online,
regularly caming across terms such as those mentioned above. I was totally confused,
and decided I would learn about some of these processes. I settled on using `gulp` to
perform these tasks. This started out as a knowledge gap filler, and turned into
a hands on gulp project. At the end of it, I figured this might benefit beginners
who were in my position.

#### File Structure

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
