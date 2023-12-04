<template>
    <div class="write-board-section">
        <h2>게시글 작성</h2>
        <WriteBoardForm />
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: 게시글 작성
 *    - menu: 메인 > 글쓰기
 *    - layout: WriteBoard
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import WriteBoardForm from '../components/form/WriteBoardForm.vue';
</script>
<style scoped>
.write-board-section{
    width: 70%;
}
</style>