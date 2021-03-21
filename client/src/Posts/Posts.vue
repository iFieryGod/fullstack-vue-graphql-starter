<template>
  <v-container fluid grid-list-xl>
    <!-- Post Card -->
    <h1>{{ this.pageNumber }}</h1>
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex
        xs12
        sm6
        v-for="post in infiniteScrollPosts.posts"
        :key="post._id"
      >
        <v-card hover>
          <v-img
            @click.native="goToPost(post._id)"
            :src="post.imageUrl"
            height="30vh"
            lazy
          ></v-img>
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{ post.title }}</div>
                <span class="grey-text"
                  >{{ post.likes }} likes -
                  {{ post.messages.length }} comments</span
                >
              </div>
            </v-card-title>
            <v-btn @click="showPostCreator = !showPostCreator">
              <v-icon>{{
                `mdi-arrow-${showPostCreator ? "up" : "down"}-bold`
              }}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- POst Creator -->
          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list-item>
                <img :src="post.createdBy.avatar" />
              </v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-primary"
                  >{{ post.createdBy.username }}
                </v-list-item-title>
                <v-list-item-subtitle
                  >Added
                  {{
                    formatCreatedDate(post.createdDate)
                  }}</v-list-item-subtitle
                >
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon ripple>
                  <v-icon>mdi-bread-slice</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Fetch More Button -->
    <v-layout v-if="showMoreEnabled" column>
      <v-flex>
        <v-layout justify-center row>
          <v-btn @click="showMorePosts">Fetch More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import { INFINITE_SCROLL_POSTS } from "@/queries";
import { mapGetters } from "vuex";
const pageSize = 2;

export default {
  name: "Post",
  data() {
    return {
      // showMoreEnabled: true,
      showPostCreator: false,
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize,
      },
    },
  },
  computed: {
    ...mapGetters(["pageNumber"]),
    showMoreEnabled() {
      return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore;
    },
  },
  methods: {
    formatCreatedDate(date) {
      return moment(new Date(date)).format("ll");
    },
    goToPost(postId) {
      this.$router.push(`/post/${postId}`);
    },
    showMorePosts() {
      this.$store.commit("setPageNumber");
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // pageNum incremented by 1
          pageNum: this.pageNumber,
          pageSize,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          // this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with the new posts
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore,
            },
          };
        },
      });
    },
  },
};
</script>
