<template>
    <div class="anony-board-section">
        <MainBodyHeader :msg="anonyBoardHeader"/>
        <div v-if="boardList.length > 0" class="anony-board-article">
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
                    <div class="board-elements">
                        <span>⭐ {{ board.reactionTotal }}</span>
                        <span>👁 {{ board.boardHit }}</span>
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
/**
 * @description
 *    - title: 익명 게시판
 *    - menu: 메인 > 익명 카테고리
 *    - layout: AnonyBoard
 *    - dev: 서상균
 *    - devVersion : 01_20231201
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import MainBodyHeader from '../components/header/MainBodyHeader.vue';
import { onMounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router'

const user = ref();
const axios = inject('$axios');
const anonyBoardHeader = ref('익명 게시판');
const router = useRouter();

let boardList = ref([]);

// 익명 글 상세페이지로 이동하기 위한 로그인한 사용자 정보 조회
function getUserInfo(){
    user.value = JSON.parse(localStorage.getItem('user'));
}

// 익명 글 리스트 조회 API
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

// 익명 게시판 상세페이지 이동 및 조회수 증가
async function moveDetail(boardNum){
    if(user.value.memberNum === ''){
        alert('로그인 후 확인할 수 있습니다.');
        return;
    }

    router.push({path: '/anonyBoardDetail', query: {
        boardNum:boardNum
    }});

    await axios.post('/api/board/addHit',{
        boardNum: boardNum
    },{
        method : 'POST',
        header : {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data) console.log('조회수 증가');
        else console.log('조회수 증가 통신 오류');
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
    width: 90%;
    margin: 0px auto;
}

.article{
    padding: 10px;
    border-bottom: 1px solid lightgray;
    cursor: pointer;
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