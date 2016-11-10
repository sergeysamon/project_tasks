(function () {
    'use strict';
    angular.module('tasks')
        .filter('format_date', function () {
            return function (input, format) {
                var date = moment(new Date(input));
                // .subtract(1, 'day')
                    console.log(date)

                    date.calendar(null, {
                        sameDay : '[Today]',
                        nextDay : '[Tomorrow]',
                        nextWeek: 'dddd',
                        lastDay : '[Yesterday]',
                        lastWeek: '[Last] dddd',
                        sameElse: 'DD/MM/YYYY'
                    });

                console.log(date)
                if (date !== 'Tomorrow' || date !== 'Yesterday' || date !== 'Today') {
                    return moment(new Date(input)).format("dddd")
                } else {
                    return moment(new Date(input)).format("dddd") + " (" + moment(new Date(input)).format("DD.mm.YYYY") + ")"
                }
            };
        })
})();
