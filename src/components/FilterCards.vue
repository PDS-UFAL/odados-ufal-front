<template>
  <v-layout wrap>
    <v-col
      cols="12"
      xs="12"
      md="4"
      v-for="(option, index) in options"
      :key="index"
    >
      <v-flex @click="clickOption(option, index)">
        <v-card flat class="filter-card" :style="cardStyle(option)">
          <v-card-text class="black--text">
            <v-row>
              <v-col cols="10">
                <v-row>
                  <v-col cols="8" md="12" xs="10" class="text-subtitle-1">
                    {{ option.title }}
                  </v-col>
                  <v-col
                    cols="4"
                    md="12"
                    xs="2"
                    class="text-h5 text-md-h3 text-md-left text-right"
                  >
                    {{ option.amount }}
                  </v-col>
                </v-row>
              </v-col>

              <v-col
                cols="2"
                class="px-2 d-flex justify-end align-center align-md-start"
              >
                <v-checkbox
                  :input-value="option.active"
                  :color="checkboxColor(option)"
                  class="ma-0 pa-0"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-col>
  </v-layout>
</template>

<script>
  import colors from 'vuetify/es5/util/colors';

  export default {
    name: 'FilterCards',
    props: {
      options: {
        type: Array,
        default: () => [],
        required: true,
      },
    },
    methods: {
      clickOption(option, index) {
        this.$emit('clickOption', index, !option.active);
      },
      cardStyle(option) {
        return {
          'border-color': colors[option.color].base,
          'background-color': option.active
            ? colors[option.color].lighten5
            : 'white',
        };
      },
      checkboxColor(option) {
        return colors[option.color].darken1;
      },
    },
  };
</script>

<style>
  .filter-card {
    cursor: pointer;
    border: 1px solid;
    user-select: none;
  }
</style>
