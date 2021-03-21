<template>
  <v-container>
    <!-- Loading Spinner -->
    <v-layout row v-if="loading">
      <v-layout row>
        <v-progress-circular
          indeterminate
          :size="70"
          :width="7"
          color="error"
        ></v-progress-circular>
      </v-layout>
    </v-layout>

    <!-- Explore POsts Button -->

    <v-layout row wrap v-if="!loading" class="my-3">
      <v-flex xs12>
        <v-btn class="secondary" to="/post" large color="green"
          >Explore Posts</v-btn
        >
      </v-flex>
    </v-layout>

    <!-- POst Carousel -->

    <v-flex xs12>
      <v-carousel
        v-if="!loading"
        v-bind="{ cycle: true }"
        interval="3000"
        :show-arrows="false"
      >
        <v-carousel-item
          @click.native="goToPost(post._id)"
          reverse-transition="fade-transition"
          transition="fade-transition"
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
        >
          <h1 class="carousel_title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
// import { gql } from 'apollo-boost'
import { mapGetters } from "vuex";
// @ is an alias to /src
export default {
  name: "Home",
  data: () => {
    return {
      authSnackbarError: false,
    };
  },
  created() {
    this.handleGetCarouselPosts();
  },
  computed: {
    ...mapGetters(["loading", "posts"]),
  },
  methods: {
    handleGetCarouselPosts() {
      // reach out to vue-store and retrieve posts
      this.$store.dispatch("getPosts");
    },
    goToPost(postId) {
      this.$router.push(`/post/${postId}`);
    },
  },
  // apollo: {
  //   getPosts: {
  //     query: gql`
  //     query {
  //       getPosts {
  //         title
  //         imageUrl
  //         description
  //         createdDate
  //         likes
  //       }
  //     }
  //     `
  //   }
  // }
};
</script>
<style>
.carousel_title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  border-radius: 5px 5px 0 0;
  padding: 0.5rem;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>
