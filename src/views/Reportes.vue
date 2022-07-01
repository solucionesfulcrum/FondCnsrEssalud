<template>
  <v-container>
    <v-card class="mx-auto my-5" max-width="900">
      <v-tabs background-color="#1973a5" center-active dark>
        <v-tab @click="adminForm=0">Anemia</v-tab>
        <v-tab @click="adminForm=1">Nutrición</v-tab>
      </v-tabs>
    </v-card>
    <v-card class="mx-auto my-5" max-width="900" v-if="adminForm==1">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-system-bar color="#1973a5" dark> Reportes </v-system-bar>
        <v-row class="mt-4 container">
          <v-col cols="12" sm="12" md="12">
            <v-autocomplete
              v-model="valueClinicas"
              :items="itemsClinicas"
              :rules="[rules.required]"
              solo
              filled
              label="Seleccine una Clinica"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Fecha Desde"
                  hint="YYYY/MM/DD formato"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateHasta"
                  label="Fecha Hasta"
                  hint="YYYY/MM/DD formato"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateHasta"
                no-title
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="4"></v-col>
          <v-col cols="12" md="4">
            <v-btn class="mt-10" icon color="#1973a5" @click="exportExcel">
              Generar Excel<v-icon>mdi-arrow-down-bold-box</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn class="mt-10" icon color="#1973a5" @click="generatePDF">
              Generar PDF<v-icon>mdi-arrow-down-bold-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
import ExportExcel from "./ExportarExcel.vue";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data: () => ({
    adminForm:0,
    selectedPesta:"",
    valid: true,
    rules: {
      required: (value) => !!value || "Campo Obligatorio.",
    },
    dataToExport: [],
    dataNutriServ: [],
    dataNutriDefault: [],
    dataPdfExport: [],
    dataPdfExportPacNuevo: [],
    heading: "INFORME MENSUAL DE NUTRICIÓN",
    select: [],
    itemsClinicas: [],
    valueClinicas: null,
    dateHoy: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateHasta: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    modalHasta: false,
    menu2: false,
    menu1: false,
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
  },

  created() {
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "cnsr",
        password: "123456",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "/cas/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("clinicas", res.data);
            for (let i = 0; i < res.data.length; i++) {
              this.itemsClinicas.push(
                res.data[i].codCas + "-" + res.data[i].descripCas
              );
            }
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
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    exportExcel() {
      if (this.valueClinicas === null) {
        console.log("no a seleccionado ninguan clinica");
        this.$refs.form.validate();
      } else {
        //delete this.dataToExport
        this.dataToExport = [];
        console.log("estamos aqui 1", this.dataToExport);
        console.log("selectClinica", this.valueClinicas);
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
                  this.valueClinicas.split("-")[0],
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                console.log("value clinica", this.valueClinicas);
                for (let i = 0; i < res.data.length; i++) {
                  //this.dataPdfExport.push(this.desserts[i].datosPaciente.nombres,this.desserts[i]);
                  this.dataToExport.push(
                    Object.assign(
                      { contador: i + 1 },
                      { Dni: res.data[i].datosPaciente.num_doc },
                      {
                        Nombre:
                          res.data[i].datosPaciente.nombres +
                          " " +
                          res.data[i].datosPaciente.ape_pat +
                          " " +
                          res.data[i].datosPaciente.ape_mat,
                      },
                      {
                        edad:
                          res.data[i].datosPaciente.edad[0] +
                          " a " +
                          res.data[i].datosPaciente.edad[1] +
                          " m",
                      },
                      {
                        Turno: res.data[i].turno,
                      },
                      {
                        Frecuencia: res.data[i].frecuencia,
                      },
                      {
                        FechaIngreso: res.data[i].fechaIngreso,
                      },
                      {
                        FechaEvaluacion: res.data[i].fechaEvaluacion,
                      },
                      {
                        Peso: res.data[i].peso,
                      },
                      {
                        Talla: res.data[i].talla,
                      },
                      {
                        IMC: res.data[i].imc,
                      },
                      {
                        CMB: res.data[i].porcentajeCMB,
                      },
                      {
                        EPT: res.data[i].porcentajeEPT,
                      },
                      {
                        AlbuminaSerica: res.data[i].albSerica,
                      },
                      {
                        ValGlobalSub: res.data[i].ValGlobalSub,
                      },
                      {
                        IngestaCalorica: res.data[i].ingestaCalorica,
                      },
                      {
                        IngestaProteica: res.data[i].ingestaProteica,
                      },
                      {
                        DiagNutricional: res.data[i].diagNutricional,
                      },
                      {
                        InterNutricional: res.data[i].interveNutricional,
                      },
                      {
                        PacienteNuevo: res.data[i].pacNuevo,
                      },
                      {
                        Registro: res.data[i].datosUsuario.nombre,
                      }
                    )
                  );
                }
                //this.dataToExport = res.data;
                console.log("estamos aqui", this.dataToExport);
                let data = XLSX.utils.json_to_sheet(this.dataToExport);
                const workbook = XLSX.utils.book_new();
                const filename = "Exportado";
                XLSX.utils.book_append_sheet(workbook, data, filename);
                XLSX.writeFile(workbook, `${filename}.xlsx`);
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
    generatePDF() {
      if (this.valueClinicas === null) {
        console.log("no a seleccionado ninguan clinica");
        this.$refs.form.validate();
      } else {
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
                  this.valueClinicas.split("-")[0],
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                //this.dataNutriServ = res.data;
                console.log("serv", res.data);
                const result = res.data.filter((e) => e.pacNuevo == false);
                const resultNoNUevo = result.filter(
                  (e) =>
                    e.fechaEvaluacion >= this.date &&
                    e.fechaEvaluacion <= this.dateHasta
                );
                const resultPacNuevo = res.data.filter(
                  (e) => e.pacNuevo == true
                );
                const resultPacN = resultPacNuevo.filter(
                  (e) =>
                    e.fechaEvaluacion >= this.date &&
                    e.fechaEvaluacion <= this.dateHasta
                );
                console.log("serv-noNuevo", result);
                console.log("servPacNuevo", resultPacNuevo);
                console.log("resultPacN", resultPacN);
                console.log("date Fecha", this.dateHasta);
                console.log("resultPacN", resultPacN);

                for (let i = 0; i < resultNoNUevo.length; i++) {
                  //this.dataPdfExport.push(this.desserts[i].datosPaciente.nombres,this.desserts[i]);
                  this.dataPdfExport.push(
                    Object.assign(
                      { contador: i + 1 },
                      {
                        dni: resultNoNUevo[i].datosPaciente.num_doc,
                      },
                      {
                        nombrePaciente:
                          resultNoNUevo[i].datosPaciente.nombres +
                          " " +
                          resultNoNUevo[i].datosPaciente.ape_pat +
                          " " +
                          resultNoNUevo[i].datosPaciente.ape_mat,
                      },
                      {
                        edad:
                          resultNoNUevo[i].datosPaciente.edad[0] +
                          " a " +
                          resultNoNUevo[i].datosPaciente.edad[1] +
                          " m",
                      },
                      resultNoNUevo[i]
                    )
                  );
                }

                for (let y = 0; y < resultPacN.length; y++) {
                  //this.dataPdfExport.push(this.desserts[i].datosPaciente.nombres,this.desserts[i]);
                  this.dataPdfExportPacNuevo.push(
                    Object.assign(
                      { contador: y + 1 },
                      {
                        dni: resultPacN[y].datosPaciente.num_doc,
                      },
                      {
                        nombrePaciente:
                          resultPacN[y].datosPaciente.nombres +
                          " " +
                          resultPacN[y].datosPaciente.ape_pat +
                          " " +
                          resultPacN[y].datosPaciente.ape_mat,
                      },
                      {
                        edad:
                          resultPacN[y].datosPaciente.edad[0] +
                          " a " +
                          resultPacN[y].datosPaciente.edad[1] +
                          " m",
                      },
                      resultPacN[y]
                    )
                  );
                }

                console.log("dataPdfExport", this.dataPdfExport);
                const columns = [];
                console.log(
                  "dataPdfExportPacNuevo",
                  this.dataPdfExportPacNuevo
                );

                const doc = new jsPDF({
                  orientation: "landscape",
                  unit: "in",
                  format: "letter",
                });
                // text is placed using x, y coordinates
                var finalY = doc.lastAutoTable.finalY || 0.5;
                doc.setFontSize(16).text(this.heading, 3.5, finalY);
                doc
                  .setFontSize(10)
                  .text(
                    "Centro Contratado: " + this.valueClinicas,
                    0.5,
                    finalY + 0.35
                  );
                doc
                  .setFontSize(10)
                  .text(
                    "Nutricionista a Cargo: " +
                      sessionStorage.getItem("nombre"),
                    0.5,
                    finalY + 0.55
                  );
                doc.setFontSize(10).text("Mes: " +  "Del "+this.date + " Al " + this.dateHasta, 0.5, finalY + 0.74);
                 doc.setFontSize(10).text("Fecha de Reporte: "+this.dateHoy, 6.0, finalY + 0.74);
                // create a line under heading
                doc
                  .setLineWidth(0.01)
                  .line(0.5, finalY + 0.85, 10.0, finalY + 0.85);
                doc
                  .setFontSize(10)
                  .text(
                    "Reporte de Pacientes Casos Problemas",
                    0.5,
                    finalY + 1
                  );
                doc
                  .setFontSize(8)
                  .text(
                    "N Pacientes casos problema (con diagnóstico de desnutrición) en el mes: " + resultNoNUevo.length,
                    0.5,
                    finalY + 1.12
                  );
                doc
                  .setFontSize(8)
                  .text("N Pacientes con DPE en el mes: ", 5.0, finalY + 1.12);
                // Using autoTable plugin
                doc.autoTable({
                  startY: finalY + 1.3,
                  columns: [
                    { title: "N", dataKey: "contador" },
                    { title: "Dni", dataKey: "dni" },
                    { title: "Paciente", dataKey: "nombrePaciente" },
                    { title: "frecuencia", dataKey: "frecuencia" },
                    { title: "turno", dataKey: "turno" },
                    { title: "Edad", dataKey: "edad" },
                    { title: "peso", dataKey: "peso" },
                    { title: "talla", dataKey: "talla" },
                    { title: "imc", dataKey: "imc" },
                    { title: "porcentajeCMB", dataKey: "porcentajeCMB" },
                    { title: "albSerica", dataKey: "albSerica" },
                    { title: "ingestaCalorica", dataKey: "ingestaCalorica" },
                    { title: "ingestaProteica", dataKey: "ingestaProteica" },
                    { title: "diagNutricional", dataKey: "diagNutricional" },
                    {
                      title: "interveNutricional",
                      dataKey: "interveNutricional",
                    },
                  ],
                  //startY: 10,
                  body: this.dataPdfExport,
                  margin: { left: 0.5, top: 1.87 },
                  styles: { fontSize: 6 },
                });
                this.dataPdfExport = [];
                finalY = doc.lastAutoTable.finalY;
                doc
                  .setFontSize(8)
                  .text("Reporte pacientes Nuevos", 0.5, finalY + 0.2);
                doc
                  .setFontSize(8)
                  .text(
                    "N pacientes nuevos evaluados en el mes: " + resultPacN.length,
                    0.5,
                    finalY + 0.33
                  );
                console.log("comlumnssss", columns);
                doc.autoTable({
                  startY: finalY + 0.4,
                  columns: [
                    { title: "N", dataKey: "contador" },
                    { title: "Dni", dataKey: "dni" },
                    { title: "Paciente", dataKey: "nombrePaciente" },
                    { title: "frecuencia", dataKey: "frecuencia" },
                    { title: "turno", dataKey: "turno" },
                    { title: "Edad", dataKey: "edad" },
                    { title: "fechaIngreso", dataKey: "fechaIngreso" },
                    { title: "fechaEvaluacion", dataKey: "fechaEvaluacion" },
                    { title: "peso", dataKey: "peso" },
                    { title: "talla", dataKey: "talla" },
                    { title: "imc", dataKey: "imc" },
                    { title: "porcentajeCMB", dataKey: "porcentajeCMB" },
                    { title: "porcentajeEPT", dataKey: "porcentajeEPT" },
                    { title: "albSerica", dataKey: "albSerica" },
                    { title: "ValGlobalSub", dataKey: "ValGlobalSub" },
                    { title: "ingestaCalorica", dataKey: "ingestaCalorica" },
                    { title: "ingestaProteica", dataKey: "ingestaProteica" },
                    { title: "diagNutricional", dataKey: "diagNutricional" },
                    {
                      title: "interveNutricional",
                      dataKey: "interveNutricional",
                    },
                  ],
                  body: this.dataPdfExportPacNuevo,
                  margin: { left: 0.5, top: 1.87 },
                  styles: { fontSize: 5 },
                });
                this.dataPdfExportPacNuevo = [];
                // Using array of sentences
                /*doc
                  .setFont("helvetica")
                  .setFontSize(12)
                  .text(this.desserts, 0.5, 3.5, { align: "left", maxWidth: "7.5" });
                */
                // Creating footer and saving file
                doc
                  .setFont("times")
                  .setFontSize(10)
                  //.setFontStyle("italic")
                  .text(
                    "Firma y sello Nutricionista",
                    6,
                    doc.internal.pageSize.height - 0.7
                  );
                doc
                  .setFont("times")
                  .setFontSize(10)
                  //.setFontStyle("italic")
                  .text(
                    "C.N.P. N°____",
                    6.5,
                    doc.internal.pageSize.height - 0.5
                  );
                doc.save(`${this.heading}.pdf`);
                //console.log(this.desserts[0].datosPaciente.nombres, "aqui tas");
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

        //delete this.dataPdfExport
      }
    },
  },

  mounted() {},

  components: {
    ExportExcel,
  },
};
</script>

