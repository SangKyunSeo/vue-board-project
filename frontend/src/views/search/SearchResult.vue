<template>
    <div class="search-main-section">
        <SearchForm v-if="searchWord" :searchWord="searchWord" @inputWord="inputWordSearch"/>
        <MainBodyHeader :msg="msg"/>
        <div class="search-result-section">
            <div class="search-result-article">
                <div class="select-section">
                    <select v-model="searchCategory">
                        <option value="free">자유</option> 
                        <option value="anony">익명</option> 
                    </select>
                </div>
                <div v-if="(searchCategory === 'free' && freeSearch.length === 0) || (searchCategory === 'anony' && anonySearch.length === 0)">
                    <h4> 검색한 결과가 없습니다. </h4>
                </div>
                <SearchResultBody v-if="searchCategory === 'free' && freeSearch.length > 0" :searchResult="freeSearch"/>
                <SearchResultBody v-if="searchCategory === 'anony' && anonySearch.length > 0" :searchResult="anonySearch"/>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, inject } from 'vue';
import MainBodyHeader from '../../components/header/MainBodyHeader.vue';
import SearchForm from '../../components/form/SearchForm.vue';
import SearchResultBody from '../../components/body/SearchResultBody.vue';


const axios = inject('$axios');
const route = new useRoute();
const searchWord = route.query.searchWord;
const msg = ref();
const freeSearch = ref([]);
const anonySearch = ref([]);

let searchCategory = ref('free');

// 검색 API
async function getSearchResult(word){
    
    // 자유글 검색
    await axios.post('/api/search/getFreeSearch', {
        word : word,
        boardCategory : 1
    },{
        method : 'POST',
        header : {'Content-Type' : 'application/json'}
    })
    .then(res => {
        freeSearch.value = res.data;
        console.log(freeSearch.value);
    })  
    .catch(console.log);

    // 익명글 검색
    await axios.post('/api/search/getAnonySearch', {
        word: word,
        boardCategory : 2
    }, {
        method : 'POST',
        header : {'Content-Type' : 'application/json'}
    })
    .then(res => {
        anonySearch.value = res.data;
        console.log(anonySearch.value);
    })
    .catch(console.log);
}

const inputWordSearch = (data) => {
    msg.value = data + ' 검색 결과';
    getSearchResult(data);
}

onMounted(() => {
    msg.value = searchWord + ' 검색 결과';
    getSearchResult(searchWord);
});

</script>
<style scoped>
.search-main-section{
    width: 70%;
}
.search-result-article{
    display: flex;
    flex-wrap:wrap;
}
.select-section{
    width: 100%;
    text-align: left;
    
}
.select-section select{
    border: none;
}
</style>