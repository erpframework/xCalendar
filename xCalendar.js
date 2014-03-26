/**
 * Created with PhpStorm.
 * User: godsong
 * Date: 14-3-17
 * Time: 下午7:14
 */
var xCalendar = function () {
    var DateUtil = window.DateUtil = function () {

        var _dateConver = {
            'day': function (date, num) {
                date.setDate(date.getDate() + num);
            },
            'year': function (date, num) {
                var d = date.getDate();
                date.setFullYear(date.getFullYear() + num);
                if (date.getDate() != d) {
                    date.setDate(0);
                }
            },
            'month': function (date, num) {
                var d = date.getDate();
                date.setMonth(date.getMonth() + num);
                if (date.getDate() != d) {
                    date.setDate(0);

                }
            }
        };

        function _convert(str, date, num) {
            str = str.toLowerCase();
            if (str == 'd') {
                str = 'day';
            }
            else if (str == 'y') {
                str = 'year';
            }
            else if (str == 'm') {
                str = 'month';
            }
            _dateConver[str](date, num);
        }

        function strtotime(str, date) {

            date = date instanceof Date ? new Date(date) : new Date();
            var reg = /([\+\-])(\d+)\s*([a-zA-Z]+)/g;
            var token;
            while (token = reg.exec(str)) {
                //console.log(token);
                var opt = token[1] == '-' ? -1 : 1;

                _convert(token[3], date, +token[2] * opt);
            }
            return date;
        }

        function format(d, str) {
            return d.getFullYear() + '-' + (d.getMonth() > 8 ? '' : '0') + (d.getMonth() + 1) + '-' + (d.getDate() > 9 ? '' : '0') + d.getDate();
        }

        return {
            strtotime: strtotime,
            format: format
        }
    }();


    var firstDay = 0,
        expando='xCalendar_',
        uuid=1;
    var lang = {
        weekdaysFull: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    };
    var _monthDate = new Date(), _currentSelectedDate = new Date();

    function getDaysNumInAMonth(year, month) {
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

    function getDateBlockView(date, outfocus) {
        var className = 'xCalendar-day';
        if (outfocus) {
            className += ' xCalendar-day-outfocus';
        }

        return '<td><div class="' + className + '" data-pick="' +
            date.getTime() + '" role="button">' +
            date.getDate() + '</div>';
    }

    var _commonHead=function () {
        var head = '<thead><tr>';
        for (var i = 0; i < 7; i++) {
            var curWeekDay = firstDay + i;
            if (curWeekDay >= 7) {
                curWeekDay %= 7;
            }
            if (curWeekDay == 0) {
                curWeekDay = 7;
            }
            head += '<th class="weekdays">' + lang.weekdaysFull[curWeekDay - 1] + '</th>';
        }
        head += '</tr></thead>';
        $('.xCalendar_head_wrap').html('<table class="xCalendar-head-table">'+head+'</table>');
        return head;
        //return head;
    }();

    function generateTable(year, month) {
        var body = '<tbody>\n', safeIndex = 1000000, overlayHead = '', overlayFoot = '';
        var dIdx = 1, maxDays = getDaysNumInAMonth(year, month);
        i = 0;
        body += '<tr>';
        while (safeIndex-- > 0) {

            curWeekDay = firstDay + i++;
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
                    body += getDateBlockView(modifyDate(curDate, -dist), true);
                    overlayHead = 'data-overlay-head="true"';

                }
                else {

                    body += getDateBlockView(curDate);

                    dIdx++;
                }
            }
            else {
                endFlag = true;
                dist = curWeekDay - curDate.getDay();
                if (dist < 0) {
                    dist += 7;
                }

                body += getDateBlockView(modifyDate(curDate, dist), true);
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





        return '<table class="xCalendar-table hide-thead" ' + overlayHead + ' ' + overlayFoot + '>' + _commonHead + body + '</table>';;


    }

    function html2DOM(str) {
        var ctn = document.createElement('div');
        ctn.innerHTML = str;
        return ctn.children.length > 1 ? ctn.children : ctn.children[0];
    }
    var _xCalendar_inSight,xCalendar_prev_table


    function XCalendar(el,config){
        if(el){

        }
    }
    XCalendar.prototype={
        render:function(year, month) {
            this.currentTable = html2DOM(generateTable(year, month));

            this.currentTable.style.zIndex = 2;
            this.currentTable.style.top = '0';
            var $table_wrap=$('#'+this.id).find('.xCalendar_wrap');
            $table_wrap.html('');

           $table_wrap.append(this.currentTable);

            this.prevTable=_renderPrev($table_wrap,$(this.currentTable),year, month);
            this.nextTable=_renderNext($table_wrap,$(this.currentTable),year, month);
            setCurrentMonth(year, month);
            initYearPanel();
            generateYearPanel();
        },
        currentYear:function(){
            return this.currentDate.getFullYear();
        },
        currentMonth:function(){
            return this.currentDate.getMonth()+1;
        }
    }

    function _renderPrev(xCalendar,$wrap,$inSight,year, month) {

        var $table = $(generateTable(xCalendar.currentYear(), xCalendar.currentMonth()-1));
        $table.css('zIndex' ,1);
        xCalendar.$wrap.append(tb);


        var offset = -$table.height();//offsetHeight;
        var $currentTable=$(xCalendar.currentTable);
        if (xCalendar.$currentTable.attr('data-overlay-head')) {
            var h1 = $table.find('tbody tr:last').height(),
                h2 = xCalendar.$currentTable.find('tbody tr').height();

            offset += h2;
            offset += 4 + (h1 - h2) / 2;
        }
        $table.css('top', offset + 'px');
        xCalendar.$prevTable=$table;

    }

    function _renderNext($wrap,$inSight,year, month) {
        var tb = html2DOM(generateTable(year, month + 1));
        tb.style.zIndex = 1;
        $wrap.append(tb);
        $inSight = $('.xCalendar_inSight');
        var offset = $inSight.height();
        if ($inSight.attr('data-overlay-foot')) {
            var h1 = $(tb).find('tbody tr').height(),
                h2 = $inSight.find('tbody tr:last').height();
            offset -= h2;

            offset -= 4 + Math.ceil((h1 - h2) / 2);
        }
        tb.style.top = offset + 'px';
        return tb;
    }

    var Animate = function () {

        function getTransition(el) {
            var getComputedStyle = window.getComputedStyle || (document.defaultView && document.defaultView.getComputedStyle);
            var styles = getComputedStyle(el);
            return parseFloat(styles['webkitTransitionDuration']||styles['mozTransitionDuration']||styles['transitionDuration']) * 1000;
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
                callback && setTimeout(callback, getTransition($el[0]));
            }
            else {
                $el.animate(css, delay, 'swing', callback);
            }
        }

    }();

    function setCurrentMonth(year, month) {
        _currentSelectedDate.setFullYear(year);
        _currentSelectedDate.setMonth(month-1);

        $('.date-month-wrap').html((_currentSelectedDate.getMonth()+1) + '月');
        $('.date-year-wrap').html(_currentSelectedDate.getFullYear() + '年');
        return month;
    }

    function changeCurrentMonth(monthChange) {
        setCurrentMonth(_currentSelectedDate.getFullYear(), _currentSelectedDate.getMonth() + monthChange+1);

    }
    function _initSwitchButton(xCalendar){
    var _inScroll = false,
        $ctn=$('#'+xCalendar.id);

        $ctn.find('.prev-month').on('click' , function () {
        if (!_inScroll) {
            _inScoll = true;
            var $prev = $(xCalendar.prevTable);

            var h = -parseInt($prev.css('top'));
            $prev.css('z-index', 2);
            Animate($prev, {'top': 0}, 600, function () {
                $(xCalendar.currentTable).remove();
                xCalendar.currentTable=xCalendar.prevTable;
                changeCurrentMonth(-1);
                _renderPrev(xCalendar);
                _inScoll = false;
                console.log(1);
            });
            //$prev.animate({'top':0},);
            Animate($('.xCalendar_inSight'), {'top': h + 'px'}, 600);
        }
    });;
    document.querySelector('.next-month').onclick = function () {
        if (!_inScoll) {
            _inScoll = true;
            var $next = $('.xCalendar_next_table');
            var h = -parseInt($next.css('top'));
            $next.css('z-index', 2);
            Animate($next, {'top': 0}, 600, function () {
                $('.xCalendar_inSight').remove();
                $next.attr('id', 'xCalendar_inSight');
                changeCurrentMonth(1);
                renderNext(_currentSelectedDate.getFullYear(), _currentSelectedDate.getMonth() + 1);
                _inScoll = false;
                console.log(1);
            });
            Animate($('.xCalendar_inSight'), {'top': h + 'px'}, 600);
        }
        /* _currentSelectedDate.setMonth(_currentSelectedDate.getMonth() + 1);
         render(_currentSelectedDate.getFullYear(), _currentSelectedDate.getMonth() + 1);*/
    };
    }
    var panelYear=2013;
    function initYearPanel(){
        $('.year-panel .prev-year-panel').on('click',function(){
            panelYear-=10;
            generateYearPanel(panelYear);
        })
        $('.year-panel .next-year-panel').on('click',function(){
            panelYear+=10;
            generateYearPanel(panelYear);
        })
    }
    function generateYearPanel(){
        $('.year-panel .year-block').each(function(idx,item){
            //debugger;
            if(idx>0&&idx<11){
                item.innerHTML=panelYear-7+idx;
            }
        });
    }




    return {
        render: render
    }

}();