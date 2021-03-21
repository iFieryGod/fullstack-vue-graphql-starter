import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import AddPost from '../Posts/addPosts.vue'
import Posts from '../Posts/Posts.vue'
import Login from '../auth/login.vue'
import Profile from '../auth/Profile.vue'
import SignUp from '../auth/signup.vue'
import Post from "../Posts/Post.vue"

import AuthGuard from '@/AuthGuard.js'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/post/add',
    name: 'AddPost',
    component: AddPost,
    beforeEnter: AuthGuard
  },
  {
    path: "/post/:postId",
    name: "Post",
    component: Post,
    props: true
  },
  {
     path: '/posts',
    name: 'Posts',
    component: Posts,
    beforeEnter: AuthGuard
  },
  {
    path: '/login',
    name: 'SignUp',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: AuthGuard
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
