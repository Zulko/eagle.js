module.exports = {
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
    '@/([^\\.]*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: [
    "js",
    // tell Jest to handle `*.vue` files
    "vue"
  ],
  transform: {
    // process `*.js` files with `babel-jest`
    ".*\\.(js)$": "babel-jest",
    // process `*.vue` files with `vue-jest`
    ".*\\.(vue)$": "vue-jest"
  },
}
