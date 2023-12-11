<template>
    <MainBodyHeader :msg="popularHeader"/>
    <div v-if="popularBoardList !== null" class="popular-board-article">
        <div :key="i" v-for="(board, i) in popularBoardList" class="article" >
            <span v-if="board.boardCategory === 1" class="board-cate"><a @click="goBoard(board.boardCategory)">자유</a></span>
            <span v-if="board.boardCategory === 2" class="board-cate"><a @click="goBoard(board.boardCategory)">익명</a></span>
            <a class="board-title" @click="addHit(board.boardNum, board.boardCategory)">{{ board.boardTitle }}</a>
            <div class="article-elements">
                <span>🤍 {{ board.favCount }}</span>
                <span>👁 {{ board.boardHit }}</span>
                <span>🗨 {{ board.repleCount }}</span>
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
let popularBoardList = ref();

async function getPopularBoardList(){
    await axios.get('/api/main/popularBoardList')
    .then(res => {
        console.log(res.data);
        popularBoardList.value = res.data;
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

onMounted(()=>{
    getPopularBoardList();
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
</style>