import { PaginationDataSource } from './models/data-source';

export class PaginatorConfig<T = any> {
	dataSource: PaginationDataSource;
	pageSize?: number = 20;
	firstPage?: number = 0;
	cacheTTL?: number = 30000;
	clearCacheWithDataSource?: boolean = true;

	constructor(config: Partial<PaginatorConfig> = {}) {
		Object.assign(this, config);
	}
}
