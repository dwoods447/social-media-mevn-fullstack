<template>
    <div>
      <v-card style=" margin: 7px auto; max-width: 55%;">
                <v-toolbar dark color="primary">
                    <div v-if="generatedUser === 'true'">
                        <div v-if="gender === 'male'" >
                              <img :src="postCreatorImage|maleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                        </div>
                        <div v-if="gender === 'female'">
                              <img :src="postCreatorImage|femaleImageSrcFilter" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                        </div>
                    </div>
                     <div v-else>
                           <img :src="this.postPhotoBaseURL+'/images/'+postCreatorImage" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;" >
                    </div>
              
                <h2 style="font-size: 1.1em; margin-right: 20px;">&nbsp;&nbsp;{{ postedBy.username }}<br/><span style="font-size: small;">{{ created | dateFilter}}</span></h2>
                <v-spacer></v-spacer>
                <v-btn text v-if="canDelete === true" :class="[{canDelete: 'show-post-remove-icon'}]" @click="deletePost">
                     <v-icon>delete</v-icon>
                </v-btn>
                 <v-btn text v-else :class="['hide-post-remove-icon']">
                     <v-icon>delete</v-icon>
                </v-btn>
              </v-toolbar>

       <v-card-text>
           <div v-if="photo.length > 0 && this.postPhotoBaseURL">
            <div style="max-width: 100%; height: auto;">
               <img :src="this.postPhotoBaseURL+'/images/'+photo[0].path" style="width: 100%;">
            </div>
           </div>
           {{this.text}}
           <v-card-actions>
                <v-btn icon @click="addLikeToPost(postId)">
                 <v-icon  dark :class="{'pink--text':youLikedPost}">mdi-heart</v-icon> &nbsp;&nbsp; {{ postLikes.length }}
                </v-btn>

               <v-btn icon>
                <v-icon>insert_comment</v-icon> &nbsp;&nbsp; {{ numberOfComments.length }}
                </v-btn>
           </v-card-actions>
            <v-card-actions>
                <v-text-field
                label="Write something"
                v-model="comment">
                </v-text-field>
                <v-btn  icon @click="addCommentToPost(postId)">
                    <v-icon>send</v-icon>
                </v-btn>
           </v-card-actions>
           <slot></slot>
       </v-card-text>        
      </v-card>
    </div>
</template>

<script>
import moment from 'moment'
import api from '../../services/API'
    export default {
        props: {
            text: {
                type: String,
            },
            numberOfLikes: {
                type: Array,
            },
            numberOfComments:{
                type: Array,
            },
            postedBy: {
                type: Object
            },
            created:{
                type: String
            },
            postCreatorImage: {
                type: String
            },
            generatedUser:{
                type: String
            },
            gender: {
                type: String
            },
            postId: {
                type: String
            },
            photo: {
                type: Array
            }
        },
        created(){
            this.checkLikes(); 
            this.setCanDelete(); 
            this.postPhotoBaseURL = api.defaults.baseURL;
       },
        data(){
            return {
                comment: '',
                postWasLikedByYou: true,
                canDelete: false,
                postPhotoBaseURL: null,
            }
        },
        computed: {
            postLikes(){
                return this.numberOfLikes;
            },
            youLikedPost(){
                return this.postWasLikedByYou;
            },
        },
        methods:{
            setCanDelete(){
                if(this.$store.getters.getUser._id === this.postedBy._id){
                    console.log(`This user posted this post.`)
                    this.canDelete = true;
                }
            },
            checkLikes(){

                const likeIndex = this.numberOfLikes.findIndex(like =>{
                    return like._id.toString() === this.$store.getters.getUser._id;
                });
                console.log(`Like index ${likeIndex}`);
                if(this.numberOfLikes.length > 0 && likeIndex >= 0){
                        this.postWasLikedByYou = true;
                }else {
                     this.postWasLikedByYou = false;
                }
            },
            addLikeToPost(postId){
                const postInfo  = {postId: postId}
                this.$store.dispatch('addLikeToPostAction', postInfo);
            },
            addCommentToPost(postId){
                if(this.comment){
                // console.log(`Adding comment to post with id ${postId}`);
                 const postInfo  = {postId: postId, comment: this.comment };
                 this.$store.dispatch('addCommentToPost', postInfo);
                }
             
            },
             deletePost(){
                   const postInfo  = {postId: this.postId};
                   console.log(`deleting post in the post component post id:${this.postId}`)
                   this.$store.dispatch('deletePostAction', postInfo);
             }
        },
        filters: {
            dateFilter(date){
              if(date){
                return moment(new Date(date), 'MM/DD/YYYY').format('l')
              }
            },

            imageSrcFilter(src){
                if(src){
                    return require('../../assets/static/random-users/uploads/'+src);
                } else {
                  return 'http://via.placeholder.com/230x230';
                }
            },
            maleImageSrcFilter(src){
                if(src){
                    return require('../../assets/static/random-users/men/'+ src);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
            femaleImageSrcFilter(src){
                if(src){
                  return require('../../assets/static/random-users/women/'+ src);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
        }
    }
</script>

<style  scoped>
 .post-like{
     color: red;
 }

 .show-post-remove-icon{
     display: block;
 }
 .hide-post-remove-icon{
     display: none;
 }
</style>