<template lang="pug">
#DemoSlideshow
  .eg-slideshow
    slide
      h1 Hi there !
      h4 I am slide 1

    slide
      h1 Hi again !
      h4 I am slide 2

    slide
      h1 Hi third !
      h4 I am slide 3

    slide(enter='fadeIn' leave='fadeOut')
      h1 I am a fading slide !
      h4 I fade in and fade away

    slide(enter='bounceInRight' leave='bounceOutLeft')
      h1 I'm a bouncing slide
      h4 I bounce in and out
</template>

<script>
import eagle from 'eagle.js'

export default {
  mixins: [eagle.slideshow]
}
</script>

<style lang='scss'>
@import url(https://fonts.googleapis.com/css?family=Raleway);
#DemoSlideshow {
  .eg-slideshow {
    background-color: white;
    background-image: none;
    .eg-slide {
      h1, h2, h3, h4, h5, p, li, {
        font-family: 'Raleway'
      }
    }

  }

}
</style>
