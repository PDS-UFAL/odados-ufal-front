<template>
  <div>
    <v-flex>
      <v-row class="pt-4">
        <v-col cols="12" md="6">
          <v-row class="ma-0 mb-2 d-flex align-center">
            <v-col cols="8" sm="9" class="pa-0">
              <v-text-field
                v-model="columnToAdd"
                label="Adicionar coluna"
                dense
                outlined
                hide-details
              />
            </v-col>

            <v-col>
              <v-btn
                color="primary"
                class="mr-2"
                @click="addColumn"
                icon
                outlined
                small
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                color="red"
                :disabled="columns.length < 1"
                @click="removeColumn(0)"
                icon
                outlined
                small
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-row class="ma-0 mb-2 d-flex align-center">
            <v-btn color="blue" @click="addRow()" outlined>
              Adicionar Linha
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-flex>

    <div>
      <v-row>
        <v-col>
          <span class="text-subtitle-1 font-weight-bold">
            {{ question.title }}
            <span style="color: red">{{ question.required ? '*' : '' }}</span>
          </span>
          <div id="table">
            <v-grid
              theme="compact"
              :resize="true"
              :autoSizeColumn="true"
              stretch
              :source="lines"
              :columns="columns"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  import VGrid from '@revolist/vue-datagrid';
  import rules from '@/mixins/questionRules';

  export default {
    name: 'Table',

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
    data() {
      return {
        columns: [],
        lines: [],
        rowToAdd: null,
        columnToAdd: null,
      };
    },
    components: {
      VGrid,
    },
    methods: {
      addRow() {
        let grid = document.querySelector('revo-grid');
        let rowUpdate = [...grid.source];
        let newLine = {};

        for (let i = 0; i < this.columns.length; i++) {
          newLine[this.columns.map((x) => x.props)[i]] = '';
        }

        rowUpdate.push(newLine);
        grid.source = rowUpdate;
        grid.refresh('all');
        this.lines = rowUpdate;
      },
      addColumn() {
        let grid = document.querySelector('revo-grid');
        let columnUpdate = [...grid.columns];
        columnUpdate.push({
          prop: this.columnToAdd,
          name: this.columnToAdd,
        });

        grid.columns = columnUpdate;

        grid.refresh('all');
        this.columns = columnUpdate;
      },
    },
  };
</script>

<style>
  #table {
    height: 400px;
    width: auto;
  }
  .header-wrapper,
  .rowHeaders {
    background-color: #f2f2f2 !important;
  }
  revo-grid {
    height: 50%;
  }
</style>
