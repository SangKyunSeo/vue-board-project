<template>
    <div v-for="(board, i) in searchResult" :key="i" class="article">
        <span>{{ board.boardTitle }}</span>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    searchResult : {
        type : Array
    }
})


</script>
<style scoped>

</style>