<template>
    <div class="nav-menu-section">
        <div class="profile-section"></div>
        <div class="info-section">
            <div class="user-name-section">
                {{ getUserName }} <br>
                포인트 : {{ getUserPoint.toLocaleString('ko-KR') }} 점
            </div>
            <div class="user-regdate-section">
                가입한지 {{  parseInt(Number(new Date() - new Date(user.memberRegdate))/86400000) }}일째
            </div>
            <div class="user-write-section">
                내가 쓴 글 {{ myBoardCount }} 개
            </div>
            <div class="user-fav-section">
                관심 글 {{ myReactionTotal + myFreeTotal }} 개
            </div>
        </div>
        <div class="login-button-section">
            <button class="login-btn" @click="logout">로그아웃</button>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 로그인 한 이후 네비게이션
 *    - menu: 메인 > 로그인 후 > 
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { defineProps, defineEmits, defineExpose, onMounted, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user-store';
import { storeToRefs } from 'pinia';

const router = new useRouter();
const axios = inject('$axios');
const store = useUserStore();
const { getUserPoint, getUserName } = storeToRefs(store);

let myBoardCount = ref(0);
let myPoint = ref(0);
let myReactionTotal = ref(0);
let myFreeTotal = ref(0);


const props = defineProps({
    user : {
        type: Object
    },
    userPoint : {
        type: Number
    }
});


const emit = defineEmits(['logout']);

// 로그아웃 버튼 클릭 시 데이터 전달 및 URI 이동
function logout(){
    emit('logout', true);
    router.push('/');
}

// 내가 쓴 글 개수 조회 API
async function getMyBoardCount(){
    const memberNum = props.user.memberNum;
    await axios.get('/api/main/myBoardCount', {
        params: {
            memberNum : memberNum
        }
    })
    .then(res => {
        console.log(res.data);
        myBoardCount.value = res.data[0].count;
    })
    .catch(error => console.log(error));
}

// Store에 내 현재 포인트 저장 API
async function setMyPointForStore(){
    const memberNum = props.user.memberNum;
    await axios.get('/api/main/getMyPoint',{
        params: {
            memberNum: memberNum
        }
    })
    .then(res => {
        store.setUserPoint(res.data[0].pointScore === null ? 0 : res.data[0].pointScore);
        localStorage.setItem('memberPoint', getUserPoint.value);
    })
    .catch(error => console.log(error));
}

// Store에 저장된 내 포인트 조회
function getMyPoint(){
    myPoint.value = getUserPoint.value;
    return getUserPoint.value;
}


// 관심글 개수 구하기
async function getInteresting(){
    // 익명글 반응 한 개수 구하기
    await axios.get('/api/react/myTodayReaction',{
        params: {
            memberNum : props.user.memberNum
        }
    })
    .then(res => {
        myReactionTotal.value = res.data.count;
        console.log(myReactionTotal.value);
       
       
    })
    .catch(error => console.log(error));

    // 자유글 관심 글 개수 구하기 
    await axios.get('/api/board/myFreeInterestTotal', {
        params: {
            memberNum : props.user.memberNum
        }
    })
    .then(res => {
        myFreeTotal.value = res.data.count;
    })  
    .catch(error => console.log(error));
}




defineExpose({
    getMyPoint
});

onMounted(()=>{
    getMyBoardCount();
    setMyPointForStore();
    getMyPoint();
    getInteresting();
    
});

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
.user-name-section{
    height: 25%;
}
.user-regdate-section{
    height: 25%;
}
.user-write-section{
    height: 25%;
}
.user-fav-section{
    height: 25%;
}
</style>