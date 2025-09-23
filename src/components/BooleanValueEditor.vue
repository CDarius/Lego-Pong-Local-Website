<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    value: boolean,
    updateInProgress?: boolean,
}>(), {
    updateInProgress: false,
});

const emit = defineEmits<{
    (e: 'updateValue', value: boolean): void;
}>();


function updateValue(event: Event) {
    console.log('Checkbox change event:', event);
    let newValue = (event.target as HTMLInputElement).checked
    if (props.value != newValue) {
        emit('updateValue', newValue);
    }

}
</script>

<template>
    <div class="switch-container position-relative d-inline-block">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                :checked="props.value" @change="updateValue($event)" 
                :disabled="props.updateInProgress" style="caret-color: transparent;"/>
        </div>
        <div v-if="props.updateInProgress" class="spinner-overlay">
            <div class="spinner-border text-primary" role="status" style="width: 1.5rem; height: 1.5rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    <!-- <div class="input-group" :style="{ width: fieldWidth }">
        <button v-if="stepChange != null" class="btn btn-secondary" type="button" @click="decrementValue()">
            -
        </button>
        <input type="number" class="form-control text-end" :class="{ 'update-in-progress': props.updateInProgress }"
            :value="internalValue" @change="updateValue($event)" />
        <button v-if="stepChange != null" class="btn btn-secondary" type="button" @click="incrementValue()">
            +
        </button>
    </div> -->
</template>

<style scoped>
.update-in-progress {
    -webkit-animation: 1s linear infinite progress-bar-stripes;
    animation: 1s linear infinite progress-bar-stripes;
    background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-size: 1rem 1rem;
    background-color: #BAC8D3 !important;
}

.switch-container {
    /* Ensures the overlay is positioned relative to the switch */
    position: relative;
    display: inline-block;
}

.spinner-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; /* Allows clicks to pass through to the switch */
    z-index: 2;
}

</style>