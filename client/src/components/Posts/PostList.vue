<template>
<div>
     <div v-if="allPosts.length > 0">
        <Post v-for="post in allPosts" 
        :text="post.text" 
        :numberOfLikes="post.likes" 
        :postedBy="post.postedBy" 
        :key="post._id"
        :created="post.created"
        :postCreatorImage="post.postedBy.images.imagePaths[0].path"
        :numberOfComments="post.comments"
        :generatedUser="post.postedBy.generatedUser"
        :gender="post.postedBy.gender"
        :postId="post._id"
        :photo="post.photo.imagePaths"
        >
        <div v-if="post.comments" class="comment-list-outer-container">
             <comment-list 
            :comments="post.comments"
            :postId="post._id"
             ></comment-list>
        </div>
       
        </Post>
    </div>
    <div v-else>
            <h1 style="text-align: center; color: #ccc;">You don't have any posts yet.</h1>
    </div>
</div>
   
</template>

<script>
import Post from '../Posts/Post'
import CommmentList from '../CommentList/CommentList'
    export default {
        props:{
            posts: {
                type: Array,
                required: true
            }
        },
        components: {Post, 'comment-list': 
        CommmentList},
        data(){
            return {

            }
        },
        computed:{
            allPosts(){
                return this.posts;
            }
        }
    }
</script>

<style  scoped>
.comment-list-outer-container{
    overflow: hidden;
}
</style>