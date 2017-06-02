# Eagle.js - A slideshow framework for hackers

Eagle.js is a slideshow system built on top of the [Vue.js](https://vuejs.org/) web framework.
It supports animations, themes, interactive widgets (for web demos),
and makes it easy to reuse components, slides and styles across presentations. For a quick tour, see [this slideshow](https://zulko.github.io/eaglejs-demo/#/introducing-eagle):

[![screenshot](https://raw.githubusercontent.com/Zulko/eagle.js/master/screenshot.jpg)](https://zulko.github.io/eaglejs-demo/#/introducing-eagle)

Most of all, Eagle.js aims at offering a simple and very hackable API so you
can get off the beaten tracks and craft the slideshows you really want.

Here is what the Eagle.js syntax looks like (using [Pug](https://pugjs.org/api/getting-started.html)):
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

If you are not familiar with Vue.js you will find Eagle.js harder to use than, say, [Reveal.js](https://github.com/hakimel/reveal.js/), but on the long term Eagle.js makes it easier to organize your slides and implement new ideas.

## Get started

You must have Node.js/npm installed to use Eagle.js.

Then the best to get started is to clone the example repo:
``` bash
$ git clone https://github.com/Zulko/eaglejs-demo.git
```

Install the dependencies (they will only be downloaded in a local folder):
```bash
$ cd eaglejs-demo
$ npm install
```

Then run ```npm run dev``` to start the server, and open your browser at [http://localhost:8080](http://localhost:8080) to see the slideshows.

To start editing, click on ``My first slideshow`` to display this slideshow, then open the file ``eagle/src/slideshows/first-slideshow/FirstSlideshow.vue`` and change the content of the first slide. Observe the changes happen automatically in your browser. The only times you need to refresh the page is when you add remove or add slides to the presentation.

## Configuration

You can configure your slides with these properties:

| Property             | Default         | Description                               |
| -------------------- | --------------- | ----------------------------------------- |
| `skip`               | `false`         |                                           |
| `enter`              | `null`          | Default enter animation                   |
| `leave`              | `null`          | Default leave animation                   |
| `steps`              | `1`             | Default steps per slide                   |
| `mouseNavigation`    | `true`          | Navigate with mouse click or scroll event |
| `keyboardNavigation` | `true`          | Navigate with keyboard                    |

### Usage example

```js
props: {
  mouseNavigation: {default: false},
  keyboardNavigation: {default: true}
}
```

## Contribute

Eagle.js is an open source framework originally written by [Zulko](https://github.com/Zulko) and released on [Github](https://github.com/Zulko/eagle.js) under the ISC licence. Everyone is welcome to contribute!

Below are a few ideas that deserve more attention in the future:

- Bundler to make standalone HTML presentations
- PDF export?
- Themes
- Better docs? (What do JavaScript people use to write docs?)
