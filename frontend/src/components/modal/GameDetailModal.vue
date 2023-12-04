<template>
    <div class="game-detail-modal">
        <div class="game-detail-modal-content">
            <div class="game-detail-modal-body">
                {{ gameNum }}
                <button @click="close">닫기</button>
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

defineProps({
    gameNum : {
        type : Number
    }
});

const emit = defineEmits(['gameModalOpen']);

// 취소 버튼 클릭 시 모달창 숨기기
function close(){
    emit('gameModalOpen', false);
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
    height: 300px;
    padding: 30px 30px;
    margin: 0 auto;
    border: 1px solid #777;
    background-color: #fff;
}
</style>