import Vue from 'vue'
import MyTitle from './MyTitle'
import whiteSpace from './whiteSpace'
const Components  = [
  MyTitle,
  whiteSpace
]

Components.map(c => {
  Vue.component(c.name, c)
})