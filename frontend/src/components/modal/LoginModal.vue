<template>
    <div class="login-modal-section">
        <div class="login-modal-content">
            <div class="login-modal-body">
                <LoginTitle />
                <form class="login-modal-form">
                    <div class="input-id-section">
                        <label>ID</label>
                        <input type="text" id="loginId" placeholder="아이디 입력" v-model="userId">
                    </div>
                    <div class="input-pw-section">
                        <label>PW</label>
                        <input type="password" id="loginPw" placeholder="비밀번호 입력" v-model="userPw" autocomplete="off">
                    </div>
                    <div class="input-buttons">
                        <button @click.prevent="login">확인</button>
                        <button @click.prevent="registerForm">회원가입</button>
                        <button @click="close">닫기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: 로그인 모달
 *    - menu: 메인 > 로그인 버튼 > 
 *    - layout: LoginModal
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import LoginTitle from '../title/LoginTitle.vue'
import { defineEmits } from 'vue';
import { ref, inject } from 'vue';
import { useUserStore } from '../../stores/user-store'
import { storeToRefs } from 'pinia';

const emit = defineEmits(['loginModalCheck', 'registerCheck', 'loginStatusCheck']);
const axios = inject('$axios');
const store = useUserStore();
const {getUserName, getUserNum, getUserAuth, getUserRegdate} = storeToRefs(store);

let userId = ref('');
let userPw = ref('');

// 로그인 모달창 닫기 시 데이터 전달
function close(){
    emit('loginModalCheck', false);
}

// 로그인 버튼 클릭 시 로그인 진행 API
async function login(){
    if(userId.value === '') {
        alert('아이디를 입력하세요!');
        return;
    }

    if(userPw.value === '') {
        alert('비밀번호를 입력하세요!');
        return;
    }

    const loginVO = {
        memberId : userId.value,
        memberPw : userPw.value
    }
    await axios.post('/api/login', loginVO, {
        method : 'POST',
        headers: {'Content-Type' : 'application/json'},
    })
    .then(res => {
        if(res.data.length > 0){
            store.setUserInfo(res.data[0].member_name, res.data[0].member_num, res.data[0].member_auth, res.data[0].member_regdate);
            localStorage.setItem('user',JSON.stringify({memberName: getUserName.value, memberNum: getUserNum.value, memberAuth: getUserAuth.value, memberRegdate: getUserRegdate.value}));
            console.log(getUserName.value + ',' + getUserNum.value + ',' + getUserAuth.value + ',' + getUserRegdate.value);
            emit('loginStatusCheck', true);
            close();
        }else{
            alert('회원정보가 없습니다.');
        }
    })
    .catch(error => console.log(error));
}

// 회원가입 버튼 클릭 시 데이터 전달
function registerForm(){
    emit('registerCheck', true);
}

</script>

<style scoped>
.login-modal-section{
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.login-modal-body{
    width: 300px;
    height: 300px;
    padding: 30px 30px;
    margin: 0 auto;
    border: 1px solid #777;
    background-color: #fff;
}

.input-id-section{
    width : 100%;
    margin-top : 10px;
}
.input-pw-section{
    width : 100%;
    margin-top : 10px;
}

.login-modal-form label{
    display : inline-block;
    width: 15%;
    text-align: left;
    font-weight: bold;
}

.login-modal-form input{
    border: none;
    border-bottom: 1px solid gray;
}
.login-modal-form input:focus{
    outline: none;
}
.input-buttons{
    display: flex;
    justify-content: space-between;
    padding: 40px;   
}

.input-buttons button{
    border: none;
    background: none;
    cursor: pointer;
    background-color:seashell;
    font-size: 14px; 
    padding: 10px;
}
.input-buttons button:hover{
    font-weight: bold;
}
</style>