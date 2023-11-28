<template>
    <div class="anony-board-section">
        <MainBodyHeader :msg="anonyBoardHeader"/>
        <div v-if="boardList.length > 0" class="anony-board-article">
            <div :key="i" v-for="(board, i) in boardList" class="article">
                <div class="board-header-section">
                    <div class="board-title">
                        {{ board.boardTitle }}
                    </div>
                    <div v-if="board.boardMdate === null" class="board-date">
                        {{ board.boardRegdate.slice(0, 10) }}
                    </div>
                    <div v-else class="board-date" style="color:aqua;">
                        {{ board.boardMdate.slice(0, 10) }}
                    </div>
                </div>
                <div class="board-main-section">
                    {{ board.boardContent }}
                </div>
                <div class="board-footer-section">
                    <div class="board-elements">
                        <span>🤍 0</span>
                        <span>👁 {{ board.boardHit }}</span>
                        <span>🗨 0</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="free-board-article">
            오늘 작성된 글이 없습니다.
        </div>
    </div>
</template>
<script setup>
import MainBodyHeader from '../components/header/MainBodyHeader.vue';
import { onMounted, ref, inject } from 'vue';

const user = ref();
const axios = inject('$axios');
const anonyBoardHeader = ref('익명 게시판');

let boardList = ref([]);

function getUserInfo(){
    user.value = localStorage.getItem('user');
}

async function getAnonyBoardList(){
    await axios.get('/api/board/anonyBoardList')
    .then(res => {
        for(let row of res.data){
            boardList.value.push(row);
        }
        console.log(boardList.value);
    })
    .catch(error => console.log(error));
}

onMounted(() => {
    getUserInfo();
    getAnonyBoardList();
});

</script>
<style scoped>
.anony-board-section{
    width: 70%;
}

.anony-board-article{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: -20px 10px 10px 10px;
}

.article{
    width: 30%;
    padding: 10px;
    border-bottom: 1px solid lightgray;
    cursor: pointer;
}
.article:not(:nth-child(3n)){
    border-right: 1px solid lightgray;
}

.board-header-section{
    display: flex;
    height: 50px;
    position: relative;
    margin-top: 20px;
    
}
.board-title{
    font-size: 20px;
    font-weight: bold;
    line-height: 6px;
}
.board-date{
    position: absolute;
    display: inline-block;
    font-size: 12px;
    right: 0;
}

.board-main-section{
    text-align: left;
    height: 100px;
    line-height: 50px;
}

.board-footer-section{
    text-align: left;
}
.board-writer{
    margin-bottom: 10px;
}
.board-elements{
    color: #b5b5b1;
}
.board-elements span{
    margin-right: 20px;
}
</style>