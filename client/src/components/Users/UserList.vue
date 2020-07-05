<template>
    <div>
        <div v-for="user in users" :key="user._id">
            <div>
                <img src="http://placehold.it/100x100">
                <span></span>
            </div>
             <div>
              <md-button class="md-dense md-primary">Flat</md-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['users'],
        data(){
            return {

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>