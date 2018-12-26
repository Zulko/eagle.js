<template lang='pug'>
eg-transition(:enter='enter', :leave='leave')
  div.eg-code-comment(v-if='active')
    span(v-if='arrow') &larr;
    slot
</template>
<script>
export default {
  isWidget: true,
  name: 'eg-code-comment',
  props: {
    enter: {default: null},
    leave: {default: null},
    active: {default: true},
    arrow: {default: true}
  }
}
</script>
<style>
.eg-code-comment {
  display: inline-block
}
</style>
