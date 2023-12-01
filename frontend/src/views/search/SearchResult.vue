<template>
    <div class="search-main-section">
        <SearchForm v-if="searchWord" :searchWord="searchWord"/>
        <MainBodyHeader :msg="msg"/>
        <div class="search-result-section">
            <div class="search-result-article">
                <select v-model="searchCategory">
                   <option value="free">자유</option> 
                   <option value="anony">익명</option> 
                </select>
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
async function getSearchResult(){
    
    // 자유글 검색
    await axios.post('/api/search/getFreeSearch', {
        word : searchWord,
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
        word: searchWord,
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


onMounted(() => {
    msg.value = searchWord + ' 검색 결과';
    getSearchResult();
});

</script>
<style scoped>
.search-main-section{
    width: 70%;
}
</style>