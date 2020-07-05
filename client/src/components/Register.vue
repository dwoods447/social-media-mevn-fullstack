<template>
    <v-container fluid fill-height style="background-color: #ccc;">
        <v-layout align-center justify-center>
          <v-flex xs12 sm12 md12>
             <v-card class="elevation-12" style="max-width: 35%; margin: 0 auto;">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Register for an Account</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>    
                <v-card-text>
                 
                 <SignUp style="width: 65%; margin: 0 auto;"></SignUp>
                </v-card-text>
            </v-card>
     </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import SignUp from '../components/Auth/SignUp'
    export default {
        components: {
            SignUp
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>

</style>