<template>
  <v-flex>
    <span class="text-subtitle-1 font-weight-bold">Opções:</span>

    <v-row class="pt-4">
      <v-col cols="12" md="6">
        <v-row class="ma-0 mb-2 d-flex align-center">
          <v-col cols="8" sm="9" class="pa-0">
            <v-text-field
              v-model="question.options[0]"
              label="Opção 1"
              dense
              outlined
              hide-details
            />
          </v-col>

          <v-col>
            <v-btn
              color="primary"
              class="mr-2"
              @click="addOption"
              v-if="question.options.length < 2"
              icon
              outlined
              small
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              color="red"
              :disabled="question.options.length < 2"
              @click="removeOption(0)"
              icon
              outlined
              small
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row
          class="ma-0 d-flex align-center"
          v-for="(option, index) in question.options"
          :key="index"
        >
          <template v-if="index > 0">
            <v-col cols="8" sm="9" class="pa-0 my-2">
              <v-text-field
                v-model="question.options[index]"
                :label="`Opção ${index + 1}`"
                dense
                outlined
                hide-details
              />
            </v-col>

            <v-col>
              <v-btn
                color="primary"
                class="mr-2"
                @click="addOption"
                v-if="index === question.options.length - 1"
                icon
                outlined
                small
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                color="red"
                :disabled="question.options.length < 2"
                @click="removeOption(index)"
                icon
                outlined
                small
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
  export default {
    name: 'OptionsList',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    methods: {
      addOption() {
        this.question.checkboxExample = [];
        this.question.options.push('');
      },
      removeOption(index) {
        this.question.options.splice(index, 1);
      },
    },
  };
</script>

<style></style>
