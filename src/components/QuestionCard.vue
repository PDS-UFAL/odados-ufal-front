<template>
  <v-card width="100%" elevation="3">
    <v-card-title>
      <v-tooltip right>
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
        v-model="questionData.required"
        color="primary"
        hide-details
        class="pa-0 ma-0"
      />

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon class="ml-sm-8" v-on="on" @click="duplicateQuestion">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>Duplicar</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon class="ml-sm-4" v-on="on" @click="removeQuestion">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Remover</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text>
      <v-divider />

      <v-row class="my-8">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="questionData.title"
            label="Título da pergunta"
            dense
            outlined
            clearable
            hide-details
          />
        </v-col>
        <v-spacer />
        <v-col cols="12" md="5">
          <v-select
            :items="questionTypes"
            v-model="questionData.type"
            label="Tipo do campo de resposta"
            :menu-props="{ 'offset-y': true }"
            dense
            outlined
            hide-details
          />
        </v-col>
      </v-row>

      <template v-if="isShortText || isLargeText">
        <span class="text-subtitle-1 font-weight-bold">Parâmetros:</span>
        <v-row class="pt-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="questionData.maxCharacters"
              label="Quantidade máxima de caracteres"
              dense
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </template>

      <template v-if="isNumber || isMoney">
        <span class="text-subtitle-1 font-weight-bold">Parâmetros:</span>
        <v-row class="pt-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="questionData.minValue"
              label="Valor mínimo (opcional)"
              :prefix="isMoney && 'R$'"
              type="number"
              dense
              outlined
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="questionData.maxValue"
              label="Valor máximo (opcional)"
              :prefix="isMoney && 'R$'"
              type="number"
              dense
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </template>

      <template v-if="isSelect || isCheckbox || isRadio">
        <span class="text-subtitle-1 font-weight-bold">Opções:</span>
        <v-row class="pt-4">
          <v-col cols="12" md="6">
            <v-row class="ma-0 mb-2 d-flex align-center">
              <v-col cols="8" sm="9" class="pa-0">
                <v-text-field
                  v-model="questionData.options[0]"
                  label="Opção"
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
                  v-if="questionData.options.length < 2"
                  icon
                  outlined
                  small
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                  color="red"
                  :disabled="questionData.options.length < 2"
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
              v-for="(option, index) in questionData.options"
              :key="index"
            >
              <template v-if="index > 0">
                <v-col cols="8" sm="9" class="pa-0 my-2">
                  <v-text-field
                    v-model="questionData.options[index]"
                    label="Opção"
                    dense
                    outlined
                    hide-details
                    full-width
                  />
                </v-col>

                <v-col>
                  <v-btn
                    color="primary"
                    class="mr-2"
                    @click="addOption"
                    v-if="index === questionData.options.length - 1"
                    icon
                    outlined
                    small
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    color="red"
                    :disabled="questionData.options.length < 2"
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
      </template>

      <v-divider class="my-8" />

      <span class="text-subtitle-1 font-weight-bold">Como vai ficar:</span>
      <v-row class="pt-4">
        <!-- Texto pequeno -->
        <v-col v-if="isShortText">
          <v-text-field
            v-model="questionData.example"
            :label="questionData.title || 'Título da pergunta'"
            :counter="questionData.maxCharacters"
            :maxlength="questionData.maxCharacters"
            :rules="[rules.required]"
            dense
            outlined
            clearable
          />
        </v-col>

        <!-- Texto grande -->
        <v-col v-if="isLargeText">
          <v-textarea
            v-model="questionData.example"
            :label="questionData.title || 'Título da pergunta'"
            :counter="questionData.maxCharacters"
            :maxlength="questionData.maxCharacters"
            :rules="[rules.required]"
            dense
            outlined
            clearable
            auto-grow
          />
        </v-col>

        <!-- Numérico -->
        <v-col v-if="isNumber">
          <v-text-field
            v-model="questionData.example"
            type="number"
            :label="questionData.title || 'Título da pergunta'"
            :min="questionData.minValue"
            :max="questionData.maxValue"
            :rules="[rules.required, ...rules.number]"
            dense
            outlined
          />
        </v-col>

        <!-- Dinheiro -->
        <v-col v-if="isMoney">
          <v-text-field
            v-model="questionData.example"
            :label="questionData.title || 'Título da pergunta'"
            :rules="[rules.required, ...rules.number]"
            type="number"
            prefix="R$"
            dense
            outlined
          />
        </v-col>

        <!-- Porcentagem -->
        <v-col cols="12" md="6" v-if="isPercent">
          <v-text-field
            v-model="questionData.example"
            type="number"
            :label="questionData.title || 'Título da pergunta'"
            :rules="[rules.required]"
            suffix="%"
            dense
            outlined
          />
        </v-col>

        <!-- Lista de opções -->
        <v-col cols="12" md="6" v-if="isSelect">
          <v-select
            :items="questionData.options"
            v-model="questionData.example"
            :label="questionData.title || 'Título da pergunta'"
            :rules="[rules.required]"
            :menu-props="{ 'offset-y': true }"
            no-data-text="Nenhuma opção disponível"
            dense
            outlined
          />
        </v-col>

        <!-- Caixa de seleção -->
        <v-col v-if="isCheckbox">
          <span class="text-subtitle-1 font-weight-bold">
            {{ questionData.title || 'Título da pergunta' }}
          </span>

          <v-checkbox
            v-for="(option, index) in questionData.options"
            :key="index"
            v-model="questionData.checkboxExample"
            :label="option"
            :value="option"
            :rules="[rules.required]"
            dense
            hide-details
          />
        </v-col>

        <!-- Múltipla escolha -->
        <v-col v-if="isRadio">
          <span class="text-subtitle-1 font-weight-bold">
            {{ questionData.title || 'Título da pergunta' }}
          </span>

          <v-radio-group
            v-model="questionData.example"
            :rules="[rules.required]"
            dense
          >
            <v-radio
              v-for="(option, index) in questionData.options"
              :key="index"
              :label="option"
              :value="option"
            />
          </v-radio-group>
        </v-col>

        <!-- Arquivo -->
        <v-col v-if="isFile">
          <span class="text-subtitle-1 font-weight-bold">
            {{ questionData.title || 'Título da pergunta' }}
          </span>

          <div
            class="file-box rounded-sm pa-12"
            :style="fileUploaderStyle"
            @drop="dropFile"
            @dragenter.prevent
            @dragover.prevent
          >
            <input
              type="file"
              :required="questionData.required"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              ref="fileInput"
              id="assetsFieldHandle"
              style="display: none"
              @change="handleFileUpload"
            />

            <label for="assetsFieldHandle">
              <v-row class="d-flex justify-center">
                <v-icon :color="color.base">mdi-file</v-icon>

                <span class="ml-2 text-subtitle-1 black--text">
                  {{ questionData.file.name }}

                  <template v-if="!questionData.file.name">
                    Solte o arquivo aqui ou clique para fazer upload
                  </template>
                </span>
              </v-row>

              <v-row class="d-flex justify-center">
                <span class="text-body-2">
                  <template v-if="questionData.fileError">
                    O arquivo selecionado excede o tamanho máximo de 10mb
                  </template>
                  <template v-else-if="!!questionData.file.name">
                    Solte outro arquivo ou clique para substituir
                  </template>
                  <template v-else>Tamanho máximo de 10mb</template>
                </span>
              </v-row>
            </label>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import colors from 'vuetify/es5/util/colors';

  export default {
    name: 'QuestionCard',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.questionData = Object.assign(
        {
          title: null,
          required: true,
          type: 'short-text',
          maxCharacters: 250,
          minValue: null,
          maxValue: null,
          options: [''],
          file: { name: '', size: '' },
          fileError: false,

          example: null,
          checkboxExample: [],
        },
        this.deepClone(this.question),
      );
    },
    data: () => {
      return {
        questionTypes: [
          { text: 'Texto pequeno', value: 'short-text' },
          { text: 'Texto grande', value: 'large-text' },
          { text: 'Numérico', value: 'number' },
          { text: 'Dinheiro', value: 'money' },
          { text: 'Porcentagem', value: 'percent' },
          { text: 'Arquivo', value: 'file' },
          { text: 'Lista de opções', value: 'select' },
          { text: 'Caixa de seleção', value: 'checkbox' },
          { text: 'Múltipla escolha', value: 'radio' },
        ],
        questionData: {},
      };
    },
    methods: {
      duplicateQuestion() {
        this.$emit('duplicateQuestion', { ...this.questionData });
      },
      removeQuestion() {
        this.$emit('removeQuestion', this.question.id);
      },
      deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      stringToFloat(value) {
        return parseFloat(value.replace('.', '').replace(',', '.'));
      },
      handleFileUpload() {
        const fileToUpload = this.$refs.fileInput.files[0];
        if (!fileToUpload) return;

        this.questionData.file.name = fileToUpload.name;
        this.questionData.file.size = fileToUpload.size;

        const fileSizeToMb = fileToUpload.size / 1024 / 1024;
        if (fileSizeToMb > 10) {
          this.questionData.fileError = true;
        }
      },
      dropFile(event) {
        event.preventDefault();
        this.$refs.fileInput.files = event.dataTransfer.files;
        this.handleFileUpload();
      },
      addOption() {
        this.questionData.checkboxExample = [];
        this.questionData.options.push('');
      },
      removeOption(index) {
        this.questionData.options.splice(index, 1);
      },
    },
    computed: {
      isShortText() {
        return this.questionData.type === 'short-text';
      },
      isLargeText() {
        return this.questionData.type === 'large-text';
      },
      isNumber() {
        return this.questionData.type === 'number';
      },
      isMoney() {
        return this.questionData.type === 'money';
      },
      isPercent() {
        return this.questionData.type === 'percent';
      },
      isFile() {
        return this.questionData.type === 'file';
      },
      isSelect() {
        return this.questionData.type === 'select';
      },
      isCheckbox() {
        return this.questionData.type === 'checkbox';
      },
      isRadio() {
        return this.questionData.type === 'radio';
      },
      color() {
        if (this.questionData.fileError) {
          return colors['red'];
        } else if (this.questionData.file.name) {
          return colors['blue'];
        }

        return colors['grey'];
      },
      fileUploaderStyle() {
        return {
          'border-color': this.color.base,
          'background-color': this.color.lighten5,
        };
      },
      rules() {
        return {
          required: (v) =>
            !this.questionData.required || !!v || 'Esse campo é obrigatório',

          number: [
            (v) =>
              !this.questionData.minValue ||
              (v && v >= parseFloat(this.questionData.minValue)) ||
              'Valor inserido é menor que o mínimo permitido',
            (v) =>
              !this.maxValue ||
              (v && v <= parseFloat(this.questionData.maxValue)) ||
              'Valor inserido é maior que o máximo permitido',
          ],
        };
      },
    },
    watch: {
      type() {
        this.questionData.example = null;
        this.questionData.checkboxExample = [];
        this.questionData.minValue = null;
        this.questionData.maxValue = null;
        this.questionData.options = [''];
        this.questionData.file = { name: '', size: '' };
        this.questionData.fileError = false;
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

  .file-box {
    border: 1px dashed;
    cursor: pointer;

    > label {
      cursor: pointer;
    }
  }
</style>
