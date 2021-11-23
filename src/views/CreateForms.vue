<template>
  <v-container>
    <!-- <v-fab-transition right> -->

    <!-- </v-fab-transition> -->
    <v-row class="d-flex justify-end align-center px-0 ml-3 mt-3">
      <v-btn x-large fab dark color="white" elevation="0">
        <v-icon color="grey-1"> mdi-account-circle </v-icon>
      </v-btn>
    </v-row>

    <v-row class="d-flex align-center justify-start pa-0">
      <!-- <v-col> -->
      <v-btn @click="back" text fab class="flex-grow-0">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>Novo formulário</h3>
      <!-- </v-col>
      <v-col> </v-col> -->
    </v-row>

    <v-row class="my-8 ma-2">
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

    <v-row class="my-4 ma-2">
      <h3>Quem vai responder?</h3>
    </v-row>

    <v-row>
      <v-card elevation="3" class="px-2 mt-4 ma-3">
        <v-col class="d-flex align-center justify-end">
          <v-btn text>Marcar todos</v-btn>
          <v-btn text>Desmarcar todos</v-btn>
        </v-col>

        <v-row class="mx-4">
          <div v-for="i in 22" :key="i">
            <v-col md="2" class="px-5">
              <v-checkbox v-model="checkbox" label="Setor"></v-checkbox>
            </v-col>
          </div>
        </v-row>
      </v-card>
    </v-row>

    <v-row class="pt-6 ma-2">
      <h3>Perguntas</h3>
      <v-spacer></v-spacer>
      <v-btn text color="primary">
        <v-icon>mdi-plus</v-icon>
        Importar perguntas
      </v-btn>
    </v-row>

    <div class="d-flex align-center justify-end ml-6">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            fab
            large
            bottom
            right
            v-bind="attrs"
            v-on="on"
          >
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
        checkbox: false,
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
    },
    computed: {
      dateRangeText() {
        const formattedDates = this.dates.map((date) => formatDate(date));
        return formattedDates.join(' à ');
      },
    },
  };
</script>
