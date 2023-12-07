<template>
    <div class="my-board-section">
        <h3 v-if="boardCategory === 1">자유글</h3>    
        <h3 v-else>익명글</h3>
        <span v-if="boardCategory === 1" class="toggle-span" @click="toggle"> 익명글 보러가기 ➡</span>
        <span v-else class="toggle-span" @click="toggle"> 자유글 보러가기 ➡</span>
        <div class="board-list-section">
            <table class="board-table">
                <thead>
                    <tr v-if="boardCategory === 1">
                        <th v-for="(header, index) in freeHeader" :key="index">{{ header }}</th>
                    </tr>
                    <tr v-else>
                        <th v-for="(header, index) in anonyHeader" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody v-if="boardCategory === 1">
                    <tr v-for="(board, index) in boardList" :key="index">
                        <td>{{ board.boardNum }}</td>
                        <td><a @click="moveBoardDetail(board.boardNum)" class="board-title-click">{{ board.boardTitle }}</a></td>
                        <td>{{ String(board.boardRegdate).slice(0,10) }}</td>
                        <td v-if="board.boardMdate !== null">{{ String(board.boardMdate).slice(0,10) }}</td>
                        <td v-else></td>
                        <td>{{ board.boardHit }}</td>
                        <td>{{ board.favCount }}</td>
                        <td>{{ board.repleCount }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="(board, index) in boardList" :key="index">
                        <td>{{ board.boardNum }}</td>
                        <td>{{ board.boardTitle }}</td>
                        <td>{{ String(board.boardRegdate).slice(0,10) }}</td>
                        <td v-if="board.boardMdate !== null">{{ String(board.boardMdate).slice(0,10) }}</td>
                        <td v-else></td>
                        <td>{{ board.boardHit }}</td>
                        <td>{{ board.reactionTotal }}</td>
                    </tr>
                </tbody>
            </table>
        </div>    
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 내가 쓴 글 내역
 *    - menu: 메인 > 마이페이지 카테고리 > 마이페이지 > 내가 쓴 글
 *    - layout: MyPage
 *    - dev: 서상균
 *    - devVersion : 01_20231207
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const freeHeader = ['글 번호', '제목', '작성일', '수정일', '조회수', '좋아요수','댓글수'];
const anonyHeader = ['글 번호', '제목', '작성일', '수정일', '조회수', '반응수'];
const router = new useRouter();
const emit = defineEmits(['toggle']);

const props = defineProps({
    boardList : {
        type : Array
    },
    boardCategory :{
        type : Number
    }
});

// 자유글, 익명글 토글 버튼 클릭 시
function toggle(){
    if(props.boardCategory === 1){
        emit('toggle', 2);
    }else emit('toggle', 1);
}


// 자유글 상세 페이지 이동
function moveBoardDetail(boardNum){
    if(props.boardCategory === 1){
        router.push({path: '/freeBoardDetail', query:{
            boardNum : boardNum
        }});
    }else{
        router.push({path: '/anonyBoardDetail', query:{
            boardNum : boardNum
        }});
    }
}


</script>
<style scoped>
.my-board-section{
    width: 70%;
    margin: 0 auto;
}

.toggle-span{
    display: flex;
    justify-content: end;
    cursor: pointer;
}
.toggle-span:hover{
    font-weight: bold;
}
.board-table{
    width: 100%;
}
.board-title-click{
    cursor: pointer;
}
.board-title-click:hover{
    font-weight: bold;
}
</style>