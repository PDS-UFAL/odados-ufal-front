<template>
  <v-container>
            <v-col class="d-flex justify-start" cols="8">
              <v-card-title> Abertos </v-card-title>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-checkbox
                v-model="ex4"
                color="yellow"
                value="yellow"
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

    <v-row class="my-8">
      <v-col cols="12" xs="12" md="4">
        <v-text-field
          name="search"
          label="Pesquisar"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          clearable
          hide-details
        />
      </v-col>

      <v-col cols="12" xs="12" md="2" class="py-0 mt-md-3 pr-md-0">
        <span class="d-flex justify-md-end align-center mt-md-2">
          Ordenar por:
        </span>
      </v-col>

      <v-col cols="12" xs="12" md="3" class="pt-0 pt-md-3">
        <v-select
          v-model="sortBy"
          :items="sortableItems"
          :menu-props="{ 'offset-y': true }"
          dense
          outlined
          hide-details
        />
      </v-col>

      <v-col cols="12" xs="12" md="3">
        <v-menu
          v-model="showDatepicker"
          :close-on-content-click="false"
          :nudge-right="0"
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              label="Criado em"
              :value="dateRangeText"
              prepend-inner-icon="mdi-calendar"
              dense
              readonly
              outlined
              clearable
              hide-details
              @click:clear="selectedDates = []"
              @click:prepend-inner="showDatepicker = true"
            />
          </template>
          <v-date-picker
            color="primary"
            v-model="selectedDates"
            locale="pt-br"
            range
            scrollable
            @change="setDates"
            :title-date-format="dateTitle"
          />
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
              <v-avatar color="green" size="15"></v-avatar>
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
  </v-container>
</template>

<script>
  import { formatDate } from '@/utils/formatDate';

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
        sortableItems: [
          { text: 'Nome', value: 'name' },
          { text: 'Data de início', value: 'initial_date' },
          { text: 'Data de fim', value: 'end_date' },
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

        sortBy: 'name',
        showDatepicker: false,
        selectedDates: [],
      };
    },
    methods: {
      setDates(dates) {
        this.selectedDates = dates.sort();
      },
      dateTitle() {
        return this.selectedDates.length === 2
          ? 'Intervalo selecionado'
          : formatDate(this.selectedDates[0]) || '-';
      },
      formatDate(date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    },
    computed: {
      dateRangeText() {
        const formattedDates = this.selectedDates.map((date) =>
          formatDate(date),
        );
        return formattedDates.join(' à ');
      },
    },
  };
</script>
