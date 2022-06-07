<template>
  <v-layout class="login">
    <v-row class="content">
      <v-layout sm="12" md="6" column align-center justify-center>
        <v-card
          max-width="400px"
          width="80%"
          elevation="5"
          class="d-flex flex-column pa-6"
        >
          <v-card-title class="justify-center"
            >Recupere sua conta
          </v-card-title>

          <v-card
            v-if="sucess"
            align="justify"
            class="d-flex flex-column pa-2"
            color="#9BBF45"
          >
            Um link de recuperação de senha para o endereço {{ email }}. Por
            favor, verifique sua caixa de entrada.
          </v-card>

          <div v-else>
            <v-text-field
              v-model="email"
              label=" Insira o email da conta"
              :error="error"
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
                Solicitar redefinição
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
  import errorMessages from '../mixins/errorMessages';

  export default {
    name: 'ResetPassword',
    mixins: [errorMessages],
    data: () => {
      return {
        error: false,
        email: null,
        loading: false,
        sucess: false,
      };
    },
    methods: {
      ...mapActions(['forgotPassword', 'setAlert', 'setAuthToken']),
      async requestPasswordChange() {
        this.loading = true;
        const payload = {
          email: this.email,
        };

        this.forgotPassword({ payload })
          .then(() => {
            this.sucess = true;
          })
          .catch((err) => {
            console.log('error catched:');
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
