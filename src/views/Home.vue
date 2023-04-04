<template>
  <div class="d-flex flex-column justify-space-between align-center">
    <v-card class="mx-auto my-12" max-width="374">
      <div class="text-center mt-10">
        <h1>Iniciar Sesión</h1>
      </div>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                prepend-icon="mdi-account-circle"
                v-model="usuario"
                :rules="nameRules"
                label="Usuario"
                required
                autocomplete="off"
                @keypress="actualizar"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                prepend-icon="mdi-lock"
                v-model="contra"
                :rules="nameRules"
                label="Contraseña"
                type="password"
                autocomplete="off"
                required
                @keypress="actualizar"
                @keyup.enter="ingresar"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="text-center mt-10 mb-5">
            <v-btn depressed color="primary" large @click="ingresar">
              Ingresar
            </v-btn>
            <v-dialog v-model="dialog" hide-overlay persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Cargando Datos
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
          <v-alert
            border="top"
            color="red"
            dismissible
            outlined
            text
            :value="value"
            type="warning"
          >
            Usuario o Contraseña incorrectos
          </v-alert>
        </v-container>
      </v-form>
    </v-card>
    <span>Versión N° 1.1.5 || DSI - Marzo - 2023</span>
  </div>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

export default {
  data() {
    return {
      dialog: false,
      valid: false,
      usuario: "",
      contra: "",
      value: false,
      nameRules: [
        (v) => !!v || "*Campo obligatorio",
        (v) => v.length <= 15 || "*Maximo 15 caracteres",
      ],
    };
  },
  methods: {
    ingresar() {
      this.dialog = true;
      this.value = false;
      axios
        .post(RUTA_SERVIDOR + "/APICNSR/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_SERVIDOR + "/APICNSR/usuario/?search=" + this.usuario, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.dialog = false;
              if (res.data[0].clave == this.contra) {
                console.log("ingreso exitoso");
                sessionStorage.setItem("keyValue", response.data.access);
                sessionStorage.setItem("usuario", res.data[0].usuario);
                sessionStorage.setItem("nombre", res.data[0].nombre);
                sessionStorage.setItem("perfil", res.data[0].perfil);
                sessionStorage.setItem("url", res.data[0].url);
                sessionStorage.setItem(
                  "descripCas",
                  res.data[0].datosCas.descripCas
                );
                sessionStorage.setItem("urlCas", res.data[0].datosCas.url);
                this.$router.push("/go");
              } else {
                console.log("Clave incorrecta");
                this.value = true;
              }
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialog = false;
              this.value = true;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
          this.value = true;
        });
    },
    actualizar() {
      this.value = false;
    },
  },
  created() {
    axios
      .post(RUTA_SERVIDOR + "/APICENTRAL/SgssPacienteQa/rest/pLoginMovilRWs", {
        codOpcion: "1",
        codTipDoc: "1",
        numDoc: "72412676",
        fecNacimiento: "25/02/1998",
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
</script>
