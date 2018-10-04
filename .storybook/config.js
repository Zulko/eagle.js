import { configure, setAddon } from '@storybook/vue'
import Vue from 'vue'

function loadStories() {
  require('../stories/stories.js')
}

configure(loadStories, module)
