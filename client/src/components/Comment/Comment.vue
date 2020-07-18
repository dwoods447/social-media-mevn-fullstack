<template>
    <div class="comment-container">
    <v-row
        class="mb-6"
        justify="center"
        no-gutters
        >
      <v-col lg="3">
        <div v-if="comment.postedBy.generatedUser == 'true'" :class="['comment-border','is-generated-user']">
          <div v-if="comment.postedBy.gender == 'male'" class="comment-photo-container">
               <img :src="comment.postedBy.images.imagePaths[0].path|maleImageSrcFilter" :class="['comment-photo', 'is-male']">
          </div>
           <div v-if="comment.postedBy.gender ==='female'" class="comment-photo-container">
               <img :src="comment.postedBy.images.imagePaths[0].path|femaleImageSrcFilter" :class="['comment-photo','is-female']">
           </div>
        </div>
         <div v-else :class="['comment-border','is-not-a-generated-user']" class="comment-photo-container">
              <img :src="this.postPhotoBaseURL+'/images/'+comment.postedBy.images.imagePaths[0].path" :class="['comment-photo','is-real-user']">
         </div>
        </v-col>
       <v-col lg="8" class="comment-text-container">
           <div>
             <p class="comment-text">{{ comment.postedBy.username }}</p>
             <p class="comment-text">{{ comment.text }}</p>
             <p class="comment-text">{{comment.created|dateFilter}}</p>
           </div>
           
      </v-col>
       <v-col lg="1">
           <div class="comment-photo-container">
            <v-btn text v-if="canDelete === true" :class="[{canDelete: 'show-comment-remove-icon'}]" @click="deleteComment">
                     <v-icon>delete</v-icon>
            </v-btn>
             <v-btn text v-else :class="['hide-comment-remove-icon']">
                     <v-icon>delete</v-icon>
            </v-btn>
           </div>
       </v-col>
      </v-row>
    </div>
</template>

<script>
   import api from '../../services/API'
   import moment from 'moment'
    export default {
        props: {
            comment: {
                type: Object,
            },
            postId:{
                type: String,
            }
        },
        created(){
            //console.log(`Printed Comment: ${JSON.stringify(this.comment, null, 2)}`);
             this.setCanDelete(); 
             this.postPhotoBaseURL = api.defaults.baseURL;
        },
        data(){
            return {
                 canDelete: false,
                 postPhotoBaseURL: null,
            }
        },
        methods: {
              deleteComment(){
                   const commentInfo  = {postId: this.postId, commentId: this.comment.commentId};
                   console.log(`deleting comment on post id:${this.postId}`)
                   this.$store.dispatch('deleteCommentAction', commentInfo);
             },
              setCanDelete(){
                console.log(`Comparing ${this.$store.getters.getUser._id} and ${this.comment.postedBy._id}`);
                if(this.$store.getters.getUser._id === this.comment.postedBy._id){
                    console.log(`This user posted this comment.`)
                    this.canDelete = true;
                }
            },

        },
        filters:{
           dateFilter(date){
              if(date){
                return moment(new Date(date), 'MM/DD/YYYY').format('LLLL')
              }
            },
            imageSrcFilter(src){
                if(src){
                    console.log(`${src}`);
                    //return require(`../../assets/static/random-users/uploads/${src}`);
                    return require('../../assets/static/random-users/uploads/'+src)
                } else {
                  return 'http://via.placeholder.com/230x230';
                }
            },
            maleImageSrcFilter(src){
                if(src){
                    console.log(`${src}`);
                    //return require(`../../assets/static/random-users/men/${src}`)
                    return require('../../assets/static/random-users/men/'+src);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
            femaleImageSrcFilter(src){
                if(src){
                    console.log(`${src}`);
                  return require('../../assets/static/random-users/women/'+src);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
        }
    }
</script>

<style  scoped>
.comment-container{
    margin-top: 50px;
}
 .comment-photo{
     width: 50px;
     height: 50px;
     border-radius: 50%;
     display: flex;
 }
 .comment-photo-container{
      margin: 35% auto;
 }
 .comment-text-container{
     width:85%;
     background-color: #eee;
     margin-left: -35px;
     padding: 0.5em;
 }
 .comment-text{
     padding: 0.5em;
     line-height: 8px;
 }
 
 .show-comment-remove-icon{
     display: block;
 }
 .hide-comment-remove-icon{
     display: none;
 }
</style>