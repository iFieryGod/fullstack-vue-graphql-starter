import Vue from 'vue'
import Vuex from 'vuex'
import { defaultClient as ApolloClient } from '@/main'
import { 
  GET_CURRENT_USER,
  INFINITE_SCROLL_POSTS, 
  SIGNIN_USER, 
  SIGNUP_USER, 
  GET_POSTS, 
  ADD_POST,
  GET_USER_POSTS,
  SEARCH_POSTS,
  UPDATE_USER_POST,
  DELETE_POST
 } from '@/queries'
import router from '@/router/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    userPosts: [],
    SearchResults: [],
    pageNumber: 1,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setSearchResults: (state, payload) => {
      if(payload !== null){
        state.SearchResults = payload
      }
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload
    },
    setError: (state, payload) => {
      state.error = payload
    },
    setAuthError: (state, payload) => {
      state.authError = payload
    },
    setPageNumber: state => (state.pageNumber += 1),
    clearSearchResults: state => (state.SearchResults = []),
    clearUser: state => (state.user = null),
    clearError: state => (state.user = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      ApolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        commit('setLoading', false);
        // Add user data to state
        commit('setUser', data.getCurrentUser);
      })
      .catch(err => {
        commit('setLoading', false)
        console.error(err)
      })
    },
    searchPosts: ({ commit }, payload) => {
      ApolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(( { data }) => {
        commit('setSearchResults', data.searchPosts)
      }).catch(err => {
        console.error(err)
      })
    },
    getPosts: ({commit}) => {
      commit('setLoading', true)
      // use ApolloClient to fire getPosts query
      ApolloClient
      .query({
        query: GET_POSTS,
        refetchQueries: [
          {
            query: INFINITE_SCROLL_POSTS,
            variables: {
              pageNum: 1,
              pageSize: 2
            },
          },
        ]
      }).then(({data}) => {
        // Get data from action and pass it to State
        // commit passes data from action along to mutation function
        commit('setPosts', data.getPosts);
        commit('setLoading', false);
      }).catch(err => {
        commit('setLoading', false);
        console.error(err);
      })
    },
    getUserPosts: ({ commit }, payload) => {
      ApolloClient
      .query({
        query: GET_USER_POSTS,
        variables: payload
      }).then(( { data }) => {
        commit('setUserPosts', data.getUserPosts)
      }).catch(err => {
        console.log(err)
      })
    },
    addPost: ({commit}, payload) => {
      ApolloClient
      .mutate({
        mutation: ADD_POST,
        variables: payload,
        update: (cache, {data: {addPost}}) => {
          // first read the query you want to update
          const data = cache.readQuery({ query: GET_POSTS });
          // Create updated data
          data.getPosts.unshift(addPost)
          // Write updated data back to query
          
          cache.writeQuery({
            query: GET_POSTS,
            data
          });
        },
        // optimistic response ensures the data is added immediately as we specified in the update function
        optimisticResponse: {
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            _id: -1,
            ...payload
          }
        },
        // Rerun any queries after performing the mutation in order to get fresh data
        refetchQueries: [
          {
            query: INFINITE_SCROLL_POSTS,
            variables: {
              pageNum: 1,
              pageSize: 2
            },
          },
        ]
      })
      .then(({data}) => { 
        commit('setPosts', data.addPost)
      })
      .catch(err => {
        console.log("AddPostError",err)
      })
    },
    updateUserPost: ({ state, commit }, payload) => {
      ApolloClient
      .mutate({
        mutation: UPDATE_USER_POST,
        variables: payload
      })
      .then(( {data}) => {
      const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
      const userPosts = [
        ...state.userPosts.slice(0, index),
        data.updateUserPost,
        ...state.userPosts.slice(index + 1)
      ];
      commit("setUserPosts", userPosts);
      }).catch(err => {
        console.log(err)
      })
    },
    deleteUserPost: ({ state, commit }, payload) => {
      ApolloClient
      .mutate({
        mutation: DELETE_POST,
        variables: payload,
        refetchQueries: [
          {
            query: INFINITE_SCROLL_POSTS,
            variables: {
              pageNum: 1,
              pageSize: 2
            },
          },
        ]
      })
      .then(( { data }) => {
        const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);
        const updatedPosts = [
          ...state.userPosts.slice(0, index),
          ...state.userPosts.slice(index + 1)
        ];
        commit("setUserPosts", updatedPosts)
        console.log(data.deleteUserPost)
      }).catch(err => {
        console.log(err)
      });
    },
    signinUser: ({ commit }, payload) => {
      commit('setError')
      commit('setLoading', true)
     
      ApolloClient
      .mutate({
        mutation: SIGNIN_USER,
        variables: payload
      })
      .then(({data}) => {
        commit('setLoading', false)
        localStorage.setItem('token', data.signinUser.token);
        // to make sure created method is run in main.js
        router.go();
      })
      .catch(err => {
        commit('setLoading', false)
        commit('setError', err)
        console.error(err);
      });
    },
    signUpUser: ({ commit }, payload) => {
      commit('setError')
      commit('setLoading', true)
      
      ApolloClient
      .mutate({
        mutation: SIGNUP_USER,
        variables: payload
      })
      .then(({data}) => {
        commit('setLoading', false)
        localStorage.setItem('token', data.signupUser.token);
        // to make sure created method is run in main.js
        router.go();
      })
      .catch(err => {
        commit('setLoading', false)
        commit('setError', err)
        console.error(err);
      });
    },
    signOutUser: async ({ commit }) => {
      // clear the user in state
      commit('clearUser');
      // remove token in localStorage
      localStorage.removeItem('token', '');
      // end the session
     await ApolloClient.resetStore();
    //  redirect home = kick user ot of private page
      // router.push('/');
    }
  },
  modules: {
  },
  getters: {
    posts: state => state.posts,
    SearchResults: state => state.SearchResults,
    loading: state => state.loading,
    userFavorites: state => state.user && state.user.favorites,
    user: state => state.user,
    userPosts: state => state.userPosts,
    pageNumber: state => state.pageNumber,
    error: state => state.error,
    authError: state => state.authError
  }
})
