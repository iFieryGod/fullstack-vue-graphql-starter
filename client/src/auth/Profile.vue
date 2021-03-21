<template>
  <v-container class="text-xs-center">
    <!-- User details -->
    <v-flex class="sm6 offset-sm3">
      <v-card class="white-text" color="green">
        <v-layout>
          <v-flex class="xs5">
            <v-img
              class="mt-5"
              height="125px"
              contain
              :src="user.avatar"
            ></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ user.username }}</div>
                <div>Joined {{ formatDate(user.joinDate) }}</div>
                <div class="hidden-xs-only">
                  {{ user.favorites.length }} Favorites
                </div>
                <div class="hidden-xs-only">
                  {{ userPosts.length }} Posts Added
                </div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts favorited by user -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12 class="my-2 py-3">
          <h2>
            You have no Favorites currently. Go and add some!
          </h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          favorited
          <span class="font-weight-regular">({{ userFavorites.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img
              @click="goToPost(favorite._id)"
              height="30vh"
              :src="favorite.imageUrl"
            ></v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- User Posts -->

    <v-container class="mt-3">
      <v-flex xs12>
        <h2 class="font-weight-bold">All Your Posts</h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-card-text>
              <v-btn
                @click="handleDeleteUserPost(post)"
                color="red"
                floating
                fab
                small
                class="mr-5"
              >
                <v-icon>mdi-file-remove</v-icon>
              </v-btn>
              <v-btn @click="loadPost(post)" color="warning" floating fab small>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-card-text>
            <v-img
              @click="goToPost(post._id)"
              height="30vh"
              :src="post.imageUrl"
            ></v-img>
            <v-card-title>{{ post.title }}</v-card-title>
            <v-divider></v-divider>
            <span v-for="(category, index) in post.categories" :key="index">
              <v-chip class="mx-2 my-2" color="accent" text-color="white">{{
                category
              }}</v-chip>
            </span>
            <h3 class="mx-2">
              {{ formatDescription(post.description) }}
            </h3>
            <v-card-text class="grey lighten-4">
              <v-list-item-content>
                <v-list-item-subtitle class="mx-2"
                  >Added
                  {{ formatDate(post.createdDate) }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit POst Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-container>
          <v-form
            class="mx-3"
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleUpdateUserPost"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="titleRules"
                  v-model="title"
                  prepend-icon="mdi-face"
                  label="Title"
                  type="text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  :rules="imageRules"
                  v-model="imageUrl"
                  prepend-icon="mdi-face"
                  label="Image URL"
                  type="text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-row align="center">
              <v-flex xs12>
                <img :src="imageUrl" height="300px" />
              </v-flex>
            </v-row>

            <!-- Select Catergories -->
            <v-layout row>
              <v-flex xs12>
                <v-select
                  :rules="catRules"
                  v-model="categories"
                  :items="['Art', 'Gaming', 'Weed', 'Modern', 'Health']"
                  multiple
                  label="Catergories"
                ></v-select>
              </v-flex>
            </v-layout>

            <h1>{{ categories }}</h1>

            <v-layout row>
              <v-flex xs12>
                <v-textarea
                  :rules="DesRules"
                  v-model="description"
                  prepend-icon="mdi-face"
                  label="Description"
                  type="text"
                  required
                ></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!isFormValid"
                type="submit"
                class="success--text"
                >Update</v-btn
              >
              <v-btn class="error--text" @click="editPostDialog = false"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  name: "profile",
  data: () => {
    return {
      editPostDialog: false,
      isFormValid: false,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        (title) => !!title || "Title is required",
        (title) =>
          title.length < 30 || "title cannot be less than 20 characters",
      ],
      imageRules: [(imageUrl) => !!imageUrl || "Image URL is required"],
      catRules: [
        (catergories) =>
          !!catergories || "You must choose atleast one catergory",
      ],
      DesRules: [
        (description) => !!description || "Description is required",
        (description) =>
          description.length < 200 ||
          "description cannot be more than 20 characters",
      ],
    };
  },
  created() {
    this.handleGetUserPosts();
  },
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts", "loading"]),
  },
  methods: {
    goToPost(favorite) {
      this.$router.push(`/post/${favorite}`);
    },
    formatDate(date) {
      return moment(new Date(date)).format("ll");
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    },
    handleUpdateUserPost() {
      //update post action
      if (this.$refs.form.validate()) {
        this.$store.dispatch("updateUserPost", {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
        });
      }
      this.editPostDialog = false;
    },
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id,
      });
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (deletePost) {
        this.$store.dispatch("deleteUserPost", {
          postId: this.postId,
        });
      }
    },
    closeDialog() {
      this.editPostDialog = false;
    },
    formatDescription(desc) {
      return desc.length > 80 ? `${desc.slice(0, 80)}...` : desc;
    },
  },
};
</script>
