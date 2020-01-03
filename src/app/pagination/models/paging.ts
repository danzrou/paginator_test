export interface PagingRequest {
	pageSize: number;
	searchTerm: string;
	requestedPage: number;
}

export interface PagingMetadata {
	totalRecordsCount: number;
	totalNumberOfPages: number;
}

export interface PagingResponse<T> {
	objectsList: T[];
	metadata: PagingMetadata;
}
