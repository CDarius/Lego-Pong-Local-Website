import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CancelTokenSource } from 'axios';

import api from '@/api/api';
import type { ListGameSettingsResponse, GameSettingsGroup, ReadGameSettingRespose, WriteGameSettingRespose } from '@/api/settingsApi'

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

    const readGameSettingValue = async(groupName: string, settingName: string) => {
        return await api.get<ReadGameSettingRespose>(`/settings/${groupName}/${settingName}`);
    }

    const writeGameSettingValue = async(groupName: string, settingName: string, value: unknown, cancelTokenSource: CancelTokenSource | null = null) => {
        return await api.put<WriteGameSettingRespose>(
            `/settings/${groupName}/${settingName}`, { value: value },
            {
                cancelToken: cancelTokenSource?.token,
            }
        );
    }

    return {
        groups, groupsLoading, groupsLoadingError,
        fetchGameSettingsList,
        readGameSettingValue,
        writeGameSettingValue,
    };
});