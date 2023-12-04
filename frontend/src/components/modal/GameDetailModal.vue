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
import { defineProps, defineEmits } from 'vue';

defineProps({
    gameNum : {
        type : Number
    }
});

const emit = defineEmits(['gameModalOpen']);

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