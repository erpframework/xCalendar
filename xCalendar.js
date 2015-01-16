/**
 * Created with PhpStorm.
 * User: godsong
 * Date: 14-3-17
 * Time: 下午7:14
 */
!function () {
    Date.prototype.toString=Date.prototype.toLocaleDateString;
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


        core.format = function (date, formatStr) {
            formatStr = formatStr || 'yyyy-mm-dd';
            return formatStr.replace(_regFormat, function (m) {
                return _dateResolver(date, m);
            })
        };
        core.isEqual = function (date1, date2) {
            if (!date1 || !date2) {
                return false;
            }
            return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();

        };
        core.clone=function(date){
            return new Date(date.getTime());
        };
        core.parse = function (dateStr, formatStr) {
            _matchType = [];
            if (dateStr) {
                if (formatStr) {
                    var date = new Date(1,0,1);
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
                    if (isNaN(+tok[0])) {
                        return null;
                    }
                    else {
                        return new Date(+tok[0], +tok[1] - 1, +tok[2]);
                    }

                }
            } else {
                return null;
            }
        };
        core.strtotime=function (str, date) {

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
        return core;

    }();


    var expando = 'xCalendar_',
        uuid = 1;
    var defaultConfig = {
        min:'0000-01-01',
        max:'9999-12-31',
        firstDay: 0,
        format: 'yyyy-mm-dd',
        weekdaysFull: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        weekdaysShort: ['一', '二', '三', '四', '五', '六', '日'],
        monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    };


    function getDaysNumInAMonth(year, month) {
        var _monthDate = new Date(year,month,0);

        return  _monthDate.getDate();
    }

    function getCurrentDate(year, month, date) {

        return new Date(year,month-1,date);

    }

    function modifyDate(date, d, m, y) {
        return new Date(date.getFullYear() + (y || 0),date.getMonth() + (m || 0),date.getDate() + (d || 0));
    }

    function _resolveDisableDate(xCalendar, date) {
        var dateStr = DateUtil.format(date, xCalendar.config.format);

        if (xCalendar.config.min && dateStr < xCalendar.config.minDateStr) {
            return true;
        }

        if (xCalendar.config.max && dateStr > xCalendar.config.maxDateStr) {

            return true;
        }
        if (xCalendar.config.disable) {
            return xCalendar.config.disable.call(xCalendar,date, dateStr);
        }
        return false;
    }

    function getDateBlockView(xCalendar, date, outfocus) {
        var ctx={
            className:['xCalendar-day'],
            property:['data-date='+date.getTime()],
            content:date.getDate()
        };


        if (outfocus) {
            ctx.className.push('xCalendar-day-outfocus');
        }

        if (DateUtil.isEqual(date, xCalendar.selectedDate)) {
            ctx.className.push('xCalendar-day-selected');
        }
        if (DateUtil.isEqual(date, new Date())) {
            ctx.className.push('xCalendar-day-today');
        }
        var disabled = _resolveDisableDate(xCalendar, date);
        if(disabled){
            ctx.property.push('disabled="true"');
            ctx.className.push('xCalendar-day-disabled');
        }


        if (xCalendar.config.beforeShowDay) {
            xCalendar.config.beforeShowDay.call(xCalendar,date,ctx);
        }
        return '<td class="' + ctx.className.join(' ') +'" '+ctx.property.join(' ')+'>' +
            ctx.content + '</td>';
    }


    function html2DOM(str) {
        var ctn = document.createElement('div');
        ctn.innerHTML = str;
        return ctn.children.length > 1 ? ctn.children : ctn.children[0];
    }

    var _minWidth = 250;
    function _adjustSize(xCalendar){
        if(xCalendar.config.fullscreen){
            var w=xCalendar.config.width||window.innerWidth*0.5;
            if(w<300){
                w=300;
            }
        }
        else{
            w = xCalendar.config.width || xCalendar.$el.width();
        }
        if (w < _minWidth) {
            w = _minWidth;
        }
        h = Math.ceil(w * 0.64);
        xCalendar.$container.css('width', w + 'px');
        xCalendar.$container.find('.xCalendar-wrap').css('height', h + 'px');
        xCalendar.width=w;
        xCalendar.height=h;
    }
    function _initPosition(xCalendar){
        if(xCalendar.config.fullscreen){
            var $mask=xCalendar.$mask=$('<div></div>');
            $mask.css({
                position:'fixed',
                top:0,
                left:0,
                right:0,
                bottom:0,
                background:'rgba(0,0,0,0.32)',
                display:'none',
                zIndex:(xCalendar.config.zIndex||1000)-1
            });
            $(document.body).append($mask).append(xCalendar.$container);
            var x=(window.innerWidth-xCalendar.width)/2;
            if(x<0){
                x=0;
            }
            y=(window.innerHeight-xCalendar.$container.height())/2;
            if(y<0){
                y=0;
            }
            xCalendar.$container.css({
                position:'fixed',
                left:  x+ 'px',
                top: y+'px',
                zIndex: xCalendar.config.zIndex || 1000

            }).addClass('fullscreen');



        }
        else{


            xCalendar.$container.css({
                left: xCalendar.$el[0].offsetLeft + 'px',
                top: xCalendar.$el[0].offsetTop + xCalendar.$el[0].offsetHeight,
                zIndex: xCalendar.config.zIndex || 1000

            });
            xCalendar.$el.after(xCalendar.$container);
        }

    }
    function _initHeader(xCalendar){
        if (xCalendar.width > 300) {
            var weekdaysName = xCalendar.config.weekdaysFull;
        }
        else {
            weekdaysName = xCalendar.config.weekdaysShort;
        }


        xCalendar.commonHead = '<thead><tr>';
        for (i = 0; i < 7; i++) {
            var curWeekDay = xCalendar.config.firstDay + i;
            if (curWeekDay >= 7) {
                curWeekDay %= 7;
            }
            if (curWeekDay == 0) {
                curWeekDay = 7;
            }
            xCalendar.commonHead += '<th class="weekdays">' + weekdaysName[curWeekDay - 1] + '</th>';
        }
        xCalendar.commonHead += '</tr></thead>';
        xCalendar.$container.find('.xCalendar-head-wrap').html('<table class="xCalendar-head-table">' + xCalendar.commonHead + '</table>');
    }
    function XCalendar(el, config) {
        if (el) {

            var $el = el.jquery ? el : $(el);
            if($el.length==0){
                return;
            }
            this.config = $.extend({},defaultConfig, config);
            this.id = expando + uuid++;

            if(this.config.min instanceof Date){
                this.config.minDateStr=DateUtil.format(this.config.min,this.config.format);


            }
            else{
                this.config.minDateStr=this.config.min;
                this.config.min=DateUtil.parse(this.config.min, this.config.format);

            }
            if(this.config.max instanceof Date){
                this.config.maxDateStr=DateUtil.format(this.config.max,this.config.format);

            }
            else{
                this.config.maxDateStr=this.config.max;
                this.config.max=DateUtil.parse(this.config.max, this.config.format);

            }




            var $dom = this.$container = _initDom(this);
            this.currentDate = DateUtil.parse(this.config.defaultDate, this.config.format) || new Date();

            if(this.currentDate.getTime()<this.config.min.getTime()){
                this.currentDate=DateUtil.clone(this.config.min);
            }
            else if(this.currentDate.getTime()>this.config.max.getTime()){
                this.currentDate=DateUtil.clone(this.config.max);
            }
            _initSwitchButton(this);
            _initYearMonthPanel(this, this.currentDate.getFullYear());
            var self = this;

            _initHeader(this);
            this.isOpen=false;
            this.isOpenEx=false;
            this.isYearhOpen=false;
            this.isMonthOpen=false;
            _adjustSize(this);
            if($el[0].tagName=='INPUT'){
                this.$el=$el;
                _initPosition(this);

            }
            else{
                $el.append($dom);
                // this.open();
            }
            if(this.config.partials&&this.config.partials.append){
                $dom.append(this.config.partials.append);
            }
            $el.attr('data-x-calendar', this.id);

            var lock=false;
            $el.on('focus', function () {
                lock=true;
                this.blur();
                lock=false;
                self.open($el.val());
            });
            if(this.config.bindClick!==false){
                $el.on('click',function(evt){
                    if(self.isOpenEx){

                        if(self.config.secondClick){
                            self.close();
                        }
                    }
                    else{
                        self.open($el.val());
                        self.isOpenEx=true;
                    }
                    evt.stopPropagation();
                })}
            $el.on('blur',function(){
                if(!self.config.selectClose&&!lock){
                    self.timer=setTimeout(function(){
                        self.close();
                    },200);
                }
            });
            $(document).on('click',function(){
                if(!self.config.selectClose){
                    self.close();
                }
            });
            $dom.on('click',function(evt){
                clearTimeout(self.timer);
                evt.stopPropagation();
            });
            var clickType='click';
            if('ontouchstart' in document.documentElement){
                clickType='touchstart';
            }
            $dom.find('.xCalendar-wrap').on(clickType, 'td', function (evt) {
                var $td = $(this);
                if (!$td.attr('disabled')) {
                    self.selectedDate = new Date(+$td.attr('data-date'));
                    var dateStr = DateUtil.format(self.selectedDate, self.config.format);
                    $el.val(dateStr);
                    console.log('click td closed');
                    self.close();
                    evt.stopPropagation();
                }
            });
        }

    }

    XCalendar.prototype = {
        format:function(date,formatStr){
            return DateUtil.format(date,formatStr);
        },
        open:function(dateStr){
            if(!this.isOpen){
                var curDate= DateUtil.parse(dateStr, this.config.format);
                if(curDate){
                    this.selectedDate=DateUtil.clone(curDate);
                }
                else{
                    curDate=this.currentDate
                }

                this.render(curDate.getFullYear(), curDate.getMonth() + 1);
                this.$container.find('.xCalendar-table-ctn').show();
                this.$container.find('.month-panel').hide();
                this.$container.find('.year-panel').hide();
                this.closeMonthPanel();
                this.closeYearPanel();
                if(this.config.fullscreen){
                    //this.$container.css('position','absolute');
                    this.$mask.show();
                    this.$container.css('-webkit-transform','scale(0)');
                    this.$container.show();
                    _renderPrev(this);
                    _renderNext(this);
                    var self=this;
                    clearTimeout(self.hideTimer);
                    setTimeout(function(){
                        self.$container.css('-webkit-transform','scale(1)');
                    },100);
                    /*setTimeout(function(){
                     self.$container.css('-webkit-transform','');
                     },1000);*/

                }
                else{
                    this.$container.show();
                    _renderPrev(this);
                    _renderNext(this);
                }
                this.isOpen=true;

            }
            return this;
        },
        openYearPanel:function(){
            this.$container.find('.xCalendar-table-ctn').hide();
            this.$container.find('.month-panel').hide();
            _generateYearPanel(this,this.currentYear());
            this.$container.find('.year-panel').show();
            this.isMonthOpen=false;
            this.isYearOpen=true;

        },
        closeYearPanel:function(){
            this.$container.find('.xCalendar-table-ctn').show();
            this.$container.find('.year-panel').hide();
            this.isYearOpen=false;

        },
        toggleYearPanel:function(){
            if(!this.isYearOpen){
                this.openYearPanel();
            }
            else{
                this.closeYearPanel();
            }
        },
        openMonthPanel:function(){
            var self=this;
            this.$container.find('.month-panel .month-block').each(function(idx,item){
                if((new Date(self.currentYear(),idx+1,0)<=self.config.min)||(new Date(self.currentYear(),idx,1)>=self.config.max)){
                    item.className+=' panel-disabled';
                }
                else{
                    item.className=item.className.replace(' panel-disabled','');
                }
            });
            this.$container.find('.xCalendar-table-ctn').hide();
            this.$container.find('.year-panel').hide();
            this.$container.find('.month-panel').show();
            this.isMonthOpen=true;
            this.isYearOpen=false;

        },
        closeMonthPanel:function(){
            this.$container.find('.xCalendar-table-ctn').show();
            this.$container.find('.month-panel').hide();
            this.isMonthOpen=false;

        },
        toggleMonthPanel:function(){

            if(!this.isMonthOpen){
                this.openMonthPanel();
            }
            else{
                this.closeMonthPanel();

            }
        },
        close:function(){
            if(this.isOpen){
                if(!this.config.selectClose){
                    if(this.config.fullscreen){
                        this.$mask.hide();
                        this.$container.css('-webkit-transform','scale(0)');
                        var self=this;
                        clearTimeout(self.hideTimer);
                        self.hideTimer=setTimeout(function(){
                            self.$container.hide();
                        },600);
                    }
                    else{
                        this.$container.hide();
                    }

                }
                if (this.config.onSelect&&this.selectedDate) {
                    var dateStr = DateUtil.format(this.selectedDate, this.config.format);
                    this.config.onSelect.call(this, this.selectedDate, dateStr);
                }
                this.isOpen=false;
                this.isOpenEx=false;
                if(this.config.selectClose){
                    this.open();
                }

            }
        },
        render: function (year, month) {
            this.$currentTable = $(_generateTable(this, year, month));

            this.$currentTable.css({
                zIndex: 2,
                top: 0
            });

            var $table_wrap = this.$container.find('.xCalendar-wrap');
            $table_wrap.html('');
            $table_wrap.append(this.$currentTable);
            this.setCurrentMonth(year, month);
            _changeSwitchBtnState(this);



        },
        currentYear: function () {
            return this.currentDate.getFullYear();
        },
        currentMonth: function () {
            return this.currentDate.getMonth() + 1;
        },
        setCurrentMonth: function (year, month) {
            this.currentDate.setDate(1);
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
            template += '<div class="month-block" data-month="'+(i+1)+'">' + xCalendar.config.monthsFull[i] + '</div>';
        }
        template += '</div>' +
            '<div class="year-panel"><div class="year-block prev-year-panel"><<</div>';
        for (i = 1; i < 11; i++) {
            template += '<div class="year-block"></div>'
        }
        template += '<div class="year-block next-year-panel">>></div></div>' +
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
            //console.log(year,month,curDate);

            if (dIdx <= maxDays) {
                if (curDate.getDay() != curWeekDay) {
                    var dist = curDate.getDay() - curWeekDay;
                    if (dist < 0) {
                        dist += 7;
                    }
                    body += getDateBlockView(xCalendar, modifyDate(curDate, -dist), true);
                    overlayHead = 'data-overlay-head="true"';

                }
                else {

                    body += getDateBlockView(xCalendar, curDate);

                    dIdx++;
                }
            }
            else {
                endFlag = true;
                dist = curWeekDay - curDate.getDay();
                if (dist < 0) {
                    dist += 7;
                }

                body += getDateBlockView(xCalendar, modifyDate(curDate, dist), true);
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

    function _renderPrev(xCalendar, renew) {

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
        if (renew && xCalendar.$prevTable) {
            xCalendar.$prevTable.remove();
        }
        xCalendar.$prevTable = $table;

    }

    function _renderNext(xCalendar, renew) {

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
        if (renew && xCalendar.$nextTable) {
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

    function _changeSwitchBtnState(xCalendar){
        var nextMonth=new Date(xCalendar.currentYear(),xCalendar.currentMonth(),1);
        var prevMonth=new Date(xCalendar.currentYear(),xCalendar.currentMonth()-1,0);


        if (nextMonth <=xCalendar.config.max) {
            xCalendar.$container.find('.next-month').removeClass('disabled');
        }
        else{
            xCalendar.$container.find('.next-month').addClass('disabled');
        }

        if (prevMonth>= xCalendar.config.min) {
            xCalendar.$container.find('.prev-month').removeClass('disabled');
        }
        else{
            xCalendar.$container.find('.prev-month').addClass('disabled');
        }
    }
    function _initSwitchButton(xCalendar) {
        var _inScroll = false;

        xCalendar.$container.find('.prev-month').on('click', function (evt) {

            if (!_inScroll&&!(xCalendar.isYearOpen||xCalendar.isMonthOpen)) {

                var prevMonth=new Date(xCalendar.currentYear(),xCalendar.currentMonth()-1,0);
                if (prevMonth>=xCalendar.config.min) {
                    _inScroll = true;

                    var h = -parseInt(xCalendar.$prevTable.css('top'));
                    xCalendar.$prevTable.css('z-index', 2);
                    Animate(xCalendar.$prevTable, {'top': 0}, 600, function () {
                        xCalendar.$currentTable.remove();
                        xCalendar.$currentTable = xCalendar.$prevTable;
                        xCalendar.changeCurrentMonth(-1);
                        _renderPrev(xCalendar);
                        _renderNext(xCalendar, true);
                        _changeSwitchBtnState(xCalendar);
                        _inScroll = false;

                    });

                    Animate(xCalendar.$currentTable, {'top': h + 'px'}, 600);
                }
                else{

                }


            }

        });

        xCalendar.$container.find('.next-month').on('click', function (evt) {
            if (!_inScroll&&!(xCalendar.isYearOpen||xCalendar.isMonthOpen)) {

                var nextMonth=new Date(xCalendar.currentYear(),xCalendar.currentMonth(),1);
                if (nextMonth<=xCalendar.config.max) {
                    _inScroll = true;

                    var h = -parseInt(xCalendar.$nextTable.css('top'));
                    xCalendar.$nextTable.css('z-index', 2);
                    Animate(xCalendar.$nextTable, {'top': 0}, 600, function () {
                        xCalendar.$currentTable.remove();
                        xCalendar.$currentTable = xCalendar.$nextTable;
                        xCalendar.changeCurrentMonth(1);
                        _renderPrev(xCalendar, true);
                        _renderNext(xCalendar);
                        _changeSwitchBtnState(xCalendar);

                        _inScroll = false;

                    });
                    Animate(xCalendar.$currentTable, {'top': h + 'px'}, 600);
                }

            }

        });
    }

    function _generateYearPanel(xCalendar,year) {
        xCalendar.$container.find('.year-panel .year-block').each(function (idx, item) {

            var curYear=year - 7 + idx;
            if (idx > 0 && idx < 11) {
                item.innerHTML = curYear;
            }

            if(new Date(curYear,11,31)<xCalendar.config.min||new Date(curYear,0,1)>xCalendar.config.max){
                $(item).addClass('panel-disabled');
            }
            else{
                $(item).removeClass('panel-disabled');
            }

        });
    }
    function _initYearMonthPanel(xCalendar,year) {
        var panelYear=year,isYearOpen=false,isMonthOpen=false;
        xCalendar.$container.find('.prev-year-panel').on('click', function (evt) {

            if(!$(evt.target).hasClass('panel-disabled')){
                panelYear -= 10;
                _generateYearPanel(xCalendar,panelYear);
            }

        });
        xCalendar.$container.find('.next-year-panel').on('click', function (evt) {

            if(!$(evt.target).hasClass('panel-disabled')){
                panelYear += 10;
                _generateYearPanel(xCalendar,panelYear);
            }

        });
        xCalendar.$container.find('.date-year-wrap').on('click',function(evt){
            panelYear=xCalendar.currentYear();
            xCalendar.toggleYearPanel();
        });
        xCalendar.$container.find('.date-month-wrap').on('click',function(evt){
            xCalendar.toggleMonthPanel();
        });
        xCalendar.$container.find('.year-panel .year-block').on('click',function(evt){
            var $this=$(evt.target);
            if(!$this.hasClass('panel-disabled')&&!$this.hasClass('prev-year-panel')&&!$this.hasClass('next-year-panel')){
                xCalendar.render(+$this.html(),xCalendar.currentMonth());
                _renderPrev(xCalendar);
                _renderNext(xCalendar);
                xCalendar.closeYearPanel();

            }
        });
        xCalendar.$container.find('.month-panel .month-block').on('click',function(evt){
            var $this=$(evt.target);
            if(!$this.hasClass('panel-disabled')){
                xCalendar.render(xCalendar.currentYear(),+$this.attr('data-month'));
                xCalendar.closeMonthPanel();
                _renderPrev(xCalendar);
                _renderNext(xCalendar);

            }
        });
        _generateYearPanel(xCalendar,panelYear);
    }


    window.XCalendar = XCalendar;

}();