<template>
    <div class="myPage-content-section">
        <div class="my-info-section">
            <h4>내 정보</h4>
            <div v-show="userDetail" class="my-info-content">
                <ul class="my-info-list">
                    <li>
                        <span class="title">이름 </span>
                        <span class="content">{{ userDetail.memberName }}</span>
                    </li>
                    <li>
                        <span class="title">성별 </span>
                        <span class="content">{{ userDetail.memberGender === 1 ? '남자' : '여자' }}</span>
                    </li>
                    <li>
                        <span class="title">아이디 </span>
                        <span class="content">{{ userDetail.memberId }}</span>
                    </li>
                    <li>
                        <span class="title">가입일 </span>
                        <span class="content">{{ String(userDetail.memberRegdate).slice(0,10) }}</span>
                    </li>
                </ul>
            </div>
            <div class="my-info-update-button">
                <button type="button" class="update-button" @click="updateMyInfo">수정</button>
            </div>
        </div>
        
        <div class="my-board-section">
            <h4>내가 쓴 글</h4>
            <div class="my-board-buttons">
                <button class="my-free-board">{{ userDetail.freeCount }}</button>
                
                <button class="my-anony-board">{{ userDetail.anonyCount }}</button>
            </div>
            <div class="my-board-span">
                <span>자유글</span>
                <span>익명글</span>
            </div>
        </div>
        <div class="my-point-section">
            <a>내 포인트 내역 확인하러 가기 ➡ </a>
        </div>
        <UpdateMyInfoModal v-if="updateModalOpen" @closeModal="close" :userDetail="userDetail" @changeName="change"/>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import UpdateMyInfoModal from '@/components/modal/UpdateMyInfoModal.vue'
let updateModalOpen = ref(false);
const emit = defineEmits(['changeName']);

defineProps({
    userDetail: {
        type : Object
    }
});

function updateMyInfo(){
    updateModalOpen.value = true;
}

const close = (data) => {
    if(data) updateModalOpen.value = false;
}

const change = (data) => {
    emit('changeName', data);
}
</script>

<style scoped>
.myPage-content-section{
    width : 50%;
    margin: 0px auto;
}
.my-info-section{
    border : 1px solid lightgreen;
    padding : 20px;
}
.my-board-section{
    margin-top: 40px;
    border : 1px solid lightcoral;
    padding : 20px;
}
.my-board-buttons{
    width : 50%;
    margin : 0px auto;
    display : flex;
    justify-content: space-between;
    height : 40px;
}
.my-free-board{
    font-size: 20px;
    background : none;
    border : 1px solid darkgray;
    width : 80px;
    border-radius : 10px;
    cursor : pointer;
    
}
.my-anony-board{
    font-size: 20px;
    background : none;
    border : 1px solid darkgray;
    width : 80px;
    border-radius : 10px;
    cursor : pointer;
}
.my-board-span{
    width : 41%;
    margin: 0px auto;
    display: flex;
    justify-content: space-between;
}

.my-info-list{
    list-style: none;
    text-align: left;
}
.my-info-list li{
    display: flex;
    padding : 10px;
}
.title{
    display: block;
    width: 100px;
    font-style : italic;
    font-weight : bold;
    font-size : 16px;
}
.my-info-update-button{
    width : 70%;
    margin : 0px auto;
}
.update-button{
    background-color: beige;
    border: none;
    width : 100%;
    color : gray;
    cursor : pointer;
}
.update-button:hover{
    color : black;
}
.my-point-section{
    margin-top : 20px;
}
.my-point-section a{
    cursor : pointer;
}
.my-point-section a:hover{
    font-weight: bold;
}
</style>