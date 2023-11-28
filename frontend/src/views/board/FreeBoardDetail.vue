<template>
    <div v-if="boardDetail !== undefined " class="free-board-detail-section">
        <div class="board-title">
            <h1>{{ boardDetail.boardTitle }}</h1>
        </div>
        <div class="board-main">
            <div class="board-info">
                <span class="board-writer">작성자 : <b>{{ boardDetail.memberName }}</b></span>
                <span v-if="boardDetail.boardMdate === null" class="board-date">등록일 : <b>{{ boardDetail.boardRegdate.slice(0,10) }}</b></span>
                <span v-else class="board-date">수정일 : {{ boardDetail.boardMdate.slice(0,10) }}</span>
            </div>
            <div class="board-fav">
                <span class="board-hit"> 조회수 {{ boardDetail.boardHit }} </span>
                <span class="board-reple"> 댓글수 {{ repleTotalCount }}</span>
            </div>
            <div class="board-content">
                {{ boardDetail.boardContent }}
            </div>
        </div>
        <div class="board-buttons">
            <div class="board-button-fav">
                <span v-if="!isRegistFav" class="fav-button" @click="registFav">🤍 {{ favCount }}</span>
                <span v-if="isRegistFav" class="fav-button" @click="registFav">💗 {{ favCount }}</span>
            </div>
            <div class="board-button-reple">
                <h5>댓글 {{ repleTotalCount }}</h5>
                <button v-if="!showRepleForm" class="reple-button" @click="showRegistReple">댓글을 남겨주세요.</button>
                <div v-else class="reple-write-section">
                    <textarea class="reple-write-content" id="repleContent" v-model="repleContent" maxlength="1000" ></textarea>
                    <p>{{ 1000 - repleContent.length }}</p>
                    <div class="reple-write-buttons">
                        <button class="reple-write-check" @click="registReple">확인</button>
                        <button class="reple-write-cancel" @click="cancelRegistReple">취소</button>
                    </div>
                </div>
            </div>
        </div>
        <hr >
        <RepleList v-if="repleList.length > 0" :repleList="repleList" />
    </div>
    
</template>
<script setup>
import RepleList from '../../components/body/RepleList.vue';
import { ref, inject, onBeforeMount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../stores/user-store';
import { storeToRefs } from 'pinia';

const axios = inject('$axios');
const route = new useRoute();
const boardDetail = ref();
const store = useUserStore();

const { getUserNum, getUserPoint } = storeToRefs(store);
const boardNum = route.query.boardNum;
const favCount = ref(0);

let isRegistFav = ref(false);
let showRepleForm = ref(false);
let repleContent = ref('');
let repleList = ref([]);
let repleTotalCount = ref(0);

const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1): date.getMonth() + 1;
const day = date.getDate < 10 ? '0' + date.getDate() : date.getDate();
const today = year + '/' + month + '/' + day; 
const todayRepleCount = ref(0);

async function getBoardDetail(){
    await axios.get('/api/board/freeBoardDetail',{
        params: {
            boardNum : boardNum
        }
    })
    .then(res => {
        boardDetail.value = res.data;
        
    })
    .catch(error => console.log(error));
}

// 좋아요 눌렀는지 확인
async function getMyFav(){
    await axios.get('/api/fav/getMyFav',{
        params: {
            memberNum : getUserNum.value,
            boardNum : boardNum
        }
    })
    .then(res => {
        if(res.data === true) isRegistFav.value = true;
        else isRegistFav.value = false;
    })
    .catch(error => console.log(error));
}

// 좋아요 등록
async function registFav(event){
    event.preventDefault();
    if(getUserNum.value === '' || getUserNum.value === undefined){
        alert('로그인이 필요합니다.');
        return;
    }

    if(getUserNum.value !== boardDetail.value.memberNum){
        if(isRegistFav.value === false){
            await axios.post('/api/fav/registFav',{
                boardNum: boardNum,
                memberNum : getUserNum.value
            }, {
                method: 'POST',
                header: {'Content-Type' : 'application/json'}
            })
            .then(res => {
                if(res.data === true) {
                    isRegistFav.value = true;
                    getFavCount();
                }
                else console.log('데이터 통신 오류');
            })
            .catch(error => console.log(error));
        }else{
            await axios.post('/api/fav/deleteFav',{
                boardNum: boardNum,
                memberNum : getUserNum.value
            },{
                method: 'POST',
                header: {'Content-Type' : 'application/json'}
            })
            .then(res => {
                if(res.data === true){
                    isRegistFav.value = false;
                    getFavCount();
                }else{
                    console.log('데이터 통신 오류');
                }
            })
            .catch(error => console.log(error));
        }
    }
}

// 좋아요 개수 조회
async function getFavCount(){
    await axios.get('/api/fav/count',{
        params: {
            boardNum: boardNum
        }
    })
    .then(res => {
        favCount.value = res.data[0].count;
    })
    .catch(error => console.log(error));
}

// 댓글 작성 창 띄우기
function showRegistReple(event){
    event.preventDefault();

    if(getUserNum.value === null || getUserNum.value === ''){
        alert('로그인 해주세요.');
        return;
    }

    console.log('오늘 작성한 댓글 수' + todayRepleCount.value);

    if(todayRepleCount.value >= 5){
        alert('하루에 5개의 댓글을 작성할 수 있습니다.');
        return;
    }

    showRepleForm.value = true;
}

// 금일 댓글 작성 개수 구하기
async function getTodayRepleCount(){
    console.log('금일 : ' + today);
    await axios.get('/api/reple/getTodayRepleCount', {
        params: {
            memberNum : getUserNum.value,
            today : today
        }
    })
    .then(res => {
        console.log(res.data[0].count);
        todayRepleCount.value = res.data[0].count;
    })
    .catch(error => console.log(error));
}

// 댓글 작성 창 취소
function cancelRegistReple(event){
    event.preventDefault();

    repleContent.value = '';
    showRepleForm.value = false;
}


// 댓글 등록 API
async function registReple(){
    await axios.post('/api/reple/writeReple', {
        memberNum : getUserNum.value,
        boardNum: boardNum,
        repleContent: repleContent.value
    },{
        method: 'POST',
        header: {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data){
            repleContent.value = '';
            showRepleForm.value = false;
            addPointReple();
            getRepleList();
            getRepleTotalCount();
        }else console.log('댓글 작성 오류');
    })
    .catch(error => console.log(error));
}

// 댓글 목록 API
async function getRepleList(){
    await axios.get('/api/reple/getRepleList', {
        params: {
            boardNum : boardNum
        }
    })
    .then(res => {
        repleList.value = res.data;
        console.log(repleList.value);
    })  
    .catch(error => console.log(error));
}

// 포인트 20 누적
async function addPointReple(){
    await axios.post('/api/point/addPointReple',{
        memberNum : getUserNum.value,
        pointCate : 4,
        pointScore : 20,
        pointType : 1
    },{
        method : 'POST',
        header: {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data){
            store.setUserPoint(getUserPoint.value + 20);
            localStorage.setItem('memberPoint', getUserPoint.value);
        }
    })
    .catch(error => console.log(error));
}

// 댓글 수 조회
async function getRepleTotalCount(){
    await axios.get('/api/reple/getRepleTotalCount',{
        params: {
            boardNum : boardNum
        }
    })
    .then(res => {
        repleTotalCount.value = res.data[0].count
    })
    .catch(error => console.log(error));
}

onBeforeMount(() => {
    getBoardDetail();
});

onMounted(() => {
    getMyFav();
    getFavCount();
    getTodayRepleCount();
    getRepleList();
    getRepleTotalCount();
});


</script>

<style scoped>

.free-board-detail-section{
    width: 70%;
}

.board-main{
    width: 80%;
    margin: 0px auto;
}

.board-info{
    display: flex;
    margin: 40px 0 10px 0 ;
    padding: 0 0 20px 0;

}
.board-writer b{
    color:skyblue;
}
.board-fav{
    margin: 10px 0 30px 0;
    display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}
.board-fav span{
    margin-right: 20px;
    color: #808080;
}

.fav-button{
    cursor: pointer;
}

.board-date{
    display: inline-block;   
    margin-left: auto;
}

.board-content{
    height: 300px;
    text-align: left;
    font-size: 18px;
}

.board-buttons{
    width: 80%;
    margin: 30px auto;
    text-align: left;
}
.board-button-fav{
    margin-bottom: 30px;
}
.board-button-reple{
    font-size: 20px;
    border-top: 1px solid #eee;
}
.reple-button{
    width: 100%;
    border: 1px solid #eee;
    padding: 20px;
    cursor: pointer;
    background-color: white;
    font-size: 20px;
}

.reple-write-section{
    text-align: center;
}
.reple-write-content{
    width: 90%;
    height: 100px;
    font-size: 20px;
}

.reple-write-buttons{
    text-align: right;
    width: 90%;
}
.reple-write-buttons button{
    background-color: transparent;
    border: 0.5px solid #eee;
    padding: 10px;
    cursor: pointer;
}
.reple-write-check{
    margin-right: 20px;
}

hr{
    width: 80%;
    border: 0.5px solid #eee;
}





</style>