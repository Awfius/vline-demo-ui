import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TimetablesService } from '../../timetables.service';

@Component({
    selector   : 'timetables-main-sidenav',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class TimetablesMainSidenavComponent implements OnDestroy
{
    user: any;
    filterBy: string;
    
    onUserDataChangedSubscription: Subscription;

    constructor(private timetablesService: TimetablesService)
    {
        this.filterBy = this.timetablesService.filterBy || 'all';
        this.onUserDataChangedSubscription =
            this.timetablesService.onUserDataChanged.subscribe(user => {
                this.user = user;
            });
    }

    changeFilter(filter)
    {
        this.filterBy = filter;
        this.timetablesService.onFilterChanged.next(this.filterBy);
    }

    ngOnDestroy()
    {
        this.onUserDataChangedSubscription.unsubscribe();
    }
}
