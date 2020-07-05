<template>
    <div>
         <v-btn @click="followUser(followUser)"
         color="primary">
            Follow  
         </v-btn>   
    </div>
</template>

<script>
    export default {
        props:['userID'],
        components: {

        },
        data(){
            return {

            }
        },
        methods: {
           followUser(){
               const userId = {userId:  this.userID};
               console.log(`Sending user id for follow: ${this.userID}`)
               this.$store.dispatch('followUserAction', userId);
           }
        }
    }
</script>

<style scoped>

</style>