<template lang='pug'>
transition(:enter-active-class="enter ? 'animated ' + enter : ''",
           :leave-active-class="leave ? 'animated ' + leave : ''")
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
