<template>
  <v-expansion-panel
    style="background-color: #ffffff; margin-bottom: 15px"
    elevation="3"
    class="px-4"
  >
    <v-expansion-panel-header>
      <v-toolbar-title style="font-size: 1.17em">{{
        sector.abbreviation + ' - ' + sector.name
      }}</v-toolbar-title>
      <!-- {{ sector.abbreviation + ' - ' + sector.name }} -->
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-data-table
        :headers="headers"
        :items="userRows"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Criar Usuário
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nome"
                      ></v-text-field>
                    </v-row>
                    <v-row>
                      <v-text-field
                        v-model="editedItem.email"
                        label="E-mail"
                      ></v-text-field>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Tem certeza que deseja apagar o usuário
                  {{ editedItem.email }}?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon dense @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  export default {
    name: 'UsersSectorAccordion',

    props: {
      sector: {
        type: Object,
        required: true,
      },
      users: {
        type: Array,
        required: true,
      },
    },

    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Nome',
          value: 'name',
        },
        {
          text: 'E-mail',
          value: 'email',
        },
        { text: 'Excluir', value: 'actions', sortable: false },
      ],
      userRows: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        email: '',
      },
      defaultItem: {
        name: '',
        email: '',
      },
    }),

    computed: {
      formTitle() {
        return 'Novo Usuário - ' + this.sector.abbreviation;
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },
      dialogDelete(val) {
        val || this.closeDelete();
      },
    },

    created() {
      this.initialize();
    },

    methods: {
      initialize() {
        this.userRows = this.users.map((user) => ({
          id: user.id,
          name: 'teste',
          email: user.email,
        }));
      },

      editItem(item) {
        this.editedIndex = this.userRows.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem(item) {
        this.editedIndex = this.userRows.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm() {
        this.userRows.splice(this.editedIndex, 1);
        this.closeDelete();
      },

      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },

      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.userRows[this.editedIndex], this.editedItem);
        } else {
          this.userRows.push(this.editedItem);
        }
        this.close();
      },
    },
  };
</script>

<!-- 
<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'UsersSectorAccordion',

    props: {
      sector: {
        type: Object,
        required: true,
      },
      users: {
        type: Array,
        required: true,
      },
    },

    data: () => {
      return {
        headers: [
          {
            text: 'Nome',
            value: 'name',
          },
          {
            text: 'E-mail',
            value: 'email',
          },
        ],
        usersRows: [],
      };
    },
    async mounted() {
      await this.updateTable();
    },
    methods: {
      ...mapActions(['fetchSectors']),
      back() {
        this.$router.back();
      },

      async updateTable() {
        this.usersRows = this.users.map((user) => ({
          id: user.id,
          name: 'teste',
          email: user.email,
        }));
      },
    },
  };
</script>

<style scoped lang="scss">
  .save-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
  }
</style> -->
