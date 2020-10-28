<template lang='pug'>
transition(:enter-active-class="enter ? 'animate animate__animated ' + enter : ''",
           :leave-active-class="leave ? 'animate animate__animated ' + leave : ''")
  slot
</template>
<script>
export default {
  name: 'eg-transition',
  props: {
    enter: {default: null},
    leave: {default: null}
  }
}
</script>
