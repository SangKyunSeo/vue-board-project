<template>
    <div class="board-buttons">
        <a :id="buttonId[index]" v-for="(element, index) in emoji" :key="index" class="buttons"
            @click="setReaction(index + 1)">
            <span>{{ element }}</span>
            <span>{{ reactionCountVO.get(index + 1) }}</span>
            <span>{{ word[index] }}</span>
        </a>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 익명글 반응 버튼
 *    - menu: 메인 > 익명 카테고리 > 익명글 상세
 *    - layout: AnonyBoardDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231201
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { defineEmits, defineProps, onMounted, defineExpose } from 'vue';

const emoji = ['🤩', '😀', '😫', '😥', '😤'];
const buttonId = ['button1', 'button2', 'button3', 'button4', 'button5'];
const word = ['좋아요', '응원해요', '별로에요', '슬퍼요', '화나요']
const emit = defineEmits(['reactionType']);

const props = defineProps({
    myReact: {
        type: Object
    },
    changeColorState: {
        type: Boolean
    },
    reactionCountVO: {
        type: Array
    }
});

// 반응 클릭시 해당 반응 타입 전달
function setReaction(type) {
    console.log(Object.keys(props.myReact).length + ', ' + type);
    if (props.myReact.reactionType === type) {
        emit('reactionType', 0);
    } else {
        emit('reactionType', type);
    }
}

// 내가 누른 반응 표시
function setColorMyReaction(type) {
    console.log('누른 반응 표시 작동 : ' + type);
    initColorMyReaction();
    const elements = document.getElementsByClassName('buttons');
    elements[type - 1].childNodes[1].style.color = 'red';
    elements[type - 1].childNodes[2].style.color = 'red';

}

// 내가 누른 반응 표시 초기화
function initColorMyReaction() {
    console.log('초기화 작동');
    initAllReaction();
}

// 내가 누른 반응이 있고 취소한 경우 스타일 초기화
function initAllReaction() {
    const elements = document.querySelectorAll('.buttons');

    elements.forEach((e) => {
        e.childNodes[1].style.color = '';
        e.childNodes[2].style.color = '';
    });
}

onMounted(() => {
    console.log(props.myReact.reactionType);
    if (Object.keys(props.myReact).length > 0 && props.myReact.reactionType !== 0) {
        setColorMyReaction(props.myReact.reactionType);
    }


});

defineExpose({
    setColorMyReaction,
    initColorMyReaction
})
</script>
<style scoped>
.board-buttons {
    width: 100%;
    display: flex;
    justify-content: space-between;
    left: 0;
    height: 20px;
}

.board-buttons a {
    display: flex;
    flex-direction: column;
    cursor: pointer;

}

.board-buttons a span {
    display: flex;
    justify-content: center;
}
</style>