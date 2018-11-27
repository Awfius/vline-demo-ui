import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { TimetableFormDialogComponent } from '../timetable-form/timetable-form.component';
import { TimetablesService } from '../timetables.service';

@Component({
    selector     : 'timetable-list',
    templateUrl  : './timetable-list.component.html',
    styleUrls    : ['./timetable-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class TimetableListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

    timetables: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['departStation', 'arrivalStation', 'departDateTime', 'arrivalDateTime'];
    selectedTimetables: any[];
    checkboxes: {};

    onTimetablesChangedSubscription: Subscription;
    onFilterChangedSubscription: Subscription;
    onSelectedTimetablesChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private timetablesService: TimetablesService,
        public dialog: MatDialog
    )
    {
        this.onTimetablesChangedSubscription =
            this.timetablesService.onTimetablesChanged.subscribe(timetables => {

                this.timetables = timetables;
                console.log(timetables);
                this.checkboxes = {};
                timetables.map(timetable => {
                    this.checkboxes[timetable.id] = false;
                });
            });

        this.onSelectedTimetablesChangedSubscription =
            this.timetablesService.onSelectedTimetablesChanged.subscribe(selectedTimetables => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedTimetables.includes(id);
                }
                this.selectedTimetables = selectedTimetables;
            });
    }

    ngOnInit()
    {
        this.dataSource = new FilesDataSource(this.timetablesService);
    }

    ngOnDestroy()
    {
        this.onTimetablesChangedSubscription.unsubscribe();
        this.onFilterChangedSubscription.unsubscribe();
        this.onSelectedTimetablesChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }

    editTimetable(timetable)
    {
        this.dialogRef = this.dialog.open(TimetableFormDialogComponent, {
            panelClass: 'timetable-form-dialog',
            data      : {
                timetable: timetable,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this.timetablesService.updateTimetable(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteTimetable(timetable);

                        break;
                }
            });
    }

    /**
     * Delete Timetable
     */
    deleteTimetable(timetable)
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.timetablesService.deleteTimetable(timetable);
            }
            this.confirmDialogRef = null;
        });

    }

    onSelectedChange(timetableId)
    {
        this.timetablesService.toggleSelectedTimetable(timetableId);
    }
}

export class FilesDataSource extends DataSource<any>
{
    constructor(private timetablesService: TimetablesService)
    {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        return this.timetablesService.onTimetablesChanged;
    }

    disconnect()
    {
    }
}
