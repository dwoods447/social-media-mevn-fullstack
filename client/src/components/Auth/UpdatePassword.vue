<template>
     <v-form @submit.prevent="updatePassWord">
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password" v-model="password" ></v-text-field>
                   <v-text-field id="confirm-password" prepend-icon="lock" name="confirm-password" label="Confirm Password" type="password" v-model="confirm_password" ></v-text-field>
                  <v-btn color="primary" @click="updatePassWord">Update Password</v-btn>
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
            console.log(`UserId ${this.$route.params.userId}`)
             this.$store.dispatch('updatePasswordAction', {userId: this.$route.params.userId, password:  this.password});
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