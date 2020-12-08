<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import { dateFormat } from "../helpers/formats";
const defaultUserImage = require("../assets/defaultuser.png");
export default {
  name: "Detail",

  computed: {
    defaultUserImage() {
      return defaultUserImage;
    },
    elementName() {
      return this.$route.params.element;
    },
    elementObject() {
      if (
        this.$store.getters[this.element] &&
        this.$store.getters[this.element][this.$route.params.id]
      )
        return this.$store.getters[this.element][this.$route.params.id];
      return {};
    },
    headers() {
      return Object.values(this.$store.getters["modelInfo"][this.elementName])
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
  },
  created() {
    if (this.$route.params.element) {
      this.$store.dispatch("load", this.$route.params.element);
    }
  },
};
</script>
