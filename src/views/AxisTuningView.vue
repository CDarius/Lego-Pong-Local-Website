<template>
    <PageScrollableLayout>
        <template v-slot:header>
            <div class="py-2 ps-2 bg-light">
                <h1>Tune {{ $route.params.axis }}-Axis</h1>
            </div>
        </template>

        <div v-if="initDone" class="card mt-3 mx-3">
            <div class="card-body">
                <h5 class="card-title">PID Settings</h5>
                <div class="row">
                    <div class="col-12 col-md-3">
                        <div><strong>Kp:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                            :setting="pidKpSetting!" :value-only="true"
                            :show-unit="false" class="mb-3"/>
                    </div>
                    <div class="col-12 col-md-3">
                        <div><strong>Ki:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                            :setting="pidKiSetting!" :value-only="true"
                            :show-unit="false" class="mb-3"/>
                    </div>
                    <div class="col-12 col-md-3">
                        <div><strong>Kd:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                            :setting="pidKdSetting!" :value-only="true"
                            :show-unit="false" class="mb-3"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-3">
                        <div><strong>Integral Range:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                        :setting="integralRangeSetting!" :value-only="true"
                        :show-unit="false" class="mb-3"/>
                    </div>
                    <div class="col-12 col-md-3">
                        <div><strong>Integral Rate:</strong></div>
                        <EditSetting :group-name="settingGroupName" 
                        :setting="integraleRateSetting!" :value-only="true"
                        :show-unit="false" class="mb-3"/>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-primary m-3"
                @click="testLogging()">
                Save Settings
            </button>
        </div>
    </PageScrollableLayout>
</template>

<script setup lang="ts">

import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { GameSettingItem } from '@/api/settingsApi';
import { useGameSettingsStore } from '@/stores/gameSettings'
import { useGameFunctionsStore } from '@/stores/gameFunctions';
import { useAxesLogStore } from '@/stores/axesLog';
import type { AxisPidSettings } from '@/stores/axesLog';

import PageScrollableLayout from '@/components/PageScrollableLayout.vue';
import EditSetting from '@/components/settings/EditSetting.vue';

const settingStore = useGameSettingsStore();
const functionsStore = useGameFunctionsStore();
const axesLogStore = useAxesLogStore();

const route = useRoute();
const axisName = route.params.axis as string;

const initDone = ref(false);

const pidKpSettingName = 'pid_kp';
const pidKiSettingName = 'pid_ki';
const pidKdSettingName = 'pid_kd';
const integralRangeSettingName = 'intgral_rng';
const integraleRateSettingName = 'intgral_rate';

let settingGroupName = '';
const pidKpSetting = ref<GameSettingItem>();
const pidKiSetting = ref<GameSettingItem>();
const pidKdSetting = ref<GameSettingItem>();
const integralRangeSetting = ref<GameSettingItem>();
const integraleRateSetting = ref<GameSettingItem>();

onBeforeMount(() => {
    // Search for axis settings
    const groupName = `${axisName}_axis`.toLowerCase();
    const settingGroup = settingStore.groups.find(g => g.name === groupName);
    if (!settingGroup) {
        console.error(`Setting group '${groupName}' not found.`);
        return;
    }

    settingGroupName = settingGroup.name;

    pidKpSetting.value = settingGroup.settings.find(s => s.name === pidKpSettingName);
    pidKiSetting.value = settingGroup.settings.find(s => s.name === pidKiSettingName);
    pidKdSetting.value = settingGroup.settings.find(s => s.name === pidKdSettingName);
    integralRangeSetting.value = settingGroup.settings.find(s => s.name === integralRangeSettingName);
    integraleRateSetting.value = settingGroup.settings.find(s => s.name === integraleRateSettingName);

    if (!pidKpSetting.value || !pidKiSetting.value || !pidKdSetting.value || !integralRangeSetting.value || !integraleRateSetting.value) {
        console.error(`One or more PID settings not found in group '${groupName}'.`);
        return;
    }

    initDone.value = true;
});

async function testLogging() {
    const pidSettings = await readPidSettings();
    await axesLogStore.startLogging(axisName);
    setTimeout(async () => {
        await axesLogStore.stopLogging(axisName);
        await axesLogStore.fetchLastLog(axisName, pidSettings); 
    }, 10000);
}

async function readPidSettings(): Promise<AxisPidSettings> {
    const kp = await settingStore.readGameSettingValue(settingGroupName, pidKpSettingName);
    const ki = await settingStore.readGameSettingValue(settingGroupName, pidKiSettingName);
    const kd = await settingStore.readGameSettingValue(settingGroupName, pidKdSettingName);
    const integralRange = await settingStore.readGameSettingValue(settingGroupName, integralRangeSettingName);
    const integralRate = await settingStore.readGameSettingValue(settingGroupName, integraleRateSettingName);
    return {
        kp: typeof kp.value === 'number' ? kp.value : 0,
        ki: typeof ki.value === 'number' ? ki.value : 0,
        kd: typeof kd.value === 'number' ? kd.value : 0,
        integralRange: typeof integralRange.value === 'number' ? integralRange.value : 0,
        integralRate: typeof integralRate.value === 'number' ? integralRate.value : 0,
    };
}
</script>