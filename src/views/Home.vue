<template>
  <v-container>
    <confirmation-dialog
      ref="showDeleteFormDialog"
      width="400"
      title="Apagar o formulário?"
      description="Esta ação não pode ser desfeita."
      confirmButton="Apagar"
    />

    <v-row>
      <filter-cards :options="filters" @clickOption="changeFilter" />
    </v-row>

    <v-row class="my-8">
      <v-col cols="12" xs="12" md="4">
        <v-text-field
          name="search"
          label="Pesquisar"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          clearable
          hide-details
          @change="filterByName"
        />
      </v-col>

      <v-col cols="12" xs="12" md="3">
        <v-menu
          v-model="showDatepicker"
          :close-on-content-click="false"
          :nudge-right="0"
          transition="scale-transition"
          max-width="290px"
          min-width="290px"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              label="Início / Fim"
              :value="dateRangeText"
              prepend-inner-icon="mdi-calendar"
              dense
              readonly
              outlined
              clearable
              hide-details
              @click:clear="setDates([])"
              @click:prepend-inner="showDatepicker = true"
            />
          </template>
          <v-date-picker
            color="primary"
            v-model="selectedDates"
            locale="pt-br"
            range
            scrollable
            @change="setDates"
            @input="setDates"
            :title-date-format="dateTitle"
          />
        </v-menu>
      </v-col>
    </v-row>

    <v-row class="mx-0">
      <v-col class="pa-0">
        <v-data-table
          :headers="headers"
          :items="forms"
          class="elevation-2"
          disable-pagination
          hide-default-footer
          :loading="loading"
          loading-text="Carregando... Por favor aguarde"
        >
          <template slot="no-data">
            <div class="">Nenhum formulário encontrado</div>
          </template>

          <template v-slot:item.start_date="{ item }">
            {{ formatDate(item.start_date) }}
          </template>

          <template v-slot:item.end_date="{ item }">
            {{ formatDate(item.end_date) }}
          </template>

          <template v-slot:item.status="{ item }">
            <v-icon size="17" :color="chipStatusColor(item.status)">
              mdi-checkbox-blank-circle
            </v-icon>
            {{ translatedStatus(item.status) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn small icon @click="viewForm(item.id)">
              <v-icon> mdi-eye </v-icon>
            </v-btn>

            <v-btn
              small
              icon
              v-if="isAdmin"
              @click="openDeleteFormDialog(item)"
            >
              <v-icon> mdi-delete </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { formatDate } from '@/utils/formatDate';
  import FilterCards from '@/components/FilterCards.vue';
  import ConfirmationDialog from '@/components/ConfirmationDialog';

  export default {
    name: 'Home',
    components: {
      FilterCards,
      ConfirmationDialog,
    },
    data: () => {
      return {
        loading: true,
        filters: [
          {
            title: 'Abertos',
            status: 'open',
            amount: 0,
            color: 'yellow',
            active: false,
          },
          {
            title: 'Não iniciados',
            status: 'not_started',
            amount: 0,
            color: 'red',
            active: false,
          },
          {
            title: 'Finalizados',
            status: 'closed',
            amount: 0,
            color: 'green',
            active: false,
          },
        ],

        headers: [
          {
            text: 'Título',
            value: 'title',
            sortable: true,
            align: 'start',
            width: '40%',
          },
          { text: 'Status', value: 'status', sortable: false, width: '20%' },
          { text: 'Data inicial', value: 'start_date', sortable: true },
          { text: 'Data final', value: 'end_date', sortable: true },
          { text: 'Ações', value: 'actions', sortable: false, align: 'end' },
        ],

        forms: [],

        params: {},

        sortBy: 'name',
        showDatepicker: false,
        selectedDates: [],
      };
    },
    mounted() {
      this.filterForms();
    },
    methods: {
      ...mapActions(['fetchForms', 'deleteForm', 'setAlert']),
      formatDate,
      async filterForms() {
        this.loading = true;
        try {
          const { data } = await this.fetchForms({ params: this.params });
          this.forms = data.forms;
          this.filters.forEach((filter) => {
            filter.amount = data.meta[filter.status];
          });
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Um erro aconteceu ao carregar formulários.',
            alertColor: 'red',
          });
        } finally {
          this.loading = false;
        }
      },
      async changeFilter(filterIndex, value) {
        this.filters[filterIndex].active = value;

        const activeFilters = this.filters.filter((filter) => filter.active);
        this.params = {
          ...this.params,
          status: activeFilters.map((filter) => filter.status),
        };
      },
      setDates(dates) {
        this.selectedDates = dates.sort();
        this.filterByDate();
      },
      dateTitle() {
        return this.selectedDates.length === 2
          ? this.dateRangeText
          : formatDate(this.selectedDates[0]) || '-';
      },
      chipStatusColor(status) {
        return (
          {
            open: 'yellow',
            finished: 'green',
            not_started: 'red',
          }[status] || 'primary'
        );
      },
      translatedStatus(status) {
        return {
          open: 'Aberto',
          finished: 'Fechado',
          not_started: 'Não iniciado',
        }[status];
      },
      openDeleteFormDialog(form) {
        this.$refs.showDeleteFormDialog.open(() => {
          this.deleteFormHandler(form);
        });
      },
      async deleteFormHandler(form) {
        try {
          await this.deleteForm({ id: form.id });
          await this.filterForms();
        } catch (err) {
          this.setAlert({
            alertMessage:
              err.response?.data.error ||
              'Um erro aconteceu ao deletar o formulário.',
            alertColor: 'red',
          });
        }
      },
      viewForm(id) {
        const routeName =
          this.getUser?.role === 'admin' ? 'ViewForms' : 'AnswerForm';
        this.$router.push({ name: routeName, params: { id } });
      },
      async filterByName(name) {
        this.params = {
          ...this.params,
          title: name,
        };
      },
      filterByDate() {
        const [range_start_date, range_end_date] = this.selectedDates;
        this.params = {
          ...this.params,
          range_start_date,
          range_end_date,
        };
      },
    },
    computed: {
      ...mapGetters(['getUser']),
      dateRangeText() {
        const formattedDates = this.selectedDates.map((date) =>
          formatDate(date),
        );
        return formattedDates.join(' à ');
      },
      isAdmin() {
        return this.getUser.role === 'admin';
      },
    },
    watch: {
      params: {
        handler() {
          this.filterForms();
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep .v-date-picker-title__date {
    font-size: 20px;
  }
</style>
