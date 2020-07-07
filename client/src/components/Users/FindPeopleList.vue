<template>
    <div>
        <FindPeople :user="user" :key="user._id" v-for="user in allUserFollowed"></FindPeople>
    </div>
</template>

<script>
    import FindPeople from '@/components/Users/FindPeople'
    import openSocket from 'socket.io-client'
    import api from '../../services/API'
    export default {
        components: {
            FindPeople
        },
        created(){
              this.getUsersNotFollowed();
                 const socket = openSocket(api.defaults.baseURL);
                 socket.on('new-people-list', (data)=>{
                     console.log(`New Followes added`)
                      if(data.action === 'list'){
                          this.users = data.lists;
                            console.log(`new follower list rec'vd`);
                      }
                 });
        },
        data(){
            return {
                users: [],
            }
        },
        methods:{
           async getUsersNotFollowed(){
               const usersNotFollowed = await this.$store.dispatch('getAllUsersNotFollowedAction');
               this.users = usersNotFollowed.users;
           }
        },
        computed:{
            allUserFollowed() {
                return this.users;
            }  
        }
    }
</script>

<style  scoped>

</style>