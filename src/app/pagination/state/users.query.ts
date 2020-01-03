import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../user';
import { PaginationDataSource } from '../data-source';
import { UsersState, UsersStore } from './users.store';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends QueryEntity<UsersState> implements PaginationDataSource<User> {
	constructor(protected store: UsersStore) {
		super(store);
	}

	selectUserVMs() {
		return this.selectAll().pipe(map(users => users.map(user => ({ ...user, VM: true }))));
	}

	getData(): Observable<User[]> {
		return this.selectUserVMs();
	}
}
