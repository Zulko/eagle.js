<template lang='pug'>
#app
  router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
body {
  width: 100%;
  margin: 0 0;
}
html {
  height: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
</style>
