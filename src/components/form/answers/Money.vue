<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
        <span style="color: red">{{ question.required ? '*' : '' }}</span>
      </span>
      <div style="display: flex; justify-content: start">
        <v-data-table
          :headers="headers"
          :items="items"
          disable-pagination
          hide-default-footer
          dense
          class="elevation-4"
          style="margin: 1rem 0"
        ></v-data-table>
      </div>
      <v-text-field
        v-model="question.response"
        :rules="[rules.required, ...rules.number]"
        label="Sua Resposta (2022)"
        class="mt-2"
        type="number"
        prefix="R$"
        dense
        outlined
        :readonly="!canEdit"
      />
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Money',
    props: {
      question: {
        type: Object,
        required: true,
      },
      canEdit: {
        type: Boolean,
        default: true,
      },
      headers: {
        type: Array,
      },
      items: {
        type: Array,
      },
    },
    mixins: [rules],
  };
</script>

<style></style>
