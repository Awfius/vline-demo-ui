import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { environment } from 'environments/environment';

import { FuseUtils } from '@fuse/utils';

import { Timetable } from './timetable.model';

@Injectable()
export class TimetablesService implements Resolve<any>
{
    BASE_URL = environment.production
      ? 'https://medica-suite-experience-api.azurewebsites.net'
      : 'http://localhost:5001';
      
    onTimetablesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedTimetablesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();

    timetables: Timetable[];
    user: any;
    selectedTimetables: string[] = [];

    searchText: string;
    filterBy: string;

    constructor(private http: HttpClient)
    {
    }

    /**
     * The Timetables App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getTimetables()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getTimetables();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getTimetables();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getTimetables(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.BASE_URL}/api/timetables`)
                .subscribe((response: any) => {

                    this.timetables = response;

                    if ( this.searchText && this.searchText !== '' )
                    {
                        this.timetables = FuseUtils.filterArrayByString(this.timetables, this.searchText);
                    }

                    this.timetables = this.timetables.map(timetable => {
                        return new Timetable(timetable);
                    });

                    this.onTimetablesChanged.next(this.timetables);
                    resolve(this.timetables);
                }, reject);
            }
        );
    }

    /**
     * Toggle selected timetable by id
     * @param id
     */
    toggleSelectedTimetable(id)
    {
        // First, check if we already have that timetable as selected...
        if ( this.selectedTimetables.length > 0 )
        {
            const index = this.selectedTimetables.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedTimetables.splice(index, 1);

                // Trigger the next event
                this.onSelectedTimetablesChanged.next(this.selectedTimetables);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedTimetables.push(id);

        // Trigger the next event
        this.onSelectedTimetablesChanged.next(this.selectedTimetables);
    }

    selectTimetables(filterParameter?, filterValue?)
    {
        this.selectedTimetables = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedTimetables = [];
            this.timetables.map(timetable => {
                this.selectedTimetables.push(timetable.id);
            });
        }
        else
        {
            /* this.selectedTimetables.push(...
                 this.timetables.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedTimetablesChanged.next(this.selectedTimetables);
    }

    createTimetable(timetable) {
        let newTimetable = {
            departStation: timetable.departStation,
            arrivalStation: timetable.arrivalStation,
            departDateTime: timetable.departDateTime,
            arrivalDateTime: timetable.arrivalDateTime
        };
        console.log(newTimetable);
        return new Promise((resolve, reject) => {
            this.http.post(`${this.BASE_URL}/api/timetables/`, newTimetable)
                .subscribe(response => {
                    this.getTimetables();
                    resolve(response);
                });
        });
    }

    updateTimetable(timetable) {
        return new Promise((resolve, reject) => {
            this.http.put(`${this.BASE_URL}/api/timetables/${timetable.id}`, {...timetable})
                .subscribe(response => {
                    this.getTimetables();
                    resolve(response);
                });
        });
    }

    deleteTimetable(timetable)
    {
        // const timetableIndex = this.timetables.indexOf(timetable);
        // this.timetables.splice(timetableIndex, 1);
        // this.onTimetablesChanged.next(this.timetables);

        return new Promise((resolve, reject) => {
            this.http.delete(`${this.BASE_URL}/api/timetables/${timetable.id}`)
                .subscribe(response => {
                    this.getTimetables();
                    resolve(response);
                });
        });
    }

}
