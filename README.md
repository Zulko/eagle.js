# Eagle.js - A slideshow framework for hackers

Eagle.js is a slideshow system built on top of the web framefork [Vue.js](https://vuejs.org/).
It supports animations, themes, interactive widgets (for web demos),
and makes it easy to reuse components, slides and styles across presentations.

Most of all, Eagle aims at offering a simple and very hackable API so you
can get off the beaten tracks and craft the slideshows you really want.

Here is what the Eagle syntax looks like (using Pug):
```pug
.eg-slideshow
    slide
      h1 My slideshow
      h4 By Zulko

    slide
      h3 Title of this slide
      p  Paragraph 1.
      p  Paragraph 2.

    slide(:steps=3)
      h3 Slide with bullet points
      p(v-if='step >= 2') This will appear first.
      p(v-if='step >= 3') This will appear second.
```

If you are not familiar with Vue.js you will find Eagle harder to use than, say, [Reveal.js](https://github.com/hakimel/reveal.js/), but on the long term Eagle makes it easier to organize your slides and implement new ideas.

## Get started

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

Then run ```npm run dev``` to start the server, and open your browser at [http://localhost:8080](http://localhost:8080) to see the slideshows.

To start editing, click on ``My first slideshow`` to display this slideshow, then open the file ``eagle/src/slideshows/first-slideshow/FirstSlideshow.vue`` and change the content of the first slide. Observe the changes happen automatically in your browser. The only times you need to refresh the page is when you add remove or add slides to the presentation.

## Contribute

Eagle.JS is an open source framework originally written by [Zulko](https://github.com/Zulko) and released on [Github]() under the ISC licence. Everyone is welcome to contribute ! Below are a few ideas that would deserve attention:

- Bundler to make standalone HTML presentations
- PDF export ?
- Themes
