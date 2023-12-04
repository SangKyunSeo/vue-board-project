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
import { useRouter } from 'vue-router';
import { defineExpose, onMounted } from 'vue';

const router = new useRouter();


function goFreeBoard(){
    router.push('/freeBoard');
    document.getElementById('free_board').style.fontWeight = 'bold';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = '';
}

function goAnonyBoard(){
    router.push('/anonyBoard');
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = 'bold';
    document.getElementById('game_board').style.fontWeight = '';
}

function goGameBoard(){
    router.push('/gameBoard');
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = 'bold';
}

function checkCateState(){
    return window.location.href;
}

const initHeaderStyle = () => {
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = '';
}

const currentFree = () => {
    document.getElementById('free_board').style.fontWeight = 'bold';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = '';
}
const currentAnony = () => {
    document.getElementById('free_board').style.fontWeight = '';
    document.getElementById('anony_board').style.fontWeight = 'bold';
    document.getElementById('game_board').style.fontWeight = '';
}
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