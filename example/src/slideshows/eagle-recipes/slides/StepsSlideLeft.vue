<template lang='pug'>
slide(:steps=2)
  h3
  .code-and-demo
    .code
      :markdown
        ```
        slide
          h3 effect
          transition(name='slide-left')
            li(v-if='step===1') First item
          transition(name='slide-left')
            li(v-if='step===2') Second item
        ```
    .demo
      slide(:steps=2)
        h3 effect
        transition(name='slide-left')
          li(v-if='step===1') First item
        transition(name='slide-left')
          li(v-if='step===2') Second item
</template>
