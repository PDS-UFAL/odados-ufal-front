<template>
  <v-container>
    <v-row class="pa-0 align-center mt-md-4 mb-8">
      <h3>Ajuda</h3>
    </v-row>
    <v-row>
      <span style="font-size: 18px">
        Caso tenha alguma dúvida na utilização do sistema, por favor consulte os
        manuais:
      </span>
    </v-row>
    <br />
    <v-row>
      <v-ul style="font-size: 18px">
        <li>
          Manual em Vídeo: <a :href="videoLink" target="_blank">clique aqui</a>
        </li>
        <li>
          Manual Escrito: <a :href="textLink" target="_blank">clique aqui</a>
        </li>
      </v-ul>
    </v-row>
  </v-container>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    data: () => {
      return {
        videoLink: '',
        textLink: '',
      };
    },
    mounted() {
      this.getLinks();
    },
    computed: {
      ...mapGetters(['getUser']),
    },
    methods: {
      getLinks() {
        if (this.getUser?.role === 'admin') {
          this.videoLink =
            'https://www.youtube.com/playlist?list=PLE8vssyxdTnMm4fSnhG_cWgURPyTHNRgA';
          this.textLink =
            'https://docs.google.com/document/d/12kYdcVlR_4Tf7e-BVOXt-F5HVzTNSxlK2JH1HrXeAh8/edit?usp=sharing';
        } else {
          this.videoLink =
            'https://www.youtube.com/playlist?list=PLE8vssyxdTnPQKhyD1KPLAwSKgqL9GI8s';
          this.textLink =
            'https://docs.google.com/document/d/14Wc4bLvl89NanVgVIBl4MJ0x7zRtt7hvz4qHXHX2iCI/edit?usp=sharing';
        }
      },
    },
  };
</script>
