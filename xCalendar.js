/**
 * Created with PhpStorm.
 * User: godsong
 * Date: 14-3-17
 * Time: 下午7:14
 */
var xCalendar=function(){
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


    var firstDay= 0;
    var lang={
        weekdaysFull:['周一','周二','周三','周四','周五','周六','周日']
    };
    var _monthDate=new Date(),_curDate=new Date(),_selectedDate=new Date();
    function getDaysNumInAMonth(year,month){
        _monthDate.setFullYear(year);
        _monthDate.setMonth(month);
        _monthDate.setDate(0);
        return  _monthDate.getDate();
    }

    function getCurrentDate(year,month,date){
        _curDate.setFullYear(year);
        _curDate.setMonth(month-1);
        _curDate.setDate(date);
        return _curDate;

    }
    function modifyDate(date,d,m,y){
        var newDate=new Date();

        newDate.setFullYear(date.getFullYear()+(y||0));
        newDate.setMonth(date.getMonth()+(m||0));
        newDate.setDate(date.getDate()+(d||0));
        console.log(date.toLocaleDateString(), d,newDate.toLocaleDateString());
        return newDate;

    }
    function getDateBlockView(date,outfocus){
        var className='calendar-day';
        if(outfocus){
            className+=' calendar-day-outfocus';
        }

        return '<td><div class="'+className+'" data-pick="'+
            date.getTime()+'" role="button">'+
            date.getDate()+'</div>';
    }
    function render(year,month){

        //处理头
        var head='<thead><tr>';
        var dIdx= 1,maxDays=getDaysNumInAMonth(year,month);


        for(var i=0;i<7;i++){
            var curWeekDay=firstDay+i;
            if(curWeekDay>=7){
                curWeekDay%=7;
            }
            if(curWeekDay==0){
                curWeekDay=7;
            }
            head+='<th class="weekdays">'+lang.weekdaysFull[curWeekDay-1]+'</th>';
        }
        i=0;

        var body='<tbody>\n<tr>',endFlag=false,saveIndex=1000000;
        while(saveIndex-->0){

            curWeekDay=firstDay+i++;
            if(curWeekDay>=7){
                curWeekDay%=7;
            }
            var curDate=getCurrentDate(year,month,dIdx);
            if(dIdx<=maxDays){
                if(curDate.getDay()!=curWeekDay){
                    var dist=curDate.getDay()-curWeekDay;
                    if(dist<0){
                        dist+=7;
                    }

                    body+=getDateBlockView(modifyDate(curDate,-dist),true);
                }
                else{
                    body+=getDateBlockView(curDate);
                    dIdx++;
                }
            }
            else{
                endFlag=true;
                dist=curWeekDay-curDate.getDay();
                if(dist<0){
                    dist+=7;
                }
                body+=getDateBlockView(modifyDate(curDate,dist),true);
            }

            if(i==7){
                i=0;
                if(endFlag){
                    body+='</tr></tbody>';
                    break;

                }
                else{
                    body+='</tr>\n<tr>';
                }
            }
        }



        head+='</tr></thead>\n';
        var html='<table class="calendar-table">'+head+body+'</table>';
        console.log(html);
       document.querySelector('#calendar_wrap').innerHTML=html;


    }
    document.querySelector('.prev-month').onclick=function(){
        _selectedDate.setMonth(_selectedDate.getMonth()-1);
        render(_selectedDate.getFullYear(), _selectedDate.getMonth()+1);
    };
    document.querySelector('.next-month').onclick=function(){
        _selectedDate.setMonth(_selectedDate.getMonth()+1);
        render(_selectedDate.getFullYear(), _selectedDate.getMonth()+1);
    };
    return {
        render:render
    }

}();