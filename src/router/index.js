import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import List from "../views/List.vue";
import Detail from "../views/Detail.vue";
import Form from "../views/Form.vue";
import Evaluation from "../views/Evaluation.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/courses'
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/create/:element",
    name: "Create",
    component: Form,
  },
  {
    path: "/evaluation/:id",
    name: "Evaluation",
    component: Evaluation,
  },
  {
    path: "/edit/:element/:id",
    name: "Edit",
    component: Form,
  },
  {
    path: "/:element",
    name: "List",
    component: List,
  },
  {
    path: "/:element/:id",
    name: "Detail",
    component: Detail,
  },
  
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
