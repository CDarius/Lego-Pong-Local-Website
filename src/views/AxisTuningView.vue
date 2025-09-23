<template>
    <PageScrollableLayout>
        <div class="py-2 ps-2 bg-light">
            <h1>Tune {{ $route.params.axis }}-Axis</h1>
        </div>

    </PageScrollableLayout>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import PageScrollableLayout from '@/components/PageScrollableLayout.vue';
</script>