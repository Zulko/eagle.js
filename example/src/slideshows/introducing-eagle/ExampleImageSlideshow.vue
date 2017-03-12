<template lang="pug">
.eg-slideshow
  image-slide(v-for='imageUrl, i in images[preference]',
              :enter="(i === 0) ? null : 'slideInRight'", leave='slideOutLeft', :url='imageUrl')
</template>

<script>
import eagle from 'eagle.js'

export default {
  mixins: [eagle.slideshow],
  props: {
    preference: {default: 'funny kitties'}
  },
  data: function () {
    var images = {
      'baby bunnies': [
        'http://i.imgur.com/1PL2k1H.jpg',
        'http://i.imgur.com/GfFUcPQ.jpg',
        'http://i.imgur.com/et8w8Rn.gif'
      ],
      'funny kitties': [
        'https://i.imgur.com/P7iyH.png',
        'http://i.imgur.com/sHOqlJc.jpg',
        'http://i.imgur.com/wiAwNQZ.gif'
      ],
      'fluffy puppies': [
        'http://i.imgur.com/Scj7lzM.jpg',
        'http://i.imgur.com/FyFhTEE.jpg',
        'http://i.imgur.com/G62BWuI.gif'
      ]
    }
    return {
      images: images,
      preloadedImages: images[this.preference]
    }
  }
}
</script>
