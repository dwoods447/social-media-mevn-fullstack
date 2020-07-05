import Api from './API'

export default {
    getAllPosts(){
        return Api.get('/posts/all/posts');
    },
    createPost(postInfo){
        const formData = new FormData();
        formData.append('text', postInfo.text);
        if("image" in postInfo){
            formData.append('image', postInfo.image, postInfo.image.name);
        }
        return Api.post('/posts/create/post', formData);
    },
    deletePost(postID){
        return Api.post(`/posts/delete/${postID.postId}/post`, postID);
    },
    deleteComment(postID){
        return Api.post(`/posts/delete/${postID.postId}/comment/${postID.commentId}`, postID);
    },
    addCommentToPost(postInfo){
        return Api.post(`/posts/add/comment/${postInfo.postId}/post`, postInfo);
    },
    addLikeToPost(postInfo){
        return Api.post(`/posts/add/like/${postInfo.postId}/post`, postInfo);
    }
}