<template lang='pug'>
.eg-code-block.container
  .box.hljs.code-box(:id='id')
    pre
      code(:class="lang ? lang : ''", :id='id3')
  .box.comments-box
    pre
      code(:id='id2')
        slot
</template>

<script>
import hljs from 'highlight.js'
function randId () {
  return Math.random().toString(36).substr(2, 10)
}
export default {
  props: {
    id: {default: () => randId()},
    id2: {default: () => randId()},
    id3: {default: () => randId()},
    lang: {default: null}
  },
  mounted: function () {
    this.update()
  },
  methods: {
    update: function () {
      var codeBlock = document.getElementById(this.id)
      var commentsContent = document.getElementById(this.id2)
      var codeContent = document.getElementById(this.id3)
      codeContent.innerHTML = commentsContent.innerHTML
      console.log(this.id)
      if (this.lang) {
        hljs.highlightBlock(codeBlock)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.container {
  position: relative;
  width: 100%;
}

.code-box {
  .eg-code-comment {
    display: none
  }
}

.comments-box {
  position: absolute;
  color: rgba(0, 0, 0, 0.0);
  top: 0;

}

.eg-code-comment {
  z-index: 10 !important;
}
</style>
