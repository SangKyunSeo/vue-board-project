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

const check = (data) => {
    loginModalState.value = data;
}

const close = (data) => {
    loginModalState.value = data;
}

const registerModalCheck = (data) => {
    registerModalState.value = data;
    loginModalState.value = false;
}

const registerClose = (data) => {
    registerModalState.value = data;
}

const logoutCheck = (data) => {
    if(data === true){
        loginState.value = false;
        store.$reset();
        localStorage.clear();
        userInfo.value = JSON.parse(localStorage.getItem('user'));
    }
}

function loginStatusCheck(){
    userInfo.value = JSON.parse(localStorage.getItem('user'));
    console.log(userInfo.value);
    if(userInfo.value === null || userInfo.value.memberName === '') loginState.value = false;
    else {
      loginState.value = true;
      getTodayAttend();
    }
}

const pointUpdate = (data) => {
  if(data){
    alert('출석버튼 클릭!');
    userPoint.value = getMyPoint.value.getMyPoint();
    console.log(userPoint.value);
  }
}

const loginSuccess = (data) => {
    if(data === true){
        loginState.value = true;
        userInfo.value = JSON.parse(localStorage.getItem('user'));
        // 로그인 성공 시 금일 출석 정보 조회
        getTodayAttend();
    }
}

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
