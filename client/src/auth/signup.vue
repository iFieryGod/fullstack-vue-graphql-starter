<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Getting Started</h1>
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
              @submit.prevent="handleSignUpUser"
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
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="emailRules"
                    v-model="email"
                    prepend-icon="mdi-email"
                    label="Email"
                    type="email"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="passwordConfirmation"
                    prepend-icon="mdi-password"
                    label="Confirm Password"
                    type="password"
                    required
                  ></v-text-field>
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
                    Sign Up
                  </v-btn>
                  <h3>Already have an acocunt?</h3>
                  <router-link to="/login">SIgn In</router-link>
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
  name: "SignUp",
  data: () => {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        (username) => !!username || "Username is required",
        (username) =>
          username.length < 10 || "Username must be less than 10 characters",
      ],
      emailRules: [
        (email) => !!email || "Email is required",
        (email) => /.@./.test(email) || "email must be valid",
      ],
      passwordRules: [
        (password) => !!password || "password is required",
        (password) =>
          password.length >= 4 || "password must be more than four characters",
      ],
    };
  },
  computed: {
    ...mapGetters(["loading", "error", "user"]),
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    },
  },
  methods: {
    handleSignUpUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signUpUser", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
      }
    },
  },
};
</script>
