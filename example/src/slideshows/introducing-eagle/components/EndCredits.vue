This component is not super-adapted to be reused. Feel free to rewrite and
reuse it.

PUBLIC DOMAIN

<template lang='pug'>
.end-credits-container
  .end-credits
    .end-credit-category(v-for='category, name in categories')
      h4.center {{ name.toUpperCase() }}
      .end-credit-line(v-for='person in category')
        p.left {{ person.name }}
        p.right {{ person.role }}
</template>

<script>
export default {
  props: {
    username: {default: 'Tracy'}
  },
  data: function () {
    return {
      categories: {
        'Crew': [
          {
            name: this.username,
            role: 'Internet Person'
          },
          {
            name: 'Brent Rambo',
            role: 'as Computer Kid'
          },
          {
            name: 'Deadpool',
            role: 'MC'
          },
          {
            name: 'Zulko',
            role: 'Author'
          }
        ],
        'Software': [
          {
            name: 'Vue.js',
            role: 'Front-end engine'
          },
          {
            name: 'Eagle.js',
            role: 'Slideshow framework'
          },
          {
            name: 'Animate.css',
            role: 'Transitions animations'
          },
          {
            name: 'Hammer.js',
            role: 'Swipe events'
          },
          {
            name: 'MoviePy',
            role: 'Gifs Editing'
          },
          {
            name: 'Highlight.js',
            role: '(Bad) highlighting'
          }
        ],
        'Assets': [
          {
            name: 'Irfan iLias',
            role: 'Background Pattern'
          },
          {
            name: 'Karolina Lach',
            role: 'Pompiere Font'
          },
          {
            name: 'Dario @linea.io',
            role: 'Icons'
          },
          {
            name: 'Zulko',
            role: 'Computer Kid GIF'
          },
          {
            name: 'Cem Sagisman @Unsplash',
            role: 'Beach photo'
          },
          {
            name: 'Drew Collins @Unsplash',
            role: 'Forest Road Photo'
          },
          {
            name: 'Jamie Street @Unsplash',
            role: 'Dark Woods Photo'
          },
          {
            name: 'Gabriel Santiago @Unsplash',
            role: 'Bokeh City Lights Photo'
          },
          {
            name: 'Greg Rakozy  @Unsplash',
            role: 'Starry Sky Photo'
          }
        ]
      }
    }
  }
}
</script>
<style lang='scss' scoped>
@import url(https://fonts.googleapis.com/css?family=Patrick+Hand+SC);
@keyframes scroll {
    from {margin-top: 0%}
    to {margin-top: -500%}
}
.end-credits-container{
  height: 11em;
  font-family: 'Patrick Hand SC';
  overflow-y: hidden;
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;

  .end-credits {
    font-size: 0.9em;
    padding-top: 50%;

    .end-credit-category {
      .end-credit-line {
        p {
          margin-top: 0
        }
        .left {
          width: 45%;
          margin-right: 10%;
          text-align: right;
          display: inline-block;
        }
        .right {
          display: inline-block;
          text-align: right;
        }
      }
    }
    animation-name: scroll;
    animation-duration: 24s;
    animation-timing-function: linear;
    -webkit-animation-timing-function: linear; /* Safari 4.0 - 8.0 */
  }
}
</style>
