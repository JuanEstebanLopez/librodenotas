<template>
  <v-container class="detail">
    <v-row class="px-3">
      <h1 v-text="elementObject.name" />
    </v-row>
    <v-row>
      <v-col>
        <v-sheet color="white" elevation="3" outlined class="my-3 pa-5">
          <v-container>
            <v-row v-for="(h, hi) in headers" :key="'h_' + hi" class="py-5">
              <v-col md-2>
                <b v-text="h.text" />
              </v-col>
              <v-col md-8>
                <div v-if="h.type == 'img'">
                  <v-avatar
                    v-if="formData[h.value]"
                    width="2.5em"
                    height="2.5em"
                    class="ma-2"
                  >
                    <img :src="formData[h.value]" :alt="h.text" />
                  </v-avatar>

                  <v-text-field
                    type="text"
                    v-model="formData[h.value]"
                    label="Url de la imagen"
                    rules:h.rules
                  />
                </div>
                <span v-else-if="h.type == 'date'">
                  {{ dateFormat(elementObject[h.value]) }}
                </span>
                <v-text-field v-else :label="h.text" :required="h.required" v-model="formData[h.value]" rules:h.rules></v-text-field>
                
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { dateFormat } from "../helpers/formats";
const defaultUserImage = require("../assets/defaultuser.png");
export default {
  name: "Detail",
  data() {
    return {
      formData: {},
    };
  },
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
  },
  watch: {
    elementName: function(val) {
      this.updateElement(val, this.elementID);
    },
    elementObject: function(val) {
      this.formData = Object.assign(this.formData, val);
    },
  },
  methods: {
    dateFormat,
    updateElement(element, id) {
      this.$store.dispatch("load", element + "/" + id);
    },
    create() {
      this.$store
        .dispatch("create", {
          route: this.elementName,
          data: this.formData,
        })
        .then(() =>
          this.$router.push({
            name: "List",
            params: { element: this.elementName },
          })
        );
    },
    update() {
      this.$store
        .dispatch("update", {
          route: this.elementName + "/" + this.elementID,
          data: this.formData,
        })
        .then(() =>
          this.$router.push({
            name: "Detail",
            params: { element: this.elementName, id: this.elementID },
          })
        );
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
