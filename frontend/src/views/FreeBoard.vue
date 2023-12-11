<template>
    <div class="free-board-section">
        <MainBodyHeader :msg="freeBoardHeader" />
        <div v-if="boardList.length > 0" class="free-board-article" >
            <div :key="i" v-for="(board, i) in boardList" class="article" @click="moveDetail(board.boardNum)">
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
                    <div class="board-writer">
                        {{ board.memberName }}
                    </div>
                    <div class="board-elements">
                        <span>🤍 {{ board.favCount }}</span>
                        <span>👁 {{ board.boardHit }}</span>
                        <span>🗨 {{ board.repleCount }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="free-board-article">
            표시할 게시물이 없습니다.
        </div>
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: 자유 게시판
 *    - menu: 메인 > 자유 카테고리
 *    - layout: FreeBoard
 *    - dev: 서상균
 *    - devVersion : 01_20231129
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import { onMounted, ref, inject } from 'vue';
import MainBodyHeader from '../components/header/MainBodyHeader.vue'
import { useRouter } from 'vue-router';

const user = ref();
const axios = inject('$axios');
const freeBoardHeader = ref('자유 게시판');
const router = new useRouter();

let boardList = ref([]);

// 자유 게시글 상세페이지로 이동하기 위한 로그인한 사용자 정보 조회
function getUserInfo(){
    user.value = localStorage.getItem('user');
}

// 자유 게시글 상세페이지 이동 및 조회수 증가
async function moveDetail(boardNum){
    
    try{
        router.push({path: '/freeBoardDetail', query: {
            boardNum:boardNum
        }});
        // 조회수 증가
        await axios.post('/api/board/addHit', {
            boardNum: boardNum
        }, {
            method: 'POST',
            header: {'Content-Type' : 'application/json'}
        })
        .then(res => {
            if(res.data) console.log('조회수 증가');
            else console.log('데이터 통신 오류');
        })
        .catch(err => console.log(err));

    }catch(error){
        console.log(error);        
    }    
    
}

// 자유 게시글 리스트 조회 API
async function getFreeBoardList(){
    await axios.get('/api/board/freeBoardList')
    .then(res => {
        for(let row of res.data){
            boardList.value.push(row);
        }
        console.log(boardList.value);
    })
    .catch(error => console.log(error));
}

// 카테고리 헤더 변경
function setCategoryStyle(){
    document.getElementById('free_board').style.fontWeight = 'bold';
    document.getElementById('anony_board').style.fontWeight = '';
    document.getElementById('game_board').style.fontWeight = '';
}

onMounted(() => {
    getUserInfo();
    getFreeBoardList();
    setCategoryStyle();
});

</script>

<style scoped>
.free-board-section{
    width: 70%;
}

.free-board-article{
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