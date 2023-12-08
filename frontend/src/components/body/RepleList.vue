<template>
    <template :key="i" v-for="(button, i) in buttonCount + 1">
        <div class="board-reple-section" v-if="repleList.length > 0 && i === 0" :index="i">
            <div :key="j" v-for="(reple, j) in repleList.slice(i * contentCount, (i+1) * contentCount)" class="reple-content">
                <div class="reple-content-details">
                    <p class="reple-member">{{ reple.memberName }}</p>
                    <p class="reple-content-detail">{{ reple.repleContent }}</p>
                    <p class="reple-regdate">{{ reple.repleRegdate }}</p>
                </div>
                <div class="reple-reple-content">
                    <span @click="showReplyForm(j)">💭</span>
                </div>
                <div v-if="showReply[j]" class="reply-section">
                    <textarea class="reply-write-content" id="repleContent" v-model="replyContent[j]" maxlength="1000" ></textarea>
                    <p>{{ 1000 - replyContent[j].length }}</p>
                    <div class="reply-write-buttons">
                        <button class="reply-write-check" @click="setReply(j)">확인</button>
                        <button class="reply-write-cancel" @click="cancelShowReply(j)">취소</button>
                    </div>
                </div>
            </div>
            <div class="board-reple-add-button" v-if="i !== buttonCount">
                <button id="addButton" @click="showMoreReple(i)">더보기</button>
            </div>      
        </div>
        <div class="board-reple-section" v-if="repleList.length > 0 && i > 0" :index="i" style="display:none;">
            <div :key="j" v-for="(reple, j) in repleList.slice(i * contentCount, (i+1) * contentCount)" class="reple-content">
                <p class="reple-member">{{ reple.memberName }}</p>
                <p class="reple-content-detail">{{ reple.repleContent }}</p>
                <p class="reple-regdate">{{ reple.repleRegdate }}</p>
            </div>
            <div class="board-reple-add-button" v-if="i !== buttonCount">
                <button id="addButton" @click="showMoreReple(i)">더보기</button>
            </div>      
        </div>
        <div class="board-reple-section" v-if="repleList.length <= 0">
            등록된 댓글이 없습니다.
        </div> 
    </template>
</template>
<script setup>
/**
 * @description
 *    - title: 자유글 댓글 리스트 노출
 *    - menu: 메인 > 자유 카테고리 > 자유글 상세 > 해당 자유글 관련 댓글 리스트 
 *    - layout: FreeBoardDetail
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import axios from 'axios';
import { defineProps, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user-store';
import { storeToRefs } from 'pinia';

const store = useUserStore();
const { getUserNum } = storeToRefs(store);

const contentCount = ref(5);
let buttonCount = ref(0);
let showReply = ref([]);
let replyContent = ref([]);

const props = defineProps({
    repleList: {
        type: Array
    }
});

// 대댓글 버튼 클릭 시 대댓글 입력 폼 노출
function showReplyForm(index){
    if(props.repleList[index].memberNum === getUserNum.value){
        alert('본인이 작성한 댓글에 대댓글을 작성할 수 없습니다.');
        return;
    }
    showReply.value[index] = true;
}

function cancelShowReply(index){
    showReply.value[index] = false;
}

// "더보기" 버튼 개수 구하기
function getButtonCount(){
    if(props.repleList.length >= contentCount.value) {
        if(props.repleList.length % contentCount.value === 0)
            return Math.floor(props.repleList.length / contentCount.value) - 1;
        return Math.floor(props.repleList.length / contentCount.value);
    }
    else return 0;
}

// "더보기" 버튼 클릭 시, 추가로 댓글 보이게 하기
function showMoreReple(index){
    document.getElementById('addButton').remove();
    document.querySelectorAll('.board-reple-section').forEach((element) => {
        if(Number(element.getAttribute('index')) === Number(index+1)) element.style.display = 'block';
    })
}

// 대댓글 등록
async function setReply(index){
    
    // 대댓글의 groupID는 부모의 groupID
    const groupId = props.repleList[index].groupId;

    // 대댓글의 detph는 부모의 depth + 1
    const repleDepth = props.repleList[index].repleDepth + 1;

    // 부모의 ID가 필요 (해당 부모의 ID는 repleNum이 되는거고, 걔가 parent_id로 들어감)
    const parentId = props.repleList[index].repleNum;

    const childNums = 0;
    
    const boardNum = props.repleList[index].boardNum;
    const repleContent = replyContent.value[index];

    // 대댓글 데이터 테이블에 삽입
    await axios.get('/api/reple/getRepleNum')
    .then(res => {
        console.log(res.data.repleNum);

        // 대댓글 삽입
        axios.post('/api/reple/setReply', {
            repleNum : res.data.repleNum,
            repleContent : repleContent,
            memberNum : getUserNum.value,
            boardNum : boardNum,
            groupId : groupId,
            repleDepth : repleDepth,
            parentId : parentId,
            childNums : childNums
        },{
            method: 'POST',
            header: {'Content-Type' : 'application/json'}
        })
        .then(res => {
            console.log(res.data);
            if(res.data){
                updateChildNums(parentId, index);
            }
        })  
        .catch(error => console.log(error));

    })
    .catch(error => console.log(error));

    // 해당 댓글의 childNum은 0이고, 부모의 childNum은 1을 추가함
}

// 부모 댓글의 자식 수 증가
async function updateChildNums(parentId, index){
    await axios.post('/api/reple/updateChildNums',{
        repleNum : parentId
    },{
        method: 'POST',
        header : {'Content-Type' : 'application/json'}
    })
    .then(res => {
        if(res.data) {
            console.log('자식 댓글 수 증가 성공');
            showReply.value[index] = false;
        }
        else console.log('자식 댓글 수 증가 실패');
    })
    .catch(error => console.log(error));
}



onMounted(() => {
    buttonCount.value = getButtonCount();

    // 댓글 개수만큼 대댓글 폼 노출 유무 설정
    if(props.repleList.length > 0){
        for(let i = 0; i < props.repleList.length ; i++){
            showReply.value.push(false);
            replyContent.value.push('');
        }
    }
});

</script>
<style scoped>
.board-reple-section{
    width: 80%;
    margin: 0 auto;
    border-bottom: 1px solid #eee;
    text-align: left;
}
.reple-content{
    border-bottom: 1px solid #eee;
    display : flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.reple-reple-content{
    display : flex;
    align-items : center;
    margin-right : 20px;
    cursor: pointer;
}
.reple-member{
    color:sienna;
    font-size: 14px;
}
.reple-content-detail{
    font-size: 20px;
}
.reple-regdate{
    color:thistle;
    font-size: 12px;
}
#addButton{
    width: 100%;
    padding: 10px;
    background: none;
    border: 1px solid #eee;
    font-size: 20px;
    cursor: pointer;
}

.reply-section{
    flex-basis: 100%;
    text-align: center;
}
.reply-write-content{
    width: 100%;
    height: 100px;
    font-size: 16px;
}
</style>

