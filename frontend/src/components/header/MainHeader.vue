<template>
    <div class="main-header-section">
        <TitleHeader @goHome="moveHome"/>
        <CategoryHeader ref="initHeaderStyle"/>
        <div class="attend-section" v-if="!getUserAttend && getUserNum !== '' && getUserNum !== 0">
            <button type="button" class="attend-button" @click="todayAttend">출석</button>
        </div>
        <div class="myPage-section" v-if="getUserNum !== 0 && getUserNum !== ''">
            <button type="button" class="myPage-button" @click="goMyPage">마이페이지</button>
        </div>
        <div class="write-section">
            <button type="button" class="write-button" @click="writeBoard">글쓰기</button>
        </div>
    </div>

</template>
<script setup>
/**
 * @description
 *    - title: 메인화면 헤더
 *    - menu: 메인 
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

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
const {getUserAttend, getUserPoint, getUserNum} = storeToRefs(store);
const emit = defineEmits(['pointUpdated']);

// 글쓰기 버튼 클릭 시
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

// Title Header 클릭 시
const moveHome = (data) => {
    if(data){
        initHeaderStyle.value.initHeaderStyle();
        router.push('/');
    }
}

// 출석 버튼 클릭 시 출석 포인트 제공 API
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

// 출석 버튼 클릭 시 금일 출석 내용 삽입 API
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

// 마이페이지 이동
function goMyPage(){
    router.push('/myPage');
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
.myPage-section{
    display: flex;
    align-items : center;
    margin-right: 10px;
}
.myPage-button{
    width: 80px;
    height: 40px;
    border: none;
    background-color:plum;
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