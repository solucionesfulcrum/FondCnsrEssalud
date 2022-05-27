<template>
  <v-container>
    <v-card class="mx-auto my-5" max-width="900">
      <v-system-bar color="#1973a5" dark> Reportes </v-system-bar>
      <v-row class="mt-4 container">
        <v-col cols="12" sm="12" md="12">
          <v-autocomplete
            v-model="valueClinicas"
            :items="itemsClinicas"
            solo
            filled
            label="Seleccine una Clinica"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Buscar Desde"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Buscar Hasta"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="4"> </v-col>
        <v-col cols="12" md="4">
          <v-btn class="mt-10" icon color="#1973a5" @click="exportExcel">
            Generar Excel<v-icon>mdi-arrow-down-bold-box</v-icon>
          </v-btn>
        </v-col>
        <!--<v-col cols="12" md="4">
          <v-btn class="mt-10" icon color="#1973a5" @click="generatePDF">
            Generar PDF<v-icon>mdi-arrow-down-bold-box</v-icon>
          </v-btn>
        </v-col>-->
      </v-row>
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
    dataToExport: [],
    dataNutriServ: [],
    dataNutriDefault: [],
    dataPdfExport: [],
    heading: "REPORTE PACIENTES NUTRICIÓN",
    select: [],
    itemsClinicas: [],
    valueClinicas: null,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
  }),

  computed: {},

  watch: {},

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
    exportExcel() {
      //delete this.dataToExport
      this.dataToExport = []
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
              this.dataNutriServ = res.data;
              console.log("value clinica", this.valueClinicas);
              console.log("serv", this.dataNutriServ);

              for (let i = 0; i < res.data.length; i++) {
                //this.dataPdfExport.push(this.desserts[i].datosPaciente.nombres,this.desserts[i]);
                this.dataToExport.push(
                  Object.assign(
                    {
                      Nombre:
                        res.data[i].datosPaciente.nombres +
                        " " +
                        res.data[i].datosPaciente.ape_pat +
                        " " +
                        res.data[i].datosPaciente.ape_mat,
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
    },
    generatePDF() {
      console.log("datos deseert elemt", this.dataToExport);
      for (let i = 0; i < this.dataNutriServ.length; i++) {
        //this.dataPdfExport.push(this.desserts[i].datosPaciente.nombres,this.desserts[i]);
        this.dataPdfExport.push(
          Object.assign(
            {
              datapacfull:
                this.dataNutriServ[i].datosPaciente.nombres +
                " " +
                this.dataNutriServ[i].datosPaciente.ape_pat +
                " " +
                this.dataNutriServ[i].datosPaciente.ape_mat,
            },
            this.dataNutriServ[i]
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
      //console.log(this.desserts[0].datosPaciente.nombres, "aqui tas");
    },
  },

  mounted() {},

  components: {
    ExportExcel,
  },
};
</script>

