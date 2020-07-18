<template>
    <div v-if="user">
        <v-card style="margin: 50px auto; width: 45%; padding: 1em;">
             <h2>{{ user.username }}'s Profile</h2> 
             <v-row no-gutters style="border-bottom: 2px solid #ccc;">
                 <v-col cols="9"
                    justify="center"
                    no-gutters>
                    <v-row>
                        <v-col cols="4" no-gutters> 
                            <div v-if="user !== {}">
                              <div v-if="user.generatedUser === 'true'">
                                    <div v-if="user.gender === 'male'" >
                                        <img :src="user|maleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                    </div>
                                    <div v-if="user.gender === 'female'">
                                        <img :src="user|femaleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                    </div>
                                </div>
                                <div v-else>
                                    <div v-if="baseURL">
                                         <div v-if="user.images">
                                           <img :src="baseURL+'/images/'+user.images.imagePaths[0].path" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                        </div>
                                    </div>
                                </div>
                             </div>

                        </v-col>
                        <v-col cols="8" no-gutters>
                            <h3>{{ user.username}}</h3>
                            <p>{{user.email}}</p>
                        </v-col>
                    </v-row>
                 </v-col>
                  <v-col cols="3"  justify="center" no-gutters>
                  <div class="flex-container-two">
                    <FollowButton :userID="user"></FollowButton>
                    </div>
                 </v-col>
             </v-row>
          
             <v-row no-gutters style="border-bottom: 2px solid #ccc;">
                <v-col cols="12">
                    {{user.created}}
                </v-col> 
             </v-row>   
              <v-row no-gutters  >
                <v-col cols="12">
                        <v-tabs
                            v-model="tab"
                            background-color="transparent"
                            color="basil"
                            grow
                            >
                            <v-tab
                                v-for="item in items"
                                :key="item"
                            >
                                {{ item }}
                            </v-tab>
                            </v-tabs>
                         <v-tabs-items v-model="tab">   
                            <v-tab-item >
                                <v-card
                                color="basil"
                                flat
                                >
                                
                                <PostList :posts="posts" style="height: 450px; overflow-y: auto;"></PostList>
                                </v-card>
                            </v-tab-item>
                             <v-tab-item >
                                <v-card flat>
                                <!-- <v-card-text>Following</v-card-text> -->
                                <carousel>
                                    <slide v-for="follower in following" :key="follower._id">
                                      <div v-if="follower.generatedUser === 'true'">
                                           <div v-if="follower.gender === 'male'">
                                               <img :src="follower|maleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                           </div> 
                                           <div v-if="follower.gender === 'female'">
                                               <img :src="follower|femaleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                           </div>
                                      </div> 
                                      <div v-else>
                                          <div v-if="baseURL && followers.length > 0">
                                              <div v-if="follower.images">
                                                     <img :src="baseURL+'/images/'+follower.images.imagePaths[0].path" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                              </div>
                                          </div>
                                      </div> 
                                      {{  follower.username }}
                                    </slide>   
                               </carousel>
                                </v-card>
                            </v-tab-item>
                             <v-tab-item >
                                <v-card
                                color="basil"
                                flat
                                >
                                <!-- <v-card-text>Tab3</v-card-text> -->
                                <carousel>
                                    <slide v-for="follower in followers" :key="follower._id">
                                            <div v-if="follower.generatedUser === 'true'">
                                                <div v-if="follower.gender === 'male'">
                                                    <img :src="follower|maleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                                </div> 
                                                <div v-if="follower.gender === 'female'">
                                                    <img :src="follower|femaleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                                </div>
                                            </div> 
                                            <div v-else>
                                                <div v-if="baseURL && followers.length > 0">
                                                    <img :src="baseURL+'/images/'+follower.images.imagePaths[0].path" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                                </div>
                                            </div> 
                                          {{  follower.username }}
                                    </slide>
                               </carousel>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                        <v-btn @click="goBackToNewsFeed">Back to NewFeed</v-btn>
                </v-col> 
             </v-row>   
        </v-card>
     
    </div>
</template>

<script>
import FollowButton from '@/components/Profile/FollowButton'
import PostList from '@/components/Posts/PostList'
import api from '../../services/API'
    export default {
        components: {
          FollowButton,
          PostList
        },
        created(){
            this.loadPerson();
            this.loadFollowing();
            this.loadFollwers();
            this.loadPosts();
            this.baseURL = api.defaults.baseURL;
        },
        data(){
            return {
                 baseURL: '',
                 user: {},   
                 tab: null,
                 items: [
                 'POSTS', 'FOLLOWING', 'FOLLOWERS',
                ],
                 text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                 followers: [],
                 following: [],
                 posts: [],
            }
        },
        methods: {
            async loadPerson(){
                const userID = {userId: this.$route.query.userId};
                const user  =  await this.$store.dispatch('loadUserProfileAction', userID);
                console.log(`This is the router query params: ${userID.userId}`);
                console.log(`uSER RETURNED${JSON.stringify(user, null, 2)}`)
                this.user = user;

            },

            async loadFollwers(){
                 const userID = {userId: this.$route.query.userId};
                //const allMyFollowers = this.$store.dispatch('getAllFollowersAction')
                 console.log(`User Id sent: ${userID.userId}`);
                const followers = await this.$store.dispatch('loadUsersFollowersAction',userID);
                this.followers = followers;
            },
            async loadFollowing(){
                 const userID = {userId: this.$route.query.userId};
                 console.log(`User Id sent: ${userID.userId}`);
                //const allMyFollowers = this.$store.dispatch('getAllFollowersAction')
                const following = await this.$store.dispatch('loadUsersFollowingAction', userID);
                this.following = following;
            },

            async loadPosts(){
                const userID = {userId: this.$route.query.userId};
                const posts = await this.$store.dispatch('loadUsersPostsAction', userID);
                this.posts = posts;
               
            },

            goBackToNewsFeed(){
                this.$router.push({name: "newsfeed"});
            }
        },
        filters:{
             imageSrcFilter(src){
                if(src.images){
                    //console.log(`img src=${src}`);
                    //return require(`../../assets/static/random-users/uploads/${src}`);
                    return require('../../assets/static/random-users/uploads/'+src.images.imagePaths[0].path)
                } else {
                  return 'http://via.placeholder.com/230x230';
                }
            },
            maleImageSrcFilter(src){
                if(src.images){
                   // console.log(`img src=${src}`);
                    //return require(`../../assets/static/random-users/men/${src}`)
                    return require('../../assets/static/random-users/men/'+src.images.imagePaths[0].path);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
            femaleImageSrcFilter(src){
                if(src.images){
                  //  console.log(`img src=${src}`);
                  return require('../../assets/static/random-users/women/'+src.images.imagePaths[0].path);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            }
        }
    }
</script>

<style scoped>
    .flex-container{
        display: inline-block;
    }
    .flex-container-two{
        display: inline-block;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
</style>