<template>
  <v-container>
    <v-row class="d-flex align-center justify-start pa-0 my-8">
      <v-btn @click="back" text fab class="flex-grow-0">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>Novo formulário</h3>
    </v-row>

    <v-row class="my-8 mx-2">
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

      <v-col cols="12" xs="12" md="3" class="pa-0 mr-4">
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

    <v-row class="my-4 mx-2">
      <h3>Quem vai responder?</h3>
    </v-row>

    <v-row>
      <v-card elevation="3" class="px-2 mt-4 ma-3" width="100%">
        <v-col class="d-flex align-center justify-end">
          <v-btn
            @click="checkAll"
            :disabled="selected.length == sectors.length"
            text
            >Marcar todos</v-btn
          >
          <v-btn :disabled="selected.length == 0" text bottom @click="undo"
            >Desmarcar todos</v-btn
          >
        </v-col>

        <v-row class="mx-4">
          <div v-for="sector in sectors" :key="sector.name">
            <v-col class="px-4">
              <v-checkbox
                v-model="selected"
                :value="sector.name"
                :label="sector.name"
              ></v-checkbox>
            </v-col>
          </div>
        </v-row>
      </v-card>
    </v-row>

    <v-row class="pt-6 mx-2">
      <h3>Perguntas</h3>
      <v-spacer></v-spacer>
      <v-btn text color="primary">
        <v-icon>mdi-plus</v-icon>
        Importar perguntas
      </v-btn>
    </v-row>

    <div class="add-btn">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab color="primary" v-bind="attrs" v-on="on">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
        <span>Salvar formulário</span>
      </v-tooltip>
    </div>
  </v-container>
</template>

<script>
  import { formatDate } from '@/utils/formatDate';

  export default {
    name: 'CreateForms',
    data: () => {
      return {
        sectors: [
          {
            name: 'Setor 1',
          },
          {
            name: 'Setor 2',
          },
          {
            name: 'Setor 3',
          },
          {
            name: 'Setor 4',
          },
          {
            name: 'Setor 5',
          },
          {
            name: 'Setor 6',
          },
          {
            name: 'Setor 7',
          },
        ],
        selected: [],
        dates: [],
        showDatepicker: false,
      };
    },
    methods: {
      back() {
        this.$router.back();
      },
      setDates(dates) {
        this.dates = dates.sort();
      },
      checkAll() {
        this.selected = [...this.sectors.map((sector) => sector.name)];
      },
      undo() {
        this.selected = [];
      },
      dateTitle() {
        return this.dates.length === 2
          ? 'Intervalo selecionado'
          : formatDate(this.dates[0]) || '-';
      },
    },
    computed: {
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
