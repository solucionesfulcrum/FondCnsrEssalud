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
            ¡Paciente no se encuentra registrado!, ponerse en contacto con el
            admistrador de sistema Telf: 988 578 051 o ingresar al siguiente
            enlace:
            <a href="https://wa.me/message/3NEVQVLLDQV3O1" target="_blank"
              >Envía un mensaje a Centro Nacional De Salud Renal - DSI por
              WhatsApp.</a
            >
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogAviso = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogAvisoEliminar"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>¡Aviso Importante!</v-toolbar>
        <v-card-text>
          <div class="text-h4 pa-5">
            ¡Solo puede ser eliminado por la persona que resgistro¡.
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogAvisoEliminar = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogAvisoEditar"
    >
      <v-card>
        <v-toolbar color="#1973a5" dark>¡Aviso Importante!</v-toolbar>
        <v-card-text>
          <div class="text-h4 pa-5">
            ¡Solo puede ser editado por la persona que resgistro!.
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialogAvisoEditar = false">cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>
      <v-card class="mx-auto my-5" max-width="900">
        <v-system-bar color="#1973a5" dark>
          MONITOREO Y SEGUIMIENTO DE COMPRAS DELEGADAS Y LOCALES
        </v-system-bar>
      </v-card>

      <v-card class="mx-auto my-5" max-width="900">
        <v-tabs background-color="#1973a5" center-active dark>
          <v-tab @click="nutricion">Delegación</v-tab>
        </v-tabs>
      </v-card>

      <v-card class="mx-auto my-5" max-width="900">
        <v-data-table :headers="headers" :items="desserts" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
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
                      <span>Registro Bienes Estratégicos</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.solped"
                              :rules="[rules.required, rules.counter]"
                              label="Solicitud Pedido"
                              :maxlength="maxdat"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.codsap"
                              :rules="[rules.required, rules.counter]"
                              label="Codigo SAP"
                              :maxlength="maxdat"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.producto"
                              :rules="[rules.required, rules.counter]"
                              label="Producto"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-select
                              v-model="editedItem.unidadMed"
                              :items="itemsUm"
                              :rules="[rules.required]"
                              label="Unidad Medida"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.cantidad"
                              :rules="[rules.required, rules.counter]"
                              label="Cantidad"
                              :maxlength="maxdat"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-menu
                              ref="menu3"
                              v-model="menu3"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateDelegacion"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateDelegacion"
                                  label="Fecha de Delegación"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateDelegacion"
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
                                    $refs.menu3.save(editedItem.dateDelegacion)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.perDel"
                              :rules="[rules.required, rules.counter]"
                              label="Periodo Delegación"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-menu
                              ref="menu4"
                              v-model="menu4"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateDerivacion"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateDerivacion"
                                  label="Fecha de Derivación"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateDerivacion"
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
                                    $refs.menu4.save(editedItem.dateDerivacion)
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
                              :return-value.sync="editedItem.dateRequerimiento"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateRequerimiento"
                                  label="Fecha de Requerimiento"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateRequerimiento"
                                no-title
                                scrollable
                                :min="minimo"
                                :max="maximo"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu5 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu5.save(editedItem.dateRequerimiento)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.perSol"
                              :rules="[rules.required, rules.counter]"
                              label="Periodo Solicitado"
                              :maxlength="maxdat"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-menu
                              ref="menu6"
                              v-model="menu6"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateLogistica"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateLogistica"
                                  label="Fecha Logistica"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.dateLogistica"
                                no-title
                                scrollable
                                :min="minimo"
                                :max="maximo"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu6 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu6.save(editedItem.dateLogistica)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ordenCompra"
                              :rules="[rules.required, rules.counter]"
                              label="N° O/C"
                              :maxlength="maxdat"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.monto"
                              :rules="[rules.required, rules.counter]"
                              label="Monto"
                              :maxlength="maxdat"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-menu
                              ref="menu7"
                              v-model="menu7"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.dateIngreso"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateIngreso"
                                  label="Fecha Ingreso Almacen"
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
                                  @click="menu7 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu7.save(editedItem.dateIngreso)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-menu
                              ref="menu8"
                              v-model="menu8"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.datePago"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.datePago"
                                  label="Fecha Pago"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.datePago"
                                no-title
                                scrollable
                                :min="minimo"
                                :max="maximo"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu8 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="
                                    $refs.menu8.save(editedItem.dateIngreso)
                                  "
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.anulacion"
                              :rules="[rules.required, rules.counter]"
                              label="Solicitud Anulación de Pedido"
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
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.talla"
                              label="Talla (Metros)"
                              :maxlength="maxdat"
                              type="number"
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
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ept"
                              label="%E.P.T."
                              :maxlength="maxdat"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.albSerica"
                              label="ALB Sérica"
                              :maxlength="maxdat"
                              type="number"
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
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              v-model="editedItem.ingestaProteica"
                              label="Ingesta Proteica"
                              :maxlength="maxdat"
                              type="number"
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
                    >Esta seguro de eliminar registro?</v-card-title
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
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data: () => ({
    //perfil data
    perfil: "",
    nombre: "",
    usuario: "",
    url: "",
    //EXPORT PDF
    dataPdfExport: [],
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
    dialogAvisoEliminar: false,
    dialogAvisoEditar: false,
    dialog: false,
    itemsFrecuencia: ["L-M-V", "M-J-S"],
    itemsTurno: ["1er Turno", "2do Turno", "3er Turno", "4to Turno"],
    itemsUm: ["TB", "G", "UN", "AM", "PBA", "CM3", "FR", "ROL", "AM", "CP"],
    nuevoValid: false,
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
      peso: Number,
      talla: Number,
      solped: Number,
      codsap: Number,
      producto: "",
      unidadMed: "",
      cantidad: Number,
      dateDelegacion: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      perDel: "",
      dateDerivacion: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      dateRequerimiento: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      perSol: "",
      dateLogistica: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      ordenCompra: Number,
      monto: Number,
      datePago: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      anulacion: "",
      imc: 0.0,
      cmb: Number,
      ept: Number,
      albSerica: Number,
      vgs: "",
      ingestaCalorica: Number,
      ingestaProteica: Number,
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
    actionBoton: "AGREGAR BIEN",
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
      peso: Number,
      talla: Number,
      solped: Number,
      codsap: Number,
      producto: "",
      unidadMed: "",
      cantidad: Number,
      dateDelegacion: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      perDel: "",
      dateDerivacion: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      dateRequerimiento: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      perSol: "",
      dateLogistica: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      ordenCompra: Number,
      monto: Number,
      datePago: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      anulacion: "",
      imc: 0.0,
      cmb: Number,
      ept: Number,
      albSerica: Number,
      vgs: "",
      ingestaCalorica: Number,
      ingestaProteica: Number,
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
      peso: Number,
      talla: Number,
      solped: Number,
      codsap: Number,
      producto: "",
      unidadMed: "",
      cantidad: Number,
      dateDelegacion: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      perDel: "",
      dateDerivacion: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      dateRequerimiento: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      perSol: "",
      dateLogistica: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      ordenCompra: Number,
      monto: Number,
      datePago: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      anulacion: "",
      imc: 0.0,
      cmb: Number,
      ept: Number,
      albSerica: Number,
      vgs: "",
      ingestaCalorica: Number,
      ingestaProteica: Number,
      diagNut: "",
      interNut: "",
    },
    menu3: false,
    menu2: false,
    menu4: false,
    menu5: false,
    menu6: false,
    menu7: false,
    menu8: false,
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
      console.log("datos deseert elemt", this.desserts);
      for (let i = 0; i < this.desserts.length; i++) {
        //this.dataPdfExport.push(this.desserts[i].datosPaciente.nombres,this.desserts[i]);
        this.dataPdfExport.push(
          Object.assign(
            {
              datapacfull:
                this.desserts[i].datosPaciente.nombres +
                " " +
                this.desserts[i].datosPaciente.ape_pat +
                " " +
                this.desserts[i].datosPaciente.ape_mat,
            },
            this.desserts[i]
          )
        );
      }

      console.log("dataPdfExport", this.dataPdfExport);
      const columns = [
        { title: "Paciente", dataKey: "datapacfull" },
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
        format: "letter",
      });
      // text is placed using x, y coordinates
      doc.setFontSize(16).text(this.heading, 0.5, 1.0);
      // create a line under heading
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      // Using autoTable plugin
      doc.autoTable({
        columns,
        body: this.dataPdfExport,
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
        );
      doc.save(`${this.heading}.pdf`);
      console.log(this.desserts[0].datosPaciente.nombres, "aqui tas");
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
                  (this.dialogAviso = true);
              //,
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
      this.editedItem.usuario = item.usuario;
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
      console.log("data pa eliminar", this.editedItem);
      if (this.editedItem.usuario == this.url) {
        console.log("hola");
        axios
          .post(RUTA_SERVIDOR + "/api/token/", {
            username: "cnsr",
            password: "123456",
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .delete(
                RUTA_SERVIDOR +
                  "/nutricion/" +
                  this.editedItem.url.split("/")[4],
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                console.log("se elimino");
                this.dialogDelete = false;
                this.nut();
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
      } else {
        console.log("no da pe");
        this.dialogDelete = false;
        this.dialogAvisoEliminar = true;
      }
      //this.desserts.splice(this.editedIndex, 1);

      //this.closeDelete();
    },

    closeFormAdmin() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    edit() {
      console.log("esto es para editar", this.editedItem);
      if (this.editedItem.usuario == this.url) {
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
                  imc:
                    this.editedItem.peso /
                    (this.editedItem.talla * this.editedItem.talla),
                  porcentajeCMB: this.editedItem.cmb,
                  porcentajeEPT: this.editedItem.ept,
                  albSerica: this.editedItem.albSerica,
                  ValGlobalSub: this.editedItem.vgs,
                  ingestaCalorica: this.editedItem.ingestaCalorica,
                  ingestaProteica: this.editedItem.ingestaProteica,
                  diagNutricional: this.editedItem.diagNut,
                  interveNutricional: this.editedItem.interNut,
                  usuario: this.url,
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
      } else {
        this.dialogEdit = false;
        this.dialogAvisoEditar = true;
      }
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
        !this.editedItem.turno ||
        !this.editedItem.frecuencia ||
        !this.editedItem.dateIngreso ||
        !this.editedItem.dateEvalu ||
        !this.editedItem.peso ||
        !this.editedItem.talla ||
        !this.editedItem.cmb ||
        //!this.editedItem.ept ||
        !this.editedItem.albSerica ||
        //!this.editedItem.vgs ||
        !this.editedItem.ingestaCalorica ||
        !this.editedItem.ingestaProteica ||
        !this.editedItem.diagNut ||
        !this.editedItem.interNut
      ) {
        this.$refs.form.validate();
        console.log("validate");
      } else {*/
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_SERVIDOR + "/delegaciones/",
              {
                solPed: this.editedItem.solped,
                codigoSap: this.editedItem.codsap,
                producto: this.editedItem.producto,
                unidadMedida: this.editedItem.unidadMed,
                cantidad: this.editedItem.cantidad,
                fechaDelegacion: this.editedItem.dateDelegacion,
                fechaDerivacion: this.editedItem.dateDerivacion,
                fechaRequerimiento: this.editedItem.dateRequerimiento,
                periodoSolicitado: this.editedItem.perDel,
                fechaLogistica: this.editedItem.dateLogistica,
                numOrdenCompra: this.editedItem.ordenCompra,
                monto: this.editedItem.monto,
                fechaIngresoAlmacen: this.editedItem.dateLogistica,
                fechaPago: this.editedItem.datePago,
                anulacionPedido: this.editedItem.anulacion,
                userOpc: "OPC",
                userUsuario: "USRER",
                userLogistica: "LOG",
                userFinanzas: "FINANZAS",
                estado: "1",
              },
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.close();
              console.log(this.editedItem);
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
    if (!sessionStorage.getItem("keyValue")) {
      this.$router.push("/");
    }
  },

  created() {
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    this.url = sessionStorage.getItem("url");
    this.usuario = sessionStorage.getItem("usuario");
    console.log("Url", this.url);
    console.log("Perfil", this.perfil);
    console.log("Nombre", this.nombre);
    console.log("usuario", this.usuario);
  },

  components: {
    CalendarioAnemia,
  },
};
</script>

