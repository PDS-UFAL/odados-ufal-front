<template>
  <v-alert
    :style="customStyle"
    border="left"
    :color="levelColor"
    outlined
    dense
    colored-border
  >
    <v-row class="muddy-grey--text">
      <v-col cols="12" sm="9" md="8" lg="9" class="d-flex align-center">
        <span>{{ title }}</span>
      </v-col>
      <v-col cols="12" sm="3" md="4" lg="3" class="text-right">
        <span>{{ relativeTime }}</span>

        <v-btn icon @click="emitDelete">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
  import getRelativeTime from '@/utils/time.js';
  import colors from 'vuetify/es5/util/colors.js';

  export default {
    name: 'Notification',
    props: {
      index: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      level: {
        type: Number,
        required: true,
      },
      viewed: {
        type: Boolean,
        required: true,
      },
    },
    computed: {
      relativeTime() {
        return getRelativeTime(new Date(this.date).getTime(), 'pt-BR');
      },
      levelColor() {
        if (this.viewed) {
          return 'grey';
        }

        return {
          0: 'red',
          1: 'yellow',
          2: 'green',
        }[this.level];
      },
      customStyle() {
        return {
          'border-color': `${colors[this.levelColor].base} !important`,
        };
      },
    },
    methods: {
      emitDelete() {
        this.$emit('delete', this.index);
      },
    },
  };
</script>

<style lang="scss" scoped></style>
