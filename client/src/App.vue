<template>
  <v-app style="#e3e3ee">
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-app-bar-nav-icon @click="sideNav = !sideNav"></v-app-bar-nav-icon>
        <router-link to="/" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="item in sideNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-action>
            <v-icon> {{ item.icon }} </v-icon>
          </v-list-item-action>
          <v-list-item-action>
            <v-list-item-content>
              {{ item.title }}
            </v-list-item-content>
          </v-list-item-action>
        </v-list-item>
        <!-- SignOut Button -->
        <v-list-item v-if="user" @click="handleSignOut">
          <v-list-item-action>
            <v-icon>mdi-beehive-outline</v-icon>
          </v-list-item-action>
          <v-list-item-action>
            <v-list-item-content>SignOut</v-list-item-content>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="deep-purple accent-4" dense dark>
      <v-app-bar-nav-icon @click="sideNav = !sideNav"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/" color="accent">VueShare</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="searchTerm"
        @input="handleSearchPosts"
        @change="clearSearchResults"
        flex
        prepend-icon="mdi-magnify"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      >
      </v-text-field>

      <!-- Search Results Card -->
      <v-card z-index="24" dark v-if="SearchResults.length" id="search__card">
        <v-list>
          <v-list-item
            @click="goToSearchResult(result._id)"
            v-for="result in SearchResults"
            :key="result._id"
          >
            <v-list-item-title>
              {{ result.title }} -
              <span class="font-weight-thin">{{
                formatDescription(result.description)
              }}</span>
            </v-list-item-title>

            <v-list-item-action v-if="checkIfUserFavorite(result._id)">
              <!-- Show icon if Favorited by User -->
              <v-icon dark>mdi-heart-outline</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <v-list v-for="item in horizontalNavItems" :key="item.title">
        <v-btn text :to="item.link" class="hidden-sm-only">
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </v-list>

      <!-- Profile Button -->
      <v-btn text to="/profile" v-if="user">
        <v-icon class="hidden-sm-only" left>mdi-baby-face-outline</v-icon>
        <v-badge right color="accent" :class="{ bounce: badgeAnimated }">
          <span slot="badge" v-if="userFavorites.length > 0">{{
            userFavorites.length
          }}</span>
          Profile
        </v-badge>
      </v-btn>

      <!-- SignOut Button -->
      <v-btn text to="/" v-if="user" @click="handleSignOut">
        <v-icon class="hidden-sm-only" left>mdi-beehive-outline</v-icon>
        signOut
      </v-btn>
    </v-app-bar>
    <main>
      <v-container>
        <transition name="fade">
          <router-view />
        </transition>
        <!-- Auth Error Need to sign Back in snackbar -->
        <v-snackbar
          v-if="authError"
          v-model="authSnackbarError"
          bottom
          left
          :timeout="10000"
          dark
        >
          <v-icon class="mr-3">mdi-dog</v-icon>
          <h3>{{ authError.message }}</h3>

          <v-btn dark text to="/login" @click="authSnackbarError = false"
            ><v-icon>mdi-close-circle</v-icon>Sign In</v-btn
          >
        </v-snackbar>

        <!-- Auth Snackbar -->
        <v-snackbar v-model="authSnackBar" bottom left :timeout="5000">
          <v-icon class="mr-3">mdi-cat</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark text @click="authSnackBar = false"
            ><v-icon>mdi-close-circle</v-icon> Close</v-btn
          >
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  data: () => ({
    searchTerm: "",
    sideNav: false,
    authSnackBar: false,
    authSnackbarError: false,
    badgeAnimated: false,
  }),
  methods: {
    handleSignOut() {
      this.$store.dispatch("signOutUser");
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm,
      });
    },
    goToSearchResult(searchResultId) {
      this.searchTerm = "";
      this.$router.push(`/post/${searchResultId}`);
      this.$store.commit("clearSearchResults");
    },
    clearSearchResults() {
      this.$store.commit("clearSearchResults");
    },
    formatDescription(desc) {
      return desc.length > 10 ? `${desc.slice(0, 10)}...` : desc;
    },
    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some((fave) => fave._id === resultId)
      );
    },
  },
  watch: {
    user(newValue, oldValue) {
      // if no value previously for user, show snackbar
      if (oldValue === null) {
        this.authSnackBar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authSnackbarError = true;
      }
    },
    userFavorites(value) {
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    },
  },
  computed: {
    ...mapGetters(["authError", "user", "userFavorites", "SearchResults"]),
    horizontalNavItems() {
      let items = [
        { icon: "mdi-bank", title: "Posts", link: "/posts" },
        { icon: "mdi-magnify", title: "Sign In", link: "/login" },
        { icon: "mdi-dots-vertical", title: "Sign Up", link: "/signup" },
      ];
      if (this.user) {
        items = [{ icon: "mdi-bank", title: "Posts", link: "/posts" }];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "mdi-bank", title: "Post", link: "/posts" },
        { icon: "mdi-magnify", title: "Sign In", link: "/login" },
        { icon: "mdi-basketball", title: "SignUp", link: "/signup" },
      ];
      if (this.user) {
        items = [
          { icon: "mdi-bank", title: "Post", link: "/posts" },
          { icon: "mdi-atom-variant", title: "Create Post", link: "/post/add" },
          { icon: "mdi-bank", title: "Profile", link: "/profile" },
        ];
      }
      return items;
    },
  },
};
</script>
<style>
h1 {
  font-weight: 400;
  font-size: 2.5rem;
}

h2 {
  font-weight: 400;
  font-size: 2rem;
}
.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateX(-25px);
}
/* Search Result Card */
#search__card {
  position: absolute;
  width: 100vw;
  top: 100%;
  left: 0;
  z-index: 55;
}
/* User FAvorite Animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
