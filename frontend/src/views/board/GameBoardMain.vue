<template>
    <div class="game-board-section">
        <MainBodyHeader :msg="gameBoardHeader"/>
        <GameListBody v-if="gameList.length > 0" @gameNum="goGameDetail" :gameList="gameList"/>
    </div>
    <GameDetailModal v-if="gameModalOpen && Object.keys(gameDetail).length > 0" :gameDetail="gameDetail" @gameModalOpen="close"/>
</template>
<script setup>
/**
 * @description
 *    - title: 게임 게시판 메인
 *    - menu: 메인 > 게임 카테고리
 *    - layout: GameBoard
 *    - dev: 서상균
 *    - devVersion : 01_20231204
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import MainBodyHeader from '@/components/header/MainBodyHeader.vue';
import GameListBody from '@/components/body/GameListBody.vue';
import { ref, inject, onMounted } from 'vue';
import { useUserStore } from '../../stores/user-store';
import { storeToRefs } from 'pinia';
import GameDetailModal from '../../components/modal/GameDetailModal.vue'

const store = useUserStore();
const { getUserNum, getUserPoint } = storeToRefs(store);
const axios = inject('$axios');
const gameBoardHeader = ref('게임');
let gameList = ref([]);
let gameModalOpen = ref(false);
let gameNum = ref(-1);
const gameDetail = ref({});


// 등록된 게임 리스트 조회 API
async function getGameList(){
    axios.get('/api/game/getGameList')
    .then(res => {
        gameList.value = res.data;
        console.log('게임 목록 : ' + gameList.value);
    })
    .catch(error => console.log(error));
}

// 게임 리스트에서 게임 클릭 시 게임 상세 모달창 띄우기
const goGameDetail = (data) => {
    if(getUserNum.value === '' || getUserNum.value === null){
        alert('로그인 후 사용가능!');
        return;
    }else{
        if(checkPoint()){
            gameModalOpen.value = window.confirm('게임에 참가하시겠습니까? (포인트가 차감됩니다.)');
            gameNum.value = data;
            // 게임 상세 조회
            getGameDetail(gameNum.value);
            // 포인트 차감
            if(gameNum.value === 1){
                calPoint(gameNum.value, 100);
            }
        }else{
            alert('포인트가 부족하여 게임에 참여할 수 없습니다.');
            return;
        }
    }
}

// 게임 참가 여부 확인
function checkPoint(){
    if(Number(getUserPoint.value) >= 100){
        return true
    }
    return false;
}

// 게임 참가 포인트 차감
async function calPoint(gameNum, gamePoint){
    // store에 반영
    store.setUserPoint(Number(getUserPoint.value) - gamePoint);
    // 로컬스토리지에 바로 반영
    localStorage.setItem('memberPoint', Number(getUserPoint.value));
    // DB 반영
    await axios.post('/api/game/setGamePoint',{
        memberNum : getUserNum.value,
        gameNum : gameNum,
        gamePoint : gamePoint,
        gamePointType : 2
    },{
        method: 'POST',
        header: {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data){
            console.log('포인트 데이터 삽입 성공');
        }else{
            console.log('포인트 데이터 삽입 실패');
        }
    })
    .catch(error => console.log(error));
    
}



// 게임 상세 조회 API
async function getGameDetail(gameNum){
    axios.get('/api/game/getGameDetail', {
        params : {
            gameNum : gameNum
        }
    })
    .then(res => {
        gameDetail.value = res.data;
        console.log(gameDetail.value);
    })
    .catch(error => console.log(error));
}

// 게임 상세 모달창 닫기
const close = (data) => {
    gameModalOpen.value = data;
}


onMounted(() => {
    getGameList();
});



</script>

<style scoped>
.game-board-section{
    width: 70%;
}
</style>