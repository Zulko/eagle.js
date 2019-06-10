<template lang="pug">
.eg-slideshow
  slide
    p test
  slide(:steps="5")
    p test
  slide(:steps="4")
    p test
  slide(:steps="3")
    embedded-slideshow
</template>

<script>
import embeddedSlideshow from './embeddedSlideshow'
import Slideshow from '@/components/Slideshow'
import Slide from '@/components/Slide'
import Transition from '@/components/AnimatedTransition'
import Vue from 'vue'

Vue.component(Slide.name, Slide)
Vue.component(Transition.name, Transition)

export default {
  mixins: [ Slideshow ],
  components: { embeddedSlideshow }
}
</script>
