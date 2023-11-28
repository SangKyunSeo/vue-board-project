<template>
    <div class="main-content-section">
        <h3>{{ msg }}</h3>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    msg : {
        type: String,
        required: true
    }
});

</script>

<style scoped>
.main-content-section{
    margin: 35px 0 0;
}
.main-content-section h3{
    height: 40px;
    text-align: left;
    border-bottom: 1px solid #eee;
}
</style>