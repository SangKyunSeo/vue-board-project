<template>
    <div class="write-board-section">
        <h2>게시글 작성</h2>
        <WriteBoardForm />
    </div>
</template>

<script setup>
import WriteBoardForm from '../components/form/WriteBoardForm.vue';
</script>
<style scoped>
.write-board-section{
    width: 70%;
}
</style>