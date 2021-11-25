<template>
  <v-container>
    <v-row>
      <filter-cards :options="filters" @clickOption="changeFilter" />
    </v-row>

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

    <v-row class="mx-0">
      <v-col class="pa-0">
        <v-data-table
          :headers="headers"
          :items="forms"
          class="elevation-2"
          disable-pagination
          hide-default-footer
          :disable-sort="$vuetify.breakpoint.smAndDown"
        >
          <template v-slot:item.status="{ item }">
            <v-icon size="17" :color="chipStatusColor(item.status)">
              mdi-checkbox-blank-circle
            </v-icon>
            {{ translatedStatus(item.status) }}
          </template>

          <template v-slot:item.actions="{}">
            <v-btn small icon>
              <v-icon> mdi-eye </v-icon>
            </v-btn>

            <v-btn small icon>
              <v-icon> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { formatDate } from '@/utils/formatDate';
  import FilterCards from '@/components/FilterCards.vue';

  export default {
    name: 'Home',
    components: {
      FilterCards,
    },
    data: () => {
      return {
        filters: [
          {
            title: 'Abertos',
            status: 'opened',
            amount: 10,
            color: 'yellow',
            active: false,
          },
          {
            title: 'Não iniciados',
            status: 'not_started',
            amount: 3,
            color: 'red',
            active: false,
          },
          {
            title: 'Finalizados',
            status: 'finished',
            amount: 7,
            color: 'green',
            active: false,
          },
        ],

        sortableItems: [
          { text: 'Nome', value: 'name' },
          { text: 'Data de início', value: 'initial_date' },
          { text: 'Data de fim', value: 'end_date' },
        ],

        headers: [
          {
            text: 'Nome',
            value: 'name',
            sortable: false,
            align: 'start',
            width: '40%',
          },
          { text: 'Status', value: 'status', sortable: false, width: '20%' },
          { text: 'Data inicial', value: 'startDate', sortable: false },
          { text: 'Data final', value: 'endDate', sortable: false },
          { text: 'Ações', value: 'actions', sortable: false, align: 'end' },
        ],

        forms: [
          {
            name: 'Formulário 1',
            status: 'open',
            startDate: '10/10/2021',
            endDate: '10/11/2021',
          },
          {
            name: 'Formulário 2',
            status: 'finished',
            startDate: '10/10/2021',
            endDate: '10/11/2021',
          },
          {
            name: 'Formulário 3',
            status: 'not_started',
            startDate: '01/12/2021',
            endDate: '30/01/2022',
          },
        ],

        sortBy: 'name',
        showDatepicker: false,
        selectedDates: [],
      };
    },
    methods: {
      changeFilter(filterIndex, value) {
        this.filters[filterIndex].active = value;
      },
      setDates(dates) {
        this.selectedDates = dates.sort();
      },
      dateTitle() {
        return this.selectedDates.length === 2
          ? 'Intervalo selecionado'
          : formatDate(this.selectedDates[0]) || '-';
      },
      chipStatusColor(status) {
        return (
          {
            open: 'yellow',
            finished: 'green',
            not_started: 'red',
          }[status] || 'primary'
        );
      },
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
