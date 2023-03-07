<template>
  <div>
    <NavBar />
    <div class="row">
      <div class="col-sm-2">
        <v-card class="mx-auto" width="100%" height="100vh" tile>
          <v-navigation-drawer permanent>
            <v-list>
              <v-list-item>
                <v-list-item-avatar> </v-list-item-avatar>
              </v-list-item>

              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="text-h6"> CNSR </v-list-item-title>
                  <v-list-item-subtitle>ESSALUD</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ nombre }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-icon>mdi-menu-down</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list nav dense>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon v-text="items2[0].icon"></v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="items2[0].text"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon v-text="items2[1].icon"></v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="items2[1].text"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon v-text="items2[2].icon"></v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="items2[2].text"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon v-text="items2[3].icon"></v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="items2[3].text"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </div>
      <div v-if="selectedItem == 0" class="col-sm-10"><CuposParame /></div>
      <div v-if="selectedItem == 1" class="col-sm-10"><CuposConfPuesto /></div>
      <div v-if="selectedItem == 2" class="col-sm-10"><CuposAsisPaciente /></div>
      <div v-if="selectedItem == 3" class="col-sm-10"><CuposReporte /></div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/navbar/NavBar.vue";
import CuposParame from "./CuposParame.vue"
import CuposConfPuesto from "./CuposConfPuesto.vue"
import CuposAsisPaciente from "./CuposAsisPaciente.vue"
import CuposReporte from "./CuposReporte.vue"

export default {
  data() {
    return {
      perfil: "",
      nombre: "",
      selectedItem: null,
      items2: [
        { text: "Parametrizacion Centro", icon: "mdi-folder" },
        { text: "Configuración Puesto", icon: "mdi-folder" },
        { text: "Asistencias de Paciente", icon: "mdi-folder" },
        { text: "Reportes", icon: "mdi-folder" },
      ],
    };
  },
  methods: {},
  mounted() {
    if (!sessionStorage.getItem("keyValue")) {
      this.$router.push("/");
    }
  },
  created() {
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    console.log("Perfil", this.perfil);
    console.log("nombre", this.nombre);
  },
  components: {
    NavBar,
    CuposParame,
    CuposConfPuesto,
    CuposAsisPaciente,
    CuposReporte,
  },
};
</script>
