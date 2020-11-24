<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="0">
      <v-spacer></v-spacer>

      <v-btn
        :to="{name:'Login'}"
        
        text
      >
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
        
        <v-list-item-title v-if="drawerMini">
          <h3>LN</h3>
        </v-list-item-title>
        <v-list-item-title v-else>
          <h3>LIBRO DE NOTAS</h3>
        </v-list-item-title>

        <v-btn icon @click.stop="drawerMini = !drawerMini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-list dense class="mt-5">
        <v-list-item v-for="item in items" :key="item.title" link :to="{name:item.to}">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: true,
    drawerMini: true,
    items: [
      { title: "Inicio", icon: "mdi-home" , to: "Home"},
      { title: "Usuarios", icon: "mdi-account-group", to:"Users" },
      { title: "Materias", icon: "mdi-notebook-multiple", to:"Users" },
      { title: "Dimensiones", icon: "mdi-sitemap", to:"Users" },
      { title: "Periodos", icon: "mdi-timetable", to:"Users" },
      { title: "Calificaciones", icon: "mdi-format-list-bulleted-type", to:"Users" },
    ],
  }),
};
</script>
