<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3><template v-if="!viewMode">Novo</template> Formulário</h3>
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
          :disabled="viewMode"
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
              :disabled="viewMode"
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
        <v-card-title v-if="!viewMode" class="d-flex justify-end">
          <v-btn
            @click="checkAll"
            :disabled="selectedSectors.length == sectors.length"
            text
            small
          >
            Marcar todos
          </v-btn>
          <v-btn
            :disabled="selectedSectors.length == 0"
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
                v-model="selectedSectors"
                :value="sector.id"
                :label="sector.name"
                :disabled="viewMode"
              />
            </div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>

    <template v-if="viewMode">
      <v-row class="pt-8 mb-4">
        <h3>Respostas</h3>
      </v-row>

      <v-row>
        <v-card elevation="3" class="px-2" width="100%">
          <v-card-text>
            <v-layout column>
              <div
                class="px-5 px-md-4"
                v-for="sector in formSectors"
                :key="sector.name"
              >
                <v-btn icon @click="getFormAnswerBySector(sector.id)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                {{ sector.name }}
              </div>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-row>
    </template>

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
        :disabled="viewMode"
      />

      <v-tooltip v-if="!viewMode" top>
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

    <div v-if="!viewMode" class="save-btn mb-8 mb-md-0">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            color="primary"
            v-bind="attrs"
            v-on="on"
            @click="saveForm"
            :loading="loading"
            :disabled="loading"
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
        selectedSectors: [],
        dates: [],
        title: null,
        showDatepicker: false,
        form: null,
      };
    },
    async mounted() {
      await this.loadSectors();

      if (this.$route.params.id) {
        await this.loadForm();
      }
    },
    methods: {
      ...mapActions([
        'fetchSectors',
        'fetchForm',
        'addQuestion',
        'createForm',
        'setAlert',
        'setQuestions',
      ]),
      async getFormAnswerBySector(sector) {
        this.$router.push({
          name: 'AnswerForm',
          params: { id: this.$route.params.id, sectorId: sector },
        });
      },
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
          this.saveFunction();
        } catch (err) {
          this.errorFunction(err);
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
        this.selectedSectors = [...this.sectors.map((sector) => sector.id)];
      },
      uncheckAll() {
        this.selectedSectors = [];
      },
      dateTitle() {
        return this.dates.length === 2
          ? 'Intervalo selecionado'
          : formatDate(this.dates[0]) || '-';
      },
      errorFunction(err) {
        if (err.response?.data.start_date || err.response?.data.end_date) {
          this.setAlert({
            alertMessage: 'A data está incorreta.',
            alertColor: 'red',
          });
        } else {
          this.setAlert({
            alertMessage: 'Ocorreu um erro ao carregar os setores.',
            alertColor: 'red',
          });
        }
      },
      saveFunction() {
        this.setAlert({
          alertMessage: 'Formulário salvo.',
          alertColor: 'green',
        });
      },
      async loadSectors() {
        try {
          const { data } = await this.fetchSectors();
          this.sectors = [...data.sectors];
        } catch (err) {
          this.errorFunction(err);
        }
      },
      async loadForm() {
        try {
          const { data } = await this.fetchForm({ id: this.$route.params.id });
          this.form = { ...data.form };

          this.selectedSectors = [
            ...this.form.sectors.map((sector) => sector.id),
          ];

          this.title = this.form.title;
          this.dates = [this.form.start_date, this.form.end_date];

          // TODO: Refactor when sections are working
          this.setQuestions(this.form.sections[0].questions);
        } catch (err) {
          if (err.response?.status === 404) {
            this.$router.push({ name: 'CreateForms' });
          }
        }
      },
    },
    computed: {
      ...mapGetters(['getQuestions']),
      dateRangeText() {
        const formattedDates = this.dates.map((date) => formatDate(date));
        return formattedDates.join(' à ');
      },
      formSectors() {
        return (
          this.form?.sectors.filter((sector) => sector.status === 'answered') ||
          []
        );
      },
      viewMode() {
        return !!this.$route.params.id;
      },
    },
    watch: {
      async $route() {
        await this.loadSectors();
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
