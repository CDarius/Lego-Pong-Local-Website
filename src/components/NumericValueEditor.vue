<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    value: number,
    stepChange?: number,
    minValue?: number,
    maxValue?: number,
    numOfDigits?: number,
    updateInProgress?: boolean,
}>(), {
    numOfDigits: 4,
    updateInProgress: false,
});

const emit = defineEmits<{
    (e: 'updateValue', value: number): void;
}>();

const internalValue = ref(0);
const fieldWidth = computed(() => {
    var w = props.numOfDigits > 0 ? props.numOfDigits : 1;
    return (w + 6) + 'em';
});
const decimalDigits = computed(() => {
    return props.stepChange?.getNumOfDecimalDigits();
});

const progressPercentage = ref(100);

onBeforeMount(() => {
    internalValue.value = props.value
});

watch(() => props.value, async (newValue) => {
    internalValue.value = newValue;
});

function roundValue(value: number): number {
    if (decimalDigits.value == null)
        return value;

    return value.roundDecimalToDigits(decimalDigits.value);
}

function incrementValue() {
    if (props.stepChange == null)
        return;

    var newValue = internalValue.value + props.stepChange;
    if (props.maxValue != null && newValue > props.maxValue) {
        newValue = props.maxValue;
    }
    newValue = roundValue(newValue);
    if (internalValue.value != newValue) {
        internalValue.value = newValue;
        emit('updateValue', internalValue.value);
    }
}

function decrementValue() {
    if (props.stepChange == null)
        return;

    var newValue = internalValue.value - props.stepChange;
    if (props.minValue != null && newValue < props.minValue) {
        newValue = props.minValue;
    }
    newValue = roundValue(newValue);
    if (internalValue.value != newValue) {
        internalValue.value = newValue;
        emit('updateValue', internalValue.value);
    }
}

function updateValue(event: Event) {
    var newValue = parseFloat((event.target as HTMLInputElement).value);
    if (props.minValue != null && newValue < props.minValue) {
        newValue = props.minValue;
    }
    if (props.maxValue != null && newValue > props.maxValue) {
        newValue = props.maxValue;
    }
    if (internalValue.value != newValue) {
        internalValue.value = newValue;
        emit('updateValue', internalValue.value);
    }

}
</script>

<template>
    <div class="input-group" :style="{ width: fieldWidth }">
        <button v-if="stepChange != null" class="btn btn-secondary" type="button" @click="decrementValue()">
            -
        </button>
        <input type="number" class="form-control text-end" :class="{ 'update-in-progress': props.updateInProgress }"
            :value="internalValue" @change="updateValue($event)" />
        <button v-if="stepChange != null" class="btn btn-secondary" type="button" @click="incrementValue()">
            +
        </button>
    </div>
</template>

<style scoped>
.update-in-progress {
    -webkit-animation: 1s linear infinite progress-bar-stripes;
    animation: 1s linear infinite progress-bar-stripes;
    background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-size: 1rem 1rem;
    background-color: #BAC8D3 !important;
}

/*#76AEFC */
/* 9FC6F9*/

/*6c757d*/
/* A4B1BC */
</style>