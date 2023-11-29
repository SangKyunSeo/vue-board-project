<template>
    <div v-if="boardDetail" class="anony-board-detail-section">
        <div class="board-title">
            <h1>{{ boardDetail.boardTitle }}</h1>
            <span>{{ boardDetail.boardRegdate.slice(0,10) }}</span>
        </div>
        <div class="board-main">
            <span>{{ boardDetail.boardContent }}</span>
        </div>
        <AnonyBoardButton />
    </div>
</template>
<script setup>
import { inject, ref, onMounted, onBeforeMount } from 'vue'
import { useUserStore } from '../../stores/user-store'
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import AnonyBoardButton from '../../components/button/AnonyBoardButton.vue';

const axios = inject('$axios');
const boardDetail = ref();
const store = useUserStore();
const { getUserNum } = storeToRefs(store);
const route = new useRoute();
const boardNum = route.query.boardNum;

// 익명 게시글 상세 내용 조회
async function getBoardDetail(){
    await axios.get('/api/board/boardDetail',{
        params: {
            boardNum : boardNum
        }
    })
    .then(res => {
        boardDetail.value = res.data;
    })
    .catch(error => console.log(error));
}

onBeforeMount(() => {
    getBoardDetail();
});

onMounted(() => {
    console.log(boardDetail.value);
    console.log(getUserNum.value);
});
</script>
<style scoped>
.anony-board-detail-section{
    width: 50%;
    margin: 40px auto;
    height: 60%;
    text-align: left;
    padding : 40px;
    border: 0.5px solid #eee;
    
}

.board-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
}

.board-title span{
    font-size: 14px;
    color: #999;
    
}

.board-main{
    margin-top: 60px;
    min-height: calc(100% - 100px);
}

</style>