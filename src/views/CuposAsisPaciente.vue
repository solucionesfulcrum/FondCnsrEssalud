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

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogAcredita"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>¡Aviso Importante!</v-toolbar>
        <v-card-text>
          <div class="text-h4 pa-5">
            ¡Lo sentimos, el paciente no esta acreditado!
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogAcredita = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogErrorRegistrado"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>¡Aviso Importante!</v-toolbar>
        <v-card-text>
          <div class="text-h4 pa-5">
            ¡El Paciente ya tiene La Asistencia Registrada!
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogErrorRegistrado = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      persistent
      v-model="dialogRegAsistencia"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>
          Registrar Asistencia de paciente: {{ nombrePacienteDialog }}
        </v-toolbar>
        <v-container class="mt-5">
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-radio-group v-model="editedItem.estado" row>
                <v-radio label="Asistió" value="ASISTIO"></v-radio>
                <v-radio label="Falto" value="FALTO"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col
              v-if="editedItem.estado == 'FALTO'"
              cols="12"
              sm="12"
              md="12"
            >
              <v-autocomplete
                v-model="editedItem.observaFalta"
                :rules="[rules.required, rules.counter]"
                :items="itemsObserva"
                dense
                label="MOTIVO FALTA"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="justify-end">
          <v-btn text @click="grabarAsistenciaPac">Aceptar</v-btn>
          <v-btn text @click="dialogRegAsistencia = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>
      <v-row>
        <v-col
          :key="indice"
          v-for="(contadorRes, indice) in contadorConf"
          cols="12"
          sm="3"
          md="3"
        >
          <v-card class="mx-auto" max-width="350">
            <v-card-text>
              <div>PUESTO {{ contadorRes.datosPueto.numeroPuesto }}</div>
              <p class="text-h5 text--primary">
                {{ contadorRes.datosPueto.tipoPuesto }}
              </p>
              <div>Paciente:</div>
              <v-card-text>
                {{
                  contadorRes.datosPaciente.nombres +
                  " " +
                  contadorRes.datosPaciente.ape_pat +
                  " " +
                  contadorRes.datosPaciente.ape_mat
                }}
              </v-card-text>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="configItem(contadorRes)"
                text
                color="deep-purple accent-4"
                elevation="2"
              >
                Asistencia
              </v-btn>
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
    itemsPuesto: ["NORMAL", "ESPECIAL"],
    itemsObserva: ["HOSPITALIZACION", "NO ESPECIFICADO"],
    //JALAR DATA DE USER
    datosEditPuesto: "",
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
      tipoPuesto: "",
      estado: null,
      numeroPuesto: null,
      observaFalta: "",
    },
    headers: [],
    desserts: [],
    editedIndex: -1,
    dataex: "",
    defaultItem: {
      turno: "",
      frecuencia: "",
      capacidad: Number,
      tipoPuesto: "",
      estado: null,
      numeroPuesto: null,
      observaFalta: "",
    },
    dialog: false,
    dialogEdit: false,
    formAdmi: false,
    dialogDelete: false,
    dialogEditAdm: false,
    dialogNoEdit: false,
    dialogDataApi: false,
    dialogRegAsistencia: false,
    dialogAcredita: false,
    dialogErrorRegistrado: false,
    vista: "",
    valid: true,
    datosEdit: "",
    actionBoton: "AGREGAR",
    contadorConf: [],
    nombrePacienteDialog: "",
    urlPacienteAsistencia: "",
    urlAsigCuposPac: "",
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
    grabarAsistenciaPac() {
      if (this.editedItem.estado == "FALTO" && !this.editedItem.observaFalta) {
        this.$refs.form.validate();
        console.log("validate");
      } else {
        console.log("VALIDADO");
        console.log("grabar asistencia paciente");
        console.log("Estado", this.editedItem.estado);
        console.log("Motivo", this.editedItem.observaFalta);
        console.log("paciente", this.urlPacienteAsistencia);
        console.log("urlAsigCuposPac", this.urlAsigCuposPac);
        console.log(
          "fechaPaciente",
          new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10)
        );
        axios
          .post(RUTA_SERVIDOR + "/APICNSR/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .post(
                RUTA_SERVIDOR + "/APICNSR/asisPacDiario/",
                {
                  asigCuposPac: this.urlAsigCuposPac,
                  estadoAsistencia: this.editedItem.estado,
                  observaFalta: this.editedItem.observaFalta,
                  usuario_reg: this.usuario + "|" + this.nombre,
                  validacionAsistencia: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .substr(0, 10)+"|"+this.urlPacienteAsistencia.split("/")[4],
                },
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                console.log("exito", res.status);
                this.editedItem.estado = "";
                this.editedItem.observaFalta = "";
                this.dialogRegAsistencia = false;
              })
              .catch((res) => {
                this.dialogErrorRegistrado = true;
                this.dialogRegAsistencia = false;
                this.editedItem.estado = "";
                this.editedItem.observaFalta = "";
                console.log("Error:", res);
              });
          })
          .catch((response) => {
            response === 404
              ? console.warn("lo sientimos no tenemos servicios")
              : console.warn("Error:", response);
          });
      }
    },

    cambioPuesto() {
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
                "/APICNSR/parameCentroPuesto/" +
                this.datosEditPuesto.split("/")[4] +
                "/",
              {
                tipoPuesto: this.editedItem.tipoPuesto,
                estado: this.editedItem.estado,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.dialogDataApi = true;
              console.log("exito", res.status);
              //this.close();
              this.dialogRegAsistencia = false;
              this.ejecutarTurno();
              this.ParameCentroPuestoInit();
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

    configItem(item) {
      console.log("item", item);
      axios
        .post(
          RUTA_SERVIDOR + "/APICENTRAL/SgssPacienteQa/rest/pLoginMovilRWs",
          {
            codOpcion: "1",
            codTipDoc: "1",
            numDoc: item.datosPaciente.num_doc,
            fecNacimiento:
              item.datosPaciente.fecha_nac.split("-")[2] +
              "/" +
              item.datosPaciente.fecha_nac.split("-")[1] +
              "/" +
              item.datosPaciente.fecha_nac.split("-")[0],
          }
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.vDataItem[0].flagIndicadorActivo == "1") {
            console.log(
              "esta acreditado:",
              response.data.vDataItem[0].fecVigHasta+"|"+item.url
            );
            this.urlPacienteAsistencia = item.datosPaciente.url;
            this.nombrePacienteDialog =
              item.datosPaciente.nombres +
              " " +
              item.datosPaciente.ape_pat +
              " " +
              item.datosPaciente.ape_mat;
            this.dialogRegAsistencia = true;
            this.urlAsigCuposPac = item.url;
          } else {
            this.dialogAcredita = true;
            console.log(
              "no esta acreditado:",
              response.data.vDataItem[0].fecVigHasta
            );
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    ejecutarTurno() {
      console.log(this.desserts, "desserts");
      const resultTurno = this.desserts.filter(
        (e) =>
          e.datosPueto.turno == this.editedItem.turno &&
          e.datosPueto.frecuencia == this.editedItem.frecuencia
      );
      //console.log("resultTurno", resultTurno);
      resultTurno.sort((x, y) => x.datosPueto.numeroPuesto - y.datosPueto.numeroPuesto);
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
      this.dialogDataApi = true;
      this.cabezeraParameCentro();
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
              axios
                .get(
                  RUTA_SERVIDOR +
                    "/APICNSR/asigCuposPac/?search=" +
                    this.urlCas.split("/")[4],
                  {
                    headers: { Authorization: this.auth },
                  }
                )
                .then((resCuposAsig) => {
                  this.dialogDataApi = false;
                  console.log("dessert", this.desserts);
                  console.log("resCuposAsig", resCuposAsig.data);
                  this.desserts = resCuposAsig.data;
                })
                .catch((res) => {
                  console.warn("Error:", res);
                  this.dialog = false;
                });
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