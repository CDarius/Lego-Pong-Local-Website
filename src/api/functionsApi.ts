export interface GameFunctionItem {
    name: string,
    title: string,
    description: string,
};

export interface ListGameFunctionsResponse {
    functions: GameFunctionItem[];
}
