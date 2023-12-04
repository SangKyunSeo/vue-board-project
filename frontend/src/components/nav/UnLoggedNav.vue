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
/**
 * @description
 *    - title: 로그인 전 네비게이션
 *    - menu: 메인 > 로그인 전
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import { defineEmits } from 'vue';

const emit = defineEmits(['loginModalCheck']);

// 로그인 버튼 클릭 시 로그인 모달창 Open 상태임을 전달
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