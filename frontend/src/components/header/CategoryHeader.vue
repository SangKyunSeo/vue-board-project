<template>
    <div class="category-header-section">
        <ul class="category-list">
            <li><a id="free_board" @click="goFreeBoard">자유</a></li>
            <li><a id="anony_board" @click="goAnonyBoard">익명</a></li>
            <li><a id="game_board" @click="goGameBoard">게임</a></li>
        </ul>
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: 메인화면 카테고리
 *    - menu: 메인 > 카테고리
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import { useRouter } from 'vue-router';
import { defineExpose, onMounted } from 'vue';

const router = new useRouter();

// 자유 게시판 이동 및 스타일 적용
function goFreeBoard(){
    router.push('/freeBoard');
    document.getElementById('free_board').style.fontWeight = 'bold';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = '';
}

// 익명 게시판 이동 및 스타일 적용
function goAnonyBoard(){
    router.push('/anonyBoard');
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = 'bold';
    document.getElementById('game_board').style.fontWeight = '';
}

// 게임 게시판 이동 및 스타일 적용
function goGameBoard(){
    router.push('/gameBoard');
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = 'bold';
}

// 현재 페이지 URI 확인
function checkCateState(){
    return window.location.href;
}

// 스타일 초기화
const initHeaderStyle = () => {
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = '';
}

// 현재 페이지가 자유게시판 일 경우 스타일 적용
const currentFree = () => {
    document.getElementById('free_board').style.fontWeight = 'bold';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = '';
}

// 현재 페이지가 익명게시판 일 경우 스타일 적용
const currentAnony = () => {
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = 'bold';
    document.getElementById('game_board').style.fontWeight = '';
}

// 현재 페이지가 게임게시판 일 경우 스타일 적용
const currentGame = () => {
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = 'bold';
}

defineExpose({
    initHeaderStyle
});

onMounted(() => {
    if(checkCateState().includes('freeBoard')){
        currentFree();
    }else if(checkCateState().includes('anonyBoard')){
        currentAnony();
    }else if(checkCateState().includes('gameBoard')){
        currentGame();
    }else{
        initHeaderStyle();
    }   
});

</script>

<style scoped>
.category-header-section{
    width: 70%;
    display: flex;
    align-items: center;
}
.category-list{
    list-style-type: none;
    float: left;
}
.category-list li{
    margin-right: 30px;
    display: inline-block;
    font-size: 20px;
}
#free_board{
    cursor: pointer;
}
#anony_board{
    cursor: pointer;
}
#game_board{
    cursor: pointer;
}
</style>