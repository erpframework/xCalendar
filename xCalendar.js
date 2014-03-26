/**
 * Created with PhpStorm.
 * User: godsong
 * Date: 14-3-17
 * Time: 下午7:14
 */
!function () {
    var DateUtil = window.DateUtil = function () {
        var core = {};
        core.lang = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            weekDayNames: ['星期日', '星期一', '星期二', '星期四', '星期五', '星期六'],
            weekDayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        };
        var _regFormat = /y+|m+|d+|Y+|M+|D+/g;
        var _matchType = [];

        function _dateStrResolver(flag) {


            if (flag == 'yyyy' || flag == 'yy' || flag == 'y') {

                _matchType.push('year');
                return '\\d{4}';
            }

            else if (flag == 'dd') {
                _matchType.push('day');
                return '\\d{2}';
            }
            else if (flag == 'd') {
                _matchType.push('day');
                return '\\d{1,2}';
            }

            else if (flag == 'm') {
                _matchType.push('month');
                return '\\d{1,2}';
            }
            else if (flag == 'mm') {
                _matchType.push('month');
                return '\\d{2}';
            }
            else return flag;
        }


        function _dateResolver(date, flag) {

            var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), weekday = date.getDay();
            if (flag == 'yyyy' || flag == 'YYYY') {
                return year;
            }
            else if (flag == 'yy' || flag == 'y') {
                return ('' + year).slice(2);
            }
            else if (flag == 'dd') {
                return day < 10 ? '0' + day : day;
            }
            else if (flag == 'd') {
                return day;
            }

            else if (flag == 'm') {
                return month;
            }
            else if (flag == 'mm') {
                return month < 10 ? '0' + month : month;
            }
            else if (flag == 'D') {
                return core.lang.weekDayNamesShort[weekday];
            }
            else if (flag == 'DD') {
                return core.lang.weekDayNames[weekday];
            }
            else if (flag == 'M') {
                return core.lang.monthNamesShort[month - 1];
            }
            else if (flag == 'MM') {
                return core.lang.monthNames[month - 1];
            }

            else return flag;
        }

        core.format = function (date, formatStr) {
            formatStr = formatStr || 'yyyy-mm-dd';
            return formatStr.replace(_regFormat, function (m) {
                return _dateResolver(date, m);
            })
        };
        core.isEqual=function(date1,date2){
            if(!date1||!date2){
                return false;
            }
            var ret=date1.getFullYear()==date2.getFullYear()&&date1.getMonth()==date2.getMonth()&&date1.getDate()==date2.getDate();
            if(ret){
                console.log(date1.toLocaleString(),date2.toLocaleString());
            }
            return ret;
        };
        core.parse = function (dateStr, formatStr) {
            _matchType = [];
            if (dateStr) {
                if (formatStr) {
                    var date = new Date();
                    date.setHours(0, 0, 0, 0);

                    var reg = new RegExp(formatStr.replace(_regFormat, function (m) {
                        return '(' + _dateStrResolver(m.toLowerCase()) + ')';
                    }), 'g');
                    var res = reg.exec(dateStr);

                    if (res) {
                        for (var i = 1; i < res.length; i++) {
                            var v = res[i], type = _matchType[i - 1];

                            if (type == 'year') {
                                date.setFullYear(+v)
                            }
                            else if (type == 'month') {
                                date.setMonth(v - 1);
                            }
                            else if (type == 'day') {
                                date.setDate(+v);
                            }
                        }
                        return date;


                    } else {
                        return null;

                    }
                }
                else {
                    var tok = dateStr.split('-');
                    return new Date(+tok[0], +tok[1] - 1, +tok[2]);

                }
            } else {
                return null;
            }
        };
        return core;

    }();


    var expando = 'xCalendar_',
        uuid = 1;
    var defaultConfig = {
        firstDay: 0,
        weekdaysFull: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        weekdaysShort: ['一', '二', '三', '四', '五', '六', '日'],
        monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    };


    function getDaysNumInAMonth(year, month) {
        var _monthDate = new Date();
        _monthDate.setFullYear(year);
        _monthDate.setMonth(month);
        _monthDate.setDate(0);
        return  _monthDate.getDate();
    }

    function getCurrentDate(year, month, date) {
        var _curDate = new Date();
        _curDate.setFullYear(year);
        _curDate.setMonth(month - 1);
        _curDate.setDate(date);
        return _curDate;

    }

    function modifyDate(date, d, m, y) {
        var newDate = new Date();

        newDate.setFullYear(date.getFullYear() + (y || 0));
        newDate.setMonth(date.getMonth() + (m || 0));
        newDate.setDate(date.getDate() + (d || 0));

        return newDate;

    }

    function getDateBlockView(xCalendar,date, outfocus) {
        var className = 'xCalendar-day';
        if (outfocus) {
            className += ' xCalendar-day-outfocus';
        }
        var tdClass='';
        if(DateUtil.isEqual(date,xCalendar.selectedDate)){
            tdClass+='xCalendar-day-selected';
        }
        if(DateUtil.isEqual(date,new Date())){
            tdClass=' xCalendar-day-today';
        }

        return '<td class="'+tdClass+'"><div class="' + className + '" data-date="' +
            date.getTime() + '" role="button">' +
            date.getDate() + '</div>';
    }


    function html2DOM(str) {
        var ctn = document.createElement('div');
        ctn.innerHTML = str;
        return ctn.children.length > 1 ? ctn.children : ctn.children[0];
    }

    var _minWidth = 200;

    function XCalendar(el, config) {
        if (el) {

            var $el = el.jquery ? el : $(el);
            this.config = $.extend(defaultConfig, config);
            this.id = expando + uuid++;


            var $dom = this.$container = _initDom(this);

            var w = this.config.width || $el.width();
            if (w < _minWidth) {
                w = _minWidth;
            }
            var h = w * 0.6;
            $dom.css('width', w + 'px');
            $dom.find('.xCalendar-wrap').css('height', h + 'px');
            if (w > 300) {
                var weekdaysName = this.config.weekdaysFull;
            }
            else {
                weekdaysName = this.config.weekdaysShort;
            }


            this.commonHead = '<thead><tr>';
            for (i = 0; i < 7; i++) {
                var curWeekDay = this.config.firstDay + i;
                if (curWeekDay >= 7) {
                    curWeekDay %= 7;
                }
                if (curWeekDay == 0) {
                    curWeekDay = 7;
                }
                this.commonHead += '<th class="weekdays">' + weekdaysName[curWeekDay - 1] + '</th>';
            }
            this.commonHead += '</tr></thead>';
            $dom.find('.xCalendar-head-wrap').html('<table class="xCalendar-head-table">' + this.commonHead + '</table>');

            $dom.css({
                left: $el.offset().left + 'px',
                top: $el.offset().top + $el[0].offsetHeight,
                zIndex: this.config.zIndex || 1000

            });
            $el.after($dom);

            $el.attr('data-x-calendar', this.id);
            this.currentDate = new Date();
            _initSwitchButton(this);
            _initYearPanel(this, 2013);
            var self = this;
            $el.on(this.config.openMode || 'focus', function () {

                var date = DateUtil.parse(this.value) || new Date();
                self.render(date.getFullYear(), date.getMonth() + 1);
                $dom.show();
            });
            $dom.find('.xCalendar-wrap').on('click', 'td', function (evt) {


                self.selectedDate = new Date(+$(this).find('.xCalendar-day').attr('data-date'));
                var dateStr = DateUtil.format(self.selectedDate, self.config.format || 'yyyy-mm-dd');
                $el.val(dateStr);
                if (self.config.onSelect) {
                    self.config.onSelect.call(self, self.selectedDate, dateStr);
                }
                console.log(self.selectedDate.toLocaleDateString());
                $dom.hide();
            });
        }
    }

    XCalendar.prototype = {
        render: function (year, month) {
            this.currentDate.setFullYear(year);
            this.currentDate.setMonth(month - 1);
            this.$currentTable = $(_generateTable(this, year, month));

            this.$currentTable.css({
                zIndex: 2,
                top: 0
            });

            var $table_wrap = this.$container.find('.xCalendar-wrap');
            $table_wrap.html('');
            $table_wrap.append(this.$currentTable);

            _renderPrev(this);
            _renderNext(this);
            this.setCurrentMonth(year, month);
        },
        currentYear: function () {
            return this.currentDate.getFullYear();
        },
        currentMonth: function () {
            return this.currentDate.getMonth() + 1;
        },
        setCurrentMonth: function (year, month) {
            this.currentDate.setFullYear(year);
            this.currentDate.setMonth(month - 1);
            this.$container.find('.date-month-wrap').html((this.currentDate.getMonth() + 1) + '月');
            this.$container.find('.date-year-wrap').html(this.currentDate.getFullYear() + '年');

        },
        changeCurrentMonth: function (monthChange) {
            this.setCurrentMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + monthChange + 1);

        }

    };
    function _initDom(xCalendar) {
        var template = '<div class="xCalendar" id="' + xCalendar.id + '">' +
            '<div class="xCalendar-top-panel">' +
            '<div class="prev-month xCalendar-switch-btn"></div>' +
            '<div class="date-holder">' +
            '<div class="date-year-wrap">2014年</div>' +
            '<div class="date-month-wrap">3月</div>' +
            '</div>' +
            '<div class="next-month xCalendar-switch-btn"></div>' +
            '</div>' +
            '<div class="month-panel">';
        for (var i = 0; i < 12; i++) {
            template += '<div class="month-block">' + xCalendar.config.monthsFull[i] + '</div>';
        }
        template += '</div>' +
            '<div class="year-panel"><div class="year-block prev-year-panel">...</div>';
        for (i = 1; i <= 11; i++) {
            template += '<div class="year-block"></div>'
        }
        template += '<div class="year-block next-year-panel">...</div></div>' +
            '<div class="xCalendar-table-ctn">' +
            '<div class="xCalendar-head-wrap"></div>' +
            '<div class="xCalendar-wrap"></div>' +
            ' </div>' +
            '</div>';
        return $(template);
    }

    function _generateTable(xCalendar, year, month) {
        var body = '<tbody>\n', safeIndex = 1000000, overlayHead = '', overlayFoot = '';
        var dIdx = 1, maxDays = getDaysNumInAMonth(year, month);
        i = 0;
        body += '<tr>';
        // console.log(xCalendar.config.firstDay,getCurrentDate(year, month, 1).toLocaleDateString(),getCurrentDate(year, month, 1).getDay(),maxDays);
        while (safeIndex-- > 0) {

            var curWeekDay = xCalendar.config.firstDay + i++;
            if (curWeekDay >= 7) {
                curWeekDay %= 7;
            }
            var curDate = getCurrentDate(year, month, dIdx);

            if (dIdx == 31) {
                // debugger;
            }
            if (dIdx <= maxDays) {
                if (curDate.getDay() != curWeekDay) {
                    var dist = curDate.getDay() - curWeekDay;
                    if (dist < 0) {
                        dist += 7;
                    }
                    body += getDateBlockView(xCalendar,modifyDate(curDate, -dist), true);
                    overlayHead = 'data-overlay-head="true"';

                }
                else {

                    body += getDateBlockView(xCalendar,curDate);

                    dIdx++;
                }
            }
            else {
                endFlag = true;
                dist = curWeekDay - curDate.getDay();
                if (dist < 0) {
                    dist += 7;
                }

                body += getDateBlockView(xCalendar,modifyDate(curDate, dist), true);
                overlayFoot = 'data-overlay-foot="true"';
            }

            if (i == 7) {
                i = 0;
                if (dIdx > maxDays) {
                    body += '</tr></tbody>';
                    break;
                }
                else {
                    body += '</tr>\n<tr>';

                }
            }
        }


        return '<table class="xCalendar-table hide-thead" ' + overlayHead + ' ' + overlayFoot + '>' + xCalendar.commonHead + body + '</table>';


    }

    function _renderPrev(xCalendar,renew) {

        var $table = $(_generateTable(xCalendar, xCalendar.currentYear(), xCalendar.currentMonth() - 1));
        $table.css('zIndex', 1);
        xCalendar.$container.find('.xCalendar-wrap').append($table);


        var offset = -$table.height();//offsetHeight;

        if (xCalendar.$currentTable.attr('data-overlay-head')) {
            var h1 = $table.find('tbody tr:last').height(),
                h2 = xCalendar.$currentTable.find('tbody tr').height();

            offset += h2;
            offset += 4 + (h1 - h2) / 2;
        }
        $table.css('top', offset + 'px');
        if(renew&&xCalendar.$prevTable){
            xCalendar.$prevTable.remove();
        }
        xCalendar.$prevTable = $table;

    }

    function _renderNext(xCalendar,renew) {

        var $table = $(_generateTable(xCalendar, xCalendar.currentYear(), xCalendar.currentMonth() + 1));
        $table.css('zIndex', 1);
        xCalendar.$container.find('.xCalendar-wrap').append($table);

        var offset = xCalendar.$currentTable.height();
        if (xCalendar.$currentTable.attr('data-overlay-foot')) {
            var h1 = $table.find('tbody tr').height(),
                h2 = xCalendar.$currentTable.find('tbody tr:last').height();
            offset -= h2;

            offset -= 4 + Math.ceil((h1 - h2) / 2);
        }
        $table.css('top', offset + 'px');
        if(renew&&xCalendar.$nextTable){
            xCalendar.$nextTable.remove();
        }
        xCalendar.$nextTable = $table;
    }

    var Animate = function () {

        function getTransition(el) {
            var getComputedStyle = window.getComputedStyle || (document.defaultView && document.defaultView.getComputedStyle);
            var styles = getComputedStyle(el);
            return parseFloat(styles['webkitTransitionDuration'] || styles['mozTransitionDuration'] || styles['transitionDuration']) * 1000;
        }

        function isSupportCss(propertyName, el) {
            var div = el || document.createElement('div'),
                getComputedStyle = window.getComputedStyle || (document.defaultView && document.defaultView.getComputedStyle),
                body = body = document.body || document.getElementsByTagName('body')[0];
            if (getComputedStyle) {
                var styles = getComputedStyle(div);

            }
            else if (body.currentStyle || body.runtimeStyle) {
                styles = body.currentStyle || body.runtimeStyle;
            }

            var prefixs = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
            for (var i = 0; i < prefixs.length; i++) {
                var styleVal = styles[prefixs[i] + propertyName];

                if (styleVal == '') {
                    return true;
                }
                else if (styleVal) {
                    return styleVal;
                }
            }
            return false;
        }

        return function ($el, css, delay, callback) {
            var cssVal = isSupportCss('transition', $el[0]);

            if (cssVal) {
                $el.css(css);
                //console.log($el,getTransition($el[0]))
                if (callback) {
                    setTimeout(function () {
                        callback();
                    }, getTransition($el[0]));
                }
            }
            else {
                $el.animate(css, delay, 'linear', callback);
            }
        }

    }();


    function _initSwitchButton(xCalendar) {
        var _inScroll = false;

        xCalendar.$container.find('.prev-month').on('click', function () {

            if (!_inScroll) {
                _inScroll = true;
                var h = -parseInt(xCalendar.$prevTable.css('top'));
                xCalendar.$prevTable.css('z-index', 2);
                Animate(xCalendar.$prevTable, {'top': 0}, 600, function () {
                    xCalendar.$currentTable.remove();
                    xCalendar.$currentTable = xCalendar.$prevTable;
                    xCalendar.changeCurrentMonth(-1);
                    _renderPrev(xCalendar);
                    _renderNext(xCalendar,true);
                    _inScroll = false;

                });

                Animate(xCalendar.$currentTable, {'top': h + 'px'}, 600);
            }
        });

        xCalendar.$container.find('.next-month').on('click', function () {
            if (!_inScroll) {

                _inScroll = true;

                var h = -parseInt(xCalendar.$nextTable.css('top'));
                xCalendar.$nextTable.css('z-index', 2);
                Animate(xCalendar.$nextTable, {'top': 0}, 600, function () {
                    xCalendar.$currentTable.remove();
                    xCalendar.$currentTable = xCalendar.$nextTable;
                    xCalendar.changeCurrentMonth(1);
                    _renderPrev(xCalendar,true);
                    _renderNext(xCalendar);


                    _inScroll = false;
                    console.log(1);
                });
                Animate(xCalendar.$currentTable, {'top': h + 'px'}, 600);
            }

        });
    }


    function _initYearPanel(xCalendar, year) {
        var panelYear = year,
            $yearPanel = xCalendar.$container.find('.year-panel .prev-year-panel');

        function generateYearPanel() {
            $yearPanel.each(function (idx, item) {

                if (idx > 0 && idx < 11) {
                    item.innerHTML = panelYear - 7 + idx;
                }
            });
        }

        $yearPanel.on('click', function () {
            panelYear -= 10;
            generateYearPanel();
        });
        $yearPanel.on('click', function () {
            panelYear += 10;
            generateYearPanel();
        });
        generateYearPanel();
    }

    window.XCalendar = XCalendar;

}();