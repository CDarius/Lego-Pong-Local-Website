<template>
    <PongGameField class="m-4"
        :fieldWidth="53"
        :fieldHeight="31"
        :paddleWidth="2"
        :paddleHeight="3"
        :ballSide="2"
        :leftPaddleY="10"
        :rightPaddleY="0"
        :ballX="2"
        :ballY="2"
    />
</template>

<script lang="ts" setup>

import PongGameField from '@/components/gamelog/PongGameField.vue';


</script>