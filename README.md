# Frontend boilerplate

This is a boilerplate designed primarily for **beginners** learning web development. It's built for developing with HTML, SASS and ES6.

#### Requirements
- Node
- Npm

#### Instructions
- Clone or download the repository
- Run `npm install`

#### Structure

```
├── dist/
|   └── css/
|   |   └── module/
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

Gulp will be used to concatenate, minify and purify the files which will then be located in the `dist` directory.

In order to use this boilerplate, `clone` the repository and run `npm install`.
