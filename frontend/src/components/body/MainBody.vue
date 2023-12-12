<template>
    <MainBodyHeader :msg="popularHeader"/>
    <div v-if="popularBoardList !== null" class="popular-board-article">
        <div :key="i" v-for="(board, i) in popularBoardList.slice((currentPage - 1) * persData, currentPage * persData)" class="article" >
            <span v-if="board.boardCategory === 1" class="board-cate"><a @click="goBoard(board.boardCategory)">자유</a></span>
            <span v-if="board.boardCategory === 2" class="board-cate"><a @click="goBoard(board.boardCategory)">익명</a></span>
            <a class="board-title" @click="addHit(board.boardNum, board.boardCategory)">{{ board.boardTitle }}</a>
            <div class="article-elements">
                <span>🤍 {{ board.favCount }}</span>
                <span>👁 {{ board.boardHit }}</span>
                <span>🗨 {{ board.repleCount }}</span>
            </div>
        </div>
        <div class="page-section">
            <div class="page-content">
                <span v-if="prev" class="prev-button" @click="movePrevPage">이전</span>
                <div v-for="(page, i) in pageArray" :key="i">
                    <span v-if="page === currentPage" style="color:red;" class="current-page">{{ page }}</span>
                    <span v-else class="page" @click="movePage(page)">{{ page }}</span>
                </div>
                <span v-if="next" class="next-button" @click="moveNextPage">다음</span>
            </div>
        </div>
    </div>
    <div v-else class="popular-board-article">
        표시할 게시물이 없습니다.
    </div>

</template>

<script setup>
/**
 * @description
 *    - title: 메인화면 게시글 노출
 *    - menu: 메인 > 게시글 리스트 노출 (조회순)
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import MainBodyHeader from '../header/MainBodyHeader.vue';
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const axios = inject('$axios');
const router = new useRouter();
const popularHeader = ref('인기글');
let popularBoardList = ref([]);
let totalData = ref(0); // 데이터 전체 개수
const persPage = ref(3); // 페이지 노출 개수
const persData = ref(3); // 한 페이지당 노출할 데이터 개수
let totalPage = ref(0); // 전체 페이지 
let currentPage = ref(1); // 현재 페이지
let startPage = ref(1); // 시작 페이지
let endPage = ref(persPage.value); // 끝 페이지
let next = ref(false); // 다음 페이지
let prev = ref(false); // 이전 페이지
let pageArray = ref([]); // 노출할 페이지를 담은 배열

async function getPopularBoardList(){
    await axios.get('/api/main/popularBoardList')
    .then(res => {
        console.log(res.data);
        popularBoardList.value = res.data;
        getTotalData(popularBoardList.value);
        getTotalPage();
        getStartPage(currentPage.value);
        getEndPage(currentPage.value);
        getNextPage();
        getPrevPage();
        getPages();
        console.log(pageArray.value.toString());
    })
    .catch(error => console.log(error));
}


// 게시글 상세 이동 시 조회 수 증가
async function addHit(boardNum, boardCategory){
    await axios.post('/api/board/addHit', {
        boardNum : boardNum
    })
    .then(res => {
        if(res.data){
            moveBoardDetail(boardNum, boardCategory);
        }else console.log('데이터 통신 오류');
    })
    .catch(error => console.log(error));
}

// 메인 페이지에서 게시글 클릭 시 이동
function moveBoardDetail(boardNum, boardCategory){
    if(boardCategory === 1){
        // 자유 글
        router.push({path : '/freeBoardDetail', query : {
            boardNum : boardNum
        }});
    }else{
        // 익명 글
        router.push({path: '/anonyBoardDetail', query : {
            boardNum : boardNum
        }});
    }
}

// 카테고리 이동
function goBoard(boardCategory){
    if(boardCategory === 1){
        // 자유 카테고리
        router.push('/freeBoard');
    }else{
        // 익명 카테고리
        router.push('/anonyBoard');
    }
}

// 전체 데이터 총 개수 구하기
function getTotalData(boardList){
    totalData.value = boardList.length;
}

// 전체 페이지 구하기
function getTotalPage(){
    totalPage.value = totalData.value % persData.value > 0 ? Math.floor(totalData.value / persData.value) + 1 : Math.floor(totalData.value / persData.value);
}

// 현재 페이지를 기준으로 시작 페이지 구하기
function getStartPage(currentPage){
    startPage.value = Math.floor((currentPage - 1) / persPage.value) * persPage.value + 1;
}

// 현재 페이지를 기준으로 마지막 페이지 구하기
function getEndPage(currentPage){
    endPage.value = Math.floor((currentPage - 1) / persPage.value) * persPage.value + persPage.value;
    if(endPage.value > totalPage.value) endPage.value = totalPage.value;
}

// 다음 페이지 구하기
function getNextPage(){
    if(endPage.value < totalPage.value) next.value = true;
    else next.value = false;
}

// 이전 페이지 구하기
function getPrevPage(){
    if(startPage.value > 1) prev.value = true;
    else prev.value = false;
}

// 노출할 페이지들 배열 생성
function getPages(){
    for(let i = startPage.value; i <= endPage.value; i++){
        pageArray.value.push(i);
    }
}

// 노출할 페이지 초기화
function initPages(){
    pageArray.value.length = 0;
}

// 페이지 클릭 시 페이지 이동
function movePage(page){
    currentPage.value = page;
    initPages();
    getStartPage(currentPage.value);
    getEndPage(currentPage.value);
    getNextPage();
    getPrevPage();
    getPages();
}

// 다음 페이지 클릭 시 이동
function moveNextPage(){
    currentPage.value = endPage.value + 1;
    initPages();
    getStartPage(currentPage.value);
    getEndPage(currentPage.value);
    getNextPage();
    getPrevPage();
    getPages();
}

// 이전 페이지 클릭 시 이동
function movePrevPage(){
    currentPage.value = startPage.value - 1;
    initPages();
    getStartPage(currentPage.value);
    getEndPage(currentPage.value);
    getNextPage();
    getPrevPage();
    getPages();
}


onMounted(()=>{
    getPopularBoardList();
    if(popularBoardList.value.length > 0){
        getTotalData(popularBoardList.value);
        getTotalPage();
        getStartPage(currentPage.value);
        getEndPage(currentPage.value);
        getNextPage();
        getPrevPage();
        getPages();
        console.log(pageArray.value.toString());
    }
});


</script>

<style scoped>
.article{
    display: flex;
    padding: 10px;
    position: relative;
}
.board-cate{
    border: 1px solid #eee;
    font-size: 12px;
    margin: 0px 6px 0px;
    height: 25px;
    line-height: 25px;
}
.board-cate a{
    padding: 0px 6px 0px 7px;
    cursor: pointer;
}

.board-title{
    line-height: 25px;
    font-size: 14px;
    cursor: pointer;
}
.board-title:hover{
    font-weight: bold;
}

.article-elements{
    position: absolute;
    display: inline-block;
    right: 0;
    font-size: 14px;
}

.article-elements span{
    display: inline-block;
    width: 50px;
}
.page-content{
    width: 100%;
    justify-content: center;
    display: flex;
    margin-top: 40px;
    line-height: 0;
}
.current-page{
    padding: 5px;
}
.page{
    padding: 5px;
    cursor: pointer;
}
.next-button, .prev-button{
    cursor: pointer;
}
</style>