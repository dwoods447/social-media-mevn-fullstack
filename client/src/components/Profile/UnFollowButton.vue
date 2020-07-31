<template>
    <div>
         <v-btn @click="unfollowUser(followUser)"
         color="primary">
            UnFollow  
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
           unfollowUser(){
               const userId = {userId:  this.userID};
               console.log(`Sending user id for follow: ${this.userID}`)
               this.$store.dispatch('unfollowUserAction', userId);
           }
        }
    }
</script>

<style scoped>

</style>