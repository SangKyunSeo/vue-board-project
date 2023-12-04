<template>
    <div class="game-board-section">
        <MainBodyHeader :msg="gameBoardHeader"/>
        <GameListBody v-if="gameList.length > 0" @gameNum="goGameDetail" :gameList="gameList"/>
    </div>
    <GameDetailModal v-if="gameModalOpen" :gameNum="gameNum" @gameModalOpen="close"/>
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
const { getUserNum } = storeToRefs(store);
const axios = inject('$axios');
const gameBoardHeader = ref('게임');
let gameList = ref([]);
let gameModalOpen = ref(false);
let gameNum = ref(-1);

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
        gameModalOpen.value = window.confirm('게임에 참가하시겠습니까? (포인트가 차감됩니다.)');
        gameNum.value = data;
    }
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