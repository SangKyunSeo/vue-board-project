<template>
    <div v-if="boardDetail" class="anony-board-detail-section">
        <div class="board-title">
            <h1>{{ boardDetail.boardTitle }}</h1>
            <span>{{ boardDetail.boardRegdate.slice(0, 10) }}</span>
        </div>
        <div class="board-main">
            <span>{{ boardDetail.boardContent }}</span>
        </div>
        <AnonyBoardButton v-if="buttonShowState" @reactionType="reactType" :myReact="myReact" ref="childFunction"
            :reactionCountVO="reactionCountVO" />
    </div>
</template>
<script setup>
/**
 * @description
 *    - title: 익명 게시판 상세
 *    - menu: 메인 > 익명 카테고리 > 익명 글 상세
 *    - layout: AnonyBoardDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231201
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import { inject, ref, onMounted, onBeforeMount } from 'vue'
import { useUserStore } from '../../stores/user-store'
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import AnonyBoardButton from '../../components/button/AnonyBoardButton.vue';

const axios = inject('$axios');
const boardDetail = ref();
const store = useUserStore();
const { getUserNum } = storeToRefs(store);
const route = new useRoute();
const boardNum = route.query.boardNum;
const childFunction = ref();


let myReact = ref({});
let buttonShowState = ref(false);
let reactionCountVO = ref(new Map());

// 반응 개수 map 객체 초기화
function initMap() {
    reactionCountVO.value.set(1, 0);
    reactionCountVO.value.set(2, 0);
    reactionCountVO.value.set(3, 0);
    reactionCountVO.value.set(4, 0);
    reactionCountVO.value.set(5, 0);
}

// 익명 게시글 상세 내용 조회
async function getBoardDetail() {
    await axios.get('/api/board/boardDetail', {
        params: {
            boardNum: boardNum
        }
    })
        .then(res => {
            boardDetail.value = res.data;
        })
        .catch(error => console.log(error));
}

// 익명 게시글 반응 개수 조회
async function getReaction() {
    await axios.get('/api/react/getReaction', {
        params: {
            boardNum: boardNum
        }
    })
        .then(res => {
            console.log('반응 데이터 개수 : ' + res.data.length);
            if (res.data.length > 0) {
                initMap();
                for (let vo of res.data) {
                    if (vo.reactionType !== 0) {
                        reactionCountVO.value.set(vo.reactionType, vo.reactionCount);
                    }
                }
            }
        })
        .catch(error => console.log(error));
}

// 반응을 한 적이 있는지 API 통신
async function getMyReaction() {
    axios.get('/api/react/getMyReaction', {
        params: {
            boardNum: boardNum,
            memberNum: getUserNum.value
        }
    })
        .then(res => {
            console.log(`반응을 한 적 있는지 API : data = ${res.data}`);
            myReact.value = res.data;
            buttonShowState.value = true;
            console.log('나의 반응 가져오기 : ' + typeof myReact.value + ', ' + myReact.value);
            console.log(Object.keys(myReact.value).length);
        })
        .catch(error => console.log(error));
}

// 반응 눌렀을 때
const reactType = (data) => {

    if (getUserNum.value === boardDetail.value.memberNum) {
        alert('본인이 작성한 글에 반응할 수 없습니다');
        return;
    }

    if (Object.keys(myReact.value).length > 0) {
        // 반응을 한 적이 있는 경우 데이터 update
        updateReaction(data);
    } else {
        // 반응을 한 적이 없을 경우 데이터 insert 
        insertReaction(data);
    }

};

// 반응 삽입 API
async function insertReaction(type) {
    await axios.post('/api/react/insertMyReaction', {
        memberNum: getUserNum.value,
        boardNum: boardNum,
        reactionType: type
    }, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.data) {
                getMyReaction();
                getReaction();
                childFunction.value.setColorMyReaction(type);
            }
            else console.log('반응 삽입 통신 오류');
        })
        .catch(error => console.log(error));
}

// 반응 수정 API
async function updateReaction(type) {
    await axios.post('/api/react/updateMyReaction', {
        memberNum: getUserNum.value,
        boardNum: boardNum,
        reactionType: type
    }, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.data) {
                getMyReaction().then(console.log('데이터 통신 후 ' + myReact.value.reactionType + '데이터 통신하기 전 타입' + type));
                getReaction();

                if (type === 0) childFunction.value.initColorMyReaction();
                else childFunction.value.setColorMyReaction(type);
            }
            else console.log('반응 수정 통신 오류');
        })
        .catch(error => console.log(error));
}

onBeforeMount(() => {
    getBoardDetail();
});

onMounted(() => {
    // 반응을 한 적이 있는지 확인
    getMyReaction();
    getReaction();
    // 반응 개수 map 객체 초기화
    initMap();
});
</script>
<style scoped>
.anony-board-detail-section {
    width: 50%;
    margin: 40px auto;
    height: 60%;
    text-align: left;
    padding: 40px;
    border: 0.5px solid #eee;

}

.board-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
}

.board-title span {
    font-size: 14px;
    color: #999;

}

.board-main {
    margin-top: 60px;
    min-height: calc(100% - 100px);
}
</style>