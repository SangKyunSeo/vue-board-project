<template>
    <div class="board-buttons">
        <a>
            <span>🤩</span>
            <span id="reactionCount">0</span>
            <span>좋아요</span>
        </a>
        <a>
            <span>😀</span>
            <span id="reactionCount">0</span>  
            <span>응원해요</span>
        </a>
        <a>
            <span>😫</span>
            <span id="reactionCount">0</span>
            <span>별로에요</span>
        </a>      
        <a>
            <span>😥</span>
            <span id="reactionCount">0</span>
            <span>슬퍼요</span>
        </a>
        <a>
            <span>😤</span>
            <span id="reactionCount">10</span>
            <span>화나요</span>
        </a>
    </div>
</template>
<script setup>

</script>
<style scoped>

.board-buttons{
    width: 100%;
    display: flex;
    justify-content: space-between;
    left: 0;
    height: 20px;
}

.board-buttons a{
    display: flex;
    flex-direction: column;
    cursor: pointer;
    
}
.board-buttons a span{
    display: flex;
    justify-content: center;
}
</style>