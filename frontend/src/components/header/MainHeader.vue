<template>
    <div class="main-header-section">
        <TitleHeader @goHome="moveHome"/>
        <CategoryHeader ref="initHeaderStyle"/>
        <div class="attend-section" v-if="!getUserAttend">
            <button type="button" class="attend-button" @click="todayAttend">출석</button>
        </div>
        <div class="write-section">
            <button type="button" class="write-button" @click="writeBoard">글쓰기</button>
        </div>
    </div>

</template>
<script setup>
import TitleHeader from './TitleHeader.vue';
import CategoryHeader from './CategoryHeader.vue';
import { defineProps, ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user-store'
import { storeToRefs } from 'pinia';
import axios from 'axios';

const props = defineProps({
    user : {
        type: Object,
    }
});
const router = new useRouter();
const initHeaderStyle = ref();
const store = useUserStore();
const {getUserAttend, getUserPoint} = storeToRefs(store);
const emit = defineEmits(['pointUpdated']);

function writeBoard(){
    if(props.user === null || props.user.memberNum === ''){
        alert('로그인 후 글을 작성하세요');
        return;
    }else if(getUserPoint.value < 30){
        alert('자유게시판 글 작성은 30포인트, 익명게시판 글 작성은 50포인트가 필요합니다!');
        return;
    }
    else{
        initHeaderStyle.value.initHeaderStyle();
        router.push({path:'/writeBoard', query:{memberNum : props.user.memberNum}});
    }
}

const moveHome = (data) => {
    if(data){
        initHeaderStyle.value.initHeaderStyle();
        router.push('/');
    }
}

async function setAttendPoint(){
    await axios.post('/api/point/setAttendPoint', {
        memberNum : props.user.memberNum,
        pointScore: 100,
    }, {
        method : 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
        if(res.data){
            const currentPoint = getUserPoint.value + 100;
            console.log('출석 이후 포인트 : ' + currentPoint);
            store.setUserPoint(currentPoint);
            localStorage.setItem('memberPoint', currentPoint);  
            emit('pointUpdated', true);
        }else{
            console.log('포인트 누적 오류');
        }
    })
}

async function todayAttend(){

    await axios.post('/api/attend/setAttend', {
        memberNum: props.user.memberNum
    }, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
        if(res.data === true){
            store.setUserAttend(true);
            // 출석 데이터 삽입 성공 시 포인트 누적
            setAttendPoint();
        }else{
            console.log('출석 오류');
        }
    })
    .catch(error => console.log(error));
}

</script>
<style scoped>
.main-header-section{
    display: flex;
}

.attend-section{
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.attend-button{
    width: 75px;
    height: 40px;
    border: none;
    background-color: aquamarine;
    font-weight: bold;
    cursor: pointer;
}
.write-section{
    display: flex;
    align-items: center;
}
.write-button{
    width: 75px;
    height: 40px;
    border: none;
    background-color: beige;
    font-weight: bold;
    cursor: pointer;
}
.write-button:hover{
    background-color: lightgrey;
}
</style>