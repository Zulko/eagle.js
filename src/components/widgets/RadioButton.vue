<template lang='pug'>
.eg-radio
  .radiobutton(:style="{'font-size': fontsize}", @click='select')
    .radio
    .radiodot(:class="{checked: value === label}")
  slot
</template>

<script>
export default {
  isWidget: true,
  name: 'eg-radio-button',
  props: {
    value: {default: null},
    label: {default: null},
    fontsize: {default: '0.7em'}
  },
  methods: {
    select: function () {
      this.$emit('input', this.label)
    }
  }
}
</script>

<style lang="scss" scoped>
.eg-radio {
  p {
    display: inline;
  }

  .radiobutton {
    position: relative;
    display: inline-block;
    width: 1em;
    height: 1em;
  }

  /* The slider */
  .radio {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 0.5em;
  }

  .radiodot {
    position: absolute;
    cursor: pointer;
    content: "";
    height: 0em;
    width: 0em;
    left: 0.5em;
    bottom: 0.5em;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }

  .radiodot.checked {
    height: .9em;
    width: .9em;
    left: 0.05em;
    bottom: 0.05em;
  }
}
</style>
