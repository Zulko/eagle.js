# Eagle.js - Slideshows for hackers.

Eagle.js is a web-based slideshow framework built with [Vue.js](https://vuejs.org/). It lets you write presentations with a simple syntax, include interactive elements, and easily reuse styles, slides, and other components between presentations. Have a look at [this demo presentation] for a quick tour.

Eagle enables all you may expect from a slideshow (themes, transitions, animated figures, and much more if you code it) while keeping a very simple syntax. Here is what your two first slides may look like:

```pug
slide
  h1 My slideshow
  h4 By Zulko

slide
  h3 Title of this slide
  p Paragraph 1.
  p Paragraph 2.
```

If you are not familiar with Vue.js you will find Eagle harder to use than, say, [Reveal.js](https://github.com/hakimel/reveal.js/), but on the long term Eagle is meant to make it easier to organize your slides and get off the beaten tracks to craft the high-end slideshows you really want.

## Getting started

First, install npm (that may depend on your system).

Then clone this repo and install its dependencies (they will only be downloaded in a local folder):
``` bash
git clone zulko/eaglejs
cd eaglejs
npm install
npm run dev
```

Then run ```npm run dev``` to start serving and open your browser at [http://loacalhost:8080](http://loacalhost:8080) to see the slideshows.

To start editing, click on ``My first slidehsow`` to display this slideshow, then open the file ``eagle/src/slideshows/first-slideshow/FirstSlideshow.vue`` and change the content of the first slide. Observe the changes being made automatically in
your browser
 slideshow which will serve your presentation with hot-reload (meaning changes you make in the source are directly)
```


npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Plans:

Automatic pdf export with
  npm build pdf presentation name

Fancy summary page

Reusable slides

bundle with inliner
