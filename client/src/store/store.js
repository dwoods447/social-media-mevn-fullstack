
import Vue from 'vue'
import Vuex from 'vuex'
import Auth from '../services/AuthenticationService'
import Api from '../services/API'
//import Cookie from 'js-cookie'
import UserService from '../services/UserService'
import PostService from '../services/PostService'



Vue.use(Vuex);



const store = new Vuex.Store({
 state: {
  token: null,
  user: null,
  isLoggedIn: false,
  appName: "InTheMix",
  newsFeedPosts: [],
  editUser: null,
 },

 mutations: {
  setAuthTokenMutation(state, token){
    state.token = token;
  },
  setLogOutMutation(state){
    state.token =  null;
    state.user = null;
    state.token = null;
    state.isLoggedIn =  false;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('user');
  },
  
  setErrorMessageMutation(state, message){
    state.error  = '';
    state.error = message;
  },
  setAllPostsMutation(state, posts){
    state.newsFeedPosts  = [];
    state.newsFeedPosts = posts;
  },

  clearToken (state){
    state.token = null;
    state.user = null;
    state.isLoggedIn =  false;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('user');
  },
  
  setLoggedInUserIdMutation(state, user){
    let storedUser = {};
    if(typeof user === 'string'){
      console.log('user is a string converting to JSON')
      let storedUser;
      user = JSON.parse(user);
      storedUser = {...user},
      state.user = storedUser;
    }
    storedUser = {...user};
    state.user = storedUser;
    state.isLoggedIn =  true;
  },


  

 },

 actions: {
    setAllPostsAction(context, posts){
    context.commit('setAllPostsMutation', posts);
    },
    setAuthHeaderTokenAction(context, token){
      Api.defaults.headers.common['Authorization'] = 'Bearer '+token;
      return token;
    },
  
   setLogOutTimerAction(context, exprationTime){
     console.log(`Expiration time : ${exprationTime}`)
     const hour  = 60 * 60 * 1000;
      setTimeout(()=>{
        context.commit('setLogOutMutation');
        console.log(`Token expired running Auto Logout`);
      }, hour);
   },



   tryAutoLoginAction(context){
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if(!token){
        return;
      }

      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Date();
      if(now <= expirationDate){
        return;
      }

      context.commit('setLoggedInUserIdMutation', user);
      context.commit('setAuthTokenMutation', token);
   },
  
   setLogOutAction(context){
      context.commit('clearToken');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('user');
  },
  
  async login(context, credentails){
    let token;
    let user;
    let tokenExpr;
    console.log('Logging in...')
    try{
    const response  = await Auth.login(credentails);
      if(response.data.token){
        token  = response.data.token;
        tokenExpr = JSON.stringify(response.data.tokenExpiresIn);
        user = JSON.stringify(response.data.user);
        const now  = new Date().getTime();
        // console.log(`Token Expiration is a: ${typeof response.data.tokenExpiresIn}`);
        // console.log(`Now ${now}`)
        const expirationDate =  ((now + response.data.tokenExpiresIn) * 1000);
        // console.log(`${(now + response.data.tokenExpiresIn * 1000)}`);
        // console.log(`Expiration which is now.getTime() + tokenExpr * 1000 is: ${JSON.stringify(expirationDate)}`);
        tokenExpr = expirationDate;
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', tokenExpr);
        localStorage.setItem('user', user);
        context.commit('setAuthTokenMutation', token);
        context.commit('setLoggedInUserIdMutation', response.data.user);
        context.dispatch('setLogOutTimerAction', tokenExpr);
        // console.log(`Auth Token: ${JSON.stringify(token)}`);
        // console.log(`User: ${JSON.stringify(user)}`);
       
      }
            return response;
        }catch(err){
          console.log(err);
          let errorMessage = 'Invalid username/password';
          context.commit('setErrorMessageMutation', errorMessage);
      }
    },

    async registerForAccountAction(context, formData){
      const registerResp = (await Auth.register(formData)).data;
      if(!registerResp){
        return;
      }
      return registerResp;
    },

     async resetActionPasswordAction(context, email){
       console.log(`Reseting password in store.`)
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
        const passWordResetResp = await Auth.resetPassword(email);
        if(!passWordResetResp){
          return; 
        }

        if(passWordResetResp.data.message == 'No user account with that email exists.'){
          return 'No user account with that email exists.';
        }

        if(passWordResetResp.data.message == 'If a user with that account exists you will recieve an email within the hour with password reset instructions.'){
          return 'Password reset successfully!'
        }

        return;
        
    },

    async updatePasswordAction(context, password){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const updatePasswordResp = (await Auth.updatePassword(password)).data;
      if(!updatePasswordResp){
        return;
      }
    },


    async loadUsersFollowersAction(context, userID){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const followers = (await UserService.getAllFollowers(userID)).data;
      if(!followers){
        return;
      }
      console.log(`Followers in store: ${JSON.stringify(followers, null, 2)}`)
      return followers.users;

    },

    async loadUsersFollowingAction(context, userID){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const followers = (await UserService.getAllFollowing(userID)).data;
      if(!followers){
        return;
      }

      console.log(`Following in store: ${JSON.stringify(followers, null, 2)}`)
      return followers.users;

    },


    async getAllUsersFollowedAction(context){
        // console.log('gEtting users followed in store...');
        context.dispatch('setAuthHeaderTokenAction', context.state.token);
        const allUsersFollowed = (await UserService.getAllUsersFollowed()).data;
       
        //console.log(`Users followed retured ${JSON.stringify(allUsersFollowed)}`)
        if(!allUsersFollowed){
          return;
        }

        return allUsersFollowed;
    },

    async getAllUsersNotFollowedAction(context){
      // console.log('gEtting users not followed in store...');
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const allUsersFollowed = (await UserService.getAllUsersNotFollowed()).data;
      // console.log(`Users not followed retured ${JSON.stringify(allUsersFollowed, null, 2)}`)
      if(!allUsersFollowed){
        return;
      }

      return allUsersFollowed;
  },

    async followUserAction(context, usertoFollowId){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const followResponse = await UserService.followUser(usertoFollowId);
      if(!followResponse){
        return;
      }
      return 'You are now following this user';
    },


    async unfollowUserAction(context, usertoUnFollowId){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const followResponse = await UserService.unfollowUser(usertoUnFollowId);
      if(!followResponse){
        return;
      }
      return 'You are now following this user';
    },


    async editUserInfoAction(context, userData){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      // console.log(`Edit Profile Data in sotre: ${JSON.stringify(userData)}`)
      const editResponse = (await UserService.editUserInfo(userData)).data;
      if(!editResponse){
        return;
      }
      // console.log(`editResponse: ${JSON.stringify(editResponse)}`)
      context.commit('setLoggedInUserIdMutation', editResponse.user);
      localStorage.removeItem('user');
      localStorage.setItem('user', editResponse.user);
      return 'Account successfuly updated!'
    },

    async uploadUserImageAction(context, image){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
        const uploadResp = await UserService.uploadUserPhoto(image);
        if(!uploadResp){
          return; 
        }

        return 'Image uploaded successfully!'
    },

    async fetchAllPostsAction(context){
       const posts = (await PostService.getAllPosts()).data;
       context.commit('setAllPostsMutation', posts.posts);
       //console.log(`store posts response${JSON.stringify(posts, null, 2)}`)
       return posts.posts;
    },

    async loadUsersPostsAction(context, userId){
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const userPosts = (await PostService.loadUserPostsonProfile(userId)).data;
      if(!userPosts){
        return [];
      }
      return userPosts.posts;

    },
    async createPostAction(context, post){
     // console.log('Initiating Api call to create new post')
     //console.log(`Setting token in store ${JSON.stringify(context.state.token)}`)
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const newPost = await PostService.createPost(post);
      if(!newPost){
        return;
      }
      return 'Post created successfully!';
    },

    async addLikeToPostAction(context, postInfo){
      // console.log('Initiating Api call to add new like post')
      //console.log(`Setting token in store ${JSON.stringify(context.state.token)}`)
       context.dispatch('setAuthHeaderTokenAction', context.state.token);
       const likeResponse = await PostService.addLikeToPost(postInfo);
       if(!likeResponse){
        return;
       }
       return 'Like added successfully';
    },

    async deletePostAction(context, postInfo){
      // console.log('Initiating Api call to delete post')
      //console.log(`Setting token in store ${JSON.stringify(context.state.token)}`)
       context.dispatch('setAuthHeaderTokenAction', context.state.token);
       const deleteResponse = await PostService.deletePost(postInfo);
       if(!deleteResponse){
        return;
       }
       return 'Post removed successfully';
    },


    async deleteCommentAction(context, postInfo){
      // console.log('Initiating Api call to delete comment')
      context.dispatch('setAuthHeaderTokenAction', context.state.token);
      const deleteResponse = await PostService.deleteComment(postInfo);
      if(!deleteResponse){
        return;
       }
       return 'Comment removed successfully';
    },

    async loadUserProfileAction(context, userID){
      // console.log('Initiating Api call to load new user profile');
      // console.log(`Userid re've in store ${userID.userId}`);
      const userProfile = (await UserService.loadUserProfile(userID)).data;
      if(!userProfile){
        return;
       }
       return userProfile.user;
    },

    async addCommentToPost(context, postInfo){
      // console.log('Initiating Api call to add new comment to post')
     // console.log(`Setting token in store ${JSON.stringify(context.state.token)}`)
       context.dispatch('setAuthHeaderTokenAction', context.state.token);
       const commentResponse = await PostService.addCommentToPost(postInfo);
       if(!commentResponse){
        return;
       }
       return 'Comment added successfully';
    },

   
 },

 getters: {
    getUser(state){
      if(state.user !== null){
        return state.user;
      } else {
        return {};
      }
    },
    getAppName(state){
      return  state.appName;
    },
    getGender(state){
      if(state.user !== null){
        return state.user.gender;
      } else {
        return null;
      }
    },
    getAuthToken(state){
      if(state.token !== null){
        return state.token;
      }else {
        return null;
      }
    },
    getAllPosts(state){
      if(state.newsFeedPosts.length > 0){
        return state.newsFeedPosts;
      }else {
        return [];
      }
    },
    isLoggedIn(state){
      return state.isLoggedIn;
    },
    isGeneratedUser(state){
      if(state.user !== null){
       return  state.user.generatedUser;
      } else {
        return null;
      }
    },
    isProfileComplete(state){
      if(state.user !== null && state.user.isProfileComplete === 'true'){
        return  state.user.isProfileComplete;
      } else {
        return null;
      }
    },
 }


});

export default store