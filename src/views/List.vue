<template>
  <div class="section">
    <h1>Lista de: {{ element }}</h1>
    <v-data-table
      :headers="headers"
      :items="list"
      :search="search"
      class="elevation-3"
      :items-per-page="-1"
      :footer-props="{
        itemsPerPageOptions: [5, 10, 30, 100, -1],
        disableItemsPerPage: false,
      }"
      @click:row="openElement"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="(h, hi) in headers" :key="'h_' + hi" class="py-5">
            <v-avatar
              v-if="h.type == 'img'"
              width="2.5em"
              height="2.5em"
              class="ma-2"
            >
              <img :src="item[h.value] || defaultUserImage" :alt="h.text" />
            </v-avatar>
            <span v-else-if="h.type == 'date'">
              {{ dateFormat(item[h.value]) }}
            </span>
            <span v-else v-text="item[h.value]" />
          </td>
          <td>
            <router-link
              :to="{
                name: 'Detail',
                params: { element: element, code: item.code },
              }"
            >
              <v-icon>mdi-arrow-right-thick</v-icon>
            </router-link>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { dateFormat } from "../helpers/formats";
const defaultUserImage = require("../assets/defaultuser.png");
export default {
  name: "List",
  data() {
    return {
      search: "",
    };
  },
  computed: {
    defaultUserImage() {
      return defaultUserImage;
    },
    element() {
      return this.$route.params.element;
    },
    list() {
      if (!this.element) return [];
      console.log(this.element);
      console.log(this.$store.getters[this.element]);
      return Object.values(this.$store.getters[this.element]);
    },
    headers() {
      return Object.values(this.$store.getters["modelInfo"][this.element])
        .filter((h) => h.show)
        .map(({ type, text, value, sortable, actions }) => ({
          type,
          text,
          value,
          sortable,
          actions,
        }));
    },
  },
  methods: {
    dateFormat,
    openElement() {},
  },
  created() {
    if (this.$route.params.element) {
      this.$store.dispatch("load", this.$route.params.element);
    }
  },
};
</script>

<style>
a {
  text-decoration: none;
  color: inherit;
}
</style>
