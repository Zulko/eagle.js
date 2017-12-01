<template lang="pug">
.eg-slideshow
  slide
    p test
  slide
    p test
  slide
    p test
</template>

<script>
import slideshow from '@/components/Slideshow'
import slide from '@/components/Slide'

export default {
  mixins: [ slideshow ],
  components: { slide }
}
</script>
  