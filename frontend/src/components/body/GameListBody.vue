<template>
    <div class="game-list-section">
        <div v-for="(game, i) in gameList" :key="i" class="article">
            <a id="article-item" @click="moveGameDetail(game.gameNum)">
                <div class="title">{{ game.gameTitle }}</div>
                <div class="content">{{ game.gameContent }}</div>
                <div class="money">
                    <div class="game-price">상품 : {{ game.gamePrice.toLocaleString('ko-KR') }}</div>
                    <div class="game-cost">참가 비용 : {{ game.gameCost.toLocaleString('ko-KR') }}</div>    
                </div>
            </a>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: Game 리스트 영역
 *    - menu: 메인 > 게임 카테고리 > 게임 리스트 노출
 *    - layout: GameBoardMain
 *    - dev: 서상균
 *    - devVersion : 01_20231204
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['gameNum']);

defineProps({
    gameList : {
        type: Array
    }
});

function moveGameDetail(gameNum){
    emit('gameNum', gameNum);
}


</script>
<style scoped>
.game-list-section{
    text-align: left;
    padding: 20px;
    border-bottom : 1px solid #eee;
}

.article{
    height: 250px;
    border-bottom : 1px solid #eee;
    margin-bottom : 10px;
}

.title{
    height : 20%;
    font-weight : bold;
    font-size : 20px;
}
.content{
    height: 60%;
}

.money{
    height : 20%;
    display : flex;
}
.game-price{
    margin-right : 40px;
    color: darksalmon;
}
.game-cost{
    color : blue;
}

#article-item{
    cursor: pointer;
}
</style>