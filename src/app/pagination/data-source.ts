import { BehaviorSubject } from 'rxjs';

export class DataSource {
  data$ = new BehaviorSubject(null);

  get data() {
    return this.data$.asObservable();
  }

  setData(data: any) {
    this.data$.next(data);
  }
}
