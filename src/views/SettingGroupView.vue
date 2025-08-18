<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGameSettingsStore } from '@/stores/game_settings'
import PageScrollableLayout from '@/components/PageScrollableLayout.vue'
import EditSetting from '@/components/settings/EditSetting.vue';

const route = useRoute();
const settingStore = useGameSettingsStore();
const settingGroup = computed(() => settingStore.groups.find((x) => x.name == route.params.group));

</script>

<template>
    <PageScrollableLayout>
        <template v-slot:header>
            <div class="py-2 ps-2 bg-light">
                <h1>{{ settingGroup?.title ?? "???" }}</h1>
            </div>
        </template>

        <div v-if="settingGroup != null" class="container-md my-3">
            <EditSetting v-for="setting in settingGroup.settings" :key="setting.name" :group-name="settingGroup.name"
                :setting="setting" :class="'mb-3'">
            </EditSetting>
        </div>
    </PageScrollableLayout>
</template>