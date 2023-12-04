<template>
    <MainBodyHeader :msg="popularHeader"/>
    <div v-if="popularBoardList !== null" class="popular-board-article">
        <div :key="i" v-for="(board, i) in popularBoardList" class="article" >
            <span v-if="board.boardCategory === 1" class="board-cate"><a>자유</a></span>
            <span v-if="board.boardCategory === 2" class="board-cate"><a>익명</a></span>
            <a class="board-title">{{ board.boardTitle }}</a>
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

const axios = inject('$axios');

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