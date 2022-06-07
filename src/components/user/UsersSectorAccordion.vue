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
  import { mapActions } from 'vuex';
  import errorMessages from '../../mixins/errorMessages';
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

    mixins: [errorMessages],

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
      ...mapActions(['createUser', 'setAlert']),
      back() {
        this.$router.back();
      },

      // async requestPasswordChange() {
      //   this.loading = true;
      //   const payload = {
      //     email: this.email,
      //   };

      //   try {
      //     this.forgotPassword({ payload }).then(() => {
      //       this.sucess = true;
      //     });
      //   } catch (err) {
      //     this.error = true;
      //     this.setAlert({
      //       alertMessage:
      //         err.response?.data.error ||
      //         'Ocorreu um erro ao realizar a solicitação. Por favor, verifique o endereço de email.',
      //       alertColor: 'red',
      //     });
      //   }
      //   this.loading = false;
      // },

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

      async save() {
        this.loading = true;
        const payload = {
          user: {
            email: this.editedItem.email,
            password: 'odadosufal',
            password_confirmation: 'odadosufal',
            sector_id: this.sector.id,
            role: 2,
          },
        };

        this.createUser({ payload })
          .then(() => {
            this.sucess = true;
            if (this.editedIndex > -1) {
              Object.assign(this.userRows[this.editedIndex], this.editedItem);
            } else {
              this.userRows.push(this.editedItem);
            }
            this.close();
            this.setAlert({
              alertMessage: 'Usuário cadastrado com sucesso!',
              alertColor: 'green',
            });
          })
          .catch((err) => {
            console.log('error catch');
            console.log(err);
            console.log(err.response);
            this.error = true;

            for (const [key, value] of Object.entries(err.response?.data)) {
              console.log(key, value);
              if (this.errorMessages[value] !== undefined) {
                this.setAlert({
                  alertMessage: this.errorMessages[value],
                  alertColor: 'red',
                });
              } else {
                this.setAlert({
                  alertMessage: 'Ocorreu um erro no sistema.',
                  alertColor: 'red',
                });
              }
            }
          });
        this.loading = false;
      },
    },
  };
</script>