 <template>
  <div class="navbar-container">
 <v-card>
   <v-toolbar dark color="primary">
      <v-toolbar-title ><v-btn text @click="navigateTo('home')">{{ this.$store.getters.getAppName}}</v-btn></v-toolbar-title>
      <span>
        <v-btn text
        v-if="isAuthenticated && isProfileComplete" @click="navigateTo('newsfeed')">
        NewsFeed
        </v-btn>
      </span>
      <v-spacer></v-spacer>
         <div v-if="isAuthenticated && userInfo">
                <div v-if="userInfo.generatedUser === 'true'" :class="['is-a-generated-user']">
                     <div v-if="userInfo.gender === 'male'" :class="['is-a-male-user']">
                            <img :src="userInfo|maleImageSrcFilter" style="display: inline-block; width:50px; height: 50px; margin-right: 7px; border-radius: 50%;">
                     </div>
                    <div v-if="userInfo.gender === 'female'" :class="['is-a-female-user']">
                            <img :src="userInfo|femaleImageSrcFilter" style="display: inline-block; width:50px; height: 50px; margin-right: 7px; border-radius: 50%;">
                     </div>
                 </div>
                 <div v-else :class="['is-not-a-generated-user']">
                      <img :src="this.postPhotoBaseURL+'images/'+userInfo.images.imagePaths[0].path" style="width:50px; height: 50px; margin-right: 7px; border-radius: 50%;">
                  </div>
       </div>
       <v-toolbar-items>
       <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            color="default"
            light
            v-on="on"
            text
            
          >
          <span v-if="isAuthenticated">
             <span >Welcome, {{userInfo.username}}</span>&nbsp;
             <v-icon>expand_more</v-icon>
          </span>
         
          </v-btn>
          </template>
         <v-list>
          <v-list-item-group >
            <v-list-item>
              <v-list-item-content>
                 <v-list-item-title style="text-align:center;"><a href="javascript:void(0)" @click="navigateTo('edit-profile')" >Edit Profile</a></v-list-item-title>
              </v-list-item-content>             
           </v-list-item>
          </v-list-item-group>
        </v-list>
       </v-menu>
      </v-toolbar-items> 
   
       <v-btn text v-if="!isAuthenticated" @click="navigateTo('signin')">
           Sign In
        </v-btn>

         <v-btn text v-if="!isAuthenticated" @click="navigateTo('signup')">
           Sign Up
        </v-btn>

        <v-btn text v-if="isAuthenticated" @click="logOut">
           LogOut
        </v-btn>

    </v-toolbar>



  </v-card>
  </div>
</template>
<script>
import api from '../../services/API'
export default {
    created(){
       this.postPhotoBaseURL = api.defaults.baseURL;
    },
    data(){
         return {
           drawer : false,
           on: true,
           postPhotoBaseURL: '',
         }
    },
    methods: {
        navigateTo(route, param){
        if (param) {
          if (this.$route.name !== route){
            this.$router.push({name: route, params: param });
          } 
        }else {
           if (this.$route.name !== route){
             this.$router.push({name: route});
           }
        }
      },

      logOut(){
        this.$store.dispatch('setLogOutAction');
        this.$router.push({name: 'home'})
      },
    },

    filters: {
         imageSrcFilter(src){
                if(src.images.imagePaths.length > 0){
                    //return require(`../../assets/static/random-users/uploads/${src}`);
                    return require('../../assets/static/random-users/uploads/'+src.images.imagePaths[0].path)
                } else {
                  return 'http://via.placeholder.com/230x230';
                }
            },
            maleImageSrcFilter(src){
                if(src.images.imagePaths.length > 0){
                    console.log(`${src}`);
                    //return require(`../../assets/static/random-users/men/${src}`)
                    return require('../../assets/static/random-users/men/'+src.images.imagePaths[0].path);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
            femaleImageSrcFilter(src){
                if(src.images.imagePaths.length > 0){
                    console.log(`${src}`);
                  return require('../../assets/static/random-users/women/'+src.images.imagePaths[0].path);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
    },
     computed: {
       isAuthenticated(){
         return this.$store.getters.isLoggedIn;
       },
       userInfo(){
         return this.$store.getters.getUser;
       },
       isProfileComplete(){
         return this.$store.getters.isProfileComplete;
       }
     },
     
}
</script>
<style>

</style>