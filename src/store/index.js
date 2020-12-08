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
    /*
    "id": 1,
	"name": "Proferos 1",
	"email": "profesor1@gmail.com",
	"email_verified_at": null,
	"current_team_id": null,
	"profile_photo_path": null,
	"created_at": "2020-12-08T15:12:15.000000Z",
	"updated_at": "2020-12-08T15:12:15.000000Z",
	"profile_photo_url": "https:\/\/ui-avatars.com\/api\/?name=Proferos+1&color=7F9CF5&background=EBF4FF"
*/
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
    /*
----- code:"MAT"
created_at:"2020-12-08T15:12:15.000000Z"
----- description:"Matemáticas"
----- id:1
----- name:"Matemáticas"
updated_at:"2020-12-08T15:12:15.000000Z"
----- year_id:1
*/

    id: getModelInfo({ text: "ID", value: "id", type: "id", show: false }),
    name: getModelInfo({ text: "Nombre", value: "name" }),
    code: getModelInfo({ text: "Código", value: "code" }),
    description: getModelInfo({ text: "Descripción", value: "description" }),
    year_id: getModelInfo({ text: "ID de año", value: "year_id", show: false }),
    /*rubric: getModelInfo({
      text: "Rúbrica",
      value: "rubric",
      type: "relation",
      show: false,
    }),*/
    students: getModelInfo({
      text: "Estudiantes",
      value: "students",
      type: "relationMany",
      show: false,
    }),
  },
  dimensions: {
    min: getModelInfo({ text: "Mínimo", value: "min", type: "number" }),
    name: getModelInfo({ text: "Nombre", value: "name" }),
    description: getModelInfo({ text: "Descripción", value: "description" }),
  },
  terms: {
    code: getModelInfo({ text: "Código", value: "code" }),
    startAt: getModelInfo({
      text: "Fecha inicial",
      value: "startAt",
      type: "date",
    }),
    endAt: getModelInfo({ text: "Fecha Final", value: "endAt", type: "date" }),
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
    /*
    percentages: {
      P1: { value: 25, name: "Parcial 1", code: "P1" },
      P2: { value: 25, name: "Parcial 2", code: "P2" },
      P3: { value: 25, name: "Parcial 3", code: "P3" },
      P4: { value: 25, name: "Parcial 4", code: "P4" },
    },
    */
  },
  grades: {
    rubricName: getModelInfo({
      text: "Rúbrica",
      value: "rubricName",
      type: "relation",
      show: false,
    }),
    percentageID: getModelInfo({
      text: "Identificador",
      value: "percentageID",
      show: false,
    }),
    gradeValue: getModelInfo({
      text: "Nota",
      value: "gradeValue",
      type: "number",
    }),
    gradedDate: getModelInfo({
      text: "Fecha de calificación",
      value: "gradedDate",
      type: "date",
    }),
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
        to: { name: "List", params: { element: "terms" } },
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
        courses: [],
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
    courses: {
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
    terms: (state) => state.terms,
    grades: (state) => state.grades,
  },
  mutations: {
    LOAD: (state, payload) => {
      state[payload.key] = payload.data;
      return state[payload.key];
    },
  },
  actions: {
    load: function({ commit }, payload) {
      axios
        .get(payload)
        .then((res) => {
          return res.data.reduce((allData, actualData) => {
            allData[actualData.id] = actualData;
            return allData;
          }, {});
        })
        .then((data) => commit("LOAD", { key: payload, data }))
        .catch((e) => alert(e));
      console.log(commit, payload);
    },
  },
  modules: {},
});
