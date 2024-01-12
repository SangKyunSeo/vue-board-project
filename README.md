# Vue, ExpressJS 를 사용한 게시판 프로젝트

Vue3 문법에 익숙해지고 Javascript의 비동기적인 코드 구현을 연습하기 위한 프로젝트 입니다.

간단하게 CRUD 기능들이 구현되었고 추가로 포인트 제도와 같은 부가적인 기능들을 구현했습니다.

---
## 개발 환경
* Vue 3.2.13
* Pinia 2.1.7
* Javascript ES6
* ExpressJS 4.18.2
---

## 기술 스택
* Vue3
* composition API
* pinia
* pinia-plugin-persistedstate
* axios
* vue-router
* ExpressJS
* Multer
* MariaDB
* MySQL
---

# 주요 기능
> 구현한 여러 기능에 대한 간단한 설명입니다.

## 1. 로그인
* pinia 의 상태관리와 localStorage를 통해 사용자 정보와 로그인 상태를 관리합니다.

## 2. 포인트
* 금일을 조건으로 하여 출석 포인트를 획득할 수 있습니다.
* 자유글 작성과 익명글 작성으로 포인트를 차감합니다.
* 게임 참여를 통해 포인트를 사용하고 획득할 수 있습니다.

## 3. 게임
* 가위바위보 게임 : 두명 중 승자를 예측하여 포인트를 획득합니다.
* 징검다리 게임 : 2번의 기회가 존재하며 Up, Down 버튼을 선택해 7번을 통과하면 포인트를 획득합니다.
* 숫자야구 게임 : 3번의 기회안에 3스트라이크를 맞추면 포인트를 획득합니다.

## 4. 대댓글
> 프론트엔드에서 데이터를 가공하여 재정렬 하는 방식, 재귀 쿼리를 통해 path를 만들어 재정렬 하여 데이터를 반환하는 방식을 구현했습니다.
* 프론트엔드에서 재정렬 : 깊이우선탐색 (DFS) 알고리즘을 선택하여 Parent를 기준으로 자식 댓글들을 재정렬하는 방식입니다.
* 재귀 쿼리 : 데이터베이스에서 재귀 쿼리를 선택해 Path를 만들어 Parent 댓글과 child 댓글의 관계를 형성하고 재정렬하는 방식입니다.
### DFS를 통해 재정렬할 경우 데이터가 많아질 때 성능적 이슈가 발생가능하다는 피드백을 반영하여 DB에서 쿼리를 통해 해결하는 방식을 채택했습니다.
---

# 관련 코드

## DFS를 통한 재정렬
```javascript
 function getParentReple() {
     for (let reple of repleList.value) {
         if (reple.parentId === 0) parentReple.value.push(reple);
     }
 }


 function reSort(reple, repleList) {
     for (let i = 0; i < repleList.length; i++) {
         if (reple.repleNum === repleList[i].parentId) {
             reSortList.value.push(repleList[i]);
             //reSort(repleList[i], repleList.slice(i, repleList.length));
             reSort(repleList[i], repleList);
         }
     }
 }
```

## 재귀쿼리
```javascript
WITH RECURSIVE CTE AS (
        SELECT board_num, r.member_num, reple_num, parent_id, reple_content, DATE_FORMAT(reple_regdate, '%Y-%m-%d') as reple_regdate, member_name, group_id, reple_depth, CONVERT(reple_num, char) AS path FROM reple r JOIN member m ON r.member_num = m.member_num WHERE parent_id = 0 AND board_num = ${req.query.boardNum}
        UNION ALL 
        SELECT a.board_num, a.member_num, a.reple_num, a.parent_id, a.reple_content, DATE_FORMAT(a.reple_regdate, '%Y-%m-%d') as reple_regdate, m.member_name, a.group_id, a.reple_depth, CONCAT(path, '-', a.reple_num) AS path FROM reple a
        INNER JOIN CTE b ON a.parent_id = b.reple_num
        JOIN member m ON a.member_num = m.member_num
        WHERE a.board_num = ${req.query.boardNum} AND a.parent_id = b.reple_num
    )SELECT * FROM CTE ORDER BY CONVERT(SUBSTRING_INDEX(path, '-', 1), int)ASC, path ASC
```

