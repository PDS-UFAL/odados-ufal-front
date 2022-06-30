<template>
  <v-container class="px-sm-12">
    <confirmation-dialog
      ref="showSaveFormDialog"
      width="300"
      title="Salvar formulário?"
      description="Deseja salvar o fomulário?"
      confirmButton="Salvar"
    />
    <confirmation-dialog
      ref="deleteSection"
      width="400"
      title="Apagar seção?"
      description="Esta ação não pode ser desfeita."
      confirmButton="Apagar"
    />
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3><template v-if="!viewMode">Novo</template> Formulário</h3>
    </v-row>

    <v-row>
      <v-col cols="12" class="pa-0">
        <v-text-field
          background-color="white"
          v-model="title"
          name="title"
          label="Título do formulário"
          dense
          outlined
          clearable
          :disabled="viewMode"
        />
      </v-col>

      <!-- <v-spacer /> -->
    </v-row>
    <v-row>
      <v-textarea
        background-color="white"
        v-model="description"
        name="description"
        label="Descrição do formulário (opcional)"
        dense
        outlined
        clearable
        :disabled="viewMode"
      ></v-textarea>
    </v-row>

    <!-- <v-col cols="12" md="3" class="pa-0">
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
 -->
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

    <!-- <template v-if="viewMode && formSectors.length > 0">
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
    </template> -->

    <v-row class="pt-8">
      <h3>Perguntas</h3>
      <v-spacer />
    </v-row>

    <div v-for="(section, i) in sections" :key="i">
      <v-card style="padding: 0 2rem 1rem 2rem; margin: 2rem 0">
        <v-card-title>
          <input
            class="input-name"
            type="text"
            :disabled="disabledSectionNamEdition"
            :placeholder="section.name"
            v-model="section.name"
            :readonly="!section.canEdit"
          />
          <v-spacer></v-spacer>
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                link
                v-on:click="doItemAction(item, section)"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-layout column justify-center align-center>
          <draggable
            v-model="section.questions_attributes"
            :disabled="section.questions_attributes.length <= 1"
            class="questions"
            handle=".grab"
            ghost-class="ghost"
            :scroll-sensitivity="200"
            @sort="updateQuestions"
          >
            <question-card
              v-for="question in section.questions_attributes"
              :key="question.id"
              class="my-4"
              :question="question"
              :section="section"
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
                @click="addQuestion(section)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Adicionar pergunta</span>
          </v-tooltip>
        </v-layout>
      </v-card>
    </div>

    <div v-if="!viewMode" class="save-btn mb-8 mb-md-0">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            color="primary"
            v-bind="attrs"
            v-on="on"
            @click="showSaveDialog"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
        <span>Salvar formulário</span>
      </v-tooltip>
    </div>
    <div v-if="!viewMode" class="new-section-btn mb-8 mb-md-0">
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            color="primary"
            v-bind="attrs"
            v-on="on"
            @click="createFormSection"
          >
            <v-icon>mdi-new-box</v-icon>
          </v-btn>
        </template>
        <span>Nova seção</span>
      </v-tooltip>
    </div>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable';

  import { mapActions, mapGetters } from 'vuex';
  import { formatDate } from '@/utils/formatDate';
  import QuestionCard from '@/components/form/questions/QuestionCard';
  import ConfirmationDialog from '@/components/ConfirmationDialog';

  export default {
    name: 'CreateForms',
    components: {
      QuestionCard,
      draggable,
      ConfirmationDialog,
    },
    data: () => {
      return {
        loading: false,
        items: [
          {
            text: 'Nova seção',
            icon: 'mdi-plus',
            action: 'createSection',
          },
          {
            text: 'Deletar',
            icon: 'mdi-delete',
            action: 'deleteSection',
          },
        ],
        sectors: [],
        selectedSectors: [],
        // startDate: '',
        // endDate: '',
        title: null,
        description: null,
        // showStartDatepicker: false,
        // showEndDatepicker: false,
        form: null,
        disabledSectionNamEdition: false,
        currentFormIndex: 1,
        // sections: [{ name: 'Seção 1', questions: [], canEdit: false }],
        sections: [],
        questions: [],
        lastSelectableSection: 'Seção 1',
      };
    },
    beforeMount() {
      if (!this.isAdmin()) this.$router.push({ name: 'Home' });
    },
    async mounted() {
      this.title = this.getTitle;
      this.description = this.getDescription;
      this.selectedSectors = this.getSelectedSectors;
      // this.resetQuestions();
      this.resetSections();

      await this.loadSectors();

      if (this.$route.params.id) {
        await this.loadForm();
      }

      // this.sections[0].questions = this.getQuestions;
      this.sections = this.getSections;
      this.questions = this.getQuestions;
    },
    methods: {
      ...mapActions([
        'fetchSectors',
        'fetchForm',
        'addQuestion',
        'addSection',
        'createForm',
        'setAlert',
        'setQuestions',
        'resetQuestions',
        'resetSections',
        'setTitle',
        'setDescription',
        'setSelectedSectors',
      ]),
      isAdmin() {
        return this.getUser.role === 'admin';
      },
      // addNewQuestion(question, section) {
      //   this.lastSelectableSection = section.name;
      //   this.addQuestion(question);
      //   for (let currentSection in this.sections) {
      //     if (
      //       this.sections[currentSection].name === this.lastSelectableSection
      //     ) {
      //       this.sections[currentSection].questions.push(
      //         this.getQuestions[this.getQuestions.length - 1],
      //       );
      //     }
      //   }
      //   this.sections[0].questions.pop();
      // },
      doItemAction(item, section) {
        switch (item.action) {
          case 'createSection':
            this.addSection();
            break;
          case 'changeName':
            this.changeSectionName(section);
            break;
          case 'deleteSection':
            this.deleteSection(item, section);
            break;
        }
      },
      changeSectionName(section) {
        section.canEdit = !section.canEdit;
      },
      deleteSection(item, section) {
        if (this.sections.length === 1) {
          this.setAlert({
            alertMessage: 'Não é possível deletar a única seção',
            alertColor: 'red',
          });
          return;
        }
        for (let i = 0; i < this.sections.length; i++) {
          if (this.sections[i].name === section.name) {
            this.$refs.deleteSection.open(() => {
              this.sections.splice(i, 1);
            });
            break;
          }
        }
      },
      createFormSection() {
        this.currentFormIndex++;
        this.sections.push({
          name: 'Seção ' + this.currentFormIndex,
          canEdit: true,
          questions_attributes: [
            {
              id: 0,
              title: null,
              response: null,
              required: true,
              type: 'short-text',
              max_char: 250,
              min_value: null,
              max_value: null,
              options: [''],
              file: { name: '', size: '' },
              fileError: false,
            },
          ],
        });
      },
      async getFormAnswerBySector(sector) {
        this.$router.push({
          name: 'AnswerForm',
          params: { id: this.$route.params.id, sectorId: sector },
        });
      },
      showSaveDialog() {
        this.$refs.showSaveFormDialog.open(() => {
          this.saveForm();
        });
      },
      async saveForm() {
        //todo: refactor here
        if (!this.selectedSectors.length) {
          this.setAlert({
            alertMessage: 'Nenhum setor selecionado.',
            alertColor: 'red',
          });
          return;
        }
        try {
          this.loading = true;

          const payload = {
            form: {
              title: this.title,
              description: this.description,
              // start_date: this.startDate,
              // end_date: this.endDate,
              sector_ids: this.selectedSectors,
              sections_attributes: this.sections,
            },
          };
          await this.createForm({ payload });
          this.saveFunction();
          this.$router.push({ name: 'Home' });
        } catch (err) {
          this.errorFunction(err);
        } finally {
          this.loading = false;

          this.setTitle('');
          this.setDescription('');
          this.setSelectedSectors([]);
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
          this.setQuestions(this.form.sections[0].questions_attributes);
        } catch (err) {
          if (err.response?.status === 404) {
            this.$router.push({ name: 'CreateForms' });
          }
        }
      },
      updateQuestions() {
        this.setQuestions(this.sections[0].questions_attributes);
      },
    },
    computed: {
      ...mapGetters([
        'getQuestions',
        'getSections',
        'getUser',
        'getTitle',
        'getDescription',
        'getSelectedSectors',
      ]),
      // formSectors() {
      //   return (
      //     this.form?.sectors.filter((sector) => sector.status === 'answered') ||
      //     []
      //   );
      // },
      viewMode() {
        return !!this.$route.params.id;
      },
      today() {
        let date = new Date();
        return date.toISOString();
      },
    },
    watch: {
      // async $route() {
      //   await this.loadSectors();
      // },
      // getQuestions: {
      //   handler(newValue) {
      //     this.sections[0].questions = [...newValue];
      //   },
      //   deep: true,
      // },
      startDate(val) {
        if (this.endDate && val > this.endDate) {
          this.endDate = '';
        }
      },
      title(val) {
        this.setTitle(val);
      },
      description(val) {
        this.setDescription(val);
      },
      selectedSectors(val) {
        this.setSelectedSectors(val);
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

  .new-section-btn {
    position: fixed;
    bottom: 100px;
    right: 32px;
  }

  .questions {
    width: 100%;
  }

  .input-name {
    padding: 10px;
    border: 1px solid lightgray;
    border-radius: 10px;
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
