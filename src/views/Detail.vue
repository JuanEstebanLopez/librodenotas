<template>
  <v-container class="detail">
    <v-row>
      <img v-if="elementObject.img" src="" alt="" />
      <h1 v-text="elementObject.name" />
    </v-row>
  </v-container>
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
    elementID() {
      return this.$route.params.id;
    },
    elementObject() {
      if (
        this.$store.getters[this.elementName] &&
        this.$store.getters[this.elementName][this.elementID]
      )
        return this.$store.getters[this.elementName][this.elementID];
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
    modelImage() {
      var img = Object.values(this.headers).find((h) => h.type === "img");
      if (img) return img.value;
      return false;
    },
  },
  watch: {
    elementName: function(val) {
      this.updateElement(val, this.elementID);
    },
  },
  methods: {
    dateFormat,
    updateElement(element, id) {
      this.$store.dispatch("load", element + "/" + id);
    },
  },
  created() {
    if (this.$route.params.element && this.$route.params.id) {
      this.$store.dispatch(
        "load",
        this.$route.params.element,
        this.$route.params.id
      );
    }
  },
};
</script>
