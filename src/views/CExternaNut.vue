<template>
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
            admistrador de sistema.
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogAviso = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>
      <v-card class="mx-auto my-5" max-width="900">
        <v-system-bar color="#1973a5" dark>
          DATOS DE PACIENTE - CONTROL NUTRICIONAL CLINICAS CONTRATADOS
        </v-system-bar>
        <v-row class="start ml-10">
          <v-col cols="12" md="4">
            <v-text-field
              class="mx-auto mt-8"
              v-model="setDni"
              label="DNI"
              required
              :maxlength="8"
              @keyup.enter="buscarPacicente"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn class="mt-10" icon color="#1973a5" @click="buscarPacicente">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="desserts.length!=0" cols="12" md="4">
            <v-btn class="mt-10" icon color="#1973a5" @click="generatePDF">
              Generar PDF<v-icon>mdi-arrow-down-bold-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!--
          <v-row justify="center">
            <v-col cols="12" md="3">
              <v-text-field label="Apellido Paterno" required></v-text-field>
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

      <v-card class="mx-auto my-5" max-width="900" v-if="desserts.length!=0">
        <v-tabs background-color="#1973a5" center-active dark>
          <v-tab @click="nutricion">Nutrición</v-tab>
        </v-tabs>
      </v-card>

      <v-card class="mx-auto my-5" max-width="900" v-if="desserts.length!=0">
        <v-data-table :headers="headers" :items="desserts" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title v-if="datosPaciente.length != 0">
                {{
                  datosPaciente[0].nombres +
                  " " +
                  datosPaciente[0].ape_pat +
                  " " +
                  datosPaciente[0].ape_mat
                }}
                | {{ vista }}</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <!--Registrar-->
              <v-dialog v-model="dialog" max-width="700px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="#1973a5"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ actionBoton }}
                  </v-btn>
                </template>
                <v-card>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-title>
                      <div cols="12" sm="6" md="6" class="">
                        <v-checkbox v-model="nuevoValid"></v-checkbox>
                      </div>
                      <span>Click si el paciente es nuevo</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
                            v-if="nuevoValid === true"
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-menu
                              ref="menu3"
                              v-model="menu3"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateIngreso"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateIngreso"
                                  label="Fecha de Ingreso"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateIngreso"
                                no-title
                                scrollable
                                :min="minimo"
                                :max="maximo"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu3 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu3.save(editedItem.dateIngreso)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col
                            v-if="nuevoValid === true"
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-menu
                              ref="menu4"
                              v-model="menu4"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateEvalu"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateEvalu"
                                  label="Fecha de Evaluacion Nutricional"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateEvalu"
                                no-title
                                scrollable
                                :min="minimo"
                                :max="maximo"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu4 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu4.save(editedItem.dateEvalu)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-select
                              v-model="editedItem.frecuencia"
                              :items="itemsFrecuencia"
                              :rules="[rules.required]"
                              label="Frecuencia"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-select
                              v-model="editedItem.turno"
                              :items="itemsTurno"
                              :rules="[rules.required]"
                              label="Turno"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.peso"
                              :rules="[rules.required, rules.counter]"
                              label="Peso (Kilogramos)"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.talla"
                              :rules="[rules.required, rules.counter]"
                              label="Talla (Metros)"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.imc"
                              label="IMC"
                              :maxlength="maxdat"
                              disabled
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.cmb"
                              :rules="[rules.required, rules.counter]"
                              label="%C.M.B."
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            v-if="nuevoValid === true"
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              v-model="editedItem.ept"
                              :rules="[rules.required, rules.counter]"
                              label="%E.P.T."
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.albSerica"
                              :rules="[rules.required, rules.counter]"
                              label="ALB Sérica"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            v-if="nuevoValid === true"
                            cols="12"
                            sm="6"
                            md="3"
                          >
                            <v-text-field
                              v-model="editedItem.vgs"
                              :rules="[rules.required, rules.counter]"
                              label="VGS"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ingestaCalorica"
                              :rules="[rules.required, rules.counter]"
                              label="Ingesta Calorica"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ingestaProteica"
                              :rules="[rules.required, rules.counter]"
                              label="Ingesta Proteica"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.diagNut"
                              :rules="[rules.required, rules.counter]"
                              label="Diagnostico Nutricional"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.interNut"
                              :rules="[rules.required, rules.counter]"
                              label="Intervención Nutricional"
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
              <!--editar-->
              <v-dialog v-model="dialogEdit" max-width="700px">
                <v-card>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-title>
                      <span class="text-h5">Editar Nutrición</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="3">
                            <v-menu
                              ref="menu5"
                              v-model="menu5"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateIngreso"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateIngreso"
                                  label="Fecha"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateIngreso"
                                no-title
                                scrollable
                                :min="minimo"
                                :max="maximo"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu4 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu4.save(editedItem.dateIngreso)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-menu
                              ref="menu5"
                              v-model="menu5"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateEvalu"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateEvalu"
                                  label="Fecha"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateEvalu"
                                no-title
                                scrollable
                                :min="minimo"
                                :max="maximo"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu4 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu4.save(editedItem.dateEvalu)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-select
                              v-model="editedItem.frecuencia"
                              :items="itemsFrecuencia"
                              :rules="[rules.required]"
                              label="Frecuencia"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-select
                              v-model="editedItem.turno"
                              :items="itemsTurno"
                              :rules="[rules.required]"
                              label="Turno"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.peso"
                              label="Peso (Kilogramos)"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.talla"
                              label="Talla (Metros)"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.imc"
                              label="IMC"
                              :maxlength="maxdat"
                              disabled
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.cmb"
                              label="%C.M.B."
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ept"
                              label="%E.P.T."
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.albSerica"
                              label="ALB Sérica"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.vgs"
                              label="VGS"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ingestaCalorica"
                              label="Ingesta Calorica"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ingestaProteica"
                              label="Ingesta Proteica"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.diagNut"
                              label="Diagnostico Nutricional"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.interNut"
                              label="Intervención Nutricional"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeEdit">
                        Cancelar
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="edit">
                        Editar
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Esta seguro de eliminar la Prescipción?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
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
            <!--<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>-->
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
import CalendarioAnemia from "./CalendarioAnemia.vue";
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  data: () => ({
    //EXPORT PDF
      heading: "REPORTE PACIENTES NUTRICIÓN",
      items: [
        { title: "Item 1", body: "I am item 1 body text" },
        { title: "Item 2", body: "I am item 2 body text" },
        { title: "Item 3", body: "I am item 3 body text" },
        { title: "Item 4", body: "I am item 4 body text" },
      ],
    //
    dialogDataApi: false,
    dialogAviso: false,
    dialog: false,
    itemsFrecuencia: ["L-M-V", "M-J-S"],
    itemsTurno: ["1er Turno", "2do Turno", "3er Turno", "4to Turno"],
    nuevoValid: true,
    datosPresHis: [],
    datosEdit: "",
    dialogEditExclu: false,
    dataAdmin: "",
    datosPaciente: [],
    setDni: "",
    adminForm: 0,
    maxdat: 21,
    valid: true,
    medicamentos: ["ERITROPOYETINA", "HIERRO"],
    via: ["SC", "EV"],
    dosisE: [1000, 2000, 3000, 4000, 5000, 6000],
    dosisH: [100, 200, 300, 400, 500, 600, 700, 800],
    rules: {
      required: (value) => !!value || "Campo Obligatorio.",
      counter: (value) => value.length <= 20 || "Max 20 characters",
    },
    editedItem: {
      dateIngreso: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateEvalu: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      frecuencia: "",
      turno: "",
      peso: 0.0,
      talla: 0.0,
      imc: 0.0,
      cmb: 0.0,
      ept: 0.0,
      albSerica: 0.0,
      vgs: "",
      ingestaCalorica: 0,
      ingestaProteica: 0,
      diagNut: "",
      interNut: "",
    },
    minimo: new Date(
      Date.now() - 432000000 - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10),
    maximo: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),

    dialogEdit: false,
    formAdmi: false,
    dialogDelete: false,
    dialogEditAdm: false,
    vista: "",
    actionBoton: "AGREGAR NUTRICIÓN",
    headers: [],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      dateIngreso: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateEvalu: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      frecuencia: "",
      turno: "",
      peso: 0.0,
      talla: 0.0,
      imc: 0.0,
      cmb: 0.0,
      ept: 0.0,
      albSerica: 0.0,
      vgs: "",
      ingestaCalorica: 0,
      ingestaProteica: 0,
      diagNut: "",
      interNut: "",
    },
    dataex: "",
    defaultItem: {
      dateIngreso: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateEvalu: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      frecuencia: "",
      turno: "",
      peso: 0.0,
      talla: 0.0,
      imc: 0.0,
      cmb: 0.0,
      ept: 0.0,
      albSerica: 0.0,
      vgs: "",
      ingestaCalorica: 0,
      ingestaProteica: 0,
      diagNut: "",
      interNut: "",
    },
    menu3: false,
    menu2: false,
    menu4: false,
    menu5: false,
    menu6: false,
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

  created() {
    //this.initialize()
    //this.actionBoton='pres'
  },

  methods: {
    generatePDF() {
      const columns = [
        { title: "Paciente", dataKey: "datosPaciente" },
        { title: "diagNutricional", dataKey: "diagNutricional" },
        { title: "ValGlobalSub", dataKey: "ValGlobalSub" },
        { title: "albSerica", dataKey: "albSerica" },
        { title: "fechaEvaluacion", dataKey: "fechaEvaluacion" },
        { title: "fechaIngreso", dataKey: "fechaIngreso" },
        { title: "frecuencia", dataKey: "frecuencia" },
        { title: "imc", dataKey: "imc" },
        { title: "ingestaCalorica", dataKey: "ingestaCalorica" },
        { title: "ingestaProteica", dataKey: "ingestaProteica" },
        { title: "interveNutricional", dataKey: "interveNutricional" },
        { title: "peso", dataKey: "peso" },
        { title: "porcentajeCMB", dataKey: "porcentajeCMB" },
        { title: "porcentajeEPT", dataKey: "porcentajeEPT" },
        { title: "talla", dataKey: "talla" },
        { title: "turno", dataKey: "turno" },
      ];
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: "letter"
      });
      // text is placed using x, y coordinates
      doc.setFontSize(16).text(this.heading, 0.5, 1.0);
      // create a line under heading 
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      // Using autoTable plugin
      doc.autoTable({
        columns,
        body: this.desserts,
        margin: { left: 0.5, top: 1.25 },
        styles: { fontSize: 5 },
      });
      // Using array of sentences
      /*doc
        .setFont("helvetica")
        .setFontSize(12)
        .text(this.desserts, 0.5, 3.5, { align: "left", maxWidth: "7.5" });
      */
      // Creating footer and saving file
      doc
        .setFont("times")
        .setFontSize(11)
        //.setFontStyle("italic")
        .setTextColor(0, 0, 255)
        .text(
          "Este reporte debe ser firmado y entregado, siguiendo el flujo normal",
          0.5,
          doc.internal.pageSize.height - 0.5
        )
        doc.save(`${this.heading}.pdf`);
        console.log(this.desserts[0].datosPaciente.nombres, "aqui tas")
    },

    initialize() {
      this.desserts = [];
    },

    buscarPacicente() {
      //this.desserts=[]
      //this.editedItem=[]
      //console.log(this.setDni);
      //this.adminForm = "";
      //if (this.setDni == "") {
      // this.dialogAviso = true;
      //} else {
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
                ? this.nut()
                : //(this.dialogDataApi = false),
                  (this.aviso = "Datos de paciente no encontrados");
              //,
              //(this.dialogAviso = true)
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
      //}
    },

    cabezeraNut() {
      this.headers = [
        { text: "Turno", value: "turno" },
        {
          text: "Frecuencia",
          align: "start",
          sortable: false,
          value: "frecuencia",
        },
        { text: "Fecha Ingreso", value: "fechaIngreso" },
        { text: "Fecha Evaluacion", value: "fechaEvaluacion" },
        { text: "Peso", value: "peso" },
        { text: "Talla", value: "talla" },
        { text: "Actions", value: "actions", sortable: false },
      ];
    },

    editItem(item) {
      console.log("item", item);
      //this.botonEditar = "1";
      //this.editedIndex;
      //this.editedIndex = this.desserts.indexOf(item);
      /*this.editedItem.date = item.fechaPres;*/
      this.editedItem.dateIngreso = item.fechaIngreso;
      this.editedItem.dateEvalu = item.fechaEvaluacion;
      this.editedItem.frecuencia = item.frecuencia;
      this.editedItem.turno = item.turno;
      this.editedItem.peso = item.peso;
      this.editedItem.talla = item.talla;
      this.editedItem.imc = item.imc;
      this.editedItem.cmb = item.porcentajeCMB;
      this.editedItem.ept = item.porcentajeEPT;
      this.editedItem.albSerica = item.albSerica;
      this.editedItem.vgs = item.ValGlobalSub;
      this.editedItem.ingestaCalorica = item.ingestaCalorica;
      this.editedItem.ingestaProteica = item.ingestaProteica;
      this.editedItem.diagNut = item.diagNutricional;
      this.editedItem.interNut = item.interveNutricional;
      /*this.editedItem.name = item.nomNefro;
      this.editedItem.dos = item.dosisPres;
      this.editedItem.dosHierro = item.dosisHiePres;
      this.editedItem.med = item.medPres;
      this.editedItem.medHierro = item.medHiePres;
      this.editedItem.via = item.viaAdmPres;
      this.editedItem.viaHierro = item.viaAdmHiePres;*/
      //this.editedItem = Object.assign({}, item);
      console.log("editedItem", this.editedItem);
      this.dialogEdit = true;
      this.datosEdit = item.url;
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

    closeFormAdmin() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    edit() {
      console.log("esto es para editar", this.datosEdit.split("/")[4]);
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_SERVIDOR +
                "/nutricion/" +
                this.datosEdit.split("/")[4] +
                "/",
              {
                paciente: this.datosPaciente[0].url,
                turno: this.editedItem.turno,
                frecuencia: this.editedItem.frecuencia,
                fechaIngreso: this.editedItem.dateIngreso,
                fechaEvaluacion: this.editedItem.dateEvalu,
                peso: this.editedItem.peso,
                talla: this.editedItem.talla,
                imc: this.editedItem.imc,
                porcentajeCMB: this.editedItem.cmb,
                porcentajeEPT: this.editedItem.ept,
                albSerica: this.editedItem.albSerica,
                ValGlobalSub: this.editedItem.vgs,
                ingestaCalorica: this.editedItem.ingestaCalorica,
                ingestaProteica: this.editedItem.ingestaProteica,
                diagNutricional: this.editedItem.diagNut,
                interveNutricional: this.editedItem.interNut,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.dialogDataApi = true;
              console.log("exito", res.status);
              this.close();
              this.nut();
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
      /*if (
        !this.editedItem.name ||
        !this.editedItem.med ||
        !this.editedItem.dos ||
        !this.editedItem.via ||
        !this.editedItem.dosHierro ||
        !this.editedItem.viaHierro ||
        !this.editedItem.medHierro
      ) {
        this.$refs.form.validate();
        console.log("validate");*/
      //} else {
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "/nutricion/",
              {
                paciente: this.datosPaciente[0].url,
                turno: this.editedItem.turno,
                frecuencia: this.editedItem.frecuencia,
                fechaIngreso: this.editedItem.dateIngreso,
                fechaEvaluacion: this.editedItem.dateEvalu,
                peso: this.editedItem.peso,
                talla: this.editedItem.talla,
                imc: this.editedItem.imc,
                porcentajeCMB: this.editedItem.cmb,
                porcentajeEPT: this.editedItem.ept,
                albSerica: this.editedItem.albSerica,
                ValGlobalSub: this.editedItem.vgs,
                ingestaCalorica: this.editedItem.ingestaCalorica,
                ingestaProteica: this.editedItem.ingestaProteica,
                diagNutricional: this.editedItem.diagNut,
                interveNutricional: this.editedItem.interNut,
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.close();
              console.log(this.editedItem);
              this.nut();
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
      //}
      //console.log('holaaaaaaaa',this.editedItem)
    },

    nut() {
      //this.adminForm = "0";
      //this.vista = "Prescipción Anemia";
      this.cabezeraNut();
      //this.actionBoton = "Registro Prescripción";
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
                "/nutricion/?search=" +
                this.datosPaciente[0].url.split("/")[4],
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.desserts = res.data;
              this.dialogDataApi = false;
              //this.dataAdmi = res.data[0].url.split("/")[4];
              //this.datosPresHis = res.data[0];
              console.log("desert", res.data);
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
    nutricion() {
      console.log("nutricion");
    },
  },

  mounted() {
    if (!localStorage.getItem("keyValue")) {
      this.$router.push("/");
    }
  },

  components: {
    CalendarioAnemia,
  },
};
</script>

