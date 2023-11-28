<template>
    <div class="board-reple-section" v-if="repleList.length > 0">
        <div :key="i" v-for="(reple, i) in repleList" class="reple-content">
            <p class="reple-member">{{ reple.memberName }}</p>
            <p class="reple-content-detail">{{ reple.repleContent }}</p>
            <p class="reple-regdate">{{ reple.repleRegdate }}</p>
        </div>
    </div>
    <div class="board-reple-section" v-else>
        등록된 댓글이 없습니다.
    </div>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
    repleList: {
        type: Array
    }
});


</script>
<style scoped>
.board-reple-section{
    width: 80%;
    margin: 0 auto;
    border-bottom: 1px solid #eee;
    text-align: left;
}
.reple-content{
    border-bottom: 1px solid #eee;
}
.reple-member{
    color:sienna;
    font-size: 14px;
}
.reple-content-detail{
    font-size: 20px;
}
.reple-regdate{
    color:thistle;
    font-size: 12px;
}
</style>