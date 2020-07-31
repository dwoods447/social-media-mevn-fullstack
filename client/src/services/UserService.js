import Api from './API'


export default {
    
    followUser(userId){
      return Api.post('/users/follow/user', userId)
    },

    unfollowUser(userId){
      return Api.post('/users/unfollow/user', userId)
    },
    loadUserProfile(user){
      console.log(`Userid re've in service ${JSON.stringify(user)}`);
      console.log(`Userid re've in service ${user.userId}`);
      return Api.get(`/users/find/user/${user.userId}`, user)
    },
    editUserInfo(userData){ 
      console.log(`Edit Profile Data: ${JSON.stringify(userData)}`)
      const formDataProp  = new FormData();
      formDataProp.append('about', userData.about) 
      formDataProp.append('image', userData.image, userData.image.name)
     
      console.log(`Sending this : ${JSON.stringify(formDataProp)}`)
     return Api.post(`/users/update/user/${userData.userId}/edit`, formDataProp)
    },
    // uploadUserPhoto(photo){
    //     const formData  = new FormData();
        
      
    //   return Api.post('/users/image/upload', formData);  
    // },
    getAllUsersFollowed(){
      return Api.get('/users/get/users/followed'); 
    },
    getAllUsersNotFollowed(){
      return Api.get('/users/get/users/notfollowed'); 
    },

    getAllFollowers(userID){
      return Api.post('/users/profile/users/followers', userID); 
    },
    getAllFollowing(userID){
      return Api.post('/users/profile/users/following', userID); 
    },
   
  
}