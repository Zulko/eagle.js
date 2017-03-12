<template lang='pug'>
transition(:enter-active-class="enter ? 'animated ' + enter : ''",
           :leave-active-class="leave ? 'animated ' + leave : ''")
  slot
</template>
<script>
export default {
  props: {
    enter: {default: null},
    leave: {default: null}
  }
}
</script>
