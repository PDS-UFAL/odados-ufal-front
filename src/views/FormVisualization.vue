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
          <v-select
            style="width: 256px"
            label="Setor(es)"
            v-model="sectorsSelected"
            :items="sectors"
            item-text="name"
            outlined
            return-object
          ></v-select>
          <div>
            <response-card
              v-for="question in questions"
              :key="question.id"
              class="my-4"
              :question="question"
              :sectors="sectorsSelected"
              :disabled="true"
            />
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  import QuestionCard from '@/components/form/questions/QuestionCard';
  import ResponseCard from '@/components/form/responses/ResponseCard';

  export default {
    components: {
      QuestionCard,
      ResponseCard,
    },
    data: () => {
      return {
        form: null,
        tab: null,
        questions: [],
        responsesCount: 0,
        sectorsSelected: {},
        sectors: [],
      };
    },
    async mounted() {
      await this.loadForm();
    },
    methods: {
      ...mapActions(['fetchForm']),
      back() {
        this.$router.back();
      },
      async loadForm() {
        const { data } = await this.fetchForm({ id: this.$route.params.id });
        this.form = { ...data.form };

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

        if (this.form.sectors !== undefined) {
          this.sectors = this.form.sectors.filter((sector) => {
            return sector.status === 'answered';
          });

          let sector = { name: 'Todos', allSectors: this.sectors };
          this.sectors.push(sector);
          this.sectorsSelected = sector;
        }
      },
    },
  };
</script>

<style scoped></style>
