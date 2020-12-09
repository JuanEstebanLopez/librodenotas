<template>
  <div class="section">
    <v-row class="px-3">
      <h1>Lista de: {{ element }}</h1>
      <v-spacer></v-spacer>
      <v-btn
        class="mr-3"
        small
        elevation="2"
        fab
        color="primary"
        :to="{
          name: 'Create',
          params: {
            element: element,
          },
        }"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </v-row>

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
          <td v-if="element !== 'dimensions'">
            <router-link
              :to="{
                name: 'Detail',
                params: { element: element, id: item.id },
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
  watch: {
    element: function(val) {
      this.updateElement(val);
    },
  },
  methods: {
    dateFormat,
    updateElement(element) {
      if (element !== "dimensions") this.$store.dispatch("load", element);
    },
  },
  created() {
    if (this.$route.params.element) {
      this.updateElement(this.$route.params.element);
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
