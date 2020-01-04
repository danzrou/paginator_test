import { PaginationDataSource } from './models/data-source';
import { PaginationDataRequest } from './models/pagination';

export class PaginatorConfig<T = any> {
	dataSource: PaginationDataSource;
	cacheTTL?: number = 10000;
	makeRequests?: boolean = true;
	getPageRequest?: PaginationDataRequest;

	constructor(config: Partial<PaginatorConfig> = {}) {
		Object.assign(this, config);
	}
}
