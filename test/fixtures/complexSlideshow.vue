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
import slideshow from '@/components/Slideshow'
import slide from '@/components/Slide'
import embeddedSlideshow from './embeddedSlideshow'

export default {
  mixins: [ slideshow ],
  components: { slide, embeddedSlideshow }
}
</script>
  