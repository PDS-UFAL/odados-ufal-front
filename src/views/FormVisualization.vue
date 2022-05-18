<template>
  <v-container class="px-sm-12">
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <v-btn @click="back" text fab small class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h3 v-if="form">{{ form.title }}</h3>
    </v-row>
    <v-tabs centered v-model="tab">
      <v-tab href="#tab-1">PERGUNTAS</v-tab>
      <v-tab href="#tab-2">RESPOSTAS ({{ responsesCount }})</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item style="padding: 8px" :value="'tab-1'">
        <v-card color="basil" flat>
          <h3>Perguntas</h3>
          <div>
            <question-card
              v-for="question in questions"
              :key="question.id"
              class="my-4"
              :question="question"
              :disabled="true"
            />
          </div>
        </v-card>
      </v-tab-item>
      <v-tab-item style="padding: 8px" :value="'tab-2'">
        <v-card color="basil" flat>
          <h3>Respostas</h3>
          <br />
        </v-card>
        <div style="padding: 8px">
          <v-row>
            <v-select
              label="Setor(es)"
              v-model="sectorsSelected"
              :items="sectors"
              item-text="name"
              outlined
              return-object
            ></v-select>
            <!-- <v-select
              label="Setor(es)"
              v-model="sectorsSelected"
              :items="sectors"
              item-text="name"
              outlined
              return-object
            ></v-select> -->
          </v-row>

          <section-responses
            v-for="section in sections"
            :key="section.id"
            :section="section"
            :sectorsSelected="sectorsSelected"
            :formSends="formSends"
          >
          </section-responses>
          <!-- <div v-for="section in sections" :key="section.id">
            <v-card color="basil" style="margin: 16px 0" flat elevation="3">
              <v-card-title class="align-middle">
                <h3>{{ section.name }}</h3>
              </v-card-title>
              <v-card-text>
                <v-checkbox
                  v-model="checkbox"
                  :label="`Agrupar dados da seção`"
                ></v-checkbox>
              </v-card-text>
            </v-card>
            <response-card
              v-for="question in section.questions"
              :key="question.id"
              class="my-4"
              :question="question"
              :sectorsProps="sectorsSelected"
              :disabled="true"
              :formSends="formSends"
            />
          </div> -->
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  import QuestionCard from '@/components/form/questions/QuestionCard';
  // import ResponseCard from '@/components/form/responses/ResponseCard';
  import SectionResponses from '@/components/form/responses/SectionResponses';

  export default {
    components: {
      QuestionCard,
      // ResponseCard,
      SectionResponses,
    },
    data: () => {
      return {
        form: null,
        tab: null,
        questions: [],
        sections: [],
        responsesCount: 0,
        sectorsSelected: {},
        sectors: [],
        formSends: null,
      };
    },
    async mounted() {
      this.tab = 'tab-2';
      // await this.loadForm();
      await this.loadFormSends();
    },
    methods: {
      ...mapActions(['fetchForm', 'fetchFormSends']),
      back() {
        this.$router.back();
      },
      async loadForm() {
        const { data } = await this.fetchForm({ id: this.$route.params.id });
        this.form = { ...data.form };

        this.sections = this.form.sections;

        this.form.sections.forEach((section) => {
          if (section.questions !== undefined) {
            this.questions.push(...section.questions);
          }
        });

        this.questions.every((question) => {
          if (question.responses !== undefined) {
            this.responsesCount = question.responses.length;
            return false;
          }
          return true;
        });

        // if (this.form.sectors !== undefined) {
        //   this.sectors = this.form.sectors.filter((sector) => {
        //     return sector.status === 'answered';
        //   });

        //   let sector = { name: 'Todos', allSectors: this.sectors };
        //   this.sectors.push(sector);
        //   this.sectorsSelected = sector;
        // }
      },
      async loadFormSends() {
        const { data } = await this.fetchFormSends({
          params: {
            form_id: this.$route.params.id,
          },
        });

        if (data.form_sends.length === 0) {
          this.loadForm();
          return;
        }

        this.formSends = { ...data.form_sends };

        this.form = this.formSends[0].form;

        this.sections = this.form.sections;

        this.form.sections.forEach((section) => {
          if (section.questions !== undefined) {
            this.questions.push(...section.questions);
          }
        });

        if (this.formSends[0].sectors !== undefined) {
          this.sectors = this.formSends[0].sectors;
        }

        this.questions.every((question) => {
          if (question.responses !== undefined) {
            this.responsesCount = question.responses.length;

            let sectorsIds = [];
            question.responses.every((response) => {
              sectorsIds.push(response.user.sector_id);
              return true;
            });

            this.sectors = this.sectors.filter((sector) => {
              return sectorsIds.includes(sector.id);
            });

            let sector = { name: 'Todos', allSectors: this.sectors };
            this.sectors.push(sector);
            this.sectorsSelected = sector;

            return false;
          }
          return true;
        });
      },
    },
  };
</script>

<style scoped></style>
