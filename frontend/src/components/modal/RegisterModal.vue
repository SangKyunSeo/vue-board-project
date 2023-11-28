<template>
    <div class="register-modal-section">
        <RegisterTitle />
        <form class="register-modal-form">
            <span>닉네임</span>
            <input type="text" id="userName" placeholder="닉네임 입력" v-model="userName">
            <br>
            <span>ID</span>
            <input type="text" id="userId" placeholder="아이디 입력" v-model="userId" @keyup="duplicateCheckInit">
            <button @click.prevent="checkDuplicate">중복확인</button>
            <span v-if="duplicateCheck === 1" style="color: blue;"> 사용가능</span>
            <span v-if="duplicateCheck === 2" style="color: red;">중복</span>
            <br>
            <span>PW</span>
            <input type="password" id="userPw" placeholder="비밀번호 입력" v-model="userPw">
            <br>
            <span>PW확인</span>            
            <input type="password" id="userPwCheck" placeholder="비밀번호 재입력" v-model="userPwCheck">
            <br>
            <label for="male">남자</label>
            <input type="radio" v-model="radioValue" value="male" id="male" name="gender" checked>
            <label for="female">여자</label>
            <input type="radio" v-model="radioValue" value="female" id="female" name="gender">
            <br>
            <button @click.prevent="register">확인</button>
            <button @click.prevent="close">취소</button>
        </form>  
    </div>
</template>
<script setup>
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

function close(){
    emit('registerModalCheck', false);
}

function duplicateCheckInit(){
    duplicateCheck.value = 0;
}

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
        }
    });
}

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