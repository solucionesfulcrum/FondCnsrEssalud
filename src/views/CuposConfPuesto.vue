<template>
  <div>
    <v-bottom-navigation :value="value" class="" color="primary" horizontal>
      <v-container class="">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete
              v-model="editedItem.turno"
              :rules="[rules.required, rules.counter]"
              :items="itemsTurno"
              dense
              label="TURNO"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete
              v-model="editedItem.frecuencia"
              :rules="[rules.required, rules.counter]"
              :items="itemsFrecuencia"
              dense
              label="FRECUENCIA"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn @click="ejecutarTurno">
              <span>EJECUTAR</span>

              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-bottom-navigation>

    <v-dialog v-model="dialogDataApi" hide-overlay persistent width="300">
      <v-card color="#1973a5" dark>
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

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogNoEdit"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>¡Aviso Importante!</v-toolbar>
        <v-card-text>
          <div class="text-h4 pa-5">¡No se puede editar, estado inactivo!</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogNoEdit = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <v-container>
        <v-row>
          <v-col
            :key="indice"
            v-for="(contadorRes, indice) in contadorConf"
            cols="12"
            sm="2"
            md="2"
          >
            <v-card class="mx-auto" max-width="250">
              <v-card-text>
                <div>PUESTO {{contadorRes.numeroPuesto}}</div>
                <p class="text-h5 text--primary">{{contadorRes.tipoPuesto}}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4"> Configurar </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

export default {
  data: () => ({
    value: 1,
    //cupos
    itemsTurno: ["TURNO 1", "TURNO 2", "TURNO 3", "TURNO 4"],
    itemsFrecuencia: ["LUN-MIE-VIE", "MAR-JUE-SAB"],
    itemsEstado: ["true", "false"],
    //perfil data
    perfil: "",
    nombre: "",
    url: "",
    usuario: "",
    //Datos de formulario
    rules: {
      required: (value) => !!value || "Campo Obligatorio.",
      counter: (value) => value.length <= 20 || "Max 20 characters",
    },

    editedItem: {
      //Cupos
      turno: "",
      frecuencia: "",
      capacidad: Number,
    },
    dialog: false,
    dialogEdit: false,
    formAdmi: false,
    dialogDelete: false,
    dialogEditAdm: false,
    dialogNoEdit: false,
    dialogDataApi: false,
    vista: "",
    valid: true,
    datosEdit: "",
    actionBoton: "AGREGAR",
    headers: [],
    desserts: [],
    editedIndex: -1,
    dataex: "",
    defaultItem: {
      turno: "",
      frecuencia: "",
      capacidad: Number,
    },
    contadorConf: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    ejecutarTurno() {
      console.log(this.desserts, "desserts");
      const resultTurno = this.desserts.filter(
        (e) =>
          e.turno == this.editedItem.turno &&
          e.frecuencia == this.editedItem.frecuencia
      );
      //console.log("resultTurno", resultTurno);
      resultTurno.sort((x, y) => x.numeroPuesto - y.numeroPuesto);
      this.contadorConf = resultTurno;
      console.log("contadorConf", this.contadorConf);
    },

    initialize() {
      this.desserts = [];
    },

    editItem(item) {
      console.log("item", item);
      this.editedItem.turno = item.turno;
      this.editedItem.frecuencia = item.frecuencia;
      this.editedItem.capacidad = item.capacidad;
      this.editedItem.estado = item.estado;
      this.datosEdit = item.url;
      if (item.estado == true) {
        this.dialogEdit = true;
      } else {
        this.dialogNoEdit = true;
      }
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {},

    closeFormAdmin() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    edit() {
      axios
        .post(RUTA_SERVIDOR + "/APICNSR/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_SERVIDOR +
                "/APICNSR/parameCentro/" +
                this.datosEdit.split("/")[4] +
                "/",
              {
                estado: false,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.dialogDataApi = true;
              console.log("exito", res.status);
              this.close();
              this.ParameCentroPuestoInit();
              this.dialogEdit = false;
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeEdit() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      console.log("click");
      if (
        !this.editedItem.turno ||
        !this.editedItem.frecuencia ||
        !this.editedItem.capacidad
      ) {
        this.$refs.form.validate();
        console.log("validate");
      } else {
        axios
          .post(RUTA_SERVIDOR + "/APICNSR/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .post(
                RUTA_SERVIDOR + "/APICNSR/parameCentro/",
                {
                  cas: this.urlCas,
                  turno: this.editedItem.turno,
                  frecuencia: this.editedItem.frecuencia,
                  capacidad: this.editedItem.capacidad,
                  estado: true,
                  usuario_reg: this.usuario + "|" + this.nombre,
                },
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                console.log("exito", res.status);
                this.close();
                //console.log(this.editedItem);
                this.ParameCentroPuestoInit();
              })
              .catch((res) => {
                console.log("Error:", res);
                this.dialog = false;
              });
          })
          .catch((response) => {
            response === 404
              ? console.warn("lo sientimos no tenemos servicios")
              : console.warn("Error:", response);
          });
      }
      //console.log('holaaaaaaaa',this.editedItem)
    },

    nutricion() {
      console.log("nutricion");
    },

    cabezeraParameCentro() {
      this.headers = [
        { text: "Turno", value: "turno" },
        {
          text: "Frecuencia",
          align: "start",
          sortable: false,
          value: "frecuencia",
        },
        { text: "Capacidad", value: "capacidad" },
        { text: "Estado", value: "estado" },
        { text: "Actions", value: "actions", sortable: false },
      ];
    },

    ParameCentroPuestoInit() {
      //this.cabezeraParameCentro();
      this.dialogDataApi = true;
      axios
        .post(RUTA_SERVIDOR + "/APICNSR/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(
              RUTA_SERVIDOR +
                "/APICNSR/parameCentroPuesto/?search=true," +
                this.urlCas.split("/")[4],
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.desserts = res.data;
              this.dialogDataApi = false;
              //this.dataAdmi = res.data[0].url.split("/")[4];
              //this.datosPresHis = res.data[0];
              console.log("parametrosPuesto", res.data);
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
  },

  mounted() {
    if (!sessionStorage.getItem("keyValue")) {
      this.$router.push("/");
    }
  },

  created() {
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    this.url = sessionStorage.getItem("url");
    this.usuario = sessionStorage.getItem("usuario");
    this.urlCas = sessionStorage.getItem("urlCas");
    console.log("Url", this.url);
    console.log("Perfil", this.perfil);
    console.log("Nombre", this.nombre);
    console.log("cas", this.urlCas);
    //INICIO DE CONSULTA
    this.ParameCentroPuestoInit();
  },

  components: {},
};
</script>


