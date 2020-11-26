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
    >
      <template
        v-for="h_img in headersFromType.img"
        v-slot:item[h_img.value]="{ item }"
      >
        <v-avatar
          width="2.5em"
          height="2.5em"
          class="ma-2"
          :key="'img_' + h_img.text"
        >
          <img :src="item.value" :alt="item.text" />
        </v-avatar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
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
    headersFromType() {
      return this.headers.reduce((types, header) => {
        if (!types[header.type]) types[header.type] = [];
        types[header.type].push(header);
        return types;
      }, {});
    },
  },
  methods: {},
  created() {
    if (this.$route.params.element) {
      this.$store.dispatch("load", this.$route.params.element);
    }
  },
};
</script>
