<template>
      <v-container fluid fill-height style="background-color: #ccc;">
        <v-layout align-center justify-center>
          <v-flex xs12 sm12 md12>
            <v-card class="elevation-12" style="max-width: 35%; margin: 0 auto;">
              <v-toolbar dark color="primary">
                <v-toolbar-title>See what’s happening in the world right now</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="sendCredentials">
                  <v-text-field prepend-icon="person" name="username" label="Username" type="text" v-model="username"></v-text-field>
    
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password" v-model="password" ></v-text-field>
                  <v-btn color="primary" @click="sendCredentials">Login</v-btn>
                </v-form>
              </v-card-text>
              
              <v-card-actions>

                <div style="padding: 1em;" v-if="invalidPassword"><strong><span style="color: red;">Incorrect Username and/or Password</span></strong></div>
                 <div style="padding: 1em;" v-if="missingCredentials"><strong><span style="color: red;">Please enter a Username and Password</span></strong></div>
                <v-spacer></v-spacer>
                <a @click="forgotPassword" href="javascript:void(0);">Forgot password</a>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
</template>
<script>
export default {
    components: {
    },
  created () {
   this.resetForm();
  },
  mounted () {
  },
  props: {
    source: String
  },
  data: function () {
    return {
      username:'',
      password:'',
      invalidPassword: false,
      emptyCredentials: false,
      missingCredentials: false,
    }
  },
  methods: {
    forgotPassword(){
      this.$router.push({name: 'forgotpassword'});
    },
    clearInvalid(){
        this.invalidPassword = false;
    },
    async sendCredentials(){
      console.log(`Sending...`);
      if(this.username && this.password) {
        let res = (await this.$store.dispatch('login', {username: this.username, password: this.password})).data;
        res.message
        console.log(`Response: ${JSON.stringify(res)}`);
        if(res.token){
          if(res.user.isProfileComplete === 'true'){
          console.log('redirecting to news feed');
            this.$router.push({name: 'newsfeed'});
          } else {
              console.log('redirecting to edit profile');
              this.$router.push({name: 'edit-profile-incomplete'});
          }
        }
        
 
      }
    },
    resetForm(){
      this.email = '';
      this.password = '';
      this.invalidPassword = false;
      this.emptyCredentials = false;
    }
  },
  computed: {
  }
}
</script>
<style>
