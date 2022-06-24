<template>
  <v-layout>
    <confirmation-dialog
      ref="showRemoveQuestionDialog"
      width="300"
      title="Apagar a pergunta?"
      description="Esta ação não pode ser desfeita."
      confirmButton="Apagar"
    />

    <v-card width="100%" elevation="3">
      <v-card-title>
        <v-tooltip v-if="!disabled" right>
          <template v-slot:activator="{ on }">
            <v-btn icon class="grab" v-on="on">
              <v-icon>mdi-drag</v-icon>
            </v-btn>
          </template>
          <span>Mover</span>
        </v-tooltip>

        <v-spacer />

        <v-switch
          label="Obrigatório"
          v-model="question.required"
          color="primary"
          hide-details
          class="pa-0 ma-0"
          :disabled="disabled"
        />

        <template v-if="!disabled">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="ml-sm-8"
                v-on="on"
                @click="duplicateQuestion({ question, section })"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Duplicar</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="ml-sm-4"
                v-on="on"
                @click="openRemoveQuestionDialog"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remover</span>
          </v-tooltip>
        </template>
      </v-card-title>
      <v-card-text>
        <v-divider />

        <v-row class="my-8">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="question.title"
              label="Título da pergunta"
              dense
              outlined
              clearable
              hide-details
              :disabled="disabled"
            />
          </v-col>
          <v-spacer />
          <v-col cols="12" md="5">
            <v-select
              :items="questionTypes"
              v-model="question.type"
              label="Tipo do campo de resposta"
              :menu-props="{ 'offset-y': true }"
              dense
              outlined
              hide-details
              :disabled="disabled"
              v-on:change="this.cleanParameters"
            />
          </v-col>
        </v-row>

        <parameters
          :question="question"
          :show="showParameters"
          :maxChar="hasMaxChar"
          :range="hasRange"
          :disabled="disabled"
        />
        <options-list
          :key="question.id"
          :question="question"
          v-if="hasOptions"
          :disabled="disabled"
        />

        <template v-if="!disabled">
          <v-divider class="my-8" />

          <span class="text-subtitle-1 font-weight-bold">Como ficará:</span>
          <component :is="questionType" :question="question" class="mt-2" />
        </template>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
  import { mapActions } from 'vuex';

  import Parameters from './Parameters';
  import OptionsList from './OptionsList';

  import ConfirmationDialog from '@/components/ConfirmationDialog';

  import ShortText from '@/components/form/answers/ShortText';
  import LargeText from '@/components/form/answers/LargeText';
  import Number from '@/components/form/answers/Number';
  import Money from '@/components/form/answers/Money';
  import Percent from '@/components/form/answers/Percent';
  // import File from '@/components/form/answers/File';
  import Select from '@/components/form/answers/Select';
  import Checkbox from '@/components/form/answers/Checkbox';
  import Radio from '@/components/form/answers/Radio';
  // import Table from '@/components/form/answers/Table';

  export default {
    name: 'QuestionCard',
    props: {
      question: {
        type: Object,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      section: {
        required: true,
      },
    },
    components: {
      Parameters,
      OptionsList,
      ConfirmationDialog,
    },
    data: () => {
      return {
        questionTypes: [
          { text: 'Texto pequeno', value: 'short-text' },
          { text: 'Texto grande', value: 'large-text' },
          { text: 'Numérico', value: 'number' },
          { text: 'Dinheiro', value: 'money' },
          { text: 'Porcentagem', value: 'percent' },
          // { text: 'Arquivo', value: 'file' },
          {
            text: 'Lista de opções (apenas 1 opção)',
            value: 'select',
          },
          {
            text: 'Múltipla escolha (apenas 1 opção)',
            value: 'radio',
          },
          {
            text: 'Caixa de seleção (1 ou mais opções)',
            value: 'checkbox',
          },

          // { text: 'Tabela', value: 'table' },
        ],
      };
    },
    methods: {
      ...mapActions(['removeQuestion', 'duplicateQuestion', 'setAlert']),
      openRemoveQuestionDialog() {
        this.$refs.showRemoveQuestionDialog.open(() => {
          if (this.section.questions_attributes.length === 1) {
            this.setAlert({
              alertMessage: 'Não é possível apagar a única pergunta da seção',
              alertColor: 'red',
            });
            return;
          }
          this.removeQuestion({
            question: this.question,
            section: this.section,
          });
        });
      },
      cleanParameters() {
        this.question.max_value = null;
        this.question.min_value = null;
      },
    },
    computed: {
      questionType() {
        return {
          'short-text': ShortText,
          'large-text': LargeText,
          number: Number,
          money: Money,
          percent: Percent,
          // file: File,
          select: Select,
          checkbox: Checkbox,
          radio: Radio,
          // table: Table,
        }[this.question.type];
      },
      isShortText() {
        return this.question.type === 'short-text';
      },
      isLargeText() {
        return this.question.type === 'large-text';
      },
      isNumber() {
        return this.question.type === 'number';
      },
      isMoney() {
        return this.question.type === 'money';
      },
      isPercent() {
        return this.question.type === 'percent';
      },
      // isFile() {
      //   return this.question.type === 'file';
      // },
      isSelect() {
        return this.question.type === 'select';
      },
      isCheckbox() {
        return this.question.type === 'checkbox';
      },
      isRadio() {
        return this.question.type === 'radio';
      },

      // isTable() {
      //   return this.question.type === 'table';
      // },

      hasMaxChar() {
        return this.isShortText || this.isLargeText;
      },
      hasRange() {
        return this.isNumber || this.isMoney;
      },
      hasOptions() {
        return this.isSelect || this.isCheckbox || this.isRadio || this.isT;
      },
      showParameters() {
        return this.hasMaxChar || this.hasRange;
      },
    },
    watch: {
      'question.type'() {
        this.question.response = null;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .grab {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
</style>
