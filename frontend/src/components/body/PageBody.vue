<template>
    <div class="page-section">
        <div class="page-content">
            <span v-if="prev" class="prev-button" @click="movePrevPage">이전</span>
            <div v-for="(page, i) in pageArray" :key="i">
                <span v-if="page === currentPage" style="color:red" class="current-page">{{ page }}</span>
                <span v-else class="page" @click="movePage(page)">{{ page }}</span>
            </div>
            <span v-if="next" class="next-button" @click="moveNextPage">다음</span>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 페이징 컴포넌트
 *    - menu: 페이지
 *    - layout: Page
 *    - dev: 서상균
 *    - devVersion : 01_20231213
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */

import { defineProps, defineEmits, ref, onMounted } from 'vue';
const props = defineProps({
    list : {
        type : Array
    },
    persPage : {
        type : Number
    },
    persData : {
        type : Number
    }
});
const emit = defineEmits(['currentPage']);

let totalData = ref(0);
let prev = ref(false);
let next = ref(false);
let totalPage = ref(0);
let currentPage = ref(1);
let startPage = ref(1);
let endPage = ref(0);
let pageArray = ref([]);


// 전체 페이지 구하기
function getTotalPage(totalData){
    totalPage.value = totalData % props.persData > 0 ? Math.floor(totalData / props.persData) + 1 : Math.floor(totalData / props.persData);
}

// 시작 페이지 구하기
function getStartPage(currentPage){
    startPage.value = Math.floor((currentPage - 1) / props.persPage) * props.persPage + 1;
}

// 끝 페이지 구하기
function getEndPage(currentPage){
    endPage.value = Math.floor((currentPage - 1) / props.persPage) * props.persPage + props.persPage;
    if(endPage.value > totalPage.value) endPage.value = totalPage.value;
}

// 다음 노출 여부
function getNext(){
    if(endPage.value < totalPage.value) next.value = true;
    else next.value = false;
}

// 이전 노출 여부
function getPrev(){
    if(startPage.value > 1) prev.value = true;
    else prev.value = false;
}

// 페이지 배열 만들기
function getPages(){
    for(let i = startPage.value ; i <= endPage.value ; i++){
        pageArray.value.push(i);
    }
}

// 페이지 배열 초기화
function initPages(){
    pageArray.value.length = 0;
}

// 페이지 이동
function movePage(page){
    currentPage.value = page;
    initPages();
    getStartPage(currentPage.value);
    getEndPage(currentPage.value);
    getNext();
    getPrev();
    getPages();
    emit('currentPage', currentPage.value);
}

// 다음 페이지 클릭 시 이동
function moveNextPage(){
    currentPage.value = endPage.value + 1;
    initPages();
    getStartPage(currentPage.value);
    getEndPage(currentPage.value);
    getNext();
    getPrev();
    getPages();
    emit('currentPage', currentPage.value);
}

// 이전 페이지 클릭 시 이동
function movePrevPage(){
    currentPage.value = startPage.value - 1;
    initPages();
    getStartPage(currentPage.value);
    getEndPage(currentPage.value);
    getNext();
    getPrev();
    getPages();
    emit('currentPage', currentPage.value);
}


onMounted(() => {
    totalData.value = props.list.length;
    getTotalPage(totalData.value);
    endPage.value = props.persPage;
    getStartPage(currentPage.value);
    getEndPage(currentPage.value);
    getNext();
    getPrev();
    getPages();
});

</script>
<style scoped>
.page-section{
    width: 100%;
}
.page-content{
    width: 100%;
    justify-content: center;
    display: flex;
    margin-top: 40px;
    line-height: 0;
}
.current-page{
    padding: 5px;
}
.page{
    padding: 5px;
    cursor: pointer;
}
.next-button, .prev-button{
    cursor: pointer;
}
</style>