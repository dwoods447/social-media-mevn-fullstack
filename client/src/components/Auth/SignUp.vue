<template>
<div>
    <span style="color: red; font-weight: 700;">{{ errorMsg }}</span>

      <v-form style="background-color: #fff; padding: 1.2em;" @submit.prevent="register">
            <v-text-field
            v-model="username"
            :counter="10"
            label="username"
            required
           
            ></v-text-field>
              <v-text-field
            v-model="password"
            :counter="10"
            label="password"
            :rules="[rules.required, rules.min]"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            required
            password
            :type="show1 ? 'text' : 'password'"
             @click:append="show1 = !show1"
            ></v-text-field>
             <v-text-field
            v-model="confirmPassword"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :counter="10"
            label="confirm password"
            required
            password
             @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
            v-model="email"
            label="e-mail"
            required
            ></v-text-field>
            <v-select
            v-model="gender"
            :items="genders"
            label="gender"
            required
            ></v-select>
            <!-- <v-checkbox
            v-model="checkbox"
            label="Do you agree?"
            required
            ></v-checkbox> -->

    <v-btn class="mr-4" @click="register">submit</v-btn>
    <v-btn @clear="clearForm">clear</v-btn>
  </v-form>
</div>
</template>

<script>
    export default {
        data(){
            return {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                select: null,
                show1: false,
                show2: false,
                gender: '',
                genders: [
                   {id: 'gender-male', value: 'male', text: 'male'},
                   {id: 'gender-female', value: 'female', text: 'female'},
                ],
                checkbox: false,
                rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => ('The email and password you entered don\'t match'),
                },
                errorMessage: '',
            }
        },
        computed:{
            errorMsg(){
                return this.errorMessage;
            }
        },
        methods: {
            clearForm(){
                this.username = '';
                this.password = '';
                this.confirmPassword = '';
                this.gender = '';
                this.email = '';
            },
            validate () {
                this.$refs.form.validate()
            },
            reset () {
                this.$refs.form.reset()
            },
            resetValidation () {
                this.$refs.form.resetValidation()
            },
            async register(){
                console.log('registering....');
                const formData = {};
                if(this.username)
                formData.username = this.username;
                if(this.password)
                formData.password = this.password;
                if(this.email)
                formData.email = this.email;
                if(this.gender)
                formData.gender  = this.gender
                const registerResp = await this.$store.dispatch('registerForAccountAction', formData);
                if(!registerResp){
                    console.log(`Something went wrong! Please try again.`);
                    this.errorMessage = 'Something went wrong! Please try again.'
                    return;
                }
                if(registerResp.statusCode === 422){
                    console.log(`${registerResp.message}`);
                    this.errorMessage = registerResp.message;
                    return;
                }
                 if(registerResp.statusCode === 500){
                     console.log(`${registerResp.message}`);
                    this.errorMessage = registerResp.message;
                    return;
                }
                this.$router.push({name: 'signin', params: {user: registerResp.user }});
            }
        }
    }
</script>

<style  scoped>

</style>