<template>
    <PageScrollableLayout>
        <template v-slot:header>
            <div class="py-2 ps-2 bg-light">
                <h1>Tune {{ $route.params.axis }}-Axis</h1>
            </div>
        </template>

        <!-- PID Settings card -->
        <div v-if="initDone" class="card mt-3 mx-2">
            <div class="card-body">
                <h5 class="card-title">PID Settings</h5>

                <div class="row">
                    <div class="col-12 col-sm-6 col-md-3 col-lg-2">
                        <div><strong>Kp:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                            :setting="pidKpSetting!" :value-only="true"
                            :show-unit="false" class="mb-3"/>
                    </div>
                    <div class="col-12  col-sm-6 col-md-3 col-lg-2">
                        <div><strong>Ki:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                            :setting="pidKiSetting!" :value-only="true"
                            :show-unit="false" class="mb-3"/>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3 col-lg-2">
                        <div><strong>Kd:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                            :setting="pidKdSetting!" :value-only="true"
                            :show-unit="false" class="mb-3"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-6 col-md-3 col-lg-2">
                        <div><strong>Integral Range:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                        :setting="integralRangeSetting!" :value-only="true"
                        :show-unit="false" class="mb-3"/>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3 col-lg-2">
                        <div><strong>Integral Rate:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                        :setting="integraleRateSetting!" :value-only="true"
                        :show-unit="false" class="mb-3"/>
                    </div>
                </div>
                <div class="row mt-2">
                    <SaveReloadSettings :group-name="settingGroupName" 
                        :whole-width="false" class="me-2"/>
                </div>
            </div>
        </div>

        <!-- Run step web function-->
        <ExecuteWebFunction :function-group-name="stepFunctionGroup!.name"
            :web-function-name="stepFunction!.name" @function-done="downloadAndDisplayLastLog()"
            class="mx-2 mt-2"/>

        <!-- Axis Log Chart -->
        <AxisLogChart v-if="lastAxisLog"
            :log="lastAxisLog.log"
            class="mx-3"/>
    </PageScrollableLayout>
</template>

<script setup lang="ts">

import { onBeforeMount, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { GameSettingItem } from '@/api/settingsApi';
import type { AxisPidSettings } from '@/stores/axesLog';
import type { GameFunctionsGroup, GameFunctionItem } from '@/api/functionsApi';

import { useGameSettingsStore } from '@/stores/gameSettings'
import { useGameFunctionsStore } from '@/stores/gameFunctions';
import { useAxesLogStore } from '@/stores/axesLog';
import { useAxesInfoStore } from '@/stores/axesInfo';

import PageScrollableLayout from '@/components/PageScrollableLayout.vue';
import EditSetting from '@/components/settings/EditSetting.vue';
import SaveReloadSettings from '@/components/settings/SaveReloadSettings.vue';
import ExecuteWebFunction from '@/components/functions/ExecuteWebFunction.vue';
import AxisLogChart from '@/components/charts/AxisLogChart.vue';

const settingStore = useGameSettingsStore();
const functionsStore = useGameFunctionsStore();
const axesLogStore = useAxesLogStore();
const axesInfoStore = useAxesInfoStore();

const route = useRoute();
const axisName = route.params.axis as string;

const initDone = ref(false);

const axisInfo = computed(() => axesInfoStore.axes.find(a => a.name.toLowerCase() === axisName.toLowerCase()));

// Get setting group for the axis
const settingGroupName = computed(() => `${axisName}_axis`.toLowerCase());
const settingGroup = computed(() => settingStore.groups.find(g => g.name === settingGroupName.value));

const pidKpSettingName = 'pid_kp';
const pidKiSettingName = 'pid_ki';
const pidKdSettingName = 'pid_kd';
const integralRangeSettingName = 'intgral_rng';
const integraleRateSettingName = 'intgral_rate';

const pidKpSetting = ref<GameSettingItem>();
const pidKiSetting = ref<GameSettingItem>();
const pidKdSetting = ref<GameSettingItem>();
const integralRangeSetting = ref<GameSettingItem>();
const integraleRateSetting = ref<GameSettingItem>();

const stepFunctionGroup = ref<GameFunctionsGroup>();
const stepFunction = ref<GameFunctionItem>();

const lastAxisLog = computed(() => {
    const logsForAxis = axesLogStore.logs[axisName];
    if (logsForAxis && logsForAxis.length > 0) {
        return logsForAxis[logsForAxis.length - 1];
    }
    return null;
});

onBeforeMount(() => {
    // Test axisInfo exists
    if (!axisInfo.value) {
        console.error(`Axis info for '${axisName}' not found.`);
        return;
    }

    // Search for axis settings group
    if (!settingGroup.value) {
        console.error(`Setting group '${settingGroupName.value}' not found.`);
        return;
    }

    // Find PID settings within the group
    pidKpSetting.value = settingGroup.value.settings.find(s => s.name === pidKpSettingName);
    pidKiSetting.value = settingGroup.value.settings.find(s => s.name === pidKiSettingName);
    pidKdSetting.value = settingGroup.value.settings.find(s => s.name === pidKdSettingName);
    integralRangeSetting.value = settingGroup.value.settings.find(s => s.name === integralRangeSettingName);
    integraleRateSetting.value = settingGroup.value.settings.find(s => s.name === integraleRateSettingName);

    if (!pidKpSetting.value || !pidKiSetting.value || !pidKdSetting.value || !integralRangeSetting.value || !integraleRateSetting.value) {
        console.error(`One or more PID settings not found in group '${settingGroupName.value}'.`);
        return;
    }

    // Search for axis function
    stepFunctionGroup.value = functionsStore.groups.find(g => g.name.toLowerCase() === `${axisName}_axis`.toLowerCase());
    if (!stepFunctionGroup.value) {
        console.error(`Function group '${axisName}_axis' not found.`);
        return;
    }

    // Find axis step function
    stepFunction.value = stepFunctionGroup.value.functions.find(f => f.name === 'axis_stepresponse');
    if (!stepFunction.value) {
        console.error(`Function 'axis_stepresponse' not found in group '${stepFunctionGroup.value.name}'.`);
        return;
    }

    initDone.value = true;
});

async function testLogging() {
    const pidSettings = await readPidSettings();
    await axesLogStore.startLogging(axisName);
    setTimeout(async () => {
        await axesLogStore.stopLogging(axisName);
        await axesLogStore.downloadLastLog(axisName, axisInfo.value!.counts_per_unit, pidSettings); 
    }, 10000);
}

async function downloadAndDisplayLastLog() {
    const pidSettings = await readPidSettings();
    await axesLogStore.downloadLastLog(axisName, axisInfo.value!.counts_per_unit, pidSettings); 
}

async function readPidSettings(): Promise<AxisPidSettings> {
    const kp = await settingStore.readGameSettingValue(settingGroupName.value, pidKpSettingName);
    const ki = await settingStore.readGameSettingValue(settingGroupName.value, pidKiSettingName);
    const kd = await settingStore.readGameSettingValue(settingGroupName.value, pidKdSettingName);
    const integralRange = await settingStore.readGameSettingValue(settingGroupName.value, integralRangeSettingName);
    const integralRate = await settingStore.readGameSettingValue(settingGroupName.value, integraleRateSettingName);
    return {
        kp: typeof kp.value === 'number' ? kp.value : 0,
        ki: typeof ki.value === 'number' ? ki.value : 0,
        kd: typeof kd.value === 'number' ? kd.value : 0,
        integralRange: typeof integralRange.value === 'number' ? integralRange.value : 0,
        integralRate: typeof integralRate.value === 'number' ? integralRate.value : 0,
    };
}
</script>