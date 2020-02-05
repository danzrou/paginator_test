import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationResponse } from '../../pagination/models/pagination';
import { PagingRequest } from '../../pagination/models/paging';
import { toPaginationResponse } from '../../pagination/pagination.helpers';
import { Pet } from './pet';
import { DummyServer } from '../../server/dummy-server';
import { PET_MOCK } from '../../server/pet-data';
import { TempDataSource } from '../../pagination/models/data-source';

@Injectable({
	providedIn: 'root'
})
export class PetServiceStub {
	private ds = new TempDataSource('Pets');
	private server = new DummyServer<Pet>(PET_MOCK);

	getPage(request: PagingRequest): Observable<PaginationResponse<Pet>> {
		return this.server.getData(request).pipe(
			toPaginationResponse(request),
			tap(data => this.ds.setData(data))
		);
	}

	getDataSource() {
		return this.ds;
	}
}
