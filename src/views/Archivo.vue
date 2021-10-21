<template>
  <div>
    <NavBar />
    <div>
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
        v-model="dialogAviso"
      >
        <v-card>
          <v-toolbar color="#1973a5" dark>¡Aviso Importante!</v-toolbar>
          <v-card-text>
            <div class="text-h4 pa-5">
              ¡Paciente no se encuentra registrado!, ponerce en contacto con el
              admistrador de sistema o ingresar al siguiente enlace,
              <a href="http://10.0.52.70:8030/admin/" target="_blank"
                >Agregar Paciente</a
              >
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialogAviso = false">cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-if="this.desserts.length != 0"
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="dialogRespuesta"
      >
        <v-card>
          <v-toolbar color="#1973a5" dark
            >En hora buena, ¡Historia Clinica Encontrada!</v-toolbar
          >
          <v-card-text>
            <div class="text-h4 pa-5">
              <v-card class="mx-auto" max-width="450">
                <v-card-text>
                  <div v-if="this.desserts.length != 0">
                    Nombre: {{ this.desserts[0].datosPaciente.ape_pat }}
                    {{ this.desserts[0].datosPaciente.ape_mat }}
                    {{ this.desserts[0].datosPaciente.nombres }}
                  </div>
                  <p class="text-h5 text--primary">Archivo Físico</p>
                  <p>Ubicación</p>
                  <div v-if="this.desserts.length != 0" class="text--primary">
                    Número de balda: {{ this.desserts[0].numBalda }}<br />
                    Número de Historia Clínica: {{ this.desserts[0].numHisCli }}
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialogRespuesta = false">cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card class="mx-auto my-5" max-width="900">
        <v-system-bar color="#1973a5" dark> DATOS DE PACIENTE </v-system-bar>
        <v-row justify="center">
          <v-col cols="12" md="3">
            <v-text-field
              class="mx-auto mt-8"
              v-model="setDni"
              label="DNI"
              required
              :maxlength="8"
              @keyup.enter="buscarPacicente"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="7">
            <v-btn class="mt-10" icon color="#1973a5" @click="buscarPacicente">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-autocomplete
              v-model="valorAutocomplete"
              :items="autoComplite"
              dense
              label="BUSCAR A PACIENTE POR NOMBRE"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn class="" icon color="#1973a5" @click="buscarPacicenteAuto">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" md="10">
            <div v-if="this.datosPaciente.length != 0">
              <p class="text-h6">Nombre Paciente:</p>
              {{ this.datosPaciente[0].ape_pat }}
              {{ this.datosPaciente[0].ape_mat }}
              {{ this.datosPaciente[0].nombres }}
            </div>
          </v-col>
        </v-row>
        <!--      <v-text-field label="Apellido Paterno" required></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field label="Apellido Materno" required></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field label="Nombres" required></v-text-field>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn class="mt-3" icon color="#1973a5">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          -->
      </v-card>

      <v-card class="mx-auto my-5" max-width="900">
        <!--<div v-if="this.desserts.length != 0">-->
        <div>
          <v-data-table
            :headers="headers"
            :items="desserts"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title
                  >Histórico de movimiento de Historias Clínicas
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Agregar Historia
                    </v-btn>
                  </template>
                  <v-card>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.numHisCli"
                                :rules="[rules.required, rules.counter]"
                                label="Número de Historia"
                                :maxlength="maxdat"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.numBalda"
                                :rules="[rules.required, rules.counter]"
                                label="Número de Balda"
                                :maxlength="maxdat"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancelar
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save">
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5"
                      >Are you sure you want to delete this item?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDelete"
                        >Cancelar</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <!--<template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>-->
          </v-data-table>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/navbar/NavBar.vue";
//import NavBarVertical from "../components/navbar/NavBarVertical.vue";
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

export default {
  data: () => ({
    valorAutocomplete: null,
    autoComplite: [
    ],
    valid: true,
    rules: {
      required: (value) => !!value || "Campo Obligatorio.",
      counter: (value) => value.length <= 20 || "Max 20 characters",
    },
    maxdat: 21,
    dialogRespuesta: false,
    dialogDataApi: false,
    dialogAviso: false,
    datosPaciente: [],
    datosArchivo: [],
    setDni: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Número de Historia",
        align: "start",
        sortable: false,
        value: "numHisCli",
      },
      { text: "Número de Balda", value: "numBalda" },
      { text: "Estado", value: "estado" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      numHisCli: "",
      numBalda: "",
      estado: "",
    },
    defaultItem: {
      numHisCli: "",
      numBalda: "",
      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo registro" : "Editar Registro";
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

  created() {
    //this.actionBoton='pres'
      this.dialogDataApi=true
      axios
          .post(RUTA_SERVIDOR + "/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .get(RUTA_SERVIDOR + "/paciente/", {
                headers: { Authorization: this.auth },
              })
              .then((res) => {
                //this.autoComplite = res.data[0].ape_pat + " " + res.data[0].ape_mat + " " + res.data[0].nombres;
                for (let i = 0; i < res.data.length; i++)
                {
                  this.autoComplite.push(res.data[i].ape_pat + " " + res.data[i].ape_mat + " " + res.data[i].nombres+ " DNI:"+ res.data[i].num_doc)
                }
                console.log("autocomplite", this.autoComplite);
                this.dialogDataApi=false
                //this.datosPaciente.length != 0
                 // ? this.datosHistoria()
                  //: //: ((this.dialogDataApi = false),
                    // (this.aviso = "Datos de paciente no encontrados"),
                    //(this.dialogAviso = true);
                //);
                //this.pres()
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

  methods: {
    buscarPacicenteAuto(){
      this.setDni=this.valorAutocomplete.split(":")[1]
      this.buscarPacicente()
    },

    buscarPacicente() {
      //this.desserts=[]
      //this.editedItem=[]
      //console.log("datos de paciente", this.datosPaciente);
      //this.adminForm = "";
      if (this.setDni == "") {
        this.dialogAviso = true;
      } else {
        axios
          .post(RUTA_SERVIDOR + "/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .get(RUTA_SERVIDOR + "/paciente/?search=" + this.setDni, {
                headers: { Authorization: this.auth },
              })
              .then((res) => {
                this.datosPaciente = res.data;
                console.log("datosPaciente", this.datosPaciente);

                this.datosPaciente.length != 0
                  ? this.datosHistoria()
                  : //: ((this.dialogDataApi = false),
                    // (this.aviso = "Datos de paciente no encontrados"),
                    (this.dialogAviso = true);
                //);
                //this.pres()
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
      }
    },

    datosHistoria() {
      this.dialogDataApi = true;
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(
              RUTA_SERVIDOR +
                "/archivo/?search=" +
                this.datosPaciente[0].url.split("/")[4],
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.desserts = res.data;
              console.log("datos Archivo", this.desserts);
              this.dialogDataApi = false;
              this.dialogRespuesta = true;
              //this.datosPaciente.length != 0
              //? this.pres()
              //: ((this.dialogDataApi = false),
              // (this.aviso = "Datos de paciente no encontrados"),
              // (this.dialogAviso = true));
              //this.pres()
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

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
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
      //if (this.editedIndex > -1) {
      //Object.assign(this.desserts[this.editedIndex], this.editedItem);
      //} else {
      //this.desserts.push(this.editedItem);
      //}
      //this.close();
      this.$refs.form.validate();
      if (!this.editedItem.numHisCli || !this.editedItem.numBalda) {
        this.$refs.form.validate();
        console.log("validate");
      } else {
        axios
          .post(RUTA_SERVIDOR + "/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .post(
                RUTA_SERVIDOR + "/archivo/",
                {
                  paciente: this.datosPaciente[0].url,
                  numBalda: this.editedItem.numBalda,
                  numHisCli: this.editedItem.numHisCli,
                },
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                console.log("exito", res.status);
                this.close();
                this.datosHistoria();
                //this.exclu();
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
      }
    },
  },

  mounted() {
    //if (!localStorage.getItem("keyValue")) {
    //this.$router.push("/");
    //}
  },

  components: {
    NavBar,
    //NavBarVertical,
  },
};
</script>
