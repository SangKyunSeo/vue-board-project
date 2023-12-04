<template>
    <div class="main-wrapper">
        <section class="main-search-section">
            <input type="search" placeholder="검색어를 입력하세요." class="search-input" v-model="searchWord">
            <button type="button" class="search-button" @click="search">검색</button>
        </section>
        <MainBody />
        
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: 메인
 *    - menu: 메인
 *    - layout: main
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import MainBody from '../components/body/MainBody.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = new useRouter();

let searchWord = ref('');

// 메인 화면에서 검색 시 검색 화면으로 이동
function search(){
    router.push({path : '/search', query:{
        searchWord : searchWord.value
    }});
}

</script>

<style scoped>
.main-wrapper{
    width:70%;
}

.main-search-section{
    position: relative;

}

.search-input{
    width: 50%;
    height: 40px;
    border-radius: 50px;
    border: 1px solid #bfc6c7;
    text-indent: 40px;
}
.search-input:focus{
    outline: 1px solid #969799;
}
.search-input:focus::placeholder{
    color: transparent;
}

.search-button{
    position: absolute;
    background: transparent;
    border: none;
    left: 220px;
    top: 8px;
    color: white;
    cursor: pointer;
}

.search-button::before{
    position: absolute;
    width: 50%;
    height: 100%;
    content: '';
    background: url('../assets/search.png') no-repeat;
    background-size: 100%;
    background-position: center;
}
</style>