<template>
  <v-container class="px-sm-12">
    <v-row class="d-flex align-center justify-start pa-0 mt-md-4 mb-8">
      <v-btn @click="back" text fab class="flex-grow-0">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3>Novo formulário</h3>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" class="pa-0">
        <v-text-field
          v-model="title"
          name="title"
          label="Título do formulário"
          dense
          outlined
          clearable
        />
      </v-col>

      <v-spacer />

      <v-col cols="12" md="4" class="pa-0 mr-4">
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
              dense
              readonly
              outlined
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

    <v-row class="pt-8 mb-4">
      <h3>Quem vai responder?</h3>
    </v-row>

    <v-row>
      <v-card elevation="3" class="px-2" width="100%">
        <v-card-title class="d-flex justify-end">
          <v-btn
            @click="checkAll"
            :disabled="selected.length == sectors.length"
            text
            small
          >
            Marcar todos
          </v-btn>
          <v-btn
            :disabled="selected.length == 0"
            text
            small
            @click="uncheckAll"
          >
            Desmarcar todos
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row class="mx-4">
            <div
              class="px-2 px-md-4"
              v-for="sector in sectors"
              :key="sector.name"
            >
              <v-checkbox
                v-model="selected"
                :value="sector.name"
                :label="sector.name"
              />
            </div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>

    <v-row class="pt-8">
      <h3>Perguntas</h3>
      <v-spacer />
    </v-row>

    <v-layout row justify-center>
      <question-card
        v-for="(question, index) in getQuestions"
        :key="index"
        class="my-4"
        :question="question"
      />

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            small
            color="primary"
            @click="addQuestion"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Adicionar pergunta</span>
      </v-tooltip>
    </v-layout>

    <div class="save-btn mb-8 mb-md-0">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab color="primary" v-bind="attrs" v-on="on" @click="saveForm">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
        <span>Salvar formulário</span>
      </v-tooltip>
    </div>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { formatDate } from '@/utils/formatDate';
  import QuestionCard from '@/components/form/questions/QuestionCard';

  export default {
    name: 'CreateForms',
    components: {
      QuestionCard,
    },
    data: () => {
      return {
        loading: false,
        sectors: [],
        selected: [],
        dates: [],
        title: null,
        showDatepicker: false,
      };
    },
    async mounted() {
      try {
        const { data } = await this.fetchSectors();
        this.sectors = [...data];
      } catch (err) {
        this.setAlert({
          alertMessage:
            err.response?.data.error ||
            'Ocorreu um erro ao carregar os setores.',
          alertColor: 'red',
        });
      }
    },
    methods: {
      ...mapActions(['fetchSectors', 'addQuestion', 'createForm', 'setAlert']),
      async saveForm() {
        try {
          this.loading = true;

          const payload = {
            form: {
              title: this.title,
              start_date: this.dates[0],
              end_date: this.dates[1],
              sector_ids: this.sectors.map((sector) => sector.id),
              sections_attributes: [
                {
                  name: 'Perguntas',
                  questions_attributes: [...this.getQuestions],
                },
              ],
            },
          };

          await this.createForm({ payload });
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Occorreu um erro ao tentar salvar o formulário.',
            alertColor: 'red',
          });
        } finally {
          this.loading = false;
        }
      },
      back() {
        this.$router.back();
      },
      setDates(dates) {
        this.dates = dates.sort();
      },
      checkAll() {
        this.selected = [...this.sectors.map((sector) => sector.name)];
      },
      uncheckAll() {
        this.selected = [];
      },
      dateTitle() {
        return this.dates.length === 2
          ? 'Intervalo selecionado'
          : formatDate(this.dates[0]) || '-';
      },
    },
    computed: {
      ...mapGetters(['getQuestions']),
      dateRangeText() {
        const formattedDates = this.dates.map((date) => formatDate(date));
        return formattedDates.join(' à ');
      },
    },
  };
</script>

<style scoped lang="scss">
  .save-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
  }
</style>
