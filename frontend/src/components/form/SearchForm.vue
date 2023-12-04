<template>
    <div class="search-form-section">
        <section class="main-search-section">
            <input type="search" placeholder="검색어를 입력하세요." class="search-input" v-model="inputWord">
            <button type="button" class="search-button" @click="search">검색</button>
        </section>
    </div>
</template>
<script setup>
import { defineProps, defineEmits , ref, onMounted } from 'vue'

const props = defineProps({
    searchWord : {
        type : String
    }
});
const emit = defineEmits(['inputWord']);


let inputWord = ref('');

function search(){
    emit('inputWord', inputWord.value);
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