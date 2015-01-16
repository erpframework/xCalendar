/**
 * Created by godsong on 14-12-15.
 */


var re_trim = /^\s+|\s+$/g;
var _defaultConfig = {
    firstDay: 0,
    format: 'yyyy-mm-dd',
    weekdaysFull: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    weekdaysShort: ['一', '二', '三', '四', '五', '六', '日'],
    monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
};
/////========================utils========================/////
function _trim(str) {
    return str.replace(re_trim, '');
}
function _append(parent, child) {
    if (child instanceof Array) {
        for (var i = 0; i < child.length; i++) {
            parent.appendChild(child[i]);
        }
    }
    else {
        parent.appendChild(child);
    }

}
function XNode(text) {
    var splits = text.split(/(\.|#|\*|:)/);
    var curMode = 'tagName';//当前token的模式 【tagName,className,或者ID
    this.className = [];
    this.operationId=null;
    this.tagName = null;
    this.text = text;
    for (var i = 0; i < splits.length; i++) {
        var tok = _trim(splits[i]);
        if (tok == '.') {
            curMode = 'className';
        }
        else if (tok == '#') {
            curMode = 'id';
        }
        else if (tok == '*') {
            curMode = 'num';
        }
        else if (tok == ':') {
            curMode = 'operationId';
        }
        else {
            if (this[curMode] instanceof Array) {
                this[curMode].push(tok);
            }
            else {
                if (/\{[^}]+\}/.test(tok)) {
                    this.linkName = tok.slice(1, -1);
                }
                else if (tok.charAt(0) == '@') {
                    this.textName = tok.slice(1);

                }
                else {
                    this[curMode] = tok;
                }

            }
        }
    }
    if (this.tagName === '') {
        throw TemplateParseError('missing tagName');
    }
    this.childNodes = [];
}
function _renderNode(evaluators, indexStack, args) {
    var indexCopy=indexStack.concat();
    if (this.linkName) {
        var dom = document.createComment(this.linkName);
    }
    else if (this.textName) {
        dom = document.createTextNode('');
        if (this.textName.charAt(0) == '$') {
            var value = evaluators[this.textName.slice(1)].apply({index:indexCopy,element:dom}, args);
        }
        else {
            value = this.textName;
        }
        dom.nodeValue=value;

    }
    else {
        dom = document.createElement(this.tagName);
        if (this.className.length > 0) {
            var className = this.className.join(' ');
            dom.className = className.replace(/\$([^ ]+)/g, function (m, a) {
                var value = evaluators[a].apply({index:indexCopy,element:dom}, args);
                return value ? value : '';
            });
        }
        if (this.id) {
            if (this.id.charAt(0) == '$') {
                value = evaluators[this.id.slice(1)].apply({index:indexCopy,element:dom}, args);
            }
            dom.id = value;
        }
    }
    return dom;
}
function _addElementGroup(elemGroup, node, domList) {
    if (elemGroup[node.operationId]) {
        elemGroup[node.operationId].add(domList);
    }
    else {
        elemGroup[node.operationId] = new XGroup(domList, node);
    }
}
XNode.prototype.render = function (schema, args) {
    if (this.num) {
        var domList = [];
        if (this.num.charAt(0) == '$') {
            this.num = schema.evaluators[this.num.slice(1)].apply(schema.indexStack.concat(), args);
        }
        schema.indexStack.push(0);
        for (var i = 0; i < +this.num; i++) {
            schema.indexStack[schema.indexStack.length - 1] = i;
            var curDom = _renderNode.call(this, schema.evaluators, schema.indexStack, args);
            domList.push(curDom);
            if (this.childNodes.length > 0) {
                for (var j = 0; j < this.childNodes.length; j++) {
                    _append(curDom, this.childNodes[j].render(schema, args));
                }
            }
        }
        schema.indexStack.pop();
        if (this.operationId) {
            _addElementGroup(schema.elemGroup, this.operationId, domList);
        }
        this.elementList=domList;
        if(this.text='td'){
            debugger;
        }
        return domList;
    }
    else {
        curDom = _renderNode.call(this, schema.evaluators, schema.indexStack, args);
        if (curDom.nodeType == 8) {
            schema.linkMap[curDom.nodeValue].position = curDom;
        }
        if (this.childNodes.length > 0) {
            for (j = 0; j < this.childNodes.length; j++) {
                _append(curDom, this.childNodes[j].render(schema, args));
            }
        }
        if (this.operationId) {
            _addElementGroup(schema.elemGroup, this.operationId, curDom);
        }
        this.element=curDom;
        return curDom;
    }
};
function XGroup(elementList, name) {
    this.name = name;
    this.elementList=[];
    if (elementList instanceof Array) {
        for(var i=0;i<elementList.length;i++){
            this.elementList.push({
                element:elementList[i],
                eventDispatcher:{}
            });
        }
    }
    else if (elementList) {
        this.elementList.push({
            element:elementList,
            eventDispatcher:{}
        });
    }
    this.handlers = {};

}
XGroup.prototype.add = function (elementList) {
    if (!elementList instanceof Array) {
        elementList = [elementList];
    }

    for (var i = 0; i < elementList.length; i++) {
        var el = elementList[i];
        var elementWrapper={
            element:el,
            eventDispatcher:{}
        };
        this.elementList.push(elementWrapper);
        for (var type in this.handlers) {
            if (this.handlers.hasOwnProperty(type)) {
                var handlers=this.handlers[type];
                elementWrapper.eventDispatcher[type]=function(handlers,element){
                    return function(event) {
                        _eventDispatcher(handlers, event,element );
                    }
                }(handlers,elementList[i]);
                _addEventListener(el,type,elementWrapper.eventDispatcher[type]);
            }
        }
    }


}
XGroup.prototype.each = function (callback) {
    for (var i = 0; i < this.elementList.length; i++) {
        if (callback.call(this.elementList, this.elementList[i], i) === false) {
            break;
        }
    }
};
function _addEventListener(el, type, handler, flag) {
    if (el.addEventListener) {
        el.addEventListener(type, handler, !!flag);
    }
    else if (el.attachEvent) {
        el.attachEvent('on' + type, handler);
    }
}

function _removeEventListener(el, type, handler) {
    if (el.removeEventListener) {
        el.removeEventListener(type, handler);
    }
    else if (el.detachEvent) {
        el.detachEvent('on' + type, handler);
    }
}
function _eventDispatcher(handlers,event,node){
    //todo fix evnet
    for(var i=0;i<handlers.length;i++){
        handlers[i].call(node,event);
    }
}
XGroup.prototype.on = function (type, handler,flag) {
    (this.handlers[type] || (this.handlers[type] = [])).push(handler);
    var handlers=this.handlers[type];
    this.each(function (wrap) {
        if(!wrap.eventDispatcher[type]){
            wrap.eventDispatcher[type]=function(event){
                _eventDispatcher(handlers, event,wrap.element );
            }
            _addEventListener(wrap.element, type, wrap.eventDispatcher[type],flag);
        }

    })
};
XGroup.prototype.css = function (name, value) {
    if (typeof name == 'object') {
        for (var k in name) {
            if (name.hasOwnProperty(k)) {
                this.each(function (e) {
                    e.style[k] = name[k];
                });
            }
        }
    }
    else {
        this.each(function (e) {
            e.style[name] = value;
        });
    }
}

function XView(template) {
    this.schema = new XSchema(template);

}
var DateResolver=function(){
    var _resolvers=[];
    return {
        resolve:function(context,date,classList){
            for(var i=0;i<_resolvers.length;i++){
                _resolvers[i].call(context,date,classList);
            }
        },
        register:function(resolver){
            _resolvers.push(resolver);
        }
    }
}();
var container = new XSchema('div.x-calendar>(div.x-calendar-top-panel>{top-panel})+div.month-panel+div.year-panel+div.x-calendar-table-ctn>{table}');
var table = new XSchema('table>(thead>tr>th*7>@$week)+tbody>tr*6>td:selected.$dayClass*7>@$day');//创建日历表格
table.bindEvaluators('day', function (year, month, config) {
    var idx = this.index[0] * 7 + this.index[1];
    var firstDate = new Date(year, month, 1);
    var firstDay = firstDate.getDay();
    if (firstDay == 0) {
        firstDay = 7;
    }
    var dist = (firstDay + 7 - config.firstDay) % 7;
    var curDate = new Date(year, month, idx - dist + 1);

    return curDate.getDate();

});//绑定日历表格每个td内容的求值函数
table.bindEvaluators('dayClass',function(year,month,config){
    var idx = this.index[0] * 7 + this.index[1];
    var firstDate = new Date(year, month, 1);
    var firstDay = firstDate.getDay();
    if (firstDay == 0) {
        firstDay = 7;
    }
    var dist = (firstDay + 7 - config.firstDay) % 7;
    var curDate = new Date(year, month, idx - dist + 1);
    this.element.setAttribute('data-time',curDate.getTime());
    var classList=[];
    if(idx<dist){
        classList.push('x-day-out-focus');
    }
    else{
        classList.push('x-day-in-focus');
    }
    DateResolver.resolve(this,curDate,classList);
    return classList.join(' ');
});
table.bindEvaluators('week',function(year,month,config){
  return config.weekdaysShort[(this.index[0]+config.firstDay-1)%7];
});
table.elemGroup.selected.on('mouseenter', function () {
    this.style.color='blue';
    this.style.transition='0.6s';
});
table.elemGroup.selected.on('mouseleave', function () {
    this.style.color='#000';
});
container.linkIn('table', table);//把表格挂接到container的{table}锚点
var config=new Configuration({firstDay: 2});
document.body.appendChild(container.render());//渲染container
var dom = table.render(2014, 11, config);//渲染2014年 11月的日历

table.elemGroup.selected.on('mouseleave', function () {
    var el=this;
    setTimeout(function(){el.style.color='red';},500)
});

function Configuration(config) {
    for (var key in _defaultConfig) {
        if (_defaultConfig.hasOwnProperty(key)) {
            this[key] = _defaultConfig[key];
        }
    }
    for (key in config) {
        if (config.hasOwnProperty(key)) {
            this[key] = config[key];
        }
    }
    if (this.min instanceof Date) {
        this.minDateStr = DateUtil.format(this.min, this.format);
    }
    else {
        this.minDateStr = this.min;
        this.min = DateUtil.parse(this.min, this.format);

    }
    if (this.max instanceof Date) {
        this.maxDateStr = DateUtil.format(this.max, this.format);
    }
    else {
        this.maxDateStr = this.max;
        this.max = DateUtil.parse(this.max, this.format);
    }
}
function XCalendar(config) {
    this.config = new Configuration(config);

}

/**/
