import { ref } from 'vue'
import { defineStore } from 'pinia'

import api from '@/api/api';
import type { ListGameFunctionsResponse, GameFunctionItem } from '@/api/functionsApi'

export const useGameFunctionsStore = defineStore('gamefunctions', () => {
    // State
    const functions = ref<GameFunctionItem[]>([]);
    const functionsLoading = ref(false);
    const functionsLoadingError = ref<string | null>(null);

    // Actions
    const fetchGameFunctionsList = async() => {
        functionsLoading.value = true;
        functionsLoadingError.value = null;

        try {
            const response = await api.get<ListGameFunctionsResponse>('/functions');
            functions.value = response.data.functions;
        } catch(err) {
            functionsLoadingError.value = 'Failed to get functions list';
            console.error('/functions API Error:', err);            
        } finally {
            functionsLoading.value = false;
        }
    }

    return {
        functions, functionsLoading, functionsLoadingError,
        fetchGameFunctionsList
    };
});