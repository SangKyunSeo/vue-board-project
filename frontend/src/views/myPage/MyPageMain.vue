<template>
    <div class="myPage-section">
        <MainBodyHeader :msg="msg"/>
        <MyPageBody v-show="viewState === 0" :userDetail="userDetail" @changeName="change" @getMyBoard="getMyBoardDetail" @getMyPointDetail="goMyPointDetail"/>
        <MyBoardBody v-if="viewState === 1" :boardList="freeBoardList" :boardCategory="viewState" @toggle="changeViewState"/>
        <MyBoardBody v-if="viewState === 2" :boardList="anonyBoardList" :boardCategory="viewState" @toggle="changeViewState"/>
        <MyPointBody v-if="viewState === 3" @toggle="changeViewState" :myPointDetail="myPointDetail" :myGamePointDetail="myGamePointDetail"/>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 마이페이지
 *    - menu: 메인 > 마이페이지 카테고리 > 마이페이지
 *    - layout: MyPage
 *    - dev: 서상균
 *    - devVersion : 01_20231206
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */
import MainBodyHeader from '../../components/header/MainBodyHeader.vue';
import MyPageBody from '../../components/body/MyPageBody.vue';
import MyBoardBody from '../../components/body/MyBoardBody.vue';
import MyPointBody from '../../components/body/MyPointBody.vue';

import { ref, onMounted, inject } from 'vue'
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

const axios = inject('$axios');
const store = useUserStore();
const { getUserNum } = storeToRefs(store);
const msg = ref('마이페이지');
const userDetail = ref({});
let viewState = ref(0);
const freeBoardList = ref([]);
const anonyBoardList = ref([]);
const myPointDetail = ref([]);
const myGamePointDetail = ref([]);

// 사용자 상세 조회 API
 const getUserDetail = async () => {
    await axios.get('/api/member/getMemberDetail', {
        params : {
            memberNum : getUserNum.value
        }
    })
    .then(res => {
        userDetail.value = res.data;
    })
    .catch(error => console.log(error));
}

// 이름 수정 후 데이터 재 조회 API
const change = (data) => {
    if(data){
        getUserDetail();
    }
}

// 내가 쓴 자유글 1개 이상일 때 리스트 조회
async function getMyFreeBoardList(){
    await axios.get('/api/member/getMyFreeBoardList', {
        params : {
            memberNum : getUserNum.value,
            boardCategory : viewState.value
        }
    })
    .then(res => {
        freeBoardList.value = res.data;
    })
    .catch(error => console.log(error));
}

// 내가 쓴 익명글 1개 이상일 때 리스트 조회
async function getMyAnonyBoardList(){
    await axios.get('/api/member/getMyAnonyBoardList', {
        params : {
            memberNum : getUserNum.value,
            boardCategory : viewState.value
        }
    })
    .then(res => {
        anonyBoardList.value = res.data;
    })
    .catch(error => console.log(error));
}

// 자유글 , 익명글 토글
const changeViewState = (data) => {
    viewState.value = data;
}

// 내가 쓴 글 내역으로 이동
const getMyBoardDetail = (data) => {
    viewState.value = data;
    if(viewState.value === 1 && userDetail.value.freeCount > 0) getMyFreeBoardList();
    if(viewState.value === 2 && userDetail.value.anonyCount > 0) getMyAnonyBoardList();
}

// 그냥 내 포인트 조회
async function getPointDetail(){
    await axios.get('/api/point/getMyPointDetail', {
        params : {
            memberNum : getUserNum.value
        }
    })
    .then(res => {
        console.log(res);
        myPointDetail.value = res.data;
    })
    .catch(error => console.log(error));
}

// 게임 관련 내 포인트 조회
async function getGamePointDetail(){
    await axios.get('/api/point/getMyGamePointDetail', {
        params : {
            memberNum : getUserNum.value
        }
    })
    .then(res => {
        console.log(res);
        myGamePointDetail.value = res.data;
    })
    .catch(error => console.log(error));
}


// 내 포인트 내역으로 이동
const goMyPointDetail = (data) =>{
    if(data) viewState.value = 3;
}

onMounted(()=>{
    getUserDetail();
    getPointDetail();
    getGamePointDetail();
});

</script>


<style scoped>

.myPage-section{
    width: 70%;
}

</style>