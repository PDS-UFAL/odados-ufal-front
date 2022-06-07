<template>
  <div class="d-flex justify-center align-center" style="height: 90vh">
    <div class="d-flex justify-center flex-column" style="width: 18rem">
      <h3 style="text-align: center">Página não encontrada</h3>
      <p style="margin-top: 1rem">
        A página que você tentou acessar não existe, clique abaixo para ir para
        a página principal.
      </p>
      <router-link style="text-align: center" to="/"
        ><v-btn outlined color="blue">Página principal</v-btn></router-link
      >
    </div>
  </div>
</template>
