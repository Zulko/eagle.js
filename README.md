# Eagle.js - Slideshows for hackers.

Eagle.js is a web-based slideshow framework built with [Vue.js](https://vuejs.org/). It lets you write presentations with a simple syntax, include interactive elements, and easily reuse styles, slides, and other components between presentations. Have a look at [this demo presentation]() for a quick tour.

Eagle has most features you may expect from a slideshow (themes, transitions, animated figures, and much more) while keeping a very simple syntax. Here is what your two first slides may look like:

```pug
slide
  h1 My slideshow
  h4 By Zulko

slide
  h3 Title of this slide
  p Paragraph 1.
  p Paragraph 2.
```

If you are not familiar with Vue.js you will find Eagle harder to use than, say, [Reveal.js](https://github.com/hakimel/reveal.js/), but on the long term Eagle makes it easier to organize your slides and get off the beaten tracks to craft the high-end slideshows you really want.

## Getting started

You must have Node/NPM installed to use Eagle.js.

Then the best to get started is to clone the example repo:
``` bash
git clone zulko/eaglejs
```

Install the dependencies (they will only be downloaded in a local folder):
```bash
cd eaglejs
npm install
```

Then run ```npm run dev``` to start the server, and open your browser at [http://loacalhost:8080](http://loacalhost:8080) to see the slideshows.

To start editing, click on ``My first slideshow`` to display this slideshow, then open the file ``eagle/src/slideshows/first-slideshow/FirstSlideshow.vue`` and change the content of the first slide. Observe the changes happen automatically in your browser. The only times you need to refresh the page is when you add remove or add slides to the presentation.

## Plans:

Automatic pdf export with
  npm build pdf presentation name

bundle with inliner
