<template>
  <v-container class="detail">
    <v-row class="px-3">
      <v-avatar v-if="modelImage" size="56" class="mr-4">
        <img
          :src="elementObject[modelImage]"
          :alt="elementObject.name + ' image'"
        />
      </v-avatar>
      <h1 v-text="elementObject.name" />
      <v-spacer></v-spacer>
      <v-btn
        class="mr-3"
        small
        elevation="2"
        fab
        color="primary"
        :to="{
          name: 'Edit',
          params: {
            element: elementName,
            id: elementID,
          },
        }"
        ><v-icon>mdi-pencil</v-icon></v-btn
      >
      <v-btn
        class="mr-3"
        small
        elevation="2"
        fab
        color="error"
        @click="deleteConfirm"
        ><v-icon>mdi-trash-can-outline</v-icon></v-btn
      >
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
                <v-avatar
                  v-if="h.type == 'img'"
                  width="2.5em"
                  height="2.5em"
                  class="ma-2"
                >
                  <img
                    :src="elementObject[h.value] || defaultUserImage"
                    :alt="h.text"
                  />
                </v-avatar>
                <span v-else-if="h.type == 'date'">
                  {{ dateFormat(elementObject[h.value]) }}
                </span>
                <span v-else-if="h.type == 'relation'">
                  {{ getRelated(elementObject, h.value, h.to).name }}
                </span>
                <span v-else v-text="elementObject[h.value]" />
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline red--text text--darken-2">
          Eliminar {{ elementName }}
        </v-card-title>
        <v-card-text
          >¿Seguro que quiere eliminar a {{ elementObject.name }}?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="deleteDialog = false">
            cancelar
          </v-btn>
          <v-btn color="red darken-1" text @click="deleteElement">
            eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { dateFormat } from "../helpers/formats";
const defaultUserImage = require("../assets/defaultuser.png");
export default {
  name: "Detail",
  data() {
    return { deleteDialog: false };
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
        .map(({ type, text, value, sortable, actions, to }) => ({
          type,
          text,
          value,
          sortable,
          actions,
          to,
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
    updateElement(element, id = undefined) {
      var route = id ? element + "/" + id : element;
      this.$store.dispatch("load", route);
    },
    getRelated(element, key, to) {
      var k = key.includes("_") ? key.split("_")[0] : key;
      if (element[k]) return element[k];
      var related = this.$store.getters[to][element[key]];
      if (related) return related;
      else if (Object.keys(this.$store.getters[to]) == 0)
        this.updateElement(to);
      return {};
    },
    deleteConfirm() {
      this.deleteDialog = true;
    },
    deleteElement() {
      this.$store
        .dispatch("delete", {
          element: this.elementName,
          id: this.elementID,
        })
        .then(() =>
          this.$router.push({
            name: "List",
            params: { element: this.elementName },
          })
        );
    },
  },
  created() {
    if (this.$route.params.element && this.$route.params.id) {
      this.$store.dispatch(
        "load",
        this.$route.params.element + "/" + this.$route.params.id
      );
    }
  },
};
</script>
