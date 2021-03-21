import store from '@/store/index.js'

export default (to, from , next) => {
  if(!store.getters.user){
    next({
      path: '/login'
    });
  } else {
    next();
  }
}