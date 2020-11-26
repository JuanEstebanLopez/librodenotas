<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="0">
      <v-spacer></v-spacer>

      <v-btn :to="{ name: 'Login' }" text>
        <span class="mr-2">Iniciar sesión</span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      app
      v-model="drawer"
      :mini-variant.sync="drawerMini"
      permanent
    >
      <v-list-item class="px-3 py-2 primary" dark>
        <v-list-item-title>
          <h3 v-text="drawerMini ? 'LN' : 'LIBRO DE NOTAS'" />
        </v-list-item-title>

        <v-btn icon @click.stop="drawerMini = !drawerMini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-list class="mt-5">
        <v-list-item v-for="item in items" :key="item.title" link :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bkg-color">
      <router-view class="py-8 px-8" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    drawer: true,
    drawerMini: true,
  }),
  computed: {
    items() {
      return this.$store.getters["routes"];
    },
  },
};
</script>
<style>
.bkg-color {
  background-color: #f8f8f8;
}
</style>
