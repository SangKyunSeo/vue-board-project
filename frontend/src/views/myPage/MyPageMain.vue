<template>
    <div class="myPage-section">
        <MainBodyHeader :msg="msg"/>
        <MyPageBody :userDetail="userDetail" @changeName="change"/>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 마이페이지
 *    - menu: 메인 > 마이페이지 카테고리 > 마이페이지
 *    - layout: MyPage
 *    - dev: 서상균
 *    - devVersion : 01_20231206
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */
import MainBodyHeader from '../../components/header/MainBodyHeader.vue';
import MyPageBody from '../../components/body/MyPageBody.vue';
import { ref, onMounted, inject } from 'vue'
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

const axios = inject('$axios');
const store = useUserStore();
const { getUserNum } = storeToRefs(store);
const msg = ref('마이페이지');
const userDetail = ref({});

// 사용자 상세 조회 API
 const getUserDetail = async () => {
    await axios.get('/api/member/getMemberDetail', {
        params : {
            memberNum : getUserNum.value
        }
    })
    .then(res => {
        userDetail.value = res.data;
    })
    .catch(error => console.log(error));
}

const change = (data) => {
    if(data){
        getUserDetail();
    }
}

onMounted(()=>{
    getUserDetail();
});

</script>


<style scoped>

.myPage-section{
    width: 70%;
}

</style>