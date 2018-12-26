<template lang='pug'>
.eg-switch
  .switch(:style="{'font-size': fontsize}", @click='toggle')

    input(type='checkbox', :checked='checked')
    .slider(:class="{checked: checked}")
    .sliderdot(:class="{checked: checked}")

  span(:class="{unchecked: !checked}")
    slot
</template>

<script>
export default {
  isWidget: true,
  name: 'eg-toggle',
  props: {
    value: {default: true},
    fontsize: {default: '0.8em'}
  },
  data: function () {
    return {
      checked: this.value
    }
  },
  methods: {
    toggle: function () {
      this.checked = !this.checked
    }
  },
  watch: {
    checked: function (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss" scoped>

.eg-switch {
  p {
    display: inline;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 2em;
    height: 1em;
  }

  .switch input {
    display:none;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 0.5em;
  }

  .sliderdot {
    position: absolute;
    cursor: pointer;
    content: "";
    height: 0.8em;
    width: 0.8em;
    left: 0.1em;
    bottom: 0.1em;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: .4em;
  }

  .sliderdot.checked {
    -webkit-transform: translateX(1em);
    -ms-transform: translateX(1em);
    transform: translateX(1em);

  }
}
</style>
