<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome Back!</h1>
      </v-flex>
    </v-layout>

    <!-- error alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary">
          <v-container>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="handleSignInUser"
            >
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="usernameRules"
                    v-model="username"
                    prepend-icon="mdi-face"
                    label="Username"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="password"
                    prepend-icon="mdi-extension"
                    label="Password"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout style="background-color: orange" row>
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
                    Sign In
                  </v-btn>
                  <h3>Don't Have an account?</h3>
                  <router-link to="/signup">SignUp</router-link>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SignIn",
  data() {
    return {
      isFormValid: true,
      username: "",
      password: "",
      usernameRules: [
        (username) => !!username || "Username is required",
        (username) =>
          username.length < 10 || "Username must be less than 10 characters",
      ],
      passwordRules: [
        (password) => !!password || "password is required",
        (password) =>
          password.length >= 4 || "password must be more than four characters",
      ],
    };
  },
  computed: {
    ...mapGetters(["user", "error", "loading"]),
  },
  watch: {
    user(value) {
      // if user value changes, router to homepage
      if (value) {
        this.$router.push("/");
      }
    },
  },
  methods: {
    handleSignInUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password,
        });
      }
    },
  },
};
</script>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
