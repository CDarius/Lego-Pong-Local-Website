import { ref } from 'vue'
import { defineStore } from 'pinia'

import api from '@/api/api';
import type { ListGameSettingsResponse, GameSettingsGroup } from '@/api/settingsApi'

export const useGameSettingsStore = defineStore('gamesettings', () => {
    // State
    const groups = ref<GameSettingsGroup[]>([]);
    const groupsLoading = ref(false);
    const groupsLoadingError = ref<string | null>(null);

    // Actions
    const fetchGameSettingsList = async() => {
        groupsLoading.value = true;
        groupsLoadingError.value = null;

        try {
            const response = await api.get<ListGameSettingsResponse>('/settings');
            groups.value = response.data.groups;
        } catch(err) {
            groupsLoadingError.value = 'Failed to get settings list';
            console.error('/settings API Error:', err);            
        } finally {
            groupsLoading.value = false;
        }
    }

    return {
        groups, groupsLoading, groupsLoadingError,
        fetchGameSettingsList
    };
});