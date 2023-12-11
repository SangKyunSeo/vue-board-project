<template>
    <div class="my-point-section">
        <h3>내 포인트 내역</h3>
        <span class="back-main" @click="toggle">돌아가기</span>
        <div class="my-point-detail-section">
            <h5>포인트 내역</h5>
            <table class="my-point-detail-table">
                <thead>
                    <tr>
                        <th>포인트 번호</th>
                        <th>포인트 종류</th>
                        <th>포인트</th>
                        <th>포인트 날짜</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(point, index) in myPointDetail" :key="index">
                        <td>{{ point.pointNum }}</td>
                        <td v-if="point.pointCate === 1">자유글 작성</td>
                        <td v-if="point.pointCate === 2">익명글 작성</td>
                        <td v-if="point.pointCate === 3">출석</td>
                        <td v-if="point.pointCate === 4">댓글 작성</td>
                        <td v-if="point.pointType === 1" class="point-acquire">+ {{ point.pointScore }}</td>
                        <td v-else class="point-used">- {{ point.pointScore }}</td>
                        <td>{{ String(point.pointDate).slice(0,10) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="my-game-point-detail-section">
            <h5>게임 포인트 내역</h5>
            <table class="my-game-point-detail-table">
                <thead>
                    <tr>
                        <th>게임포인트 번호</th>
                        <th>게임포인트</th>
                        <th>게임</th>
                        <th>게임포인트 날짜</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(point, index) in myGamePointDetail" :key="index">
                        <td>{{ point.gamePointNum }}</td>
                        <td v-if="point.gamePointType === 1" class="game-point-acquire">+ {{ point.gamePoint }}</td>
                        <td v-else class="game-point-used">- {{ point.gamePoint }}</td>
                        <td>{{ point.gameTitle }}</td>
                        <td>{{ String(point.gamePointDate).slice(0,10) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 포인트내역
 *    - menu: 메인 > 마이페이지 카테고리 > 마이페이지 > 포인트
 *    - layout: MyPage
 *    - dev: 서상균
 *    - devVersion : 01_20231211
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */
import { defineEmits, defineProps } from 'vue';
const emit = defineEmits(['toggle']);

defineProps({
    myPointDetail : {
        type : Array
    },
    myGamePointDetail : {
        type : Array
    }
});

// 마이페이지 메인으로 이동
function toggle(){
    emit('toggle', 0);
}

</script>
<style scoped>
h5{
    background-color: beige;
}
.my-point-detail-section{
    width: 70%;
    margin: 0 auto;
}
.my-point-detail-table{
    width: 100%;
}
.my-game-point-detail-section{
    width: 70%;
    margin: 0 auto;
}
.my-game-point-detail-table{
    width: 100%;
}
.back-main{
    cursor: pointer;
}
.back-main:hover{
    font-weight: bold;
}
.point-acquire, .game-point-acquire{
    color: blue;
}
.point-used, .game-point-used{
    color: red;
}

</style>