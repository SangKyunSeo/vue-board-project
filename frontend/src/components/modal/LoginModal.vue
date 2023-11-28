<template>
    <div class="login-modal-section">
        <LoginTitle />
        <button @click="close">닫기</button>
        <form class="login-modal-form">
            <span>ID</span>
            <input type="text" id="loginId" placeholder="아이디 입력" v-model="userId">
            <br>
            <span>PW</span>
            <input type="password" id="loginPw" placeholder="비밀번호 입력" v-model="userPw">
            <br>
            <button @click.prevent="login">확인</button>
            <button @click.prevent="registerForm">회원가입</button>
        </form>        
    </div>
</template>

<script setup>
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

function close(){
    emit('loginModalCheck', false);
}

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

function registerForm(){
    emit('registerCheck', true);
}

</script>