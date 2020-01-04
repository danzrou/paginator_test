import { EMPTY, Observable } from 'rxjs';
import { PaginationDataRequest } from './models/pagination';

export class PaginatorConfig<T = any> {
	cacheTTL = 10000;
	idKey = 'id';
	makeRequests = true;
	dataSource: Observable<T[]> = EMPTY;
	getPageRequest: PaginationDataRequest = () => EMPTY;

	constructor(config: Partial<PaginatorConfig> = {}) {
		Object.assign(this, config);
	}
}
