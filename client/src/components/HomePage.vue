<template style="margin: 0; padding: 0;">
    <div style="margin: 0; padding: 0;">
            <template style="margin: 0; padding: 0;">
                <v-parallax src="../assets/banner/home-banner.jpg" 
                height="100vh" style="min-height: 100vh; padding: 0; !important; margin : 0;">
                <slot>
                      <div style="padding: 0; margin : 0; overflow: hidden; min-width: 100vw; min-height: 100vh; opacity: 1; background-color: rgba(0,0,0,0.5);">
                        <div class="flex-container">
                            <div class="flex-item">
                                <div style="width: 65%;">
                                <h1 style="">Connect with friends and the world around you on {{ this.$store.getters.getAppName}}</h1>
                                </div>
                                <ul>
                                    <li>See photos and updates from followers in News Feed.</li>
                                    <li>Share what's new in your life on your News Feed.</li>
                                    <li>Find more of who you're looking for with {{ this.$store.getters.getAppName}} follwers </li>
                                </ul>
                            </div>
                            <div class="flex-item">
                                <h1>Sign Up</h1>
                                <p>It’s quick and easy.</p>
                                <signup-component></signup-component> 
                            </div>
                        </div>
                   </div>
                </slot>
                </v-parallax>
            </template>
    </div>
</template>

<script>
    import SignUp from '../components/Auth/SignUp'
    export default {
        components: {
            'signup-component': SignUp
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>
 .flex-container{
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: center;
 }

 .header-text{
     font-size: 6em
 }

 .flex-item {
     width: 35%;
     height: 560px;
     margin: 10px;
     padding: 1em;
     color: #fff;
 }


</style>