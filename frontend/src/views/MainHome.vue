<template>
    <div class="main-wrapper">
        <section class="main-search-section">
            <input type="search" placeholder="검색어를 입력하세요." class="search-input">
            <button type="button" class="search-button">검색</button>
        </section>
        <MainBody />
        
    </div>
</template>

<script setup>
import MainBody from '../components/body/MainBody.vue'

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