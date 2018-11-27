import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { TimetableFormDialogComponent } from './timetable-form/timetable-form.component';
import { TimetablesService } from './timetables.service';

@Component({
    selector     : 'timetables',
    templateUrl  : './timetables.component.html',
    styleUrls    : ['./timetables.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class TimetablesComponent implements OnInit, OnDestroy
{
    hasSelectedTimetables: boolean;
    searchInput: FormControl;
    dialogRef: any;
    onSelectedTimetablesChangedSubscription: Subscription;

    constructor(
        private timetablesService: TimetablesService,
        public dialog: MatDialog
    )
    {
        this.searchInput = new FormControl('');
    }

    newTimetable()
    {
        this.dialogRef = this.dialog.open(TimetableFormDialogComponent, {
            panelClass: 'timetable-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response)
                {
                    return;
                }

                this.timetablesService.createTimetable(response.getRawValue());

            });

    }

    ngOnInit()
    {
        this.onSelectedTimetablesChangedSubscription =
            this.timetablesService.onSelectedTimetablesChanged
                .subscribe(selectedTimetables => {
                    this.hasSelectedTimetables = selectedTimetables.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.timetablesService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy()
    {
        this.onSelectedTimetablesChangedSubscription.unsubscribe();
    }
}
