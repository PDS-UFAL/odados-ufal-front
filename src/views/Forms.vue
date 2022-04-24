<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3><template v-if="!viewMode">Novo</template> Formulário</h3>
    </v-row>

    <v-row>
      <v-col cols="12" md="5" class="pa-0">
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

      <v-col cols="12" md="3" class="pa-0">
        <v-menu
          v-model="showStartDatepicker"
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
              label="Abre em"
              :value="formatedDate(startDate)"
              prepend-inner-icon="mdi-calendar"
              dense
              readonly
              outlined
              clearable
              @click:clear="startDate = ''"
              @click:prepend-inner="showStartDatepicker = true"
              :disabled="viewMode"
            />
          </template>
          <v-date-picker
            color="primary"
            v-model="startDate"
            locale="pt-br"
            :min="today"
            scrollable
            @input="showStartDatepicker = false"
          />
        </v-menu>
      </v-col>

      <v-spacer />

      <v-col cols="12" md="3" class="pa-0">
        <v-menu
          v-model="showEndDatepicker"
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
              label="Fecha em"
              :value="formatedDate(endDate)"
              prepend-inner-icon="mdi-calendar"
              dense
              readonly
              outlined
              clearable
              @click:clear="dates = []"
              @click:prepend-inner="showEndDatepicker = true"
              :disabled="viewMode"
            />
          </template>
          <v-date-picker
            color="primary"
            v-model="endDate"
            locale="pt-br"
            :min="startDate || today"
            scrollable
            @input="showEndDatepicker = false"
          />
        </v-menu>
      </v-col>
    </v-row>

    <v-row class="pt-8 mb-4">
      <h3>Quem vai responder?</h3>
    </v-row>

    <v-row>
      <v-card elevation="3" class="px-4" width="100%">
        <v-card-title v-if="!viewMode" class="px-0 d-flex justify-end">
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

        <v-card-text class="overflow my-4">
          <v-row class="pa-0">
            <v-col class="pa-0">
              <div class="px-2" v-for="sector in sectors" :key="sector.name">
                <v-checkbox
                  v-model="selectedSectors"
                  :value="sector.id"
                  :label="sector.name"
                  :disabled="viewMode"
                  dense
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>

    <template v-if="viewMode && formSectors.length > 0">
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

    <v-layout column justify-center align-center>
      <draggable
        v-model="questions"
        :disabled="questions.length <= 1"
        class="questions"
        handle=".grab"
        ghost-class="ghost"
        :scroll-sensitivity="200"
        @sort="updateQuestions"
      >
        <question-card
          v-for="question in questions"
          :key="question.id"
          class="my-4"
          :question="question"
          :disabled="viewMode"
        />
      </draggable>

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
  import draggable from 'vuedraggable';

  import { mapActions, mapGetters } from 'vuex';
  import { formatDate } from '@/utils/formatDate';
  import QuestionCard from '@/components/form/questions/QuestionCard';

  export default {
    name: 'CreateForms',
    components: {
      QuestionCard,
      draggable,
    },
    data: () => {
      return {
        loading: false,
        sectors: [],
        selectedSectors: [],
        startDate: '',
        endDate: '',
        title: null,
        showStartDatepicker: false,
        showEndDatepicker: false,
        form: null,
        questions: [],
      };
    },
    async mounted() {
      this.resetQuestions();
      await this.loadSectors();

      if (this.$route.params.id) {
        await this.loadForm();
      }

      this.questions = this.getQuestions;
    },
    methods: {
      ...mapActions([
        'fetchSectors',
        'fetchForm',
        'addQuestion',
        'createForm',
        'setAlert',
        'setQuestions',
        'resetQuestions',
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
              start_date: this.startDate,
              end_date: this.endDate,
              sector_ids: this.selectedSectors,
              sections_attributes: [
                {
                  name: 'Perguntas',
                  questions_attributes: [...this.questions],
                },
              ],
            },
          };
          await this.createForm({ payload });
          this.saveFunction();
          this.$router.push({ name: 'Home' });
        } catch (err) {
          this.errorFunction(err);
        } finally {
          this.loading = false;
        }
      },
      formatedDate(date) {
        return formatDate(date);
      },
      back() {
        this.$router.back();
      },
      checkAll() {
        this.selectedSectors = [...this.sectors.map((sector) => sector.id)];
      },
      uncheckAll() {
        this.selectedSectors = [];
      },
      errorFunction(err) {
        if (err.response?.data.title) {
          this.setAlert({
            alertMessage: 'Título do formuário em branco.',
            alertColor: 'red',
          });
        } else if (err.response?.data.start_date) {
          this.setAlert({
            alertMessage:
              'A data inicial deve ser pelo menos a partir de hoje.',
            alertColor: 'red',
          });
        } else if (err.response?.data.end_date) {
          this.setAlert({
            alertMessage: 'A data do formulário está incorreta.',
            alertColor: 'red',
          });
        } else if (err.response?.data['sections.questions.title']) {
          this.setAlert({
            alertMessage: 'Título da pergunta não pode estar em branco.',
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
          this.startDate = this.form.start_date;
          this.endDate = this.form.end_date;
          // TODO: Refactor when sections are working
          this.setQuestions(this.form.sections[0].questions);
        } catch (err) {
          if (err.response?.status === 404) {
            this.$router.push({ name: 'CreateForms' });
          }
        }
      },
      updateQuestions() {
        this.setQuestions(this.questions);
      },
    },
    computed: {
      ...mapGetters(['getQuestions']),
      formSectors() {
        return (
          this.form?.sectors.filter((sector) => sector.status === 'answered') ||
          []
        );
      },
      viewMode() {
        return !!this.$route.params.id;
      },
      today() {
        let date = new Date();
        return date.toISOString();
      },
    },
    watch: {
      async $route() {
        await this.loadSectors();
      },
      getQuestions: {
        handler(newValue) {
          this.questions = [...newValue];
        },
        deep: true,
      },
      startDate(val) {
        if (this.endDate && val > this.endDate) {
          this.endDate = '';
        }
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

  .questions {
    width: 100%;
  }

  .ghost {
    opacity: 0.5;
    background: #83c5e46e;
  }

  .overflow {
    overflow-y: auto;
    height: 300px;
  }
</style>
