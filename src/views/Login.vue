<template>
  <v-layout class="login">
    <v-row class="content">
      <v-col sm="12" md="6" v-show="$vuetify.breakpoint.mdAndUp">
        <v-img :src="backgroundImage" height="100%" class="image" />
      </v-col>

      <v-col sm="12" md="6" class="d-flex justify-center align-center">
        <v-card
          max-width="400px"
          width="80%"
          elevation="5"
          class="d-flex flex-column pa-6"
        >
          <v-card-title class="pa-0 mb-8">Login</v-card-title>

          <v-text-field
            v-model="email"
            label="E-mail"
            :error="error"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Senha"
            :type="passwordType"
            :error="error"
            :append-icon="passwordTypeIcon"
            @click:append="togglePassword"
            @keyup.enter="login"
            outlined
          ></v-text-field>

          <a class="mt-n6 v-btn__content justify-end">Esqueceu a senha?</a>

          <v-card-actions class="pa-0 mt-8">
            <v-btn light block large color="primary" @click="login">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'Login',
    data: () => {
      return {
        error: false,
        passwordType: 'password',
        passwordTypeIcon: 'mdi-eye',
        email: null,
        password: null,
        backgroundImage: require('@/assets/login/background.png'),
      };
    },
    methods: {
      ...mapActions(['executeLogin', 'setAlert', 'setAuthToken', 'setUser']),
      async login() {
        const payload = {
          user: {
            email: this.email,
            password: this.password,
          },
        };

        try {
          const res = await this.executeLogin({ payload });

          await this.setAuthToken({ token: res.data.token });

          await this.setUser({ user: res.data.user });

          this.$router.push('/');
        } catch (err) {
          this.error = true;
          this.setAlert({
            alertMessage: err.response?.data.error || 'Um erro aconteceu',
            alertColor: 'red',
          });
        }
      },
      togglePassword() {
        this.passwordType =
          this.passwordType === 'password' ? 'text' : 'password';

        this.passwordTypeIcon =
          this.passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
      },
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
