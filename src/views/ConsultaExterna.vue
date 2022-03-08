<template>
  <div>
    <NavBar />
    <div class="row">
      <div class="col-sm-2">
        <v-card class="mx-auto" width="256" tile>
          <v-navigation-drawer permanent>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                </v-list-item-avatar>
              </v-list-item>

              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="text-h6"> CNSR </v-list-item-title>
                  <v-list-item-subtitle
                    >ESSALUD</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-icon>mdi-menu-down</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list nav dense>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </div>
        <div v-if="selectedItem == 0" class="col-sm-10"><CExternaAnem /></div>
        <div v-if="selectedItem == 1" class="col-sm-10"><CExternaNut /></div>
      </div>
    </div>
</template>

<script>
import NavBar from "../components/navbar/NavBar.vue";
import CExternaNut from "./CExternaNut.vue";
import CExternaAnem from "./CExternaAnem.vue";
import CalendarioAnemia from "./CalendarioAnemia.vue";
export default {
  data() {
    return {
    selectedItem: 0,
    items: [
      { text: "Anemia", icon: "mdi-folder" },
      { text: "Nutrición", icon: "mdi-folder" },
    ],
    };
  },
  methods: {},
  created() {},
  components: {
    NavBar,
    CExternaNut,
    CExternaAnem,
    CalendarioAnemia,
  },
};
</script>