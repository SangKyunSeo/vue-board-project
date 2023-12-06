<template>
    <div class="update-myInfo-section">
        <ul class="my-info-list">
            <li>
                <span class="title">이름 </span>
                <input type="text" class="user-name" v-model="memberName">
            </li>
            <li>
                <span class="title">성별 </span>
                <span class="content">{{ userDetail.memberGender === 1 ? '남자' : '여자' }}</span>
            </li>
            <li>
                <span class="title">아이디 </span>
                <span class="content">{{ userDetail.memberId }}</span>
            </li>
            <li>
                <span class="title">가입일 </span>
                <span class="content">{{ String(userDetail.memberRegdate).slice(0,10) }}</span>
            </li>
        </ul>
        <div class="update-modal-buttons">
            <button class="updateCheck" @click="updateInfo">확인</button>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 내 정보 수정 모달 body
 *    - menu: 메인 > 마이페이지 > 수정 버튼 
 *    - layout: MyPage
 *    - dev: 서상균
 *    - devVersion : 01_20231206
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { ref, inject, defineProps, defineEmits } from 'vue';
import { useUserStore } from '@/stores/user-store'

const emit = defineEmits(['closeModal','changeName']);
const store = useUserStore();
const props = defineProps({
    userDetail : {
        type : Object
    }
});
const axios = inject('$axios');


let memberName = ref(props.userDetail.memberName);

// 내 정보 수정 API (이름)
async function updateInfo(event){
    event.preventDefault();
    
    if(memberName.value === ''){
        alert('수정할 이름을 입력하세요!');
        return;
    }

    await axios.post('/api/member/updateName',{
        memberNum : props.userDetail.memberNum,
        memberName : memberName.value
    }, {
        method : 'POST',
        header : {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data){
            store.setUserName(memberName.value);
            localStorage.setItem('user', JSON.stringify({memberName : memberName.value, memberNum : props.userDetail.memberNum, memberAuth : props.userDetail.memberAuth, memberRegdate : props.userDetail.memberRegdate}));
            emit('closeModal', true);
            emit('changeName', true);
        }else console.log('데이터 통신 오류');
    })
    .catch(error => console.log(error));
}


</script>
<style scoped>
.my-info-list{
    list-style: none;
    text-align: left;
}
.my-info-list li{
    display: flex;
    padding : 10px;
}
.title{
    display: block;
    width: 100px;
    font-style : italic;
    font-weight : bold;
    font-size : 16px;
}
.my-info-update-button{
    width : 70%;
    margin : 0px auto;
}
</style>