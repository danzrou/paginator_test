import { Component, Inject } from '@angular/core';
import { DataSource } from './pagination/data-source';
import { DATA_SOURCE, PAGINATOR } from './pagination/injection-tokens';
import { UserService } from './pagination/pagination-service';
import { Paginator } from './pagination/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: PAGINATOR, useClass: Paginator},
    {provide: DATA_SOURCE, useClass: DataSource}
  ]
})
export class AppComponent {
  title = 'paginator';

  constructor(@Inject(DATA_SOURCE) ds: DataSource,
              @Inject(PAGINATOR) paginator: Paginator,
              private userService: UserService) {
    this.userService.setDs(ds);
    this.userService.subscribeToPaginator(paginator);
  }
}
