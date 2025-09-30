/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'

import api from '@/api/api';
import type { GetGameLogResponse } from '@/api/gameLogApi'

export interface GameLog {
    col_names: string[];
    data: (GameLogFirstEntry|GameLogSubEntry)[];
}

export class GameLogFirstEntry {
    constructor(
        public cycle: number,
        public subcycle: number,
        public ballX: number,
        public ballY: number,
        public paddleX: number,
        public paddleY: number,
        public timestamp: number
    ) {}
}

export class GameLogSubEntry {
    constructor(
        public cycle: number,
        public subcycle: number,
        public targetBallX: number,
        public targetBallY: number,
        public targetPaddleX: number,
        public targetPaddleY: number,
        public speedX: number,
        public speedY: number
    ) {}
}

export const useGameLogStore = defineStore('gamelog', () => {
    // State
    const logs = ref<GameLog[]>([]);
    
    // Actions
    const isLogRunning = async(axis: string) => {
        const response = await api.get<{ running: boolean }>(`/gamelog/running/${axis}`);
        return response.data.running;
    }

    const downloadLastLog = async() => {
        const response = await api.get<GetGameLogResponse>("/gamelog/read");
        const result: GameLog = {
            col_names: response.data.col_names,
            data: response.data.data.map(row => {
                const subcycle = row[1];
                if (subcycle === 0) {
                    // First entry in cycle
                    return new GameLogFirstEntry(
                        row[0],
                        row[1],
                        row[2],
                        row[3],
                        row[4],
                        row[5],
                        row[6]
                    );
                } else {
                    // Subsequent entries in cycle
                    return new GameLogSubEntry(
                        row[0],
                        row[1],
                        row[2],
                        row[3],
                        row[4],
                        row[5],
                        row[6],
                        row[7]
                    );
                }
            })
        };

        return result;
    }
    
    return {
        logs,
        isLogRunning,
        downloadLastLog,
    };
});