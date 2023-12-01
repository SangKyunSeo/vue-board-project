<template>
    <div class="board-buttons">
        <a :id="buttonId[index]" v-for="(element, index) in emoji" :key="index" class="buttons" @click="setReaction(index+1)">
            <span>{{ element }}</span>
            <span>{{ reactionCountVO.get(index+1) }}</span>
            <span>{{ word[index] }}</span>
        </a>
    </div>
</template>
<script setup>
import { defineEmits, defineProps, onMounted, defineExpose } from 'vue';

const emoji = ['🤩','😀','😫','😥','😤'];
const buttonId = ['button1', 'button2', 'button3', 'button4','button5'];
const word = ['좋아요', '응원해요', '별로에요', '슬퍼요', '화나요']
const emit = defineEmits(['reactionType']);

const props = defineProps({
    myReact : {
        type: Object
    },
    changeColorState : {
        type: Boolean
    },
    reactionCountVO : {
        type : Array
    }
});

function setReaction(type){
    console.log(Object.keys(props.myReact).length + ', ' + type);
    if(props.myReact.reactionType === type){
        emit('reactionType', 0);    
    }else{
        emit('reactionType', type);
    }
}

// 내가 누른 반응 표시
function setColorMyReaction(type){
    console.log('누른 반응 표시 작동');
    initColorMyReaction();
    const elements = document.querySelectorAll('.buttons');
    
    elements[type - 1].childNodes[1].style.color='red';
    elements[type - 1].childNodes[2].style.color='red';

}

// 내가 누른 반응 표시 초기화
function initColorMyReaction(){
    console.log('초기화 작동');
    const elements = document.querySelectorAll('.buttons');
    if(Object.keys(props.myReact).length > 0 && props.myReact.reactionType !== 0){
        elements[props.myReact.reactionType - 1].childNodes[1].style.color='';
        elements[props.myReact.reactionType - 1].childNodes[2].style.color='';
    }
}

onMounted(() => {
    console.log(props.myReact.reactionType);
    if(Object.keys(props.myReact).length > 0){
        setColorMyReaction(props.myReact.reactionType);
    }

    
});

defineExpose({
    setColorMyReaction,
    initColorMyReaction
})
</script>
<style scoped>

.board-buttons{
    width: 100%;
    display: flex;
    justify-content: space-between;
    left: 0;
    height: 20px;
}

.board-buttons a{
    display: flex;
    flex-direction: column;
    cursor: pointer;
    
}
.board-buttons a span{
    display: flex;
    justify-content: center;
}
</style>