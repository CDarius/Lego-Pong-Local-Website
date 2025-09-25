export type AxesInfoResponse = AxisInfoResponse[];

export interface AxisInfoResponse {
    name: string;
    counts_per_unit: number;
    standstill_speed: number;
    position_tolerance: number;
}
