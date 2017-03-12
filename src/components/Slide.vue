<template lang='pug'>
eg-transition(:enter='enter', :leave='leave')
  .eg-slide(v-if='active')
    .eg-slide-content
      slot
</template>

<script>
export default {
  props: {
    skip: {default: false},
    enter: {default: null},
    leave: {default: null},
    steps: {default: 1},
    mouseNavigation: {default: true},
    keyboardNavigation: {default: true}
  },
  data: function () {
    return {
      step: 1,
      active: false,
      isSlide: true,
      slideTimer: 0
    }
  },
  mounted: function () {
    var self = this
  },
  methods: {
    nextStep: function () {
      if (this.step === this.steps) {
        this.$parent.nextSlide()
      } else {
        this.step++
      }
    },
    previousStep: function () {
      if (this.step === 1) {
        this.$parent.previousSlide()
      } else {
        this.step--
      }
    }
  },
  watch: {
    step: function (val) {
      this.$parent.step = val
    },
    active: function (val) {
      var self = this
      if (val) {
        this.slideTimer = 0
        this.timerUpdater = setInterval(function () {
          self.slideTimer++;
        }, 1000)
      } else {
        clearInterval(this.timerUpdater)
      }

    }
  }
}
</script>
