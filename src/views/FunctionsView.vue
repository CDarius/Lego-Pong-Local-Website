<template>
    <div v-if="functionsStore.functionsLoading"
        class="h-100 w-100 d-flex flex-column justify-content-center align-items-center">
        <h3>Loading...</h3>
        <div class="spinner-border mt-2" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="functionsStore.functionsLoadingError" class="container-md">
        <div class="alert alert-danger d-flex align-items-center mt-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
                {{ functionsStore.functionsLoadingError }}
            </div>
        </div>
    </div>

    <div class="container-md my-3">
        <div class="list-group">
            <router-link v-for="group in functionsStore.functions" :to="'/settings/' + group.name" :key="group.name"
                class="list-group-item list-group-item-action">
                {{ group.title }}
                <i class="bi bi-chevron-right float-end"></i>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useGameFunctionsStore } from '@/stores/game_functions';

const functionsStore = useGameFunctionsStore();

onBeforeMount(() => {
    if (functionsStore.functions == null || functionsStore.functions.length == 0)
        functionsStore.fetchGameFunctionsList();
});

</script>

<style scoped></style>