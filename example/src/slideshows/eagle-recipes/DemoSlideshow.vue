<template lang="pug">
#DemoSlideshow
  .eg-slideshow
    slide
      h2 Hi there !
      p I am slide 1

    slide
      h2 Hi again !
      p I am slide 2

    slide
      h2 Hi third !
      p I am slide 3

    slide(enter='fadeIn' leave='fadeOut')
      h2 I'm a fading slide!
      p I fade in and fade away

    slide(enter='bounceInRight' leave='bounceOutLeft')
      h2 I'm a bouncing slide
      p I bounce in and out

    slide(:steps=4)
      h3 How to impress people

      p(v-if='step >= 2') Wear bright colors
      p(v-if='step >= 3') Learn to juggle
      p(v-if='step >= 4') Use Eagle.JS

    slide(:steps=4)
      h3 How to impress people

      eg-transition(enter='fadeInRight')
        p(v-if='step >= 2') Wear bright colors
      eg-transition(enter='fadeInLeft')
        p(v-if='step >= 3') Learn to juggle
      eg-transition(enter='fadeInDown')
        p(v-if='step >= 4') Use Eagle.JS

    slide(:steps=4)
      h2 Eagle.JS is

      h3(v-if='step === 2') Simple
      h3(v-if='step === 3') Powerful
      h3(v-if='step === 4') Hackable

    slide(:steps=3)
      h2 Animated SVG
      include animated.svg

    slide(:steps=3)
      h2 Some verses
      eg-transition(enter='fadeInRight' leave='fadeOutLeft')
        .subslide(v-if='step === 1')
          p Once it smiled a silent dell
          p Where the people did not dwell;
      eg-transition(enter='fadeInRight' leave='fadeOutLeft')
        .subslide(v-if='step === 2')
          p They had gone unto the wars,
          p Trusting to the mild-eyed stars,
      eg-transition(enter='fadeInRight' leave='fadeOutLeft')
        .subslide(v-if='step === 3')
          p Nightly, from their azure towers,
          p To keep watch above the flowers,

    slide(:steps=2)
      h2 I am a slide
      p And a modal will appear

      eg-modal(v-if='step === 2')
        h3 I am a modal



</template>

<script>
import eagle from 'eagle.js'

export default {
  mixins: [eagle.slideshow],
  infos: {
    title: 'Demo recipes',
    description: 'Demos for Eagle recipes',
    path: 'demo-recipes'
  }
}
</script>

<style lang='scss'>
@import url(https://fonts.googleapis.com/css?family=Raleway);
#DemoSlideshow {
  .eg-slideshow {
    background-color: white;
    background-image: none;
    p {
      font-size: 1.2em;
    }
    .eg-slide {
      h1, h2, h3, h4, h5, p, li, {
        font-family: 'Raleway'
      }
    }
    .eg-modal {
      background-color: rgba(0,0,0,0.8);
      color: white;
      h1, h2, h3, h4 {
        font-weight: bold;
      }
    }
  }
}
</style>
