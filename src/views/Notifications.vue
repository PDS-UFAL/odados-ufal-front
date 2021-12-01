<template>
  <v-container>
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
      };
    },
  };
</script>

<style lang="scss" scoped></style>
