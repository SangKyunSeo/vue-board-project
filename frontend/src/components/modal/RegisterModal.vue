<template>
    <div class="register-modal-section">
        <div class="register-modal-content">
            <div class="register-modal-body">
                <RegisterTitle />
                <form class="register-modal-form">
                    <div class="input-nickname">
                        <label>닉네임</label>
                        <input type="text" id="userName" placeholder="닉네임 입력" v-model="userName">
                    </div>
                    <div class="input-id">
                        <label>ID</label>
                        <input type="text" id="userId" placeholder="아이디 입력" v-model="userId" @keyup="duplicateCheckInit">
                    </div>
                    <div class="id-duplicate">
                        <button @click.prevent="checkDuplicate">중복확인</button>
                        <span v-if="duplicateCheck === 1" style="color: blue;"> 사용가능</span>
                        <span v-if="duplicateCheck === 2" style="color: red;">중복</span>
                    </div>
                    <div class="input-pw">
                        <label>PW</label>
                        <input type="password" id="userPw" placeholder="비밀번호 입력" v-model="userPw">    
                    </div>                    
                    <div class="input-re-pw">
                        <label>PW확인</label>            
                        <input type="password" id="userPwCheck" placeholder="비밀번호 재입력" v-model="userPwCheck">
                    </div>                    
                    <div class="input-gender">
                        <label for="male">남자</label>
                        <input type="radio" v-model="radioValue" value="male" id="male" name="gender" checked>
                        <label for="female">여자</label>
                        <input type="radio" v-model="radioValue" value="female" id="female" name="gender">
                    </div>
                    <div class="input-buttons">
                        <button @click.prevent="register">확인</button>
                        <button @click.prevent="close">취소</button>
                    </div>
                </form>  
            </div>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 회원가입 모달
 *    - menu: 메인 > 로그인 > 회원가입
 *    - layout: RegisterModal
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import RegisterTitle from '../title/RegisterTitle.vue'
import { defineEmits } from 'vue'
import { ref, inject } from 'vue';

const emit = defineEmits(['registerModalCheck']);
const axios = inject('$axios');

let userName = ref('');
let userId = ref('');
let userPw = ref('');
let userPwCheck = ref('');
let radioValue = ref('');
let duplicateCheck = ref(0);

// 회원가입 모달창 닫기 시 데이터 전달
function close(){
    emit('registerModalCheck', false);
}

// 아이디 중복 시 중복 상태 변경
function duplicateCheckInit(){
    duplicateCheck.value = 0;
}

// 아이디 중복 체크 API
async function checkDuplicate(){
    if(userId.value === ''){
        alert('ID를 입력하세요');
        return;
    }

    await fetch('http://localhost:3000/api/register/idDuplicateCheck',{
       method: 'POST',
       headers: {'Content-Type' : 'application/json'},
       body: JSON.stringify({
            id : userId.value
       }) 
    })
    .then(res => res.json())
    .then(data => {
        if(data.length === 0){
            duplicateCheck.value = 1;
        }else{
            duplicateCheck.value = 2;
            userId.value = '';
        }
    });
}

// 회원가입 버튼 클릭 시
async function register(){
    if(userName.value === ''){
        alert('닉네임을 입력하세요');
        return;
    }

    if(userId.value === ''){
        alert('ID를 입력하세요');
        return;
    }

    if(userPw.value === ''){
        alert('PW를 입력하세요');
        return;
    }

    if(userPwCheck.value === '' || userPw.value !== userPwCheck.value){
        alert('PW를 확인하세요');
        userPwCheck.value == '';
        return;
    }

    if(duplicateCheck.value !== 1){
        alert('ID 중복 검사를 진행하세요');
        return;
    }

    const registerVO = {
        memberName : userName.value,
        memberId : userId.value,
        memberPw : userPw.value,
        memberGender : radioValue.value
    }

    await axios.post('/api/register/',registerVO,{
        method : 'POST',
        headers: {'Content-Type' : 'application/json'},
    })
    .then(res => {
        alert(res.data);
        close();
    })
    .catch(error => console.log(error));
}

</script>
<style scoped>
.register-modal-section{
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
.register-modal-body{
    width: 500px;
    height: 400px;
    padding: 30px 30px;
    margin: 0 auto;
    border: 1px solid #777;
    background-color: #fff;
}

.register-modal-form{
    width: 100%;
}
.register-modal-form div{
    padding: 5px;
}
.input-nickname, .input-id, .input-re-pw, .input-pw, .id-duplicate{
    width: 60%;
    display : flex;
    margin: 10px auto;
    justify-content: space-between;
    border-bottom : 1px solid #eee;
}
.input-nickname input, .input-id input, .input-re-pw input, .input-pw input{
    border: none;
}
.input-nickname input, .input-id input, .input-re-pw input, .input-pw input:focus{
    outline: none;
}
.input-gender{
    display: flex;
    width: 60%;
    margin: 0 auto;
}

.register-modal-form label{
    margin-left : 0;
    text-align: left;
    font-weight: bold;
}
.id-duplicate span{
    font-weight: bold;
    margin: 0 auto;
}
.id-duplicate button{
    background : none;
    border: 1px solid #ff9496;
    cursor : pointer;
}
.id-duplicate button:hover{
    border : 1px solid #fc4245;
    font-weight: bold;
}
.input-buttons{
    width : 24%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
}
.input-buttons button{
    background: #eee;
    border: none;
    cursor : pointer;
    font-size: 14px;
    padding: 10px;
}
.input-buttons button:hover{
    background: gray;
    color: white;
}
</style>