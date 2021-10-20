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
        (v) => v.length <= 10 || "*Maximo 10 caracteres",
      ],
    };
  },
  methods: {
      ingresar() {
      this.dialog = true  
      axios
        .post(RUTA_SERVIDOR+"/api/token/", {
          username: this.usuario,
          password: this.contra,
        })
        .then((response) => {
          localStorage.setItem("keyValue", response.data.access);
          this.dialog = false
          this.$router.push("/go");
        })
        .catch((response) => {
          this.value = true;
          this.dialog = false
        });
    },
    actualizar() {
      this.value = false;
    },
  },
  created() {},
};
</script>
