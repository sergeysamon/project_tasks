(function () {
    'use strict';
    angular.module('tasks')
        .filter('format_date', function () {
            return function (input, format) {
                var date = moment(new Date(input))
                    .calendar(null, {
                        sameDay : '[Today]',
                        nextDay : '[Tomorrow]',
                        nextWeek: 'dddd',
                        lastDay : '[Yesterday]',
                        lastWeek: '[Last] dddd',
                        sameElse: 'DD/MM/YYYY'
                    });

                if (date !== 'Tomorrow' || date !== 'Yesterday' || date !== 'Today') {
                    return date
                } else {
                    return moment(new Date(input)).format("dddd") + " (" + moment(new Date(input)).format("DD.mm.YYYY") + ")"
                }
            };
        })
})();
