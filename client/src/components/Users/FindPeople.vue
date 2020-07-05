<template>
    <div v-if="user">
    <v-row
        class="suggestion-row"
        justify="center"
        no-gutters
        >
      <v-col lg="2">
        <div v-if="user.generatedUser === 'true'">
          <div v-if="user.gender == 'male'">
               <img :src="user|maleImageSrcFilter" :class="['is-male']" class="find-people-img">
          </div>
           <div v-if="user.gender ==='female'" >
               <img :src="user|femaleImageSrcFilter" :class="['is-female']" class="find-people-img">
           </div>
        </div>
         <div v-else>
             <img :src="user|imageSrcFilter" :class="['is-real-user']" class="find-people-img">
         </div>
        </v-col>
       <v-col lg="4" class="user-text-container">
             <p >{{ user.username }}</p>
      </v-col>
       <v-col lg="3">
           <div>
               <v-btn @click="viewProfile">
                    <v-icon>visibility</v-icon>
               </v-btn>
           </div>
         
      </v-col>
      <v-col lg="3">
        <FollowButton :userID="user._id"></FollowButton>
      </v-col>
      </v-row>
    </div>
</template>

<script>
import FollowButton from '@/components/Profile/FollowButton'
    export default {
        props:{
            user: {
                type: Object,
            }
        },
        components: {
            FollowButton
        },
        created(){
           // console.log(`Created hook user obj findPeople ${JSON.stringify(this.user)}`)
        },  
        data(){
            return {
                
            }
        },
        methods: {
          viewProfile(){
              this.$router.push({name: `profile`, params: {userId: this.user._id}, query: {userId: this.user._id}})
          },
    
        },
        computed: {
             
        },
         filters:{
            imageSrcFilter(src){
                if(src.images){
                    console.log(`img src=${src}`);
                    //return require(`../../assets/static/random-users/uploads/${src}`);
                    return require('../../assets/static/random-users/uploads/'+src.images.imagePaths[0].path)
                } else {
                  return 'http://via.placeholder.com/230x230';
                }
            },
            maleImageSrcFilter(src){
                if(src.images){
                    console.log(`img src=${src}`);
                    //return require(`../../assets/static/random-users/men/${src}`)
                    return require('../../assets/static/random-users/men/'+src.images.imagePaths[0].path);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
            femaleImageSrcFilter(src){
                if(src.images){
                    console.log(`img src=${src}`);
                  return require('../../assets/static/random-users/women/'+src.images.imagePaths[0].path);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            }
       },
    }
</script>

<style scoped>
.find-people-img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.suggestion-row{
      background-color: #ccc;
      max-width: 100%; 
      margin: 5px; 
      padding: 1em;
}
</style>