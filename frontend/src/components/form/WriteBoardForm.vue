<template>
    <div class="write-board-form-section">
        <form class="write-board-form" v-on:submit="write">
            <div class="title-section">
                <label for="boardTitle">제목</label>
                <input type="text" class="title-input" id="boardTitle" placeholder="제목을 작성해주세요(최대20자)" v-model="boardTitle">
            </div>
            <div class="category-section">
                <label>카테고리</label>
                <select v-model="boardCategory">
                    <option selected>자유</option>
                    <option>익명</option>
                </select>
            </div>
            <div class="content-section">
                <label for="boardContent">내용</label>
                <textarea class="content-input" id="boardContent" v-model=boardContent></textarea>
            </div>
            <div class="form-button-section">
                <button type="submit" id="submit">작성</button>
                <button type="button" id="cancle">취소</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

const axios = inject('$axios');
const boardTitle = ref('');
const boardContent = ref('');
const boardCategory = ref('');
const router = new useRouter();
const route = new useRoute();
const store = useUserStore();
const { getUserPoint } = storeToRefs(store);

async function write(e){
    e.preventDefault();    
    if(boardCategory.value === ''){
        alert('카테고리를 선택하세요');
        return;
    }
    if(boardCategory.value === '자유' && getUserPoint < 30){
        alert('자유글 작성은 30포인트가 필요합니다!');
        return;
    }
    if(boardCategory.value === '익명' && getUserPoint < 50){
        alert('익명글 작성은 50포인트가 필요합니다!');
        return;
    }
    
    const boardVO = {
        memberNum: route.query.memberNum,
        boardTitle: boardTitle.value,
        boardContent: boardContent.value,
        boardCategory: boardCategory.value === '자유' ? 1 : 2
    }
    await axios.post('/api/board/writeBoard', boardVO, {
        method: 'POST',
        header: {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data === 'success'){
            if(boardCategory.value === '자유'){
                // 자유게시판 포인트 차감
                usePointForFree();
            }else{
                // 익명게시판 포인트 차감
                usePointForAnony();
            }   
            router.push('/');
        }else{
            alert('글 작성 오류');
        }
    })
    .catch(error => console.log(error));
}

async function usePointForFree(){
    await axios.post('/api/point/useFreeBoard',{
        memberNum : route.query.memberNum,
        pointCate: 1,
        pointScore: 30,
        pointType: 2
    },{
        method: 'POST',
        header: {'Content-Type': 'application/json'}
    })
    .then(res => {
        if(res.data) {
            console.log('자유 게시판 포인트 차감 성공');
            store.setUserPoint(getUserPoint.value - 30);
            localStorage.setItem('memberPoint', getUserPoint.value);
        }
        else console.log('자유 게시판 포인트 차감 오류');
    })
    .catch(error => console.log(error));
}

async function usePointForAnony(){
    await axios.post('/api/point/useAnonyBoard',{
        memberNum : route.query.memberNum,
        pointCate: 2,
        pointScore: 50,
        pointType: 2
    },{
        method: 'POST',
        header: {'Content-Type': 'application/json'}
    })
    .then(res => {
        if(res.data) {
            console.log('익명 게시판 포인트 차감 성공');
            store.setUserPoint(getUserPoint.value - 50);
            localStorage.setItem('memberPoint', getUserPoint.value);
        }
        else console.log('익명 게시판 포인트 차감 오류');
    })
    .catch(error => console.log(error));
}

onMounted(() => {
    const user = localStorage.getItem('user');
    if(user === null || user.memberNum === '') router.push('/');
});

</script>

<style scoped>
.write-board-form-section{
    width: 60%;
    margin: 0 auto;
    
}

.write-board-form-section div{
    margin-top: 30px;
}

.write-board-form-section div label{
    display: inline-block;
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
    font-size: 24px;
}

.write-board-form-section div input, textarea{
    width: 100%;
    height: 40px;
    border: 1px solid lightgrey;
    border-radius: 10px;
}

.write-board-form-section div input, textarea:focus{
    outline: none;
}

.category-section select{
    margin-right: 100%;    
    height: 30px;
}

.title-input, .content-input{
    text-indent: 20px;
}

#submit{
    margin-right: 20px;
}

#cancle{
    margin-left: 20px;
}

</style>