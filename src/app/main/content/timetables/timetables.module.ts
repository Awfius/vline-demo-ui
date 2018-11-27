import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import { 
    MatButtonModule, 
    MatCheckboxModule, 
    MatDatepickerModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatInputModule, 
    MatMenuModule, 
    MatNativeDateModule,
    MatRippleModule, 
    MatSidenavModule, 
    MatTableModule, 
    MatToolbarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { TimetablesMainSidenavComponent } from './sidenavs/main/main.component';
import { TimetablesComponent } from './timetables.component';
import { TimetablesService } from './timetables.service';
import { TimetableListComponent } from './timetable-list/timetable-list.component';
import { TimetableFormDialogComponent } from './timetable-form/timetable-form.component';

const routes: Routes = [
    {
        path     : '**',
        component: TimetablesComponent,
        resolve  : {
            timetables: TimetablesService
        }
    }
];

@NgModule({
    declarations   : [
        TimetablesComponent,
        TimetableListComponent,
        TimetablesMainSidenavComponent,
        TimetableFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),
        CdkTableModule,

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatNativeDateModule,
        MatRippleModule,
        MatSidenavModule,
        MatTableModule,
        MatToolbarModule,

        FuseSharedModule,
        FuseConfirmDialogModule
    ],
    providers      : [
        TimetablesService
    ],
    entryComponents: [TimetableFormDialogComponent]
})
export class TimetablesModule
{
}
