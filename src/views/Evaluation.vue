<template>
  <v-container class="detail">
    <v-row class="px-3">
      <h1 v-if="userID" v-text="'Calificaciones de ' + studentObject.name" />
      <h1 v-else>Estudiante inválido</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="gradesList"
          hide-default-header
          hide-default-footer
          class="elevation-3"
        >
          <template v-slot:header="{ props }">
            <tr class="text-center border">
              <th>
                <b>
                  Materia
                </b>
              </th>
              <th
                v-for="(h, hi) in props.headers"
                :key="'hd_' + hi"
                class="py-5"
              >
                <b v-text="h.text" />
              </th>
              <th>
                <b>
                  Nota Final
                </b>
              </th>
            </tr>
          </template>
          <template v-slot:item="{ item }">
            <tr class="text-center">
              <td v-text="item.course_name"></td>
              <td
                v-for="(h, hi) in headers"
                :key="'h_' + hi"
                class="py-5 gradeForm"
              >
                <v-text-field
                  v-if="grades[item.course_id][h.id].edit"
                  v-model="grades[item.course_id][h.id].value"
                  @change="grades[item.course_id][h.id].status = 'modified'"
                  type="number"
                  label="Nota"
                ></v-text-field>
                <span v-else v-text="item[h.id].value"></span>
                <div class="actions">
                  <v-btn
                    v-if="grades[item.course_id][h.id].edit"
                    class="mr-5"
                    x-small
                    elevation="1"
                    fab
                    color="success"
                    @click="saveGrade(item.course_id, h.id)"
                    ><v-icon>mdi-check</v-icon></v-btn
                  >
                  <v-btn
                    v-else
                    class="mr-5"
                    x-small
                    elevation="1"
                    fab
                    color="primary"
                    @click="openEditGrade(item.course_id, h.id)"
                    ><v-icon>mdi-pencil</v-icon></v-btn
                  >
                </div>
              </td>
              <td v-text="finalGrade(item.course_id)"></td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { dateFormat } from "../helpers/formats";
const defaultUserImage = require("../assets/defaultuser.png");
export default {
  name: "Evaluation",
  data() {
    return {
      formData: {},
      comparableDateMenu: {},
      comparableDateString: {},
      updateList: false,
      grades: {},
    };
  },
  computed: {
    defaultUserImage() {
      return defaultUserImage;
    },
    userID() {
      return this.$route.params.id;
    },
    studentObject() {
      if (
        this.$store.getters["users"] &&
        this.$store.getters["users"][this.userID]
      )
        return this.$store.getters["users"][this.userID];
      return {};
    },
    periods() {
      return this.$store.getters["periods"];
    },
    courses() {
      var courses = this.$store.getters["courses"];
      if (!this.$store.getters["students"] || !courses) return [];
      var list = Object.values(this.$store.getters["students"]).map(
        (s) => s.course_id
      );
      return Array.from(new Set(list)).map((c) => courses[c]);
    },
    headers() {
      return Object.values(this.periods).map((h) =>
        Object.assign({ text: h.name }, h)
      );
    },
    gradesList() {
      return Object.values(this.grades);
    },
    gradesCourses() {
      var list = Object.values(this.$store.getters["grades"]).filter(
        (s) => s.user_id == this.userID
      );
      var grades = list.reduce((all, g) => {
        if (!all[g.course_id]) all[g.course_id] = {};
        all[g.course_id][g.period_id] = { id: g.id, value: g.grade };
        return all;
      }, {});
      return grades;
    },
  },
  watch: {
    studentObject: function(val) {
      this.updateFormData(val);
    },
    gradesCourses: function(val) {
      this.updategradesForm(val);
    },
  },
  methods: {
    dateFormat,
    updateElement(element, id = undefined) {
      var route = id ? element + "/" + id : element;
      this.$store.dispatch("load", route);
    },
    getRelatedList(to) {
      var list = Object.values(this.$store.getters[to]);
      if (list.length > 0) return list;
      else if (!this.updateList) {
        this.updateElement(to);
        this.updateList = true;
      }
      return [];
    },
    openEditGrade(course_id, period_id) {
      // console.log(course_id, period_id);
      var course = this.grades[course_id]; //this.grades.find((g) => g.course_id == course_id);
      if (course) this.$set(course[period_id], "edit", true);
      // console.log(course, course.edit);
    },
    saveGrade(course_id, period_id) {
      var course = this.grades[course_id];
      if (course) {
        this.$set(course[period_id], "edit", false);
        var period = course[period_id];
        var data = {
          course_id,
          period_id,
          user_id: this.userID,
          grade: period.value,
        };

        var h_method = "create";
        var h_route = "grades";
        if (period.id) {
          h_method = "update";
          h_route = "grades/" + period.id;
        }
        this.$store
          .dispatch(h_method, {
            route: h_route,
            data: data,
          })
          .then(() => {
            console.log("creado");
            this.$set(course[period_id], "status", "saved");
            this.$store.dispatch("load", "grades");
          });
      }
    },
    updategradesForm(grades) {
      var oldGrades = this.grades;
      /*this.grades.reduce((grs, o) => {
        grs[o.course_id] = o;
        return grs;
      }, {});*/
      var periods = Object.values(this.periods).sort((a, b) =>
        a.start_at.localeCompare(b.start_at)
      );
      var newGrades = {};

      console.log(oldGrades, periods);
      this.courses.forEach((c) => {
        var oldG = oldGrades[c.id];
        var newG = { course_id: c.id, course_name: c.name };

        periods.forEach((p) => {
          if (oldG && oldG[p.id] && oldG[p.id].status == "modified") {
            newG[p.id] = oldG[p.id];
          } else {
            var g = grades[c.id] ? grades[c.id][p.id] : undefined;
            if (g) {
              newG[p.id] = {
                period_id: p.id,
                status: "updated",
                id: g.id,
                value: g.value,
                edit: false,
              };
            } else {
              newG[p.id] = {
                period_id: p.id,
                status: "none",
                id: undefined,
                value: undefined,
                edit: false,
              };
            }
          }
        });
        newGrades[c.id] = newG;
      });

      this.grades = newGrades;
    },
    finalGrade(course_id) {
      var grades = this.grades[course_id]; // .find((g) => g.course_id == course_id);
      if (!grades) return "N/A";
      var list = Object.values(grades).filter(
        (g) => g.status && g.status != "none"
      );
      if (list.length == 0) return "N/A";

      console.log(list, course_id);

      return (
        list.reduce((total, period) => total + parseInt(period.value), 0) /
        list.length
      ).toFixed(1);
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
    create(gradeData) {
      this.$store
        .dispatch("create", {
          route: "grades",
          data: gradeData,
        })
        .then(() => {
          console.log("graded!!!");
        });
    },
    update(gradeID, gradeData) {
      this.$store
        .dispatch("update", {
          route: "grades/" + gradeID,
          data: gradeData,
        })
        .then(() => {
          console.log("graded!!!");
        });
    },
  },
  created() {
    if (this.$route.params.id) {
      this.$store.dispatch("load", "courses");
      this.$store.dispatch("load", "users/" + this.$route.params.id);
      this.$store.dispatch("load", "students");
      this.$store.dispatch("load", "grades");
      this.$store.dispatch("load", "periods");
    }
  },
};
</script>
<style scoped>
tr.border th {
  border-bottom: thin solid rgba(0, 0, 0, 0.2);
}
.gradeForm {
  position: relative;
}
.gradeForm:hover .actions {
  display: initial;
}
.gradeForm .actions {
  display: none;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
