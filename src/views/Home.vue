<template>
  <div class="home">
    <v-row class="d-flex justify-end align-center px-6 mt-3">
      <v-btn x-large fab dark color="white" elevation="0">
        <v-icon color="grey-1"> mdi-account-circle </v-icon>
      </v-btn>
    </v-row>
    <v-row class="mx-6">
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="0" class="px-2" style="border: 2px solid #d9d016">
          <v-row>
            <v-col class="d-flex justify-start" cols="8">
              <v-card-title> Abertos </v-card-title>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-checkbox
                v-model="ex4"
                color="yellow-1"
                value="yellow-1"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-card-subtitle class="d-flex justify-start">
            <h1>10</h1>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="0" class="px-2" style="border: 2px solid #d91636">
          <v-row>
            <v-col class="d-flex justify-start" cols="8">
              <v-card-title> Não iniciados </v-card-title>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-checkbox
                v-model="ex4"
                color="red-1"
                value="red-1"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-card-subtitle class="d-flex justify-start">
            <h1>3</h1>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="0" class="px-2" style="border: 2px solid #6ad90b">
          <v-row>
            <v-col class="d-flex justify-start" cols="8">
              <v-card-title> Finalizados </v-card-title>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-checkbox
                v-model="ex4"
                color="green-1"
                value="green-1"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-card-subtitle class="d-flex justify-start">
            <h1>10</h1>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mx-6">
      <v-col cols="12" md="4" sm="4">
        <v-text-field label="Pesquisar" outlined dense></v-text-field>
      </v-col>
      <v-col cols="4" sm="3" md="2">
        <span class="d-flex justify-end align-center mt-2">Ordenar por:</span>
      </v-col>
      <v-col class="d-flex" cols="8" sm="8" md="3">
        <v-select :items="items" dense outlined clearable></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              prepend-icon="mdi-calendar"
              label="Data"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @input="menu2 = false"
            locale="pt-br"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="mx-8">
      <v-expansion-panels>
        <v-expansion-panel v-for="(item, i) in 5" :key="i">
          <v-expansion-panel-header class="pa-3 mt-1">
            <div class="d-flex justify-end">
              <div cols="6" class="mr-2 d-flex">Formulário {{ i + 1 }}</div>
              <v-spacer></v-spacer>
              <v-avatar color="green-1" size="15"></v-avatar>
              <div class="ml-2">100%</div>
              <div class="ml-6 mr-2 align-center">10/11/2021 - 16/11/2021</div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data: (vm) => {
      return {
        ex4: ['orange', 'red', 'green'],
        items: [
          'Data de início',
          'Abertos',
          'Finalizados',
          'Pendentes',
          'Data de fim',
        ],
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        menu: false,
        modal: false,
        dateFormatted: vm.formatDate(
          new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
        ),
        menu2: false,
      };
    },
    watch: {
      date() {
        this.dateFormatted = this.formatDate(this.date);
      },
    },

    methods: {
      formatDate(date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      },
    },
    components: {},
  };
</script>
