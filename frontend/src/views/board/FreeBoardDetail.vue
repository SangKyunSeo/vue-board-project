<template>
    <div v-if="boardDetail !== undefined" class="free-board-detail-section">
        <div class="board-title">
            <h1>{{ boardDetail.boardTitle }}</h1>
        </div>
        <div class="board-main">
            <div class="board-info">
                <span class="board-writer">작성자 : <b>{{ boardDetail.memberName }}</b></span>
                <span v-if="boardDetail.boardMdate === null" class="board-date">등록일 : <b>{{
                    boardDetail.boardRegdate.slice(0, 10) }}</b></span>
                <span v-else class="board-date">수정일 : {{ boardDetail.boardMdate.slice(0, 10) }}</span>
            </div>
            <div class="board-fav">
                <span class="board-hit"> 조회수 {{ boardDetail.boardHit }} </span>
                <span class="board-reple"> 댓글수 {{ repleTotalCount }}</span>
                <button v-if="getUserNum === boardDetail.memberNum" class="board-update-button"
                    @click="modalOpen">수정</button>
                <button v-if="getUserNum === boardDetail.memberNum" class="board-delete-button"
                    @click="deleteBoard">삭제</button>
            </div>
            <div class="board-content">
                {{ boardDetail.boardContent }}
            </div>
            <div v-if="imageList.length > 0" class="image-file-section">
                <img v-for="(image, index) in imageList" :key="index" :src="image.fileUrl">
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
                    <textarea class="reple-write-content" id="repleContent" v-model="repleContent"
                        maxlength="1000"></textarea>
                    <p>{{ 1000 - repleContent.length }}</p>
                    <div class="reple-write-buttons">
                        <button class="reple-write-check" @click="registReple">확인</button>
                        <button class="reple-write-cancel" @click="cancelRegistReple">취소</button>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <RepleList v-if="reSortList.length > 0" :repleList="reSortList" @updateReply="updateReplyData"
            :boardDetail="boardDetail" />
        <BoardUpdateModal v-if="updateModalOpen" :boardDetail="boardDetail" @updateModalClose="modalClose"
            @updatedBoardDetail="updatedData" />
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 자유 게시판 상세
 *    - menu: 메인 > 자유 카테고리 > 자유 글 상세
 *    - layout: FreeBoardDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231129
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import RepleList from '../../components/body/RepleList.vue';
import BoardUpdateModal from '@/components/modal/BoardUpdateModal.vue';
import { ref, inject, onBeforeMount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../stores/user-store';
import { storeToRefs } from 'pinia';
import router from '@/router';


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
let updateModalOpen = ref(false);

const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
const day = date.getDate < 10 ? '0' + date.getDate() : date.getDate();
const today = year + '/' + month + '/' + day;
const todayRepleCount = ref(0);
const reSortList = ref([]);
const parentReple = ref([]);
const imageList = ref([]);


// 자유글 조회 API
async function getBoardDetail() {
    await axios.get('/api/board/boardDetail', {
        params: {
            boardNum: boardNum
        }
    })
        .then(res => {
            boardDetail.value = res.data;
            getImageFiles();
        })
        .catch(error => console.log(error));
}

// 자유글 이미지 파일 조회 API
async function getImageFiles() {
    await axios.get('/api/board/getImageFiles', {
        params: {
            boardNum: boardNum
        }
    })
        .then(res => {
            imageList.value = res.data;
        })
        .catch(error => console.log(error));
}

// 좋아요 눌렀는지 확인
async function getMyFav() {
    await axios.get('/api/fav/getMyFav', {
        params: {
            memberNum: getUserNum.value,
            boardNum: boardNum
        }
    })
        .then(res => {
            if (res.data === true) isRegistFav.value = true;
            else isRegistFav.value = false;
        })
        .catch(error => console.log(error));
}

// 좋아요 등록
async function registFav(event) {
    event.preventDefault();
    if (getUserNum.value === '' || getUserNum.value === undefined || getUserNum.value === 0) {
        alert('로그인이 필요합니다.');
        return;
    }

    if (getUserNum.value !== boardDetail.value.memberNum) {
        if (isRegistFav.value === false) {
            await axios.post('/api/fav/registFav', {
                boardNum: boardNum,
                memberNum: getUserNum.value
            }, {
                method: 'POST',
                header: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    if (res.data === true) {
                        isRegistFav.value = true;
                        getFavCount();
                    }
                    else console.log('데이터 통신 오류');
                })
                .catch(error => console.log(error));
        } else {
            await axios.post('/api/fav/deleteFav', {
                boardNum: boardNum,
                memberNum: getUserNum.value
            }, {
                method: 'POST',
                header: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    if (res.data === true) {
                        isRegistFav.value = false;
                        getFavCount();
                    } else {
                        console.log('데이터 통신 오류');
                    }
                })
                .catch(error => console.log(error));
        }
    } else {
        alert('자신의 글에는 좋아요를 등록할 수 없습니다!');
        return;
    }
}

// 좋아요 개수 조회
async function getFavCount() {
    await axios.get('/api/fav/count', {
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
function showRegistReple(event) {
    event.preventDefault();

    if (getUserNum.value === boardDetail.value.memberNum) {
        alert('본인 글에는 댓글을 작성할 수 없습니다!');
        return;
    }


    if (getUserNum.value === null || getUserNum.value === '' || getUserNum.value === 0) {
        alert('로그인 해주세요.');
        return;
    }

    console.log('오늘 작성한 댓글 수' + todayRepleCount.value);

    if (todayRepleCount.value >= 5) {
        alert('하루에 5개의 댓글을 작성할 수 있습니다.');
        return;
    }

    showRepleForm.value = true;
}

// 금일 댓글 작성 개수 구하기
async function getTodayRepleCount() {
    console.log('금일 : ' + today);
    await axios.get('/api/reple/getTodayRepleCount', {
        params: {
            memberNum: getUserNum.value,
            today: today
        }
    })
        .then(res => {
            console.log(res.data[0].count);
            todayRepleCount.value = res.data[0].count;
        })
        .catch(error => console.log(error));
}

// 댓글 작성 창 취소
function cancelRegistReple(event) {
    event.preventDefault();

    repleContent.value = '';
    showRepleForm.value = false;
}


// 댓글 등록 API (depth = 0) 최상위 부모에 해당됨
async function registReple() {

    // reple_num 가져오기
    await axios.get('/api/reple/getRepleNum')
        .then(res => {
            console.log(res.data.repleNum);

            axios.post('/api/reple/writeReple', {
                repleNum: res.data.repleNum,
                memberNum: getUserNum.value,
                boardNum: boardNum,
                repleContent: repleContent.value,
                groupId: res.data.repleNum,
                repleDepth: 0,
                childNums: 0,
                parentId: 0
            }, {
                method: 'POST',
                header: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    if (res.data) {
                        repleContent.value = '';
                        showRepleForm.value = false;
                        addPointReple();
                        getRepleList();
                        getRepleTotalCount();
                        location.reload();
                    } else console.log('댓글 작성 오류');
                })
                .catch(error => console.log(error));

        })
        .catch(error => console.log(error));

}

// 댓글 목록 API (재귀 쿼리를 사용해 정렬해서 가져옴)
async function getRepleList() {
    await axios.get('/api/reple/getRepleList', {
        params: {
            boardNum: boardNum
        }
    })
        .then(res => {
            repleList.value = res.data;
            initReSortList();
            getParentReple();
            for (let reple of parentReple.value) {
                reSortList.value.push(reple);
                reSort(reple, repleList.value);
            }
        })
        .catch(error => console.log(error));
}

// 최상위 부모 댓글 배열 구하기
function getParentReple() {
    for (let reple of repleList.value) {
        if (reple.parentId === 0) parentReple.value.push(reple);
    }
}

// DFS를 사용해 댓글 목록 재정렬
function reSort(reple, repleList) {
    for (let i = 0; i < repleList.length; i++) {
        if (reple.repleNum === repleList[i].parentId) {
            reSortList.value.push(repleList[i]);
            //reSort(repleList[i], repleList.slice(i, repleList.length));
            reSort(repleList[i], repleList);
        }
    }
}
// 부모 댓글, 재정렬된 댓글 초기화
function initReSortList() {
    reSortList.value.length = 0;
    parentReple.value.length = 0;
}

// 포인트 20 누적
async function addPointReple() {
    await axios.post('/api/point/addPointReple', {
        memberNum: getUserNum.value,
        pointCate: 4,
        pointScore: 20,
        pointType: 1
    }, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.data) {
                store.setUserPoint(getUserPoint.value + 20);
                localStorage.setItem('memberPoint', getUserPoint.value);
            }
        })
        .catch(error => console.log(error));
}

// 댓글 수 조회
async function getRepleTotalCount() {
    await axios.get('/api/reple/getRepleTotalCount', {
        params: {
            boardNum: boardNum
        }
    })
        .then(res => {
            repleTotalCount.value = res.data[0].count
        })
        .catch(error => console.log(error));
}

// 수정 모달창 띄우기
function modalOpen() {
    updateModalOpen.value = true;
}

// 수정 모달창 감추기
const modalClose = (data) => {
    if (data) updateModalOpen.value = false;
}

// 수정된 데이터 반영
const updatedData = (data) => {
    boardDetail.value.boardTitle = data.boardTitle;
    boardDetail.value.boardContent = data.boardContent;
}

const updateReplyData = (data) => {
    if (data) {
        initReSortList();

        getRepleList();
        getRepleTotalCount();
    }
}

// 게시글 삭제
async function deleteBoard(event) {
    event.preventDefault();
    if (getUserNum.value !== boardDetail.value.memberNum) {
        alert('본인이 작성한 글만 삭제 가능!');
        return;
    }

    if (window.confirm('정말로 삭제하시겠습니까?')) {
        await axios.post('/api/board/deleteBoard', {
            memberNum: getUserNum.value,
            boardNum: boardDetail.value.boardNum,
            imageList: imageList.value
        }, {
            method: 'POST',
            header: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.data) {
                    alert('삭제가 완료되었습니다.');
                    router.push('/');
                } else console.log('삭제 통신 오류');
            })
            .catch(error => console.log(error));
    }
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
.free-board-detail-section {
    width: 70%;
}

.board-main {
    width: 80%;
    margin: 0px auto;
}

.board-info {
    display: flex;
    margin: 40px 0 10px 0;
    padding: 0 0 20px 0;

}

.board-writer b {
    color: skyblue;
}

.board-fav {
    margin: 10px 0 30px 0;
    display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.board-fav span {
    margin-right: 20px;
    color: #808080;
}

.fav-button {
    cursor: pointer;
}

.board-date {
    display: inline-block;
    margin-left: auto;
}

.board-content {
    height: 300px;
    text-align: left;
    font-size: 18px;
}

.image-file-section img {
    width: 100%;
    margin-top: 40px;
}

.board-buttons {
    width: 80%;
    margin: 30px auto;
    text-align: left;
}

.board-button-fav {
    margin-bottom: 30px;
}

.board-button-reple {
    font-size: 20px;
    border-top: 1px solid #eee;
}

.reple-button {
    width: 100%;
    border: 1px solid #eee;
    padding: 20px;
    cursor: pointer;
    background-color: white;
    font-size: 20px;
}

.reple-write-section {
    text-align: center;
}

.reple-write-content {
    width: 90%;
    height: 100px;
    font-size: 20px;
}

.reple-write-buttons {
    text-align: right;
    width: 90%;
}

.reple-write-buttons button {
    background-color: transparent;
    border: 0.5px solid #eee;
    padding: 10px;
    cursor: pointer;
}

.reple-write-check {
    margin-right: 20px;
}

hr {
    width: 80%;
    border: 0.5px solid #eee;
}

.board-update-button {
    margin-left: auto;
    margin-right: 10px;
    background: none;
    border: 1px solid #eee;
    padding: 5px 13px;
    cursor: pointer;
}

.board-delete-button {
    background: none;
    border: 1px solid #eee;
    padding: 5px 13px;
    cursor: pointer;
}
</style>