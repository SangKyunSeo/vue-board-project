<template>
  <header>
    <MainHeader :user="userInfo" @pointUpdated="pointUpdate"/>
  </header>
  <div v-if="loginModalState">
      <LoginModal @loginModalCheck="close" @registerCheck="registerModalCheck" @loginStatusCheck="loginSuccess"/>
  </div>
  <div v-if="registerModalState">
      <RegisterModal @registerModalCheck="registerClose"/>
  </div>
  <div class="body-wrapper">
    <nav class="nav" role="navigation">
      <UnLoggedNav v-if="loginState === false" @loginModalCheck="check"/>
      <LoggedNav :user="userInfo" :userPoint="userPoint" v-if="loginState === true" @logout="logoutCheck" ref="getMyPoint"/>
    </nav>
    <router-view/>
  </div>
</template>

<script setup>
/**
 * @description
 *    - title: 메인
 *    - menu: 메인
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import MainHeader from './components/header/MainHeader.vue'
import UnLoggedNav from './components/nav/UnLoggedNav.vue'
import LoggedNav from './components/nav/LoggedNav.vue';
import LoginModal from './components/modal/LoginModal.vue'
import RegisterModal from './components/modal/RegisterModal.vue';
import { ref, onMounted } from 'vue';
import {useUserStore} from './stores/user-store'
import axios from 'axios';

let loginModalState = ref(false);
let registerModalState = ref(false);
const loginState = ref(false);
const userInfo = ref({});
const store = useUserStore();
const getMyPoint = ref();
let attended = ref(false);
let userPoint = ref(0);

// 로그인 모달창 띄우기 위한 모달창 상태 변경
const check = (data) => {
    loginModalState.value = data;
}

// 로그인 모달창 닫기 위한 모달창 상태 변경
const close = (data) => {
    loginModalState.value = data;
}

// 회원가입 모달창 뛰우기 위한 모달창 상태 변경
const registerModalCheck = (data) => {
    registerModalState.value = data;
    loginModalState.value = false;
}

// 회원가입 모달창 닫기 위한 모달창 상태 변경
const registerClose = (data) => {
    registerModalState.value = data;
}

// 로그아웃시 Store 비우고, localstorage 비우기
const logoutCheck = (data) => {
    if(data === true){
        loginState.value = false;
        store.$reset();
        localStorage.clear();
        userInfo.value = JSON.parse(localStorage.getItem('user'));
    }
}

// 현재 로그인 상태를 체크
function loginStatusCheck(){
    userInfo.value = JSON.parse(localStorage.getItem('user'));
    console.log(userInfo.value);
    if(userInfo.value === null || userInfo.value.memberName === '') loginState.value = false;
    else {
      loginState.value = true;
      getTodayAttend();
    }
}

// 출석 버튼 클릭 시 전달 받은 데이터로 확인하고 store에 저장된 포인트로 네비게이션 포인트 바로 반영
const pointUpdate = (data) => {
  if(data){
    alert('출석버튼 클릭!');
    userPoint.value = getMyPoint.value.getMyPoint();
    console.log(userPoint.value);
  }
}

// 로그인 성공 시 로그인 상태 변경 및 로컬 스토리지에 저장된 사용자 정보 조회 및 금일 출석 정보 조회
const loginSuccess = (data) => {
    if(data === true){
        loginState.value = true;
        userInfo.value = JSON.parse(localStorage.getItem('user'));
        // 로그인 성공 시 금일 출석 정보 조회
        getTodayAttend();
    }
}

// 금일 출석 정보 조회 API 로컬 스토리지에 바로 반영
async function getTodayAttend(){
    const date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1) < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    let day =  date.getDate() < 9 ? '0' + date.getDate() : date.getDate();
    const today = year + '/' + month + '/' + day;
    await axios.get('/api/main/getTodayAttend',{
      params: {
        memberNum: userInfo.value.memberNum,
        now : today
      }
    })
    .then(res => {
      console.log(res);
      if(res.data.length === 0) {
        attended.value = false;
        store.setUserAttend(attended.value);
        localStorage.setItem('user_attend', JSON.stringify(attended.value));
      }
      else {
        attended.value = true;
        store.setUserAttend(attended.value);
        localStorage.setItem('user_attend', JSON.stringify(attended.value));
      }
    })
    .catch(error => console.log(error));
}

onMounted(() => {
    loginStatusCheck();
});
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 1200px;
  margin: 0px auto;
}

.nav {
  width: 30%;
  height: 100%;
}

.body-wrapper{
  display: flex;
  height: 850px;
}

</style>
