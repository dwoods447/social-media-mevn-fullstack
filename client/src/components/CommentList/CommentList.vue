<template>
    <div   :class="[{'comment-list-container-comments':hasComments},{'comment-list-container-no-comment':!hasComments}]">
        <comment 
        :comment="comment"
        :postId="postId"
        v-for="comment in comments" 
        :key="comment._id"></comment>
    </div>
</template>

<script>
   import Comment from '../Comment/Comment'
    export default {
        props:{
            comments: {
                 type: Array,
                 required: true
            },
            postId:{
                type: String
            }
        },
        components: {
            'comment':Comment
        },
        created(){
            if(this.comments.length > 0){
                this.hasComments = true;
            }else {
                this.hasComments = false;
            }
        },
        data(){
            return {
               hasComments: false,
               
            }
        },
        methods: {
          
        }
    }
</script>

<style  scoped>
 .comment-list-container-no-comment{
      height: 100%;
      overflow-y: scroll;
 }

 .comment-list-container-comments{
     height: 124px;
      overflow-y: scroll;
 }

</style>