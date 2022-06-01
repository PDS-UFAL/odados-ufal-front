<template>
  <v-container>
    <v-row class="ml-1">
      <h3>Enviar Fomulário</h3>
    </v-row>
    <v-row style="padding-top: 20px">
      <v-select
        :items="this.forms"
        v-on:change="this.changeSelectedForm"
        :rules="[rules.required]"
        :menu-props="{ 'offset-y': true }"
        label="Selecionar Fomulário"
        dense
        outlined
        item-text="title"
        return-object
        no-data-text="Nenhuma opção disponível"
        :readonly="loading"
        cols="12"
        md="5"
        class="pa-0"
      />
    </v-row>
    <v-row>
      <div></div>
      <v-menu
        v-model="showStartDatepicker"
        :close-on-content-click="false"
        :nudge-right="0"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
        cols="12"
        md="3"
        class="pa-0"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-on="on"
            v-bind="attrs"
            label="Abre em"
            :value="formatedDate(startDate)"
            prepend-inner-icon="mdi-calendar"
            dense
            readonly
            outlined
            clearable
            @click:clear="startDate = ''"
            @click:prepend-inner="showStartDatepicker = true"
            :disabled="viewMode"
          />
        </template>
        <v-date-picker
          color="primary"
          v-model="startDate"
          locale="pt-br"
          :min="today"
          scrollable
          @input="showStartDatepicker = false"
        />
      </v-menu>
      <div style="width: 50px"></div>
      <v-menu
        v-model="showEndDatepicker"
        :close-on-content-click="false"
        :nudge-right="0"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
        cols="12"
        md="3"
        class="pa-0"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-on="on"
            v-bind="attrs"
            label="Fecha em"
            :value="formatedDate(endDate)"
            prepend-inner-icon="mdi-calendar"
            dense
            readonly
            outlined
            clearable
            @click:clear="dates = []"
            @click:prepend-inner="showEndDatepicker = true"
            :disabled="viewMode"
          />
        </template>
        <v-date-picker
          color="primary"
          v-model="endDate"
          locale="pt-br"
          :min="startDate || today"
          scrollable
          @input="showEndDatepicker = false"
        />
      </v-menu>
    </v-row>
    <v-row>
      <v-text-field
        v-model="subtitle"
        name="title"
        label="Subtítulo do Formulário"
        dense
        outlined
        clearable
        :disabled="loading"
      />
    </v-row>

    <v-row style="margin-top: 10px">
      <v-btn color="primary" @click="this.sendForm">Enviar</v-btn>
    </v-row>
  </v-container>
</template>

<script>
  import { formatDate } from '@/utils/formatDate';
  import rules from '@/mixins/questionRules';
  import { mapActions } from 'vuex';

  export default {
    data: () => {
      return {
        loading: false,
        sectors: [],
        selectedSectors: [],
        startDate: '',
        endDate: '',
        title: null,
        showStartDatepicker: false,
        showEndDatepicker: false,
        form: null,
        questions: [],
        subtitle: '',
        forms: [],
        selectedForm: {},
      };
    },
    async mounted() {
      await this.loadSectors();
      await this.loadForms();
    },

    computed: {
      today() {
        let date = new Date();
        return date.toISOString();
      },
      viewMode() {
        return !!this.$route.params.id;
      },
    },
    methods: {
      ...mapActions([
        'fetchSectors',
        'fetchForms',
        'createFormSend',
        'setAlert',
      ]),
      formatedDate(date) {
        return formatDate(date);
      },
      changeSelectedForm(item) {
        this.selectedForm = item;
      },
      sendForm() {
        try {
          let payload = {
            form_send: {
              subtitle: this.subtitle,
              start_date: this.startDate,
              end_date: this.endDate,
              form_id: this.selectedForm.id,
              year: new Date(this.startDate).getFullYear(),
            },
          };
          this.createFormSend({ payload }).then(() => {
            this.setAlert({
              alertMessage: 'Formulario enviado com sucesso!',
              alertColor: 'green',
            });
          });
        } catch (e) {
          this.setAlert({
            alertMessage:
              e.response?.data.error ||
              'Ocorreu um erro ao carregar formulários.',
            alertColor: 'red',
          });
        }
      },
      loadForms() {
        this.fetchForms({ params: this.params }).then((value) => {
          this.forms = value.data.forms;
        });
        this.forms = ['Carregando...'];
      },
      checkAll() {
        this.selectedSectors = [...this.sectors.map((sector) => sector.id)];
      },
      uncheckAll() {
        this.selectedSectors = [];
      },
      async loadSectors() {
        try {
          const { data } = await this.fetchSectors();
          this.sectors = data.sectors.filter((sector) => {
            return sector.id >= 18;
          });

          // [...data.sectors];
        } catch (err) {
          this.errorFunction(err);
        }
      },
    },
    mixins: [rules],
  };
</script>

<style></style>
