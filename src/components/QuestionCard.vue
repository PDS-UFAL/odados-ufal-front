<template>
  <v-card width="100%">
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
        v-model="required"
        color="primary"
        hide-details
        class="pa-0 ma-0"
      />

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon class="ml-sm-8" v-on="on">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>Duplicar</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon class="ml-sm-4" v-on="on">
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
            v-model="title"
            label="Título"
            dense
            outlined
            clearable
            hide-details
          />
        </v-col>
        <v-spacer />
        <v-col cols="12" md="5">
          <v-select
            :items="question_types"
            v-model="type"
            label="Tipo do campo"
            :menu-props="{ 'offset-y': true }"
            dense
            outlined
            hide-details
          />
        </v-col>
      </v-row>

      <template v-if="type === 'short-text' || type === 'large-text'">
        <span class="text-subtitle-1 font-weight-bold">Parâmetros:</span>
        <v-row class="pt-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="characters"
              label="Quantidade de caracteres"
              dense
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </template>

      <template v-if="type === 'number' || type === 'money'">
        <span class="text-subtitle-1 font-weight-bold">Parâmetros:</span>
        <v-row class="pt-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="minValue"
              label="Valor mínimo (opcional)"
              type="number"
              dense
              outlined
              hide-details
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="maxValue"
              label="Valor máximo (opcional)"
              type="number"
              dense
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </template>

      <template v-if="['select', 'checkbox', 'radio'].includes(type)">
        <span class="text-subtitle-1 font-weight-bold">Opções:</span>
        <v-row class="pt-4">
          <v-col cols="12" md="6">
            <v-row class="ma-0 mb-2 d-flex align-center">
              <v-col cols="8" sm="9" class="pa-0">
                <v-text-field
                  v-model="options[0]"
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
                  v-if="options.length < 2"
                  icon
                  outlined
                  small
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                  color="red"
                  :disabled="options.length < 2"
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
              v-for="(option, index) in options"
              :key="index"
            >
              <template v-if="index > 0">
                <v-col cols="8" sm="9" class="pa-0 my-2">
                  <v-text-field
                    v-model="options[index]"
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
                    v-if="index === options.length - 1"
                    icon
                    outlined
                    small
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    color="red"
                    :disabled="options.length < 2"
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
        <v-col v-if="type === 'short-text'">
          <v-text-field
            v-model="example"
            :label="title || 'Título'"
            :counter="characters"
            :maxlength="characters"
            :rules="[rules.required]"
            dense
            outlined
            clearable
          />
        </v-col>

        <!-- Texto grande -->
        <v-col v-if="type === 'large-text'">
          <v-textarea
            v-model="example"
            :label="title || 'Título'"
            :counter="characters"
            :maxlength="characters"
            :rules="[rules.required]"
            dense
            outlined
            clearable
            auto-grow
          />
        </v-col>

        <!-- Numérico -->
        <v-col v-if="type === 'number'">
          <v-text-field
            v-model="example"
            type="number"
            :label="title || 'Título'"
            :min="minValue"
            :max="maxValue"
            :rules="[rules.required, ...rules.number]"
            dense
            outlined
          />
        </v-col>

        <!-- Dinheiro -->
        <v-col v-if="type === 'money'">
          <v-text-field
            v-model.lazy="example"
            v-money="money"
            :label="title || 'Título'"
            :rules="[rules.required, ...rules.money]"
            prefix="R$"
            dense
            outlined
          />
        </v-col>

        <!-- Porcentagem -->
        <v-col cols="12" md="6" v-if="type === 'percent'">
          <v-text-field
            v-model="example"
            type="number"
            :label="title || 'Título'"
            :rules="[rules.required]"
            suffix="%"
            dense
            outlined
          />
        </v-col>

        <!-- Lista de opções -->
        <v-col cols="12" md="6" v-if="type === 'select'">
          <v-select
            :items="options"
            v-model="example"
            :label="title || 'Título'"
            :rules="[rules.required]"
            :menu-props="{ 'offset-y': true }"
            no-data-text="Nenhuma opção disponível"
            dense
            outlined
          />
        </v-col>

        <!-- Caixa de seleção -->
        <v-col v-if="type === 'checkbox'">
          <span class="text-subtitle-1 font-weight-bold">
            {{ title || 'Título' }}
          </span>

          <v-checkbox
            v-for="(option, index) in options"
            :key="index"
            v-model="example"
            :label="option"
            :value="option"
            :rules="[rules.required]"
            dense
          />
        </v-col>

        <!-- Múltipla escolha -->
        <v-col v-if="type === 'radio'">
          <span class="text-subtitle-1 font-weight-bold">
            {{ title || 'Título' }}
          </span>

          <v-radio-group v-model="example" :rules="[rules.required]" dense>
            <v-radio
              v-for="(option, index) in options"
              :key="index"
              :label="option"
              :value="option"
            />
          </v-radio-group>
        </v-col>

        <!-- Arquivo -->
        <v-col v-if="type === 'file'">
          <span class="text-subtitle-1 font-weight-bold">
            {{ title || 'Título' }}
          </span>

          <div
            class="file-box rounded-sm pa-12"
            :style="fileUploaderStyle"
            @drop="drop"
            @dragenter.prevent
            @dragover.prevent
          >
            <input
              type="file"
              :required="required"
              accept=".pdf,.jpg,.jpeg,.png"
              ref="fileInput"
              id="assetsFieldHandle"
              style="display: none"
              @change="handleFileUpload"
            />

            <label for="assetsFieldHandle">
              <v-row class="d-flex justify-center">
                <v-icon :color="color.base">mdi-file</v-icon>

                <span class="ml-2 text-subtitle-1 black--text">
                  <template v-if="!!file.name">{{ file.name }}</template>
                  <template v-else>
                    Solte o arquivo aqui ou clique para fazer upload
                  </template>
                </span>
              </v-row>

              <v-row class="d-flex justify-center">
                <span class="text-body-2">
                  <template v-if="!!file.name">
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
  import { VMoney } from 'v-money';
  import colors from 'vuetify/es5/util/colors';

  export default {
    name: 'QuestionCard',
    props: {
      question: {
        type: Object,
        default: () => {},
      },
    },
    directives: {
      money: VMoney,
    },
    data: () => {
      return {
        required: true,
        question_types: [
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

        title: null,
        type: 'short-text',
        characters: 250,
        minValue: null,
        maxValue: null,
        money: {
          decimal: ',',
          thousands: '.',
          prefix: '',
          suffix: '',
          precision: 2,
        },

        options: [''],

        example: null,
        file: { name: '', size: '' },
        fileError: false,
      };
    },
    methods: {
      stringToFloat(value) {
        return parseFloat(value.replace('.', '').replace(',', '.'));
      },
      handleFileUpload() {
        const fileToUpload = this.$refs.fileInput.files[0];
        if (!fileToUpload) return;

        this.file.name = fileToUpload.name;
        this.file.size = fileToUpload.size;
      },
      drop(event) {
        event.preventDefault();
        this.$refs.fileInput.files = event.dataTransfer.files;
        this.handleFileUpload();
      },
      addOption() {
        this.options.push('');
      },
      removeOption(index) {
        this.options.splice(index, 1);
      },
    },
    computed: {
      color() {
        if (this.fileError) {
          return colors['red'];
        } else if (this.file.name) {
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
          required: (v) => !this.required || !!v || 'Esse campo é obrigatório',

          number: [
            (v) =>
              !this.minValue ||
              (v && v >= parseFloat(this.minValue)) ||
              'Valor inserido é menor que o mínimo permitido',
            (v) =>
              !this.maxValue ||
              (v && v <= parseFloat(this.maxValue)) ||
              'Valor inserido é maior que o máximo permitido',
          ],

          money: [
            (v) =>
              !this.minValue ||
              (v && this.stringToFloat(v) >= parseFloat(this.minValue)) ||
              'Valor inserido é menor que o mínimo permitido',
            (v) =>
              !this.maxValue ||
              (v && this.stringToFloat(v) <= parseFloat(this.maxValue)) ||
              'Valor inserido é maior que o máximo permitido',
          ],
        };
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
