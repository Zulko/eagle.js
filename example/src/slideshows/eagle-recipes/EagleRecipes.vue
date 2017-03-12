//- (:style="{ fontSize:  '20px' }")
<template lang="pug">
#RefuelRecipes.eg-theme-gourmet
  .eg-slideshow
    v-slide
      h1 Eagle Recipes
      h4.center 100% Pure Code, <br/>no Artificial Swag

    v-slide(:steps=3)
      h3 Minimal slideshow
      eg-code-block.half.
        .eg-slideshow
          slide
            h1 Hi there !
            h4 I am slide 1
          slides
            h1 Hello
            h4 I am slide 2
          slides
            h1 Hello
            h4 I am slide 3
      .demo-slideshow
        demo-slideshow(:embedded='true', :firstSlide=1, :lastSlide=3)

    v-slide(:steps=2)
      h3 Slides with transitions
      eg-code-block.
        slide(enter='fadeIn' leave='fadeOut')
          h1 I am a fading slide !
          h4 I fade in and fade away

        slide(enter='bounceInRight' leave='bounceOutLeft')
          h1 I'm a bouncing slide
          h4 I bounce in and out
      .demo-slideshow
        demo-slideshow(:embedded='true', :firstSlide=4, :lastSlide=5)
</template>

<script>
import eagle from 'eagle.js'
import DemoSlideshow from './DemoSlideshow'

var VerticalSlide = {
  mixins: [eagle.slide],
  props: {
    enter: {default: 'slideInUp'},
    leave: {default: 'slideOutUp'}
  }
}

export default {
  mixins: [eagle.slideshow],
  data: function () {
    return {
      fullPageWidth: null,
      fullPageHeight: null,
      parentHeight: null,
      parentWidth: null
    }
  },
  infos: {
    title: 'Eagle recipes',
    description: 'For yummy presentations',
    path: 'eagle-recipes'
  },
  components: {
    'demo-slideshow': DemoSlideshow,
    'v-slide': VerticalSlide
  }
}
</script>

<style lang='scss'>
@import 'node_modules/eagle.js/src/themes/gourmet/gourmet';
#RefuelRecipes {
  .eg-slideshow {
    .eg-slide {
      .eg-slide-content {
        .demo-slideshow {
          position: relative;
          width: 12em;
          height: 8em;
        }
      }
    }
  }
}


</style>
