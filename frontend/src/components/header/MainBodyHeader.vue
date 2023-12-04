<template>
    <div class="main-content-section">
        <h3>{{ msg }}</h3>
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: body 헤더
 *    - menu: 모든 페이지
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 *    - nav, category Header를 제외한 부분의 Header
 */

import { defineProps } from 'vue';

defineProps({
    msg : {
        type: String,
        required: true
    }
});

</script>

<style scoped>
.main-content-section{
    margin: 35px 0 0;
}
.main-content-section h3{
    height: 40px;
    text-align: left;
    border-bottom: 1px solid #eee;
}
</style>