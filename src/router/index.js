import Vue from 'vue'
import Router from 'vue-router'
import store from '../utils/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

Vue.use(Router)
const Layout = resolve => require(['@/pages/layout'], resolve)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login'], resolve)
    },
    {
      path: '/',
      component: Layout,
      children: [{
        name: 'index',
        path: '',
        redirect: '/homePage'
      }]
    },
    {
      path: '/homePage',
      component: Layout,
      children: [{
        name: 'homePage',
        path: '',
        component: resolve => require(['@/pages/homePage'], resolve)
      }]
    },
    {
      path: '/ironList',
      component: Layout,
      children: [{
        name: 'ironList',
        path: '',
        component: resolve => require(['@/pages/ironList'], resolve)
      }]
    },
    {
      path: '/clientManage',
      component: Layout,
      children: [{
        name: 'clientManage',
        path: '',
        component: resolve => require(['@/pages/clientManage'], resolve)
      }]
    },
    {
      path: '/userManage',
      component: Layout,
      children: [{
        name: 'userManage',
        path: '',
        component: resolve => require(['@/pages/userManage'], resolve)
      }]
    },
    {
      path: '/articleManage',
      component: Layout,
      children: [{
        name: 'articleManage',
        path: '',
        component: resolve => require(['@/pages/articleManage'], resolve)
      }]
    },
    {
      path: '/createArticle',
      component: Layout,
      children: [{
        name: 'createArticle',
        path: '',
        component: resolve => require(['@/pages/articleManage/createArticle'], resolve)
      }]
    },
    {
      path: '/editArticle',
      component: Layout,
      children: [{
        name: 'editArticle',
        path: '',
        component: resolve => require(['@/pages/articleManage/editArticle'], resolve)
      }]
    },
    {
      path: '/questionManage',
      component: Layout,
      children: [{
        name: 'questionManage',
        path: '',
        component: resolve => require(['@/pages/questionManage'], resolve)
      }]
    },
    {
      path: '/404',
      component: Layout,
      children: [{
        name: '404',
        path: '',
        component: resolve => require(['@/pages/errorPage'], resolve)
      }]
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (to.path === '/login') {
    if (!store.state.user) {
      next()
      NProgress.done()
    } else {
      next({ path: '/' })
      NProgress.done()
    }
  } else {
    if (store.state.user) {
      next()
      NProgress.done()
    } else {
      next({ path: '/login' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
