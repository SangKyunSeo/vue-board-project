<template>
    <div class="game-modal-summary">
        1. 철수와 영희가 가위바위보를 합니다.<br>
        2. 철수와 영희 중 누가 이길지를 선택하세요.<br>
        3. 참여시 <b>500</b>포인트를 사용합니다.<br>
        4. 성공시 <b>1,000</b>포인트를 얻습니다.<br>
        <span class="warn">(주의! 새로고침 시 게임이 종료되며, 포인트는 복구되지 않습니다.)</span>
    </div>
    <div class="game-modal-content">
        <span>누구를 응원하시겠어요?</span>
        <div class="game-buttons">
            <button class="button" id="button1" @click="selectWinner(0)">철수</button>
            <button class="button" id="button2" @click="selectWinner(1)">영희</button>
            <button class="button" id="drawButton" @click="selectWinner(2)">비긴다</button>
        </div>
    </div>
    <div class="game-modal-result" v-show="finishGame">
        <div class="game-result">
            <span>철수 : <b>{{ print[person1] }}</b></span>
            <span>영희 : <b>{{ print[person2] }}</b></span>
        </div>
        <div class="game-select">
            당신의 선택은 : <b></b>
        </div>
        <div class="game-result-win" v-if="gameResult">
            🎉당신의 선택이 맞았습니다!🎉
        </div>
        <div class="game-result-lose" v-else>
            💥아쉽게 틀렸습니다!💥
        </div>
        <div class="finish-game">
            <button @click="exit">종료</button>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 철수 영희 응원 진행
 *    - menu: 메인 > 게임 카테고리 > 게임 상세 > 게임 진행 모달
 *    - layout: GameDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231206
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import { ref, onBeforeMount, defineEmits, defineProps, inject } from 'vue';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

const store = useUserStore();
const { getUserNum, getUserPoint } = storeToRefs(store);
const axios = inject('$axios');

const print = ['가위','바위','보'];
const emit = defineEmits(['gameModalOpen']);
const props = defineProps({
    gameNum : {
        type : Number
    }
})


let person1 = ref(0);
let person2 = ref(0);
let winner = ref(0);
let gameResult = ref(false);
let finishGame = ref(false);
let selectPerson = ref(0);

// 게임 초기 세팅
const gameSetting = () => {
    person1.value = Math.floor(Math.random() * 3);    
    person2.value = Math.floor(Math.random() * 3);
    playGame();
}

// 게임 진행
const playGame = () => {
    if(person1.value - person2.value === 0) winner.value = 2;
    else if(person1.value - person2.value === 1 || person1.value - person2.value === -2) winner.value = 0;
    else if(person1.value - person2.value === -1 || person1.value - person2.value === 2) winner.value = 1;
}

// 사람 선택시 노출
const printSelect = () => {
    if(selectPerson.value === 0) document.querySelector('.game-select b').innerHTML = '철수';
    else if(selectPerson.value === 1) document.querySelector('.game-select b').innerHTML = '영희';
    else document.querySelector('.game-select b').innerHTML = '비긴다';
}

// 사람을 선택했을 경우 게임 결과
const selectWinner = (person) => {
    selectPerson.value = person;
    printSelect();
    if(person === winner.value) gameResult.value = true;
    else gameResult.value = false;
    finishGame.value = true;
    exitGame();
}

// 게임 종료
const exitGame = () => {
    document.querySelectorAll('.button').forEach((e)=>{
        e.disabled = true;
        e.style.pointerEvents = 'none';
    })
}

// 모달창 닫기
const exit = () => {
    emit('gameModalOpen', false);
    if(gameResult.value){
        setGamePrice();
    }
}

// 게임 성공 시 포인트 삽입
async function setGamePrice(){
    // store에 반영
    store.setUserPoint(Number(getUserPoint.value) + 1000);
    // 로컬스토리지에 바로 반영
    localStorage.setItem('memberPoint', Number(getUserPoint.value));

    await axios.post('/api/game/setGamePoint', {
        memberNum : getUserNum.value,
        gameNum : props.gameNum,
        gamePoint : 1000,
        gamePointType : 1
    }, {
        method : 'POST',
        header: {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data){
            console.log('가위바위보 포인트 삽입 성공');
        }else{
            console.log('가위바위보 포인트 삽입 실패');
        }
    })
    .catch(error => console.log(error));
}

onBeforeMount(() => {
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
.game-buttons{
    margin-top : 10px;
    text-align: center;
}
.game-buttons button{
    margin-right : 10px;
    font-size: 20px;
    background: none;
    border: none;
    cursor : pointer;
}

#button1{
    border : 0.5px solid skyblue;
    border-radius: 20px;
}
#button1:hover{
    border : 0.5px solid blue;
}

#button2{
    border : 0.5px solid pink;
    border-radius: 20px;
}
#button2:hover{
    border : 0.5px solid red;
}

#drawButton{
    border : 0.5px solid violet;
    border-radius: 20px;
}
#drawButton:hover{
    border : 0.5px solid darkmagenta;
}

.game-modal-result{
    margin-top : 10px;
}
.game-result{
    text-align: center;
}
.game-modal-result span{
    display: block;
}
.game-result-win{
    margin-top: 10px;
    color : blue;
}
.game-result-lose{
    margin-top: 10px;
    color : red;
}

.finish-game{
    margin-top: 10px;
}
.finish-game button{
    font-size : 16px;
}
</style>