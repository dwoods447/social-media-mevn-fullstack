<template>
    <div>
         <v-card  style="max-width: 80%; margin: 25px auto;">
             <v-toolbar dark color="grey">
                 <div v-if="isAuthenticated">
                <div v-if="user.generatedUser === 'true'" :class="['is-a-generated-user']">
                     <div v-if="user.gender === 'male'" :class="['is-a-male-user']">
                            <img :src="user|maleImageSrcFilter" style="display: inline-block; width:50px; height: 50px; margin-right: 7px; border-radius: 50%;">&nbsp;<h2 style="display: inline-block;">{{user.username}}</h2> 
                     </div>
                    <div v-if="user.gender === 'female'" :class="['is-a-female-user']">
                            <img :src="user|femaleImageSrcFilter" style="display: inline-block; width:50px; height: 50px; margin-right: 7px; border-radius: 50%;">&nbsp;<h2 style="display: inline-block;">{{user.username}}</h2> 
                     </div>
                 </div>
                <div v-else :class="['is-not-a-generated-user']">
                      <img :src="this.postPhotoBaseURL+'/images/'+user.images.imagePaths[0].path" style="display: inline-block; width:50px; height: 50px; margin-right: 7px; border-radius: 50%;">&nbsp;<h2 style="display: inline-block;">{{user.username}}</h2> 
                 </div>
             </div>
                <v-spacer></v-spacer>
              </v-toolbar>
           <v-card-actions>
               <v-row>
                    <v-col lg="12" v-if="imgPreview">
                            <div style="max-width: 100%; height: auto;" >
                                <img :src="imgPreview" alt="" ref="file" style="width: 100%; height auto;"/>
                            </div>
                            <a @click="removeSelectedFile" href="javascript:void(0);">
                                <span  v-if="imgPreview">X</span>
                            </a>  
                    </v-col>
                    <v-col lg="12">
                             <div>
                                <v-form style="display:block; width: 100%; padding: 1em; background-color: #eee; margin: 0 auto;" method="post"  enctype='multipart/form-data'>
                                    <v-text-field
                                    label="Share your thoughts..."
                                    v-model="text">
                                    </v-text-field>
                                    <v-btn text>
                                        <v-icon>camera_alt</v-icon>
                                        <input type="file" name="image" ref="image"  @change="onSelect" style="">
                                    </v-btn>
                                    <!-- <v-btn text>
                                        <v-icon>videocam</v-icon>
                                    </v-btn> -->
                                <br/>
                                </v-form>
                                </div>
                    </v-col>
               </v-row>
           </v-card-actions>  
           <v-btn color="primary" style="margin: 10px 55px;" @click="addNewPost($event)">POST</v-btn>
          </v-card>
    </div>
</template>

<script>
    import api from '../../services/API'
    export default {
        props:{
            user: {
                type: Object
            }
        },
        created(){
           // console.log(`This is a user on NEWPOST ${JSON.stringify(this.user)}`)
           this.postPhotoBaseURL = api.defaults.baseURL;
        },
        components: {

        },
        data(){
            return {
                photo: '',
                text: '',
                video: '',
                selectedFile: '',
                previewSrc: '',
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
             addNewPost(event){
              event.preventDefault();
              console.log(`Adding new post on the client.`)       
             let postContents = {};
             if(this.previewSrc || this.text || this.video){
                if(this.video){
                    postContents.text = this.text;
                }  
                if(this.previewSrc){
                    postContents.image = this.selectedFile;
                }
                if(this.text){
                    postContents.text = this.text;
                } 
               
                 this.$store.dispatch('setAuthHeaderTokenAction', this.$store.getters.getAuthToken);
                 this.$store.dispatch('createPostAction', postContents);
                 this.text = '';
                 this.photo = '';
                 this.video = '';
                 this. removeSelectedFile();
              }
            },
             removeSelectedFile(){
                this.selectedFile = null;
                this.$refs.file.value = null;
                this.$refs.image.value = null;
                this.previewSrc = null;
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
            imgPreview(){
                return this.previewSrc;
            },
        }
    }
</script>

<style scoped>

</style>