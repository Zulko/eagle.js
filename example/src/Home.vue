<template lang='pug'>
.frontpage
  .content
    h1
      span.logo
      span Eagle
      span.grey .js
    h2 A slideshow framework for hackers


    iframe.github-star(src="https://ghbtns.com/github-btn.html?user=zulko&repo=eagle.js&type=star&count=true&size=large"
                       frameborder="0" scrolling="0" width="160px" height="30px")
    p.
      Eagle.js is a web-based slideshow framework for Vue.js.
      It supports animations, themes, interactive widgets (for web demos),
      and makes it easy to reuse components, slides and styles across presentations.

    p.
      Most of all, Eagle aims at offering a simple and very hackable API so you
      can get off the beaten tracks and craft the slideshows you really want.



    .thumbnails
      .box-card(v-for='slideshow in slideshows')
        router-link(:to='slideshow.infos.path' @click.native="click")
          .embedded-slideshow-container
            component(:is="slideshow", :embedded='true',
                      :keyboardNavigation='false',
                      :mouseNavigation='false')
        .caption
          h3 {{slideshow.infos.title}}
          p.thumbnail-description {{slideshow.infos.description}}
</template>

<script>
import slideshows from 'slideshows/slideshows'

export default {
  data: function () {
    return {
      slideshows: slideshows.list
    }
  },
  mounted: function () {
    console.log(this.slideshows)
    document.currentSlide = {}
  },
  methods: {
    click: function (evt) {
      evt.stopPropagation()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
@import "node_modules/eagle.js/src/themes/frontpage/frontpage";
.logo {
  display: inline-block;
  width: 130px;
  height:90px;
  margin-right: 0.1em;
  background-image: url(./logo.svg);
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
}

.github-star {
  display: block;
  margin: 0 auto;
  margin-top: -10px;
}
</style>
