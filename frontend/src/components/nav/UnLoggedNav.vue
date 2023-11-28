<template>
    <div class="nav-menu-section">
        <div class="profile-section"></div>
        <div class="info-section"></div>
        <div class="login-button-section">
            <button class="login-btn" @click="loginModalOpen">로그인</button>
        </div>
    </div>
</template>
<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['loginModalCheck']);
function loginModalOpen(){
    emit('loginModalCheck', true);
}
</script>

<style scoped>
.nav-menu-section{
    height: 100%;
}
.profile-section{
    height: 10%;
}
.info-section{
    height: 50%;
}
.login-button-section{
    height: 5%;
}
.login-btn{
    width: 100%;
    height: 100%;
}
</style>