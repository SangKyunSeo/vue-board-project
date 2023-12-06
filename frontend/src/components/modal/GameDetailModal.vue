<template>
    <div class="game-detail-modal">
        <div class="game-detail-modal-content">
            <div class="game-detail-modal-body">
                <div class="game-detail-modal-head">
                    <span class="game-title">{{ gameDetail.gameTitle }}</span>
                    <button @click="close">닫기</button>    
                </div>
                <BaseBallGameBody v-if="gameDetail.gameNum === 1" :gameNum="gameDetail.gameNum" @finishGame="closeModal"/>
                <CrossBridgeGameBody v-if="gameDetail.gameNum === 2" :gameNum="gameDetail.gameNum" @gameModalOpen="closeModal"/>
                <RSPGameBody v-if="gameDetail.gameNum === 3" :gameNum="gameDetail.gameNum" @gameModalOpen="closeModal"/>
            </div>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 게임 상세 모달
 *    - menu: 메인 > 게임 카테고리 > 게임 상세 > 게임 진행 모달
 *    - layout: GameDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231204
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */

import { defineProps, defineEmits } from 'vue';
import BaseBallGameBody from '../body/BaseBallGameBody.vue'
import CrossBridgeGameBody from '../body/CrossBridgeGameBody.vue'
import RSPGameBody from '../body/RSPGameBody.vue';

defineProps({
    gameDetail : {
        type : Object
    }
});

const emit = defineEmits(['gameModalOpen']);

// 취소 버튼 클릭 시 모달창 숨기기
function close(){
    emit('gameModalOpen', false);
}

// 게임 종료시 모달창 닫기 위한 데이터 전달
const closeModal = (data) => {
    emit('gameModalOpen', data);
}

</script>
<style scoped>
.game-detail-modal{
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.game-detail-modal-body{
    width: 500px;
    height: 400px;
    padding: 20px;
    margin: 0 auto;
    border: 1px solid #777;
    background-color: #fff;
}
.game-detail-modal-head{
    display : flex;
    justify-content: space-between;
    border-bottom : 1px solid black;
    
}
.game-detail-modal-head button{
    cursor: pointer;
    background: none;
    border : none;
    font-size: 15px;
}
.game-detail-modal-head span{
    font-weight: bold;
    font-size : 20px;
}
</style>