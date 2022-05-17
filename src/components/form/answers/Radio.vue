<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
        <span style="color: red">{{ question.required ? '*' : '' }}</span>
      </span>

      <v-radio-group
        v-model="question.response"
        :rules="[rules.required]"
        dense
      >
        <v-radio
          v-for="(option, index) in question.options"
          :key="index"
          :label="option"
          :value="option"
          :readonly="!canEdit"
        />
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script>
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Radio',
    props: {
      question: {
        type: Object,
        required: true,
      },
      canEdit: {
        type: Boolean,
        default: true,
      },
    },
    mixins: [rules],
  };
</script>

<style></style>
