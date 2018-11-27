import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { Timetable } from '../timetable.model';

@Component({
    selector     : 'fuse-timetables-timetable-form-dialog',
    templateUrl  : './timetable-form.component.html',
    styleUrls    : ['./timetable-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TimetableFormDialogComponent
{
    event: CalendarEvent;
    dialogTitle: string;
    timetableForm: FormGroup;
    action: string;
    timetable: Timetable;

    constructor(
        public dialogRef: MatDialogRef<TimetableFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Timetable';
            this.timetable = data.timetable;
        }
        else
        {
            this.dialogTitle = 'New Timetable';
            this.timetable = new Timetable({});
        }

        this.timetableForm = this.createTimetableForm();
    }

    createTimetableForm()
    {
        return this.formBuilder.group({
            id: [this.timetable.id],
            departStation: [this.timetable.departStation],
            arrivalStation: [this.timetable.arrivalStation],
            departDateTime: [new Date(this.timetable.departDateTime)],
            arrivalDateTime: [new Date(this.timetable.arrivalDateTime)]
        });
    }
}
