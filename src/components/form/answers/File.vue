<template>
  <v-row>
    <v-col>
      <span class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </span>

      <div
        class="file-box rounded-sm py-12 px-2 px-sm-12"
        :style="fileUploaderStyle"
        @drop="dropFile"
        @dragenter.prevent
        @dragover.prevent
      >
        <input
          type="file"
          :required="question.required"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          ref="fileInput"
          id="assetsFieldHandle"
          style="display: none"
          @change="handleFileUpload"
        />

        <label for="assetsFieldHandle">
          <v-row class="d-flex justify-center">
            <v-icon :color="color.base">mdi-file</v-icon>

            <span class="ml-sm-2 text-subtitle-1 black--text text-center">
              {{ question.file.name }}

              <template v-if="!question.file.name">
                Solte o arquivo aqui ou clique para fazer upload
              </template>
            </span>
          </v-row>

          <v-row class="d-flex justify-center">
            <span class="text-body-2">
              <template v-if="question.fileError">
                O arquivo selecionado excede o tamanho máximo de 10mb
              </template>
              <template v-else-if="!!question.file.name">
                Solte outro arquivo ou clique para substituir
              </template>
              <template v-else>Tamanho máximo de 10mb</template>
            </span>
          </v-row>
        </label>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import colors from 'vuetify/es5/util/colors';
  import rules from '@/mixins/questionRules';

  export default {
    name: 'File',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    mixins: [rules],
    methods: {
      handleFileUpload() {
        const fileToUpload = this.$refs.fileInput.files[0];
        if (!fileToUpload) return;

        this.question.file.name = fileToUpload.name;
        this.question.file.size = fileToUpload.size;

        const fileSizeToMb = fileToUpload.size / 1024 / 1024;
        if (fileSizeToMb > 10) {
          this.question.fileError = true;
        }
      },
      dropFile(event) {
        event.preventDefault();
        this.$refs.fileInput.files = event.dataTransfer.files;
        this.handleFileUpload();
      },
    },
    computed: {
      color() {
        if (this.question.fileError) {
          return colors['red'];
        } else if (this.question.file.name) {
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
    },
  };
</script>

<style lang="scss" scoped>
  .file-box {
    border: 1px dashed;
    cursor: pointer;

    > label {
      cursor: pointer;
    }
  }
</style>
