<template>
    <div>
      <v-row justify="center">  
        <v-dialog v-model="dialog" persistent max-width="290">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                v-bind="attrs"
                v-on="on"
                text>
                <v-icon> delete</v-icon>
                </v-btn>

                
            </template>
            <v-card>
                <h2>Delete Account</h2>
                <p>Confirm to delete your account.</p>
                <v-row>
                    <v-col cols="6">
                        
                        <v-btn text @click="dialog = false">
                            CONFIRM
                        </v-btn>
                    </v-col>
                    <v-col cols="6" @click="dialog = false">
                        <v-btn text>
                            CANCEL
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
               </v-dialog>
        </v-row>
    </div>
</template>

<script>
    export default {
        components: {

        },
        data(){
            return {
                dialog: false,
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>