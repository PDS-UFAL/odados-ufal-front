<template>
  <v-layout class="login">
    <v-row class="content">
      <v-col sm="12" md="6" v-show="$vuetify.breakpoint.mdAndUp">
        <v-img :src="backgroundImage" height="100%" class="image" />
      </v-col>
      <v-col sm="12" md="6" class="d-flex justify-center align-center">
        <v-card
          max-width="370px"
          width="100%"
          elevation="4"
          class="d-flex flex-column pa-6"
        >
          <v-card-title class="pa-0 mb-4">Login</v-card-title>
          <v-text-field
            v-model="title"
            :rules="rules"
            label="E-mail"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="title"
            :rules="rules"
            label="Senha"
            outlined
          ></v-text-field>
          <v-btn text right class="justify-end">Esqueceu a senha?</v-btn>
          <v-card-actions>
            <v-btn light block color="primary"> Entrar </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
  export default {
    name: 'Login',
    data: () => {
      return {
        backgroundImage: require('@/assets/login/background.png'),
      };
    },
  };
</script>

<style lang="scss">
  .image {
    position: relative;
    max-height: 100vh;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        69.74deg,
        rgba(3, 97, 138, 0.75) 5.24%,
        rgba(0, 152, 218, 0.75) 94.73%
      );
    }
  }
</style>
