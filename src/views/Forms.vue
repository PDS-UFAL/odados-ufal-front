<template>
  <v-container class="my-8 pa-8">
    <v-row>
      <h3>Formulários</h3>
    </v-row>

    <v-row class="my-8">
      <v-col cols="12" xs="12" md="4" class="pa-0">
        <v-text-field
          name="search"
          label="Pesquisar"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          clearable
        />
      </v-col>

      <v-spacer />

      <v-col cols="12" xs="12" md="3" class="pa-0">
        <v-row class="ma-0">
          <span class="mr-2 py-2">Status: </span>

          <v-col cols="12" xs="12" sm="11" md="8" class="pa-0">
            <v-select
              v-model="status"
              :menu-props="{ 'offset-y': true }"
              :items="getAllStatus"
              return-object
              outlined
              dense
            >
              <template v-slot:item="{ item }">
                <v-icon
                  style="margin-top: 4px"
                  v-if="item.color"
                  size="12"
                  :color="item.color"
                >
                  mdi-checkbox-blank-circle
                </v-icon>
                <span class="body-2 ml-2"> {{ item.text }} </span>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" xs="12" md="3" class="pa-0">
        <v-menu
          v-model="showDatepicker"
          :close-on-content-click="false"
          :nudge-right="0"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              label="Data"
              :value="dateRangeText"
              prepend-inner-icon="mdi-calendar"
              readonly
              outlined
              dense
              clearable
              @click:clear="dates = []"
              @click:prepend-inner="showDatepicker = true"
            />
          </template>
          <v-date-picker
            color="primary"
            v-model="dates"
            locale="pt-br"
            range
            scrollable
            @change="setDates"
            :title-date-format="dateTitle"
          />
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
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

    <div class="add-btn">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="createForms"
            fab
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Novo formulário</span>
      </v-tooltip>
    </div>
  </v-container>
</template>

<script>
  import { formatDate } from '@/utils/formatDate';

  export default {
    name: 'Forms',
    data: () => {
      return {
        search: '',
        status: 'Mostrar todos',
        dates: [],
        showDatepicker: false,

        headers: [
          { text: 'Nome', value: 'name', align: 'start', width: '40%' },
          { text: 'Status', value: 'status', sortable: false, width: '20%' },
          { text: 'Data inicial', value: 'startDate' },
          { text: 'Data final', value: 'endDate' },
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
      };
    },
    methods: {
      chipStatusColor(status) {
        return (
          {
            open: 'yellow',
            finished: 'green',
            not_started: 'red',
          }[status] || 'primary'
        );
      },
      translatedStatus(status) {
        return {
          open: 'Aberto',
          finished: 'Fechado',
          not_started: 'Não iniciado',
        }[status];
      },
      setDates(dates) {
        this.dates = dates.sort();
      },
      dateTitle() {
        return this.dates.length === 2
          ? 'Intervalo selecionado'
          : formatDate(this.dates[0]) || '-';
      },
      createForms() {
        this.$router.push('/createForms');
      },
    },
    computed: {
      getAllStatus() {
        const status = ['open', 'finished', 'not_started'];
        return [
          { text: 'Mostrar todos' },
          ...status.map((s) => ({
            text: this.translatedStatus(s),
            color: this.chipStatusColor(s),
            value: s,
          })),
        ];
      },
      dateRangeText() {
        const formattedDates = this.dates.map((date) => formatDate(date));
        return formattedDates.join(' à ');
      },
    },
  };
</script>

<style scoped lang="scss">
  .add-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
  }
</style>
