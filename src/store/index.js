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
    rules.push((r) => !!r || vars.label + " is required");
  if (vars.rules) rules = rules.concat(vars.rules);
  return Object.assign({}, defaultModelInfo, vars, { rules });
}

const modelInfo = {
  users: {
    img: getModelInfo({
      text: "Foto",
      value: "img",
      type: "img",
      required: false,
      sortable: false,
    }),
    firstname: getModelInfo({ text: "Nombre", value: "firstname" }),
    lastname: getModelInfo({ text: "Apellido", value: "lastname" }),
    code: getModelInfo({ text: "Código", value: "code" }),
    rol: getModelInfo({
      text: "Rol",
      value: "rol",
      type: "relation",
      related: "",
    }),
    state: getModelInfo({
      text: "Estado Activo",
      value: "state",
      type: "boolean",
    }),
    subjects: getModelInfo({
      text: "Materias",
      value: "subjects",
      type: "relationMany",
      related: "",
      show: false,
    }),
    educational: getModelInfo({
      text: "Institución",
      value: "educational",
      show: false,
    }),
  },
  Subjects: {
    name: "Matemáticas",
    code: "MAT",
    rubric: "default",
    students: ["1144", "1155", "1166"],
  },
  Dimensions: {
    min: 4.7,
    name: "S",
    description: "Superior",
  },
  Termns: {
    code: "2020-1",
    startAt: "2020/01/01",
    endAt: "2020/05/01",
  },
  rubrics: {
    name: "default",
    subrubrics: undefined,
    percentages: {
      P1: { value: 25, name: "Parcial 1", code: "P1" },
      P2: { value: 25, name: "Parcial 2", code: "P2" },
      P3: { value: 25, name: "Parcial 3", code: "P3" },
      P4: { value: 25, name: "Parcial 4", code: "P4" },
    },
  },
  Grades: {
    rubricName: "defaulr",
    gradeValue: 5,
    gradedDate: "2020/05/01",
  },
};

export default new Vuex.Store({
  state: {
    modelInfo: modelInfo,
    routes: [
      {
        title: "Inicio",
        icon: "mdi-home",
        to: { name: "Home" },
      },
      {
        title: "Usuarios",
        icon: "mdi-account-group",
        to: { name: "List", params: { element: "users" } },
      },
      {
        title: "Materias",
        icon: "mdi-notebook-multiple",
        to: { name: "List", params: { element: "subjects" } },
      },
      {
        title: "Dimensiones",
        icon: "mdi-sitemap",
        to: { name: "List", params: { element: "dimensions" } },
      },
      {
        title: "Periodos",
        icon: "mdi-timetable",
        to: { name: "List", params: { element: "termns" } },
      },
      {
        title: "Calificaciones",
        icon: "mdi-format-list-bulleted-type",
        to: { name: "List", params: { element: "grades" } },
      },
    ],
    authUser: undefined,
    educationalAccount: {
      name: "Icesi",
      code: "4411",
      user: "1100",
      logo: "",
      address: "",
      phone: "",
      email: "icesi@correo.com",
      maxGrade: 5,
    },
    users: {
      "1144": {
        firstname: "Camilo",
        lastname: "Lopez",
        code: "1144",
        rol: "student",
        courses: [],
        img: "",
        state: true,
        educational: "4411",
      },
      "1155": {
        firstname: "Carlos",
        lastname: "Hernandez",
        code: "1155",
        rol: "student",
        courses: [],
        img: "",
        state: true,
        educational: "4411",
      },
      "1166": {
        firstname: "José",
        lastname: "Restrepo",
        code: "1166",
        rol: "student",
        courses: [],
        img: "",
        state: true,
        educational: "4411",
      },
      "1100": {
        firstname: "David",
        lastname: "Jaramillo",
        code: "1100",
        rol: "teacher",
        subjects: [],
        img: "",
        state: true,
        educational: "4411",
      },
    },
    rubric: {
      default: {
        name: "default",
        subrubrics: undefined,
        percentages: {
          P1: { value: 25, name: "Parcial 1", code: "P1" },
          P2: { value: 25, name: "Parcial 2", code: "P2" },
          P3: { value: 25, name: "Parcial 3", code: "P3" },
          P4: { value: 25, name: "Parcial 4", code: "P4" },
        },
      },
    },
    subjects: {
      MAT: {
        name: "Matemáticas",
        code: "MAT",
        rubric: "default",
        students: ["1144", "1155", "1166"],
      },
      ESP: {
        name: "Español",
        code: "ESP",
        rubric: "default",
        students: ["1144", "1155", "1166"],
      },
      ENG: {
        name: "Inglés",
        code: "ENG",
        rubric: "default",
        students: ["1144", "1155", "1166"],
      },
    },
    terms: {
      "2020-1": {
        code: "2020-1",
        startAt: "2020/01/01",
        endAt: "2020/05/01",
      },
      "2020-2": {
        code: "2020-2",
        startAt: "2020/06/01",
        endAt: "2020/11/01",
      },
    },
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
        min: -1,
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
  },
  mutations: {},
  actions: {
    load: function({ commit }, payload) {
      // commit('LOAD', res.data)
      console.log(commit, payload);
    },
  },
  modules: {},
});
