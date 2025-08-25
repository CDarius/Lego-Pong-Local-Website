<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import axios from 'axios';
import type { CancelTokenSource } from 'axios';
import { debounce } from '@/utils/debounce';
import type { GameSettingItem } from '@/api/settingsApi';
import NumericValueEditor from '../NumericValueEditor.vue';
import { useGameSettingsStore } from '@/stores/game_settings'

const props = defineProps<{
    groupName: string,
    setting: GameSettingItem,
}>();

const settingStore = useGameSettingsStore();

const loadingValue = ref(true);
const loadingValueFailed = ref(false);
const settingValue = ref(0);
const updateInProgress = ref(false);

const showValueEditor = computed(() => {
    return !loadingValue.value && !loadingValueFailed.value;
});

onBeforeMount(() => {
    fetchSettingValue();
});

async function fetchSettingValue() {
    loadingValue.value = true;
    loadingValueFailed.value = false;

    try {
        const response = await settingStore.readGameSettingValue(props.groupName, props.setting.name);
        settingValue.value = response.data.value;
    } catch (error) {
        loadingValueFailed.value = true;
        console.error('Error fetching setting value:', error);
    } finally {
        loadingValue.value = false;
    }
}

let cancelTokenSource: CancelTokenSource | null = null;

const debouncedUpdateValue = debounce(async (value: number) => {
    // Cancel previous request
    if (cancelTokenSource) {
        cancelTokenSource.cancel('Previous request canceled');
    }

    cancelTokenSource = axios.CancelToken.source();

    try {
        const response = await settingStore.writeGameSettingValue(props.groupName, props.setting.name, value, cancelTokenSource);
        settingValue.value = response.data.value;
    } catch (error) {
        if (!axios.isCancel(error)) {
            settingValue.value = settingValue.value;
            console.error('Error updating setting value:', error);
        }
    } finally {
        cancelTokenSource = null;
        updateInProgress.value = false;
    }
}, 1000);

function updateSettingValue(value: number) {
    if (props.setting.minValue != null && value < props.setting.minValue) {
        value = props.setting.minValue;
    }
    if (props.setting.maxValue != null && value > props.setting.maxValue) {
        value = props.setting.maxValue;
    }
    if (value !== settingValue.value) {
        updateInProgress.value = true;
        debouncedUpdateValue(value);
    }
}

</script>

<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{ setting.title }}</h5>
            <p class="card-text">{{ setting.description }}</p>
        </div>
        <div class="card-footer">
            <div v-if="loadingValue" class="spinner-border float-end" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div v-if="loadingValueFailed" class="float-end text-danger">
                <i class="bi bi-exclamation-triangle"></i>
                Value read failed
            </div>
            <div v-if="showValueEditor" class="d-flex justify-content-end align-items-center">
                <div class="me-2">{{ setting.unit }}</div>
                <NumericValueEditor :value="settingValue" :step-change="setting.stepChange"
                    :min-value="setting.minValue" class="float-end" :max-value="setting.maxValue"
                    :update-in-progress="updateInProgress" @updateValue="updateSettingValue">
                </NumericValueEditor>
            </div>
        </div>
    </div>
</template>