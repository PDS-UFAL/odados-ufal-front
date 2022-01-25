<template>
  <v-flex v-if="show">
    <span class="text-subtitle-1 font-weight-bold">Parâmetros:</span>

    <v-row class="pt-4" v-if="maxChar">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="question.max_char"
          label="Quantidade máxima de caracteres"
          dense
          outlined
          hide-details
          :disabled="disabled"
        />
      </v-col>
    </v-row>

    <v-row class="pt-4" v-if="range">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="question.min_value"
          label="Valor mínimo (opcional)"
          type="number"
          dense
          outlined
          hide-details
          :disabled="disabled"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="question.max_value"
          label="Valor máximo (opcional)"
          type="number"
          dense
          outlined
          hide-details
          :disabled="disabled"
        />
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
  export default {
    name: 'Parameters',
    props: {
      question: {
        type: Object,
        required: true,
      },
      show: {
        type: Boolean,
        default: false,
      },
      maxChar: {
        type: Boolean,
        default: false,
      },
      range: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style></style>
