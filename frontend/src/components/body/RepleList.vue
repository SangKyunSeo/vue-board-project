<template>
    <template :key="i" v-for="(button, i) in buttonCount + 1">
        <div class="board-reple-section" v-if="repleList.length > 0 && i === 0" :index="i">
            <div :key="j" v-for="(reple, j) in repleList.slice(i * contentCount, (i+1) * contentCount)" class="reple-content">
                <p class="reple-member">{{ reple.memberName }}</p>
                <p class="reple-content-detail">{{ reple.repleContent }}</p>
                <p class="reple-regdate">{{ reple.repleRegdate }}</p>
            </div>
            <div class="board-reple-add-button" v-if="i !== buttonCount">
                <button id="addButton" @click="showMoreReple(i)">더보기</button>
            </div>      
        </div>
        <div class="board-reple-section" v-if="repleList.length > 0 && i > 0" :index="i" style="display:none;">
            <div :key="j" v-for="(reple, j) in repleList.slice(i * contentCount, (i+1) * contentCount)" class="reple-content">
                <p class="reple-member">{{ reple.memberName }}</p>
                <p class="reple-content-detail">{{ reple.repleContent }}</p>
                <p class="reple-regdate">{{ reple.repleRegdate }}</p>
            </div>
            <div class="board-reple-add-button" v-if="i !== buttonCount">
                <button id="addButton" @click="showMoreReple(i)">더보기</button>
            </div>      
        </div>
        <div class="board-reple-section" v-if="repleList.length <= 0">
            등록된 댓글이 없습니다.
        </div> 
    </template>
</template>
<script setup>
import { defineProps, onMounted, ref } from 'vue';

const contentCount = ref(5);
let buttonCount = ref(0);

const props = defineProps({
    repleList: {
        type: Array
    }
});

// "더보기" 버튼 개수 구하기
function getButtonCount(){
    if(props.repleList.length >= contentCount.value) {
        if(props.repleList.length % contentCount.value === 0)
            return Math.floor(props.repleList.length / contentCount.value) - 1;
        return Math.floor(props.repleList.length / contentCount.value);
    }
    else return 0;
}

// "더보기" 버튼 클릭 시, 추가로 댓글 보이게 하기
function showMoreReple(index){
    document.getElementById('addButton').remove();
    document.querySelectorAll('.board-reple-section').forEach((element) => {
        if(Number(element.getAttribute('index')) === Number(index+1)) element.style.display = 'block';
    })
}

onMounted(() => {
    buttonCount.value = getButtonCount();
});

</script>
<style scoped>
.board-reple-section{
    width: 80%;
    margin: 0 auto;
    border-bottom: 1px solid #eee;
    text-align: left;
}
.reple-content{
    border-bottom: 1px solid #eee;
}
.reple-member{
    color:sienna;
    font-size: 14px;
}
.reple-content-detail{
    font-size: 20px;
}
.reple-regdate{
    color:thistle;
    font-size: 12px;
}
#addButton{
    width: 100%;
    padding: 10px;
    background: none;
    border: 1px solid #eee;
    font-size: 20px;
    cursor: pointer;
}
</style>

