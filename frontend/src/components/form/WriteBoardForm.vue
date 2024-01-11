<template>
    <div class="write-board-form-section">
        <form class="write-board-form" v-on:submit="write">
            <div class="title-section">
                <label for="boardTitle">제목</label>
                <input type="text" class="title-input" id="boardTitle" placeholder="제목을 작성해주세요(최대20자)" v-model="boardTitle"
                    maxlength="20">
            </div>
            <div class="category-section">
                <label>카테고리</label>
                <select v-model="boardCategory">
                    <option selected>자유</option>
                    <option>익명</option>
                </select>
            </div>
            <div class="file-section">
                <label for="file">이미지 업로드</label>
                <input type="file" name="imageFiles" class="input-file" id="file" @change="changeFiles">
                <div class="file-content">
                    <p class="file-name" v-for="(file, index) in fileNameArray" :key="index">
                        <span>{{ file }}</span>
                        <button type="button" @click="deleteFile(index)">삭제</button>
                    </p>
                </div>
            </div>
            <div class="content-section">
                <label for="boardContent">내용</label>
                <textarea class="content-input" id="boardContent" v-model="boardContent" maxlength="1000"></textarea>
            </div>
            <div class="form-button-section">
                <button type="submit" id="submit">작성</button>
                <button type="button" id="cancle" @click="writeCancel">취소</button>
            </div>
        </form>
    </div>
    <div v-for="(image, index) in imageUrlList" :key="index">
        <img :src="`${image.imageUrl}`">
    </div>
</template>

<script setup>
/**
 * @description
 *    - title: 글작성 폼
 *    - menu: 메인 > 글쓰기
 *    - layout: WriteBoardForm
 *    - dev: 서상균
 *    - devVersion : 01_20231128
 *    - rework: 완료
 *    - uxWriting: 완료
 */

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
const fileNameArray = ref([]);
const fileList = ref([]);

const imageUrlList = ref([]);

//파일 업로드
async function uploadFile(boardNum) {

    if (fileList.value.length > 0) {
        const formData = new FormData();
        fileList.value.forEach((e) => {
            formData.append('userFile', e);
        });
        formData.append('boardNum', boardNum);
        await axios.post('/api/board/uploadFile', formData, {
            header: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                if (res.data === 'success') {
                    console.log('데이터 삽입 성공');
                } else {
                    console.log('데이터 통신 오류');
                }
            })
            .catch(error => console.log(error));
    }
}



// 글작성 API
async function write(e) {
    e.preventDefault();
    if (boardTitle.value === '') {
        alert('제목을 입력하세요.');
        return;
    }

    if (boardContent.value === '') {
        alert('내용을 입력하세요.');
        return;
    }

    if (boardCategory.value === '') {
        alert('카테고리를 선택하세요');
        return;
    }
    if (boardCategory.value === '자유' && getUserPoint.value < 30) {
        alert('자유글 작성은 30포인트가 필요합니다!');
        return;
    }
    if (boardCategory.value === '익명' && getUserPoint.value < 50) {
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
        header: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.data.msg === 'success') {
                if (boardCategory.value === '자유') {
                    // 자유게시판 포인트 차감
                    usePointForFree();
                } else {
                    // 익명게시판 포인트 차감
                    usePointForAnony();
                }

                // 파일 데이터 삽입
                const boardNum = res.data.boardNum;
                uploadFile(boardNum);


                router.push('/');
            } else {
                alert('글 작성 오류');
            }
        })
        .catch(error => console.log(error));
}

// 글쓰기 취소
function writeCancel() {
    router.push('/');
}

// 자유글 작성시 포인트 차감
async function usePointForFree() {
    await axios.post('/api/point/useFreeBoard', {
        memberNum: route.query.memberNum,
        pointCate: 1,
        pointScore: 30,
        pointType: 2
    }, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.data) {
                console.log('자유 게시판 포인트 차감 성공');
                store.setUserPoint(getUserPoint.value - 30);
                localStorage.setItem('memberPoint', getUserPoint.value);
            }
            else console.log('자유 게시판 포인트 차감 오류');
        })
        .catch(error => console.log(error));
}

// 익명글 작성시 포인트 차감
async function usePointForAnony() {
    await axios.post('/api/point/useAnonyBoard', {
        memberNum: route.query.memberNum,
        pointCate: 2,
        pointScore: 50,
        pointType: 2
    }, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.data) {
                console.log('익명 게시판 포인트 차감 성공');
                store.setUserPoint(getUserPoint.value - 50);
                localStorage.setItem('memberPoint', getUserPoint.value);
            }
            else console.log('익명 게시판 포인트 차감 오류');
        })
        .catch(error => console.log(error));
}

// 파일 첨부 시 파일명 출력
function changeFiles() {
    if (fileNameArray.value.includes(document.getElementById('file').value)) {
        alert('같은 파일이 존재합니다');
        return;
    }

    if (fileNameArray.value.length >= 3) {
        alert('최대 3개 까지의 이미지만 첨부 가능합니다.');
        return;
    }

    fileNameArray.value.push(document.getElementById('file').value);
    fileList.value.push(document.getElementById('file').files[0]);
}

// 첨부된 파일 삭제
function deleteFile(index) {
    fileNameArray.value.splice(index, 1);
    fileList.value.splice(index, 1);
}


onMounted(() => {
    const user = localStorage.getItem('user');
    if (user === null || user.memberNum === '') router.push('/');
});

</script>

<style scoped>
.write-board-form-section {
    width: 60%;
    margin: 0 auto;

}

.write-board-form-section div {
    margin-top: 30px;
}

.write-board-form-section div label {
    display: inline-block;
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
    font-size: 24px;
}

.title-input,
textarea {
    width: 100%;
    height: 40px;
    border: 1px solid lightgrey;
    border-radius: 10px;
}

.file-section label {
    display: inline-block;
    height: 40px;
    color: #999999;
    cursor: pointer;
    width: 20%;
}

.file-section label:hover {
    color: black;
}

input[type="file"] {
    width: 0;
    height: 0;
    border: 0;
    position: absolute;
    overflow: hidden;
}

.title-input,
textarea:focus {
    outline: none;
}

.category-section select {
    margin-right: 100%;
    height: 30px;
}

.title-input,
.content-input {
    text-indent: 20px;
}

#submit {
    margin-right: 20px;
}

#cancle {
    margin-left: 20px;
}

.file-name {
    display: flex;
    justify-content: space-between;
}
</style>