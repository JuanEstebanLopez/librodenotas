import Vue from "vue";
import Vuex from "vuex";
import axios from "../helpers/axios";
Vue.use(Vuex);

console.log(axios);

const defaultModelInfo = {
  type: "text",
  required: true,
  sortable: true,
  actions: undefined,
  show: true,
};

function getModelInfo(vars = {}) {
  var rules = []; // [ (email) => !!email || "Email is required", (email) =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) ||  "Email is not valid"]
  if (vars.required !== false)
    rules.push((r) => !!r || vars.label + " es requerido");
  if (vars.rules) vars.rules = rules.concat(vars.rules);
  return Object.assign({}, defaultModelInfo, vars);
}

const modelInfo = {
  users: {
    id: getModelInfo({ text: "ID", value: "id", type: "id", show: false }),
    profile_photo_url: getModelInfo({
      text: "Foto",
      value: "profile_photo_url",
      type: "img",
      required: false,
      sortable: false,
    }),
    name: getModelInfo({ text: "Nombre", value: "name" }),

    email: getModelInfo({
      text: "E-mail",
      value: "email",
      rules: [
        (email) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) ||
          "El Email no es válido",
      ],
    }),
    password: getModelInfo({
      text: "Contraseña",
      value: "password",
      type: "password",
      show: false,
    }),
    created_at: getModelInfo({
      text: "Usuario desde",
      value: "created_at",
      type: "date",
    }),
  },
  courses: {
    id: getModelInfo({ text: "ID", value: "id", type: "id", show: false }),
    name: getModelInfo({ text: "Nombre", value: "name" }),
    code: getModelInfo({ text: "Código", value: "code" }),
    description: getModelInfo({ text: "Descripción", value: "description" }),
    year_id: getModelInfo({
      text: "Año",
      value: "year_id",
      type: "relation",
      to: "years",
    }),
  },
  dimensions: {
    name: getModelInfo({ text: "Nombre", value: "name" }),
    description: getModelInfo({ text: "Descripción", value: "description" }),
    min: getModelInfo({ text: "Mínimo", value: "min", type: "number" }),
  },
  periods: {
    id: getModelInfo({ text: "ID", value: "id", type: "id", show: false }),
    name: getModelInfo({ text: "Nombre", value: "name" }),
    year_id: getModelInfo({
      text: "Año",
      value: "year_id",
      type: "relation",
      to: "years",
    }),

    start_at: getModelInfo({
      text: "Fecha inicial",
      value: "start_at",
      type: "date",
    }),
    created_at: getModelInfo({
      text: "Fecha Final",
      value: "finish_at",
      type: "date",
    }),
  },
  years: {
    id: getModelInfo({ text: "ID", value: "id", type: "id", show: false }),
    name: getModelInfo({ text: "Nombre", value: "name" }),
    start_at: getModelInfo({
      text: "Fecha inicial",
      value: "start_at",
      type: "date",
    }),
    created_at: getModelInfo({
      text: "Fecha Final",
      value: "finish_at",
      type: "date",
    }),
    periods: getModelInfo({
      text: "Periodos",
      value: "periods",
      to: "periods",
      type: "relationMany",
      show: false,
    }),
  },
  rubrics: {
    name: getModelInfo({ text: "Nombre", value: "name" }),
    subrubrics: getModelInfo({
      text: "Sub rúbricas",
      value: "subrubrics",
      type: "specialRelation",
      show: false,
    }),
    percentages: getModelInfo({
      text: "Porcentajes",
      value: "percentages",
      type: "object",
      show: false,
    }),
  },
  grades: {
    id: getModelInfo({ text: "ID", value: "id", type: "id", show: false }),
    user_id: getModelInfo({
      text: "Usuario",
      value: "user_id",
      type: "relation",
      to: "users",
    }),
    course_id: getModelInfo({
      text: "Curso",
      value: "course_id",
      type: "relation",
      to: "courses",
    }),
    period_id: getModelInfo({
      text: "Periodo",
      value: "period_id",
      type: "relation",
      to: "periods",
    }),
    grade: getModelInfo({
      text: "Nota",
      value: "grade",
      type: "number",
    }),
    user: getModelInfo({
      text: "Usuario",
      value: "user",
      type: "relationVal",
      to: "users",
      show: false,
    }),
    course: getModelInfo({
      text: "Curso",
      value: "course",
      type: "relationVal",
      to: "courses",
      show: false,
    }),
    period: getModelInfo({
      text: "Periodo",
      value: "period",
      type: "relationVal",
      to: "periods",
      show: false,
    }),
  },
};

export default new Vuex.Store({
  state: {
    modelInfo: modelInfo,
    routes: [
      {
        title: "Usuarios",
        icon: "mdi-account-group",
        to: { name: "List", params: { element: "users" } },
      },
      {
        title: "Materias",
        icon: "mdi-notebook-multiple",
        to: { name: "List", params: { element: "courses" } },
      },
      {
        title: "Dimensiones",
        icon: "mdi-sitemap",
        to: { name: "List", params: { element: "dimensions" } },
      },
      {
        title: "Periodos",
        icon: "mdi-timetable",
        to: { name: "List", params: { element: "periods" } },
      },
      {
        title: "Años lectivos",
        icon: "mdi-calendar",
        to: { name: "List", params: { element: "years" } },
      },
      {
        title: "Calificaciones",
        icon: "mdi-format-list-bulleted-type",
        to: { name: "List", params: { element: "grades" } },
      },
    ],
    authUser: undefined,
    users: {},
    courses: {},
    periods: {},
    years: {},
    teachers: {},
    students: {},
    dimensions: {
      S: {
        min: 4.7,
        name: "S",
        description: "Superior",
      },
      A: {
        min: 4.2,
        name: "A",
        description: "Alto",
      },
      B: {
        min: 3.5,
        name: "B",
        description: "Bueno",
      },
      I: {
        min: 1,
        name: "I",
        description: "Insuficiente",
      },
      N: {
        min: 0,
        name: "N",
        description: "No valorado",
      },
    },
    grades: {},
    roles: {
      teacher: {
        name: "Profesor",
        id: "teacher",
      },
      student: {
        name: "Estudiante",
        id: "student",
      },
    },
  },
  getters: {
    routes: (state) => state.routes,
    modelInfo: (state) => state.modelInfo,
    users: (state) => state.users,
    courses: (state) => state.courses,
    dimensions: (state) => state.dimensions,
    periods: (state) => state.periods,
    years: (state) => state.years,
    grades: (state) => state.grades,
    teachers: (state) => state.teachers,
    students: (state) => state.students,
  },
  mutations: {
    LOAD: (state, payload) => {
      state[payload.key] = Object.assign({}, state[payload.key] || {}, payload.data); // payload.data; //
      return state[payload.key];
    },
  },
  actions: {
    load: function({ commit }, payload) {
      var key = payload.includes("/") ? payload.split("/")[0] : payload;
      axios
        .get(payload)
        .then((res) => {
          if (Array.isArray(res.data))
            return res.data.reduce((allData, actualData) => {
              allData[actualData.id] = actualData;
              return allData;
            }, {});
          var dt = {};
          dt[res.data.id] = res.data;
          return dt;
        })
        .then((data) => commit("LOAD", { key, data }))
        .catch((e) => alert(e));
    },
    delete: function({ dispatch }, { element, id }) {
      axios
        .delete(element + "/" + id)
        .then(() => dispatch("load", element))
        .catch(() => alert("error al eliminar el " + element + " " + id));
    },
    create: function({ dispatch }, { route, data }) {
      axios
        .post(route, data)
        .then(() => dispatch("load", route))
        .catch(() => alert("error al crear un nuevo elemento"));
    },
    update: function({ dispatch }, { route, data }) {
      axios
        .put(route, data)
        .then(() => dispatch("load", route))
        .catch(() => alert("error al actualizar el elemento"));
    },
  },
  modules: {},
});
