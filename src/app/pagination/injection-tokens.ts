import { InjectionToken } from '@angular/core';
import { PaginatorConfig } from '@datorama/akita';

export const PAGINATOR_CONFIG = new InjectionToken<PaginatorConfig>('PAGINATOR_CONFIG');
