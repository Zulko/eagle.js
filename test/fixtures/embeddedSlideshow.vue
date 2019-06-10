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

export default {
  mixins: [ slideshow ]
}
</script> 
