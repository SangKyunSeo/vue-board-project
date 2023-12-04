<template>
    <div class="title-header-section" @click="goHome">
        <h2>Board</h2>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 메인화면 Title Header
 *    - menu: 메인
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { defineEmits } from 'vue';

const emit = defineEmits(['goHome']);

function goHome(){
    emit('goHome', true);
}
</script>
<style scoped>
.title-header-section{
    width: 30%;
    cursor: pointer;
}
</style>