/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'

import api from '@/api/api';
import type { AxisLogResponse } from '@/api/axesLogApi'

export interface AxisPidSettings {
    kp: number;
    ki: number;
    kd: number;
    integralRange: number;
    integralRate: number;
}
export interface AxisLogWithInfo {
    log: AxisLogResponse;
    pidSettings: AxisPidSettings;
}

export const useAxesLogStore = defineStore('axeslog', () => {
    // State
    const logs = ref<AxisLogWithInfo[]>([]);

    // Actions
    const startLogging = async(axis: string, duration?: number, skip?: number) => {        
        const params: Record<string, number> = {
            ...(duration !== undefined && { duration: duration }),
            ...(skip !== undefined && { div: skip })
        };
        await api.get(`/axislog/start/${axis}`, { params });
    }

    const stopLogging = async(axis: string) => {
        await api.get(`/axislog/stop/${axis}`);
    }

    const fetchLastLog = async(axis: string, pidSettings: AxisPidSettings) => {
        const response = await api.get<AxisLogResponse>(`/axislog/read/${axis}`);
        const newLog: AxisLogWithInfo = {
            log: response.data,
            pidSettings: pidSettings
        };
        logs.value.push(newLog);
    }

    return {
        logs,
        startLogging,
        stopLogging,
        fetchLastLog
    };
});