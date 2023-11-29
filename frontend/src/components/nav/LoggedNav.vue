<template>
    <div class="nav-menu-section">
        <div class="profile-section"></div>
        <div class="info-section">
            <div class="user-name-section">
                {{ user.memberName }} <br>
                포인트 : {{ getUserPoint }} 점
            </div>
            <div class="user-regdate-section">
                가입한지 {{  parseInt(Number(new Date() - new Date(user.memberRegdate))/86400000) }}일째
            </div>
            <div class="user-write-section">
                내가 쓴 글 {{ myBoardCount }} 개
            </div>
            <div class="user-fav-section">
                관심 글
            </div>
        </div>
        <div class="login-button-section">
            <button class="login-btn" @click="logout">로그아웃</button>
        </div>
    </div>
</template>
<script setup>
import { defineProps, defineEmits, defineExpose, onMounted, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user-store';
import { storeToRefs } from 'pinia';

const router = new useRouter();
const axios = inject('$axios');
const store = useUserStore();
const { getUserPoint } = storeToRefs(store);

let myBoardCount = ref(0);
let myPoint = ref(0);

const props = defineProps({
    user : {
        type: Object
    },
    userPoint : {
        type: Number
    }
});


const emit = defineEmits(['logout']);
function logout(){
    emit('logout', true);
    router.push('/');
}

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

async function setMyPointForStore(){
    const memberNum = props.user.memberNum;
    await axios.get('/api/main/getMyPoint',{
        params: {
            memberNum: memberNum
        }
    })
    .then(res => {
        store.setUserPoint(res.data[0].pointScore === null ? 0 : res.data[0].pointScore);
        localStorage.setItem('memberPoint', myPoint.value);
    })
    .catch(error => console.log(error));
}

function getMyPoint(){
    myPoint.value = getUserPoint.value;
    return getUserPoint.value;
}

defineExpose({
    getMyPoint
});

onMounted(()=>{
    getMyBoardCount();
    setMyPointForStore();
    getMyPoint();
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