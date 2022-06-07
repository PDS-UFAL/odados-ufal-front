<template>
  <v-layout class="login">
    <v-row class="content">
      <v-layout sm="12" md="6" column align-center justify-center>
        <v-card
          max-width="400px"
          width="80%"
          elevation="5"
          class="d-flex flex-column pa-4"
        >
          <v-card-title class="justify-center">
            Cadastrar nova senha
          </v-card-title>
          <v-card
            v-if="changeIsDone"
            align="justify"
            class="d-flex flex-column pa-2"
            color="#9BBF45"
          >
            Senha redefinida com sucesso! Você será redirecionada(o) para a tela
            de login em instantes.
          </v-card>
          <div v-else>
            <v-text-field
              v-model="password"
              label="Nova senha"
              :type="passwordType"
              :error="error"
              :append-icon="passwordTypeIcon"
              @click:append="togglePassword"
              outlined
            ></v-text-field>

            <v-text-field
              v-model="password_confirmation"
              label="Confirme a senha"
              :type="passwordType"
              :error="error"
              :append-icon="passwordTypeIcon"
              @click:append="togglePassword"
              outlined
            ></v-text-field>

            <v-card-actions class="pa-0 mt-0">
              <v-btn
                light
                block
                large
                color="primary"
                @click="requestPasswordChange"
                :loading="loading"
                :disabled="loading"
              >
                Redefinir senha
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-layout>
    </v-row>
  </v-layout>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'ResetPassword',
    data: () => {
      return {
        error: false,
        changeIsDone: false,
        password: '',
        password_confirmation: '',
        passwordTypeIcon: 'mdi-eye',
        passwordType: 'password',
        email: null,
        loading: false,
        errorMessages: {
          "Couldn't find User": 'Usuário não encontrado',
          'is too short (minimum is 6 characters)':
            'A senha precisa ter pelo menos 6 caracteres.',
          invalid: 'Token inválido',
          "doesn't match Password": 'As senhas infomadas não correspondem.',
        },
      };
    },
    created() {
      if (new URLSearchParams(window.location.search).get('token') == null){
        this.$router.push({name: "NotFound"});
      }
    },
    methods: {
      ...mapActions(['resetPassword', 'setAlert', 'getPasswordToken']),
      async requestPasswordChange() {
        this.loading = true;
        const payload = {
          user: {
            password: this.password,
            password_confirmation: this.password_confirmation,
          },
          token: await this.getPasswordToken(),
        };

        this.resetPassword({ payload })
          .then(() => {
            this.changeIsDone = true;
          })
          .catch((err) => {
            this.error = true;
            Object.values(err.response?.data.message).forEach((msg) => {
              this.setAlert({
                alertMessage: this.errorMessages[msg[0]],
                alertColor: 'red',
              });
            });
          });

        this.loading = false;
      },
      togglePassword() {
        this.passwordType =
          this.passwordType === 'password' ? 'text' : 'password';

        this.passwordTypeIcon =
          this.passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
      },
    },
    watch: {
      changeIsDone() {
        if (this.changeIsDone == true) {
          setTimeout(() => {
            this.$router.push({ name: 'Login' });
          }, 10000);
        }
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
