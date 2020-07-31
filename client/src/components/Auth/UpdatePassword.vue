<template>
     <v-form @submit.prevent="sendCredentials">
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password" v-model="password" ></v-text-field>
                   <v-text-field id="confirm-password" prepend-icon="lock" name="confirm-password" label="Confirm Password" type="password" v-model="confirm_password" ></v-text-field>
                  <v-btn color="primary" @click="sendCredentials">Update Password</v-btn>
    </v-form>
</template>
<script>
export default {
    data(){
        return {
            password: '',
            confirm_password: '',
            message: '',
        }
    },
     methods: {
         updatePassWord(){
             this.message = '';
             if(this.password !== this.confirm_password){
                 return this.message = 'Passwords do not match';
             }

             this.$store.dispatch('updatePasswordAction', {password:  this.password});
         }
     },
     computed: {
         errorMessage(){
             return this.message;
         }
     }
}
</script>
<style scoped>

</style>