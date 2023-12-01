<template>
    <div class="search-form-section">
        <section class="main-search-section">
            <input type="search" placeholder="검색어를 입력하세요." class="search-input" v-model="inputWord">
            <button type="button" class="search-button" @click="search">검색</button>
        </section>
    </div>
</template>
<script setup>
import { defineProps, inject, ref, onMounted } from 'vue'

const axios = inject('$axios');
const props = defineProps({
    searchWord : {
        type : String
    }
});

let inputWord = ref('');

// 게시물 검색 API
async function search(){
    await axios.post('/api/search/doSearch', {
        word : inputWord.value
    }, {
        method : 'POST',
        header : {'Content-Type' : 'application/json'}
    })
    .then(res => {
        console.log(res);
    })
    .catch(error => console.log(error));
}


onMounted(() => {
    inputWord.value = props.searchWord;
    console.log(inputWord.value);
});

</script>

<style scoped>
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
    background: url('../../assets/search.png') no-repeat;
    background-size: 100%;
    background-position: center;
}
</style>