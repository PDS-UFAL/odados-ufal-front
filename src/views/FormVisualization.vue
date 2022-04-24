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
      <v-tab href="#tab-2">RESPOSTAS (0)</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item style="padding: 8px" :value="'tab-1'">
        <v-card color="basil" flat>
          <h3>Perguntas</h3>
          <div v-for="question in questions" :key="question.id">
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
        <v-card color="basil" style="margin: 16px 0" flat elevation="3">
          <v-card-title>Respostas</v-card-title>
          <v-divider />
          <v-card-text>
            <v-tabs centered v-model="tab2">
              <v-tab href="#tab2-1">RESUMO</v-tab>
              <v-tab href="#tab2-2">INDIVIDUAL</v-tab>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tabs-items v-model="tab2">
        <v-tab-item style="padding: 8px" :value="'tab2-1'">
          <div v-for="question in questions" :key="question.id">
            <v-card color="basil" style="margin: 16px 0" flat elevation="3">
              <v-card-title>{{ question.title }}</v-card-title>
              <v-divider />
              <v-card-text> Gráfico </v-card-text>
            </v-card>
          </div>
        </v-tab-item>
        <v-tab-item style="padding: 8px" :value="'tab2-2'">
          <p>Setor</p>
          <v-select
            style="width: 256px"
            v-model="select"
            :items="items"
            outlined
          ></v-select>
          <div v-for="question in questions" :key="question.id">
            <v-card color="basil" style="margin: 16px 0" flat elevation="3">
              <v-card-title>{{ question.title }}</v-card-title>
              <v-divider />
              <v-card-text> Gráfico </v-card-text>
            </v-card>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs-items>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  import QuestionCard from '@/components/form/questions/QuestionCard';

  export default {
    components: {
      QuestionCard,
    },
    data: () => {
      return {
        form: null,
        tab: null,
        tab2: null,
        questions: [],
        select: 'teste',
        items: ['teste'],
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
        this.questions = this.form.sections[0].questions;
      },
    },
  };
</script>

<style scoped></style>
