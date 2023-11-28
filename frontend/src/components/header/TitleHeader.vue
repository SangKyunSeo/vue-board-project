<template>
    <div class="title-header-section" @click="goHome">
        <h2>Board</h2>
    </div>
</template>
<script setup>
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