<template>
    <div v-if="axesInfoStore.axesLoading"
        class="h-100 w-100 d-flex flex-column justify-content-center align-items-center">
        <h3>Loading...</h3>
        <div class="spinner-border mt-2" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="axesInfoStore.axesLoadingError" class="container-md">
        <div class="alert alert-danger d-flex align-items-center mt-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
                {{ axesInfoStore.axesLoadingError }}
            </div>
        </div>
    </div>

    <div v-else class="mx-3">
        <div class="d-grid mt-3">
            <button type="button" class="btn btn-primary" @click="downloadAndDisplayLastLog()">
                Download last Log
            </button>            
        </div>

        <PongGameField class="mt-3"
            :fieldWidth="fieldWidth"
            :fieldHeight="fieldHeight"
            :paddleWidth="2"
            :paddleHeight="3"
            :ballSide="2"
            :leftPaddleY="10"
            :rightPaddleY="0"
            :ballX="2"
            :ballY="2"
        />        
    </div>
</template>

<script lang="ts" setup>

import { onBeforeMount, onBeforeUnmount, computed } from 'vue';
import { useGameLogStore } from '@/stores/gameLog';
import { useAxesInfoStore } from '@/stores/axesInfo';

import PongGameField from '@/components/gamelog/PongGameField.vue';

const gameLogStore = useGameLogStore();
const axesInfoStore = useAxesInfoStore();

const xAxisInfo = computed(() => axesInfoStore.axes.find(a => a.name.toLowerCase() === 'x'));
const yAxisInfo = computed(() => axesInfoStore.axes.find(a => a.name.toLowerCase() === 'y'));

const fieldWidth = computed(() => xAxisInfo.value?.sw_limit_p ?? 1);
const fieldHeight = computed(() => yAxisInfo.value?.sw_limit_p ?? 1);

let pollingActive = false;
let wasLogRunning = false;

onBeforeMount(() => {
    if (axesInfoStore.axes == null || axesInfoStore.axes.length == 0)
        axesInfoStore.fetchAxesInfo();

    pollingActive = true;
    monitorGameLogRunning();
});

onBeforeUnmount(() => {
    pollingActive = false;
});

async function monitorGameLogRunning() {
    while (pollingActive) {
        const logRunning = await gameLogStore.isLogRunning('x');
        if (!logRunning && wasLogRunning) {
            await downloadAndDisplayLastLog();
        }
        wasLogRunning = logRunning;

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function downloadAndDisplayLastLog() {
    await gameLogStore.downloadLastLog();
}

</script>