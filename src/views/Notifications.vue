<template>
  <v-container>
    <v-row class="ml-1">
      <h3>Notificações</h3>
    </v-row>

    <v-row class="my-8">
      <v-col cols="12" sm="7" md="6" lg="8">
        <v-text-field
          name="search"
          label="Pesquisar"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          clearable
          hide-details
        />
      </v-col>

      <v-col cols="12" sm="5" md="6" lg="4">
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
              label="Recebido em"
              :value="dateRangeText"
              prepend-inner-icon="mdi-calendar"
              dense
              readonly
              outlined
              clearable
              hide-details
              @click:clear="selectedDates = []"
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
            :title-date-format="dateTitle"
          />
        </v-menu>
      </v-col>
    </v-row>

    <Notification
      v-for="(notification, index) in notifications"
      :key="index"
      :index="index"
      :title="notification.title"
      :date="notification.date"
      :level="notification.level"
      :viewed="notification.viewed"
    />
  </v-container>
</template>

<script>
  import { formatDate } from '@/utils/formatDate';
  import Notification from '@/components/Notification.vue';

  export default {
    name: 'Notifications',
    components: {
      Notification,
    },
    data: () => {
      return {
        notifications: [
          {
            title: 'notification 1',
            date: new Date(2021, 10, 30, 20, 58, 0, 0).toISOString(),
            level: 0,
            viewed: false,
          },
          {
            title: 'notification 2',
            date: new Date(2021, 10, 29, 18, 30, 0, 0).toISOString(),
            level: 1,
            viewed: false,
          },
          {
            title: 'notification 3',
            date: new Date(2021, 10, 28, 18, 30, 0, 0).toISOString(),
            level: 2,
            viewed: false,
          },
          {
            title: 'notification 4',
            date: new Date(2021, 7, 30, 18, 30, 0, 0).toISOString(),
            level: 1,
            viewed: true,
          },
        ],
        showDatepicker: false,
        selectedDates: [],
      };
    },
    methods: {
      setDates(dates) {
        this.selectedDates = dates.sort();
      },
      dateTitle() {
        return this.selectedDates.length === 2
          ? this.dateRangeText
          : formatDate(this.selectedDates[0]) || '-';
      },
    },
    computed: {
      dateRangeText() {
        const formattedDates = this.selectedDates.map((date) =>
          formatDate(date),
        );
        return formattedDates.join(' à ');
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep .v-date-picker-title__date {
    font-size: 20px;
  }
</style>
