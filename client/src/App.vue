<template>
  <v-app>
    <v-content style="margin: 0; padding: 0;">
    <app-menu/>
    <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Menu from './components/Menu/Menu'
export default {
  name: 'App',

  components: {
  'app-menu': Menu,
  },
  created(){
    this.$store.dispatch('tryAutoLoginAction');
  },
  data: () => ({
    //
  }),
};
</script>
