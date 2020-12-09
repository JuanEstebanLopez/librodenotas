<template>
  <v-container class="detail">
    <v-row class="px-3">
      <h1 v-if="elementID" v-text="'Actualizar ' + elementObject.name" />
      <h1 v-else>Crear {{ elementName }}</h1>
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
                <v-menu
                  v-else-if="h.type == 'date'"
                  :ref="'menu_' + h.value"
                  v-model="comparableDateMenu[h.value]"
                  :close-on-content-click="false"
                  :return-value.sync="comparableDateString[h.value]"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      v-model="comparableDateString[h.value]"
                      :label="h.text"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker
                    v-model="formData[h.value]"
                    @change="setComparableDate(h.value)"
                    :rules="h.rules"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="comparableDateMenu[h.value] = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs['menu_' + h.value][0].save(
                          comparableDateString[h.value]
                        )
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <v-text-field
                  v-else
                  :label="h.text"
                  :required="h.required"
                  v-model="formData[h.value]"
                  rules:h.rules
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <div v-if="elementID">
                <v-btn
                  text
                  color="gray"
                  :to="{
                    name: 'Detail',
                    params: { element: elementName, id: elementID },
                  }"
                  >Cancelar</v-btn
                >
                <v-btn color="primary" @click="update">Actualizar</v-btn>
              </div>
              <div v-else>
                <v-btn
                  text
                  color="gray"
                  :to="{ name: 'List', params: { element: elementName } }"
                  >Cancelar</v-btn
                >
                <v-btn color="primary" @click="create">Crear</v-btn>
              </div>
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
      comparableDateMenu: {},
      comparableDateString: {},
      dates: ["2018-09-15", "2018-09-20"],
      menu: false,
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
        .filter((h) => h.type !=="id")
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
      this.updateFormData(val);
    },
  },
  methods: {
    dateFormat,
    updateElement(element, id) {
      this.$store.dispatch("load", element + "/" + id);
    },
    updateFormData(val) {
      this.formData = Object.assign(this.formData, val);
      this.comparableDateMenu = {};
      this.comparableDateString = {};
      this.headers
        .filter((h) => h.type == "date")
        .forEach((h) => {
          this.comparableDateMenu[h.value] = false;
          this.comparableDateString[h.value] = "";
          if (val[h.value]) {
            this.setComparableDate(h.value);
          }
        });
    },
    setComparableDate(val) {
      this.comparableDateString[val] = this.dateFormat(
        this.formData[val] + " GMT-0500"
      );
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
        this.$route.params.element + "/" + this.$route.params.id
      );
    } else {
      this.updateFormData({});
    }
  },
};
</script>
