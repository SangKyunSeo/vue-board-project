<template>
    <div class="game-modal-summary">
        1. U와 D버튼을 선택 해야합니다.<br>
        2. {{ count }}번의 기회가 주어지며 7개의 다리를 건너면 성공입니다.<br>
        3. 참여시 <b>100</b>포인트를 사용합니다.<br>
        4. 성공시 <b>1,000</b>포인트를 얻습니다.<br>
        <span class="warn">(주의! 새로고침 시 게임이 종료되며, 포인트는 복구되지 않습니다.)</span>
    </div>
    <div class="game-modal-content">
        <span class="remain-count">남은 횟수 : {{ count }}</span>
        <div class="game-input">
            <button id="upButton" @click="upButtonClick">U</button>
            <button id="downButton" @click="downButtonClick">D</button>
        </div>
    </div>
    <div class="game-modal-result">
        <span v-for="(up, i) in upArr" :key="i" class="up-section">|{{ up }}</span><br>
        <span v-for="(down, i) in downArr" :key="i" class="down-section">|{{ down }}</span>
    </div>
    <div v-if="finishGame" class="game-modal-finish">
        <div v-if="win" class="win-result">
            🎉 다리를 모두 건넜습니다! 🎉
        </div>
        <div v-else class="lose-result">
            💥 다리를 건너지 못했습니다!💥
        </div>
        <button class="exitGame" @click="exitGame">종료</button>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 징검다리 건너기 진행
 *    - menu: 메인 > 게임 카테고리 > 게임 상세 > 게임 진행 모달
 *    - layout: GameDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231205
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { ref, onMounted, defineProps, defineEmits, inject } from 'vue';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

const store = useUserStore();
const { getUserNum, getUserPoint } = storeToRefs(store);
const axios = inject('$axios');

const upArr = ref([]);
const downArr = ref([]);
const answer = ref([]);
let count = ref(0);
let gameCount = ref(0);
let finishGame = ref(false);
let win = ref(false);
const emit = defineEmits(['gameModalOpen']);

const props = defineProps({
    gameNum: {
        type: Number
    }
});

// 게임 세팅
function gameSetting(){
    while(answer.value.length < 7){
        const n = Math.floor(Math.random() * 2);
        answer.value.push(n === 0 ? 'U' : 'D');
    }
    console.log(answer.value);
}


// U 버튼 클릭 시 
function upButtonClick(event){
    event.preventDefault();
    if(answer.value[gameCount.value] === 'U'){
        // 맞는 선택을 했을 경우
        printUp();
    }else{
        printDown();
        count.value -= 1;
    }
    if(count.value === 0 && gameCount.value < 7){
        // 게임 실패
        loseGame();
        return;
    }
    gameCount.value += 1;
    if(gameCount.value === 7 && count.value > 0){
        // 게임 성공
        winGame();
    }
}

// D 버튼 클릭 시
function downButtonClick(event){
    event.preventDefault();

    if(answer.value[gameCount.value] === 'D'){
        // 맞는 선택을 했을 경우
        printDown();
    }else{
        printUp();
        count.value -= 1;
    }

    if(count.value === 0 && gameCount.value < 7){
        // 게임 실패
        loseGame();
        return;
    }
    gameCount.value += 1;
    if(gameCount.value === 7 && count.value > 0){
        // 게임 성공
        winGame();
    }
}

// Up 배열에 O Down 배열에 X 그리기
function printUp(){
    upArr.value.push('O');
    downArr.value.push('X');
}
// Down 배열에 O Up 배열에 X 그리기
function printDown(){
    upArr.value.push('X');
    downArr.value.push('O');
}

// 게임 종료 시 -> 성공
function winGame(){
    finishGame.value = true;
    win.value = true;
    disableButton();
}

// 게임 종료 시 -> 실패
function loseGame(){
    finishGame.value = true;
    disableButton();
}

// 게임 종료 시 버튼 비활성화
function disableButton(){
    document.getElementById('upButton').disabled = true;
    document.getElementById('downButton').disabled = true;
}

// 종료 버튼 클릭 시 모달창 닫기
function exitGame(){
    emit('gameModalOpen', false);
    console.log('게임 상태 : ' + win.value);
    if(win.value){
        // 포인트 삽입
        setGamePrice();
    }
}

// 게임 성공 시 포인트 삽입
async function setGamePrice(){
    // store에 반영
    store.setUserPoint(Number(getUserPoint.value) + 1000);
    // 로컬스토리지에 바로 반영
    localStorage.setItem('memberPoint', Number(getUserPoint.value));

    await axios.post('/api/game/setGamePoint',{
        memberNum : getUserNum.value,
        gameNum : props.gameNum,
        gamePoint : 1000,
        gamePointType : 1
    }, {
        method : 'POST',
        header : {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data){
            console.log('징검다리 포인트 삽입 성공');
        }else console.log('징검다리 포인트 삽입 실패');
    })
    .catch(error => console.log(error));
}

onMounted(() => {
    count.value = 2;
    gameSetting();
});

</script>
<style scoped>
.game-modal-summary{
    padding: 10px;
    text-align: left;
    border-bottom : 1px solid black;
    font-size: 16px;
}

.game-modal-content{
    padding: 10px;
    text-align: left;
    border-bottom : 1px solid black;
}
.warn{
    color: red;
}
.game-input{
    display: flex;
    margin-top: 10px;
}
#upButton{
    margin-right : 10px;
}

.game-modal-result{
    text-align: left;
    margin-top : 10px;
}
.game-modal-result span{
    display: inline-block;
    letter-spacing: 0.1em;
    margin: 0;
    width: 25px
}

.win-result{
    color: blue;
}
.lose-result{
    color: red;
}
</style>