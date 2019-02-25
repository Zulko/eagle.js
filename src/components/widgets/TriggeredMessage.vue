<template lang='pug'>
eg-transition(:enter='enter', :leave='leave')
  .eg-triggered-message(v-if='active', :style='style')
    slot
</template>
<script>
export default {
  isWidget: true,
  name: 'eg-triggered-message',
  props: {
    enter: {default: 'slideInLeft'},
    leave: {default: 'slideOutLeft'},
    trigger: {default: false},
    position: {default: 'left top'},
    duration: {default: 3}
  },
  data: function () {
    return {
      active: false,
      timeout: null,
      style: {
        top: (this.position.indexOf('top') >= 0) ? '0%' : 'none',
        bottom: (this.position.indexOf('bottom') >= 0) ? '0%' : 'none',
        left: (this.position.indexOf('left') >= 0) ? '0%' : 'none',
        right: (this.position.indexOf('right') >= 0) ? '0%' : 'none'
      }
    }
  },
  watch: {
    trigger: function (val, oldVal) {
      if (!oldVal && val) {
        this.active = true
        var self = this
        this.timeout = setTimeout(function () {
          self.active = false
        }, 1000 * this.duration)
      } else if (oldVal && !val) {
        this.active = false
        clearTimeout(this.timeout)
      }
    }
  }
}
</script>
