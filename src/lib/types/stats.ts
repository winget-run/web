export interface IStat {
	Period: string;
	Value: number;
}

export interface IStatsResponse {
	Stats: {
		Id: string;
		Data: IStat[];
	};
}
