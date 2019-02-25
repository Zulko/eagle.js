
<template lang='pug'>
eg-transition(:enter='enter', :leave='leave')
  .eg-slide.image-slide(v-if='active', :style="style")
</template>

<script>
import Slide from '../Slide.vue'
export default {
  isWidget: true,
  name: 'eg-image-slide',
  mixins: [Slide],
  props: {
    url: {default: 'https://i.imgur.com/P7iyH.png'},
    enter: {default: null},
    leave: {default: null}
  },
  computed: {
    style: function () {
      return {
        'background-image': 'url(' + this.url + ')',
        'background-position': 'center center',
        'background-size': 'cover'
      }
    }
  }
}
</script>
