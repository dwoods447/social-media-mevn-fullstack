<template>
 <v-container fluid fill-height>
      <v-layout align-center justify-center>
          <v-flex xs12 sm12 md12>
       <div>
       <v-card style="width: 53%; margin: auto; padding: 1em;">
           <p v-if="showMessage" style="color: red; font-weight: 800;">{{ showMessage }}</p>
           <p>Forgot your account’s password or having trouble logging in? Enter your email address and we’ll send you a recovery link.
Email</p>
        <v-text-field
        label="Enter your email"
        v-model="email">
        </v-text-field>
        <v-btn  color="primary" @click="resetPassword">Send Recovery Email</v-btn>
       </v-card>
     </div>
    </v-flex>
   </v-layout>
 </v-container>
</template>
<script>
export default {
    data(){
        return {
            email: '',
            message: '',
        }
    },
    methods: {
          async resetPassword(){
            console.log('Resetting password....');
             this.message = '';
            const passwordReset = (await this.$store.dispatch('resetActionPasswordAction', {email: this.email})).data;
            console.log(`Password Reset Resp: ${passwordReset}`);
            if(!passwordReset){
                this.message = "An error occured while trying to reset the password please try again";
            }

            this.message = passwordReset;
        }
    },
    computed: {
        showMessage(){
            return this.message;
        }
    }


}
</script>
<style scoped>

</style>