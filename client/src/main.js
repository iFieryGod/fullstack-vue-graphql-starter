import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo'

import FormAlert from "./components/Shared/FormAlert"

//register a global component
Vue.component('form-alert', FormAlert);

Vue.use(VueApollo);

// Setup Apollo Client
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // include auth token with request to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // if not token in browser with key of 'token' in localstorage, add it
    if(!localStorage.token){
      localStorage.setItem('token', '');
    }
    // operation adds the token to an authorization header, which is sent to the backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if(networkError){
      console.log('[networkError]', networkError)
    }
    if(graphQLErrors){
      for(let err of graphQLErrors){
        console.dir(err);
        if(err.name === "AuthenticationError"){
          // set auth errror value in state (show in snackbar)
          store.commit('setAuthError', err);
          // signout user (to clear token)
          store.dispatch('signOutUser');
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });


Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app')
