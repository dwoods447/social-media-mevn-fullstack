<template>
<div>
                <div class="flex-container">
                      <div v-if="isGeneratedUser === 'true'" >
                          <div v-if="getGender === 'male'">
                                Main Image: <img :src="fullImageSrc|maleImageSrcFilter" style="width: 150px; height: 150px; border-radius: 50%;"  aspect-ratio="1">
                          </div>
                           <div v-if="getGender === 'female'">
                                 Main Image: <img :src="fullImageSrc|femaleImageSrcFilter" style="width: 150px; height: 150px; border-radius: 50%;" aspect-ratio="1" >
                          </div>
                      </div>
                      <div v-else>
                            Main Image:  <img :src="this.postPhotoBaseURL+'/images/'+fullImageSrc.images.imagePaths[0].path" style="width: 150px; height: 150px; border-radius: 50%;" aspect-ratio="1">
                      </div>
                      <div>
                        <div style="max-width: 100%; height: auto;">
                              <img :src="imgPreview" alt="" style="width: 100%;">
                        </div>
                        <a @click="removeSelectedFile" href="javascript:void(0);">
                            <span  v-if="fullImageSrc">X</span>
                        </a>
                        <input type="file" ref="file"  @change="onSelect">
                         <v-card-actions>
                        <div>
                            <h5>Allowed file types: {{allowedTypes}}</h5>
                            </div>
                            &nbsp;
                            <div v-if="uploadError">
                            <h5 style="color:red;">{{message}}</h5>
                            </div>
                            &nbsp;
                            <div v-if="uploadSuccess">
                            <h5 style="color:green;">{{message}}</h5>
                            </div>
                    </v-card-actions>
                      </div>
             </div>
          <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
           <v-card class="elevation-12">
               <h2 style="text-align:center;">Edit Profile</h2>
              <v-form @submit.prevent="formSubmit" enctype="multipart/form-data"  style="padding: 1em;">
                    <v-text-field
                    v-model="username"
                    :counter="10"
                    label="Username"
                    required
                
                    ></v-text-field>
                    <v-text-field
                    v-model="about"
                    label="About"
                    required
                    ></v-text-field>
                    <v-text-field
                    v-model="email"
                    label="E-mail"
                    required
                    ></v-text-field>
                    <v-text-field
                    v-model="password"
                    label="Password"
                    required
                    password
                    ></v-text-field>
                    <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    required
                    password
                ></v-text-field>
                <v-btn class="mr-4">submit</v-btn>
                <v-btn>clear</v-btn>
            </v-form>
             </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
</div>
     
</template>

<script>
import api from '../../services/API'
    export default {
        components: {

        },
        created(){
            console.log(`User Generated value: ${this.$store.getters.isGeneratedUser}`);
            this.postPhotoBaseURL = api.defaults.baseURL;
        },
        data(){
            return {
                imageUrl:'',
                previewSrc: '',
                selectedFile: null,
                uploadError: false,
                uploadSuccess: false,
                allowedTypes: '.jpg, .jpeg, .png',
                message: '',
                username: '',
                email: '',
                about: '',
                password: '',
                confirmPassword: '',
                image: null,
                postPhotoBaseURL: '',

               
                
            }
        },
        methods: {
             onSelect: function(e){
                this.selectedFile = e.target.files[0];
                if (this.selectedFile) {
                    // File is selected  
                   const reader = new FileReader();
                    reader.onload = e =>  this.previewSrc = e.target.result;
                    reader.readAsDataURL(this.selectedFile);
                }
            },

            formSubmit(){
                const formData = {};
                let userID;
                if(this.$store.getters.getUser)
                userID = this.$store.getters.getUser._id;
                console.log(`User's id: ${JSON.stringify(userID)}`)
                formData.userId = userID;
                if(this.username)
                formData.username = this.username;
                if(this.about)
                formData.about = this.about;
                if(this.password)
                formData.password = this.password;
                if(this.email)
                formData.email = this.email;
                if(this.imgPreview){
                     formData.image = this.selectedFile;
                }
                console.log(`Edit Profile Data in component: ${JSON.stringify(formData)}`)
                this.$store.dispatch('editUserInfoAction', formData);
                
            },

              removeSelectedFile(){
                this.selectedFile = null;
                this.$refs.file.value = null;
                this.imageUrl = '';
                 this.previewSrc = '';
            },
        },
        computed: {
           
            fullImageSrc: function(){
                return this.$store.getters.getUser;
            },
            imgPreview(){
                return this.previewSrc;
            },
            isProfileComplete(){
               return this.$store.getters.isProfileComplete;
            },
            isGeneratedUser(){
               return this.$store.getters.isGeneratedUser;
            },
            getGender(){
                return this.$store.getters.getGender;
            }
        },
        filters: {
            imageSrcFilter(src){
                if(src.images.imagePaths.length > 0){
                   return require(`../../assets/static/random-users/uploads/${src.images.imagePaths[0].path}`);
                } else {
                  return 'http://via.placeholder.com/230x230';
                }
            },
            maleImageSrcFilter(src){
                if(src.images.imagePaths.length > 0){
                    return require(`../../assets/static/random-users/men/${src.images.imagePaths[0].path}`);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
            femaleImageSrcFilter(src){
                if(src.images.imagePaths.length > 0){
                 return require(`../../assets/static/random-users/women/${src.images.imagePaths[0].path}`);
                }else {
                    return 'http://via.placeholder.com/230x230';
                }
            },
         
         }
    }
</script>

<style scoped>
.flex-container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>