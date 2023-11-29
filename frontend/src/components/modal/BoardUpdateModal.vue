<template>
    <div class="board-update-modal-section">
        <div class="board-update-modal-content">
            <div class="board-update-modal-body">
                <form class="board-update-form">
                    <div class="board-update-title-section">
                        <label for="boardTitle">제목</label>
                        <input type="text" class="update-title-input" id="boardTitle" v-model="boardTitle" maxlength="20">
                    </div>
                    <div class="board-update-content-section">
                        <label for="boardContent">내용</label>
                        <textarea class="update-content-input" id="boardContent" v-model="boardContent" maxlength="1000"></textarea>
                    </div>
                    <div class="board-update-buttons">
                        <button class="doUpdate" @click="updateBoard">확인</button>
                        <button class="doNotUpdate" @click="updateCancel">취소</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, ref, inject } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../stores/user-store'


const store = useUserStore();
const { getUserNum } = storeToRefs(store);
const axios = inject('$axios');

let boardTitle = ref('');
let boardContent = ref('');

const emit = defineEmits(['upateModalClose']);

const props = defineProps({
    boardDetail : {
        type: Object
    }
});

function getTitle(){
    boardTitle.value = props.boardDetail.boardTitle;
}

function getContent(){
    boardContent.value = props.boardDetail.boardContent;
}

function updateCancel(){
    emit('updateModalClose', true);
}

function updateBoard(event){
    event.preventDefault();

    
    // 작성자와 로그인한 회원 비교
    if(props.boardDetail.memberNum !== Number(getUserNum.value)){
        alert('작성자만 수정할 수 있습니다!');
        return;
    }
    
    // 제목 입력 유효성
    if(boardTitle.value === '' || boardTitle.value === null){
        alert('제목을 입력하세요!');
        return;
    }
    
    // 내용 입력 유효성
    if(boardContent.value === '' || boardContent.value === null){
        alert('내용을 입력하세요!');
        return;
    }

    // 수정 API 통신
    updateBoardAPI();
}

// 게시판 수정
async function updateBoardAPI(){
    await axios.post('/api/board/updateBoard',{
        boardNum : props.boardDetail.boardNum,
        boardTitle: boardTitle.value,
        boardContent: boardContent.value
    },{
        method: 'POST',
        header: {'Content-Type' : 'applicaiton/json'}
    })
    .then(res => {
        if(res.data){
            console.log('자유 게시글 수정 완료');
            let updatedBoardDetail = {
                boardTitle : boardTitle.value,
                boardContent : boardContent.value
            }

            emit('updateModalClose', true);
            emit('updatedBoardDetail', updatedBoardDetail);
            
        }
    })
    .catch(error => console.log(error));
}

onMounted(() => {
    getTitle();
    getContent();
});


</script>



<style scoped>
.board-update-modal-section{
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
.board-update-modal-body{
    width: 500px;
    height: 300px;
    padding: 30px 30px;
    margin: 0 auto;
    border: 1px solid #777;
    background-color: #fff;
}

.board-update-form div{
    margin-top : 30px;
}
.board-update-form div label{
    display: inline-block;
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
    font-size: 24px;
}
.board-update-form div input, textarea{
    width: 100%;
    height: 40px;
    border: 1px solid lightgrey;
    border-radius: 10px;
    font-size: 16px;
}

.board-update-form div input, textarea:focus{
    outline: none;
}

.doUpdate{
    margin-right: 20px;
    background-color: #eee;
    border: none;
    cursor: pointer;
}
.doNotUpdate{
    background-color: #eee;
    border: none;   
    cursor: pointer;
}
</style>