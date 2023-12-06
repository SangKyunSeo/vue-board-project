<template>
    <div class="update-modal-section">
        <div class="update-modal-content">
            <div class="update-modal-body">
                <div class="update-modal-head">
                    <span class="update-modal-title">내 정보 수정</span>
                    <button @click="close">닫기</button>
                </div>
                <UpdateMyInfoBody v-show="userDetail" :userDetail="userDetail" @closeModal="closeUpdateModal" @changeName="change"/>
            </div>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 내 정보 수정 모달
 *    - menu: 메인 > 마이페이지 > 수정 버튼 
 *    - layout: MyPage
 *    - dev: 서상균
 *    - devVersion : 01_20231206
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import UpdateMyInfoBody from '../body/UpdateMyInfoBody.vue';
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['closeModal']);
defineProps({
    userDetail : {
        type : Object
    }
})

// 모달창 닫기 위한 데이터 전달
function close(){
    emit('closeModal', true);
}

// 수정 후 모달창 닫기 위한 데이터 전달
const closeUpdateModal = (data) => {
    if(data) emit('closeModal', true);
}

// 이름 변경을 알리기 위한 데이터 전달
const change = (data) => {
    emit('changeName', data);
}

</script>
<style scoped>
.update-modal-section{
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.update-modal-body{
    width: 500px;
    height: 400px;
    padding: 20px;
    margin: 0 auto;
    border: 1px solid #777;
    background-color: #fff;
}
.update-modal-head{
    display : flex;
    justify-content: space-between;
    border-bottom : 1px solid black;
}
.update-modal-head button{
    cursor: pointer;
    background: none;
    border : none;
    font-size: 15px;
}
.update-modal-head span{
    font-weight: bold;
    font-size: 20px;
}
</style>