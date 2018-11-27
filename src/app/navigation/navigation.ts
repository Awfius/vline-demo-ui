export const navigation = [
    {
        'id'      : 'applications',
        'title'   : 'Applications',
        'translate': 'NAV.APPLICATIONS',
        'type'    : 'group',
        'children': [
            {
                'id'   : 'timetable',
                'title': 'Timetable',
                'translate': 'NAV.TIMETABLE.TITLE',
                'type' : 'item',
                'icon' : 'today',
                'url'  : '/timetables'
            }
        ]
    }
];
