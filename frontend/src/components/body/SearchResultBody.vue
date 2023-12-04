<template>
    <div v-for="(board, i) in searchResult" :key="i" class="article">
        <div class="title">{{ board.boardTitle }}</div>
        <div class="content"><a @click="moveDetail(board.boardNum, board.boardCategory)">{{ board.boardContent }}</a></div>
        <div v-if="board.boardCategory === 1" class="writer">{{ board.memberName }}</div>
        <div v-if="board.boardCategory === 1" class="buttons">
            <span class="hit">👁 {{ board.boardHit }}</span>
            <span class="reple">🗨 {{ board.repleCount }}</span>
            <span class="fav">🤍 {{ board.favCount }}</span>
            <span class="regdate">{{ board.boardRegdate.slice(0,10) }}</span>
        </div>
        <div v-if="board.boardCategory === 2" class="anony-buttons">
            <span class="hit">👁 {{ board.boardHit }}</span>
            <span class="reaction">⭐ {{ board.reactionTotal }}</span>
            <span class="regdate">{{ board.boardRegdate.slice(0,10) }}</span>
        </div>
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: 검색 결과 화면
 *    - menu: 메인 > 검색 > 검색 결과 
 *    - layout: SearchResult
 *    - dev: 서상균
 *    - devVersion : 01_20231204
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { defineProps, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

const router = new useRouter();
const axios = inject('$axios');
const store = useUserStore();
const { getUserNum } = storeToRefs(store);
const userNum = getUserNum.value;

defineProps({
    searchResult : {
        type : Array
    }
});

async function moveDetail(boardNum, boardCategory){
    if(boardCategory === 1){
        // 자유 게시판 상세페이지 이동 및 조회수 증가
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
    }else{
        // 익명 게시판 상세페이지 이동 및 조회수 증가
        if(userNum === ''){
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
}


</script>
<style scoped>
.article{
    width: 50%;
    border-top: 1px solid #eee;
    height: 250px;
    text-align: left;
    margin: 0;
    box-sizing: border-box;
    padding-top : 20px;
    padding-bottom : 10px;
    padding-left: 20px;
}
.article:nth-child(even){
    border-right: 1px solid #eee;
    padding-right: 20px
}
.title{
    height : 20%;
    font-weight: bold;
}
.content{
    height : 60%;
}
.content a{
    cursor : pointer;
}
.writer{
    height : 10%;
    font-size: 12px;
}
.buttons{
    height : 10%;
    font-size: 12px;
    display: flex;
}
.anony-buttons{
    height : 10%;
    font-size : 12px;
    display : flex;
}

.buttons span{
    width: 25%;
}
.anony-buttons span{
    width : 33%;
}
.regdate{
    text-align: right;
}

</style>