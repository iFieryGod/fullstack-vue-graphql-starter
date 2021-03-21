<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Add Post</h1>
      </v-flex>
    </v-layout>

    <!-- error alert -->
    <!-- <v-layout v-if="error" row wrap>
      <v-flex xs sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout> -->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form
          v-model="isFormValid"
          lazy-validation
          ref="form"
          @submit.prevent="handleAddPost"
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
                :items="items"
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

          <v-layout style="background-color: blue" row>
            <v-flex xs12>
              <v-btn
                :disabled="!isFormValid || loading"
                :loading="loading"
                dark
                color="primary"
                type="submit"
              >
                <span v-if="loading" class="custom-loader">
                  <!-- <v-icon light>mdi-cached</v-icon> -->
                </span>
                Submit
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AddPost",
  data: () => {
    return {
      isFormValid: false,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      items: ["Art", "Gaming", "Weed", "Modern", "Health"],
      titleRules: [
        (title) => !!title || "Title is required",
        (title) =>
          title.length < 20 || "title cannot be less than 20 characters",
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
  computed: {
    ...mapGetters(["loading", "user"]),
  },
  methods: {
    handleAddPost() {
      console.log(this.user._id);

      // add post action
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id,
        });
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      }
    },
  },
};
</script>
