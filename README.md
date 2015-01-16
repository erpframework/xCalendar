#xCalendar
=========

即将废弃
基本用法

``javascript

new XCalendar(element,config);//这样就初始化了一个日历控件 你只需要config写好就行
//element为绑定日历控件的input标签
//config为配置参数
//包含如下配置项

{
  width:'245',//宽度
  min:'2012-06-29',//最小日期
  max:'2015-12-20',//最大日期
  disable:function(date,dateStr){//传入一个判断函数判断某一天是否被禁用 这个函数会在渲染一个月的每一天都调用 return true则表示这一天是不可选状态 date为Date对象 dateStr是日期字符串
       return false;
  },
  fullscreen:true,//手机下使用这个模式
  onSelect:function(date){//选择某一项后执行的回调 date为Date对象
  },
  onClose:function(date){//日历关闭后执行的回调
  },
  defaultDate:new Date(),//默认打开时的日期
  firstDay:0,//日历布局 从左到右是从周几开始排的 0表示周日开始 1表示周一开始 以此类推
  format:'yyyy-mm-dd'//日期字符串的格式

}
