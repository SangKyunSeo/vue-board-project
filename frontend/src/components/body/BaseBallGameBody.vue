<template>
    <div class="game-modal-summary">
        1. 사용되는 숫자는 0 에서 9까지 서로 다른 숫자입니다.<br>
        2. 숫자는 맞지만 위치가 다르면 <b>Ball</b> 입니다.<br>
        3. 숫자와 위치가 모두 맞으면 <b>Strike</b> 입니다.<br>
        4. 숫자와 위치가 모두 다르면 <b>Out</b> 입니다.<br>
        5. 3번의 기회가 주어지며 <b>3 Strike</b>를 맞추면 성공입니다.<br>
        <span class="warn">(주의! 새로고침 시 게임이 종료되며, 포인트는 복구되지 않습니다.)</span>
    </div>
    <div class="game-modal-content">
        <span class="remain-count">남은 횟수 : {{ count }}</span>
        <div class="game-input">
            <input class="input-number" type="text" placeholder="숫자를 입력하세요" v-model="inputNum">
            <button class="submit" @click="doGame">제출</button>
        </div>
    </div>
    <div v-if="!success && gameCount > 0" class="game-modal-result">
        <span class="result">{{ ball }} 볼, {{ strike }} 스트라이크</span>
    </div>
    <div v-if="success" class="game-modal-result">
        <span class="success-result">성공입니다!</span>
        <button class="game-finish-button" @click="exitGame">종료</button>
    </div>
    <div v-if="!success && count === 0" class="game-modal-result">
        <span class="fail-result">실패! 정답은 <b>{{ goal.join('') }}</b> 입니다</span>
        <button class="game-finish-button" @click="exitGame">종료</button>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 숫자 야구 진행
 *    - menu: 메인 > 게임 카테고리 > 게임 상세 > 게임 진행 모달
 *    - layout: GameDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231204
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */

import { defineProps, ref, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['finishGame']);

let count = ref(0);
let goal = ref([]);
let inputNum = ref('');
let ball = ref('');
let strike = ref('');
let gameCount = ref(0);
let success = ref(false);

const regex = /^[0-9]+$/;

// 서로 다른 랜덤한 숫자 생성
function registRandomNumber(){
    
    while(goal.value.length < 3){
        let n = Math.floor(Math.random() * 10);
        if(!goal.value.includes(n)) goal.value.push(n);
    }
}

// 입력 유효성 검사
function inputValidation(value){
    if(String(value).includes(' ')){
        alert('공백을 입력할 수 없습니다!');
        return false;
    }

    if(value.length > 3 || value.length < 3){
        alert('숫자를 3개 입력해야합니다!');
        return false;
    }

    if(!regex.test(value)){
        alert('숫자만 입력 가능합니다!');
        return false;
    }

    return true;
}

// 게임 진행
function doGame(event){
    event.preventDefault();
    
    if(inputValidation(inputNum.value)){
        count.value -= 1;
        gameCount.value += 1;

        // 볼인지 스트라이크인지 체크
        strike.value = checkStrike(inputNum.value);
        ball.value = checkBall(inputNum.value);
        
        if(strike.value === 3) success.value = true;

        gameCount.value = count.value === 0 ? 0 : gameCount.value;
        
        finish(count.value);
    }else{
        inputNum.value = '';
    }

    
}

// ball 체크
function checkBall(value){
    const arr = String(value).split('');
    let ballCount = 0;
    for(let i = 0; i < 3; i++){
        if(Number(arr[i]) !== Number(goal.value[i])){
            if(goal.value.includes(Number(arr[i]))) ballCount++;
        }
    }
    return ballCount;
}

// strike 체크
function checkStrike(value){
    
    const arr = String(value).split('');
    let strikeCount = 0;
    for(let i = 0; i < 3; i++){
        if(Number(arr[i]) === Number(goal.value[i])) strikeCount++;
    }
    
    return strikeCount;
}

// 게임 종료
function finish(count){
    if(count === 0){
        document.querySelector('.input-number').disabled = true;
        document.querySelector('.submit').disabled = true; 
    }
}

function exitGame(){
    if(success.value){
        // 게임 성공
    }else{
        // 게임 실페
        emit('finishGame',false);
    }
    
}

defineProps({
    gameNum : {
        type : Number
    },
});

onMounted(() => {
    count.value = 3;
    registRandomNumber();
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
.input-number{
    margin-right : 10px;
}
</style>