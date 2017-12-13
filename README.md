<p align="center">
<img alt="Eagle.js" title="Eagle.js" src="https://raw.githubusercontent.com/yaodingyd/eagle.js/master/img/logo.png" width="150">
</p>
<h1 align="center">Eagle.js - A slideshow framework for hackers</h1>

- Slideshow system built on top of the [Vue.js](https://vuejs.org/)
- Supports animations, themes, interactive widgets (for web demos)
- Easy to reuse components, slides and styles across presentations
- All APIs public, maximum hackability 

### For a quick tour, see [this slideshow](https://zulko.github.io/eaglejs-demo/#/introducing-eagle):

<p align="center"><a href="https://zulko.github.io/eaglejs-demo/#/introducing-eagle" target="_blank"><img alt="screenshot" src="https://raw.githubusercontent.com/Zulko/eagle.js/master/img/screenshot.jpg"></a></p>


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

## Install

Install by npm

```bash
npm install --save eagle.js
```

Or install by yarn

```bash
yarn add eagle.js
```

## Usage

Eagle.js is a vue plugin. You need to `use` eagle.js in your vue app's main file:

```javascript
import Eagle from 'eagle.js'
// import eagle.js default styles
import 'eagle.js/dist/eagle.css'

Vue.use(Eagle)
```

### Basic idea

Eagle.js's basic components are `slideshow` and `slide`. You use `slideshow` as mixin to write `slideshow` component, which could include multiple `slide`s. A very basic Single File Component for `slideshow` would look like this:

``` vue
<template lang="pug">
    slide(:steps="4")
      p(v-if="step >= 1")
        | {{step}}
      p(v-if="step >= 2")
        | {{step}}
      p(v-if="step >= 3")
        | {{step}}
      p(v-if="step >= 4")
        | {{step}}
</template>

<script>
import eagle from 'eagle.js'
export default {
  mixins: [eagle.slideshow]
}
</script>
```

We use `slideshow`'s data `step` to control the conditional rendering in `slide`, thus `slideshow` is used as a mixin. Also by this way eagle.js exposes the maximum hackability to users.

### slideshow

`slideshow` can only be used as mixin. 

*Note*: For vue mixins, template cannot be extended. `slideshow` needs one HTML element to wrap around your following `slide`s because there are events registered to `slideshow` after component mounted. **We recommend you to wrap your template in a `eg-slideshow` div for default styling.** 

You can configure your authored `slideshow` component with these properties: 

| Property             | Default         | Description                                               |
| -------------------- | --------------- | --------------------------------------------------------- |
| `firstslide`         | `1`             |                                                           |
| `lastslide`          | `null`          |                                                           |
| `startStep`          | `1`             |                                                           | 
| `mouseNavigation`    | `true`          | Navigate with mouse click or scroll event                 |
| `keyboardNavigation` | `true`          | Navigate with keyboard                                    |
| `embedded`           | `false`         |                                                           |
| `inserted`           | `false`         |                                                           |
| `onStartExit`        | `null`          | event callback for exiting slideshow through first slide  |
| `onEndExit`          | `null`          | event callback for exiting slideshow through last slide   |
| `backBySlide`        | `false`         | slideshow navigates back by step by default               |

More explaination on `backBySlide`:

By default, slideshow navigates back by step, but you can change the behavior to be slide based: so if you go back to the previous slide, it lands on the first step instead of last step. See a comparison:

|Back by Step: |Back by slide:|
|--------------|--------------|
|![back by step](https://raw.githubusercontent.com/Zulko/eagle.js/master/img/backbystep.gif)|![back by slide](https://raw.githubusercontent.com/Zulko/eagle.js/master/img/backbyslide.gif)|

Please note, if you have any embedded slideshows, you have to use default back mode, because for now parent slideshow cannot know how many steps child slideshow backs. This is a feature to be implemented in the future.

#### Nested slideshow

A nested slideshow can be a `inserted` one or a `embedded` one. A `embedded slideshow` would its own events and embedded styles, while a `inserted slideshow` does not.  


### slide

`slide` can be used both as mixin or component. If your want to author a complex `slide`, writing it as a seperated SFC with `slide` mixin would really help. Including the following template(pug) as wrapper in your `slide` component to keep the default style:

```pug
eg-transition(:enter='enter', :leave='leave')
  .eg-slide(v-if='active')
    .eg-slide-content
      // Your own markup...
```

You can configure `slide` with these properties:

| Property             | Default         | Description                               |
| -------------------- | --------------- | ----------------------------------------- |
| `skip`               | `false`         |                                           |
| `enter`              | `null`          | Default enter animation                   |
| `enterPrev`          | `null`          | Enter animation for prev direction        |
| `enterNext`          | `null`          | Enter animation for next direction        |
| `leave`              | `null`          | Default leave animation                   |
| `leavePrev`          | `null`          | Leave animation for prev direction        |
| `leaveNext`          | `null`          | Leave animation for next direction        |
| `steps`              | `1`             | Total steps for this slide                |
| `mouseNavigation`    | `true`          | Navigate with mouse click or scroll event |
| `keyboardNavigation` | `true`          | Navigate with keyboard                    |

`enterPrev`, `enterNext`, `leavePrev` and `leaveNext` provides flexibility if you want to customize the animation for prev/next direction. If set to null they will use default `enter` and `leave` styles.

*Note:* `enter` and `leave` must be set in pairs. Don't only set one property, because `slide` has two directions to move: prev/next, and both directions needs animations. **We recommend either you set animation for all your `slide` on both `enter` and `leave`, or don't set any at all.**

### eg-transition

Under the hood, `eg-transition` is just vue's `transition` will support for [animate.css](https://daneden.github.io/animate.css/): you can use animate.css's class name for `enter` and `leave` property and it just works. All eagle.js's transition effects, including `slide`,  happen with this component, and you can use it just like using vue's `transition`.

### Other components

Eagle.js ships several useful widgets that can be used in your `slide`:
1. `eg-modal`
2. `eg-code-block` (code highlighted by [highlight.js](https://highlightjs.org/))
3. `eg-code-comment`
4. `eg-toggle`
5. `eg-radio`
6. `eg-triggered-message`

See their usage in the [demo project](https://github.com/Zulko/eaglejs-demo).

### Events

As you can see in `slideshow` configuration, eagle.js supports mouse and button event, but doesn't have built-in support for mobile gestures. Still, it is very easy to add mobile support with a well-tested library(like hammer.js). You can see example [here]().

## Contribute

Eagle.js is an open source framework originally written by [Zulko](https://github.com/Zulko) and released on [Github](https://github.com/Zulko/eagle.js) under the ISC licence. Everyone is welcome to contribute!

Below are a few ideas that deserve more attention in the future:

- Bundler to make standalone HTML presentations
- PDF export?
- Themes
- Better docs? (What do JavaScript people use to write docs?)

## Maintainers
1. [Zulko](https://github.com/Zulko)(owner)
2. [Yao Ding](https://github.com/yaodingyd)
