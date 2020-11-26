import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import List from "../views/List.vue";
/*
import Users from "../views/Users.vue";
import Subjects from "../views/Subjects.vue";
import Dimensions from "../views/Dimensions.vue";
import Termns from "../views/Termns.vue";
import Grades from "../views/Grades.vue";
*/
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/:element",
    name: "List",
    component: List,
  },
  /*
  {
    path: "/usuarios",
    name: "Users",
    component: Users,
  },
  {
    path: "/materias",
    name: "Subjects",
    component: Subjects,
  },
  {
    path: "/dimensiones",
    name: "Dimensions",
    component: Dimensions,
  },
  {
    path: "/periodos",
    name: "Termns",
    component: Termns,
  },
  {
    path: "/calificaiones",
    name: "Grades",
    component: Grades,
  }, 
  */
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
