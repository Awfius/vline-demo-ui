import { FuseUtils } from '@fuse/utils';

export class Timetable
{
    id: string;
    departStation: string;
    arrivalStation: string;
    departDateTime: Date;
    arrivalDateTime: Date;

    constructor(timetable)
    {
        {
            this.id = timetable.id || '';
            this.departStation = timetable.departStation || '';
            this.arrivalStation = timetable.arrivalStation || '';
            this.departDateTime = new Date(timetable.departDateTime) || null;
            this.arrivalDateTime = new Date(timetable.arrivalDateTime) || null;
        }
    }
}
