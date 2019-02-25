<template lang='pug'>
.eg-modal
  .content
    slot
</template>

<script>
export default {
  isWidget: true,
  name: 'eg-modal'
}
</script>

<style>
.eg-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
