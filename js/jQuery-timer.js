/*
*
*create by zhouzuchuan (.com)
*https://github.com/zhouzuchuan/timer
*兼容性 ： IE6+/FF/Chrome... 
*版本 ： v1.0 【2015.04.16】
*                
*
*/

;(function ($) {

  if ($.fn.timer) return ;

  $.fn.timer = function (options) {
    var configs = {
      ele : $(this)
    };
    options = $.extend({} , configs , options || {});
    $.timer(options,configs);
  };

  $.timer = function (options , configs) {

    var external = $.extend({} , tDefault , options || {});

    var internal = $.extend({} , configs , {
      appointTime : '' ,       /*设置时间*/
      localTime : '' ,         /*当前本地时间*/
      differTime : '' ,        /*当前时间与设置时间的时间差（单位毫秒）*/
      timeStr : '' ,           /*储存当然时间*/
      timeArr : [] ,           /*储存当前时间和上一个时间（用于比较）*/
      switchAnimate : false ,  /*切换是否开启动画*/
      flag : true , 
      timer : '' ,              /*定时器*/
      endFlag : 0 ,             /*储存结束时个数*/
      domHeight : ''
    });

    var fun = {
      _init : function () {

        var oYear = '' , oMonth = '' , oDay = '' , oHours = '' , oMinutes = '' , oSeconds = '' , timer ; 
        internal.localTime = new Date();
        internal.appointTime = new Date(Date.parse(external.time));
        internal.differTime = internal.appointTime.getTime() - internal.localTime.getTime() ;
        timer = internal.differTime / 1000;
        oSeconds = changeDouble(Math.round(timer % 60)) ;
        timer = Math.floor(timer / 60);
        oMinutes = changeDouble(Math.round(timer % 60)) ;
        timer = Math.floor(timer / 60);
        oHours = changeDouble(Math.round(timer % 24)) ;
        timer = Math.floor(timer / 24) ;
        oDay = changeDouble(Math.round(timer)); 
        internal.timeStr = '' + oYear + oMonth + oDay + oHours + oMinutes + oSeconds ;

        if (internal.flag) {
          for (var i = 0 ; i < internal.timeStr.length ; i ++) {
            internal.timeArr[i] = {
              prevTime : internal.timeStr.charAt(i)
            }
            internal.ele.find('img').eq(i).css({
              'position' : 'absolute' ,
              'left' : 0 ,
              'top' : internal.timeArr[i].prevTime * -internal.domHeight 
            });
          }          
        }

        if (internal.switchAnimate) {
          internal.flag = false;   
        }

      } , 
      _animateTime : function () {
 
        internal.endFlag = 0 ;

        for (var i = 0 ; i < internal.timeStr.length ; i ++) {
          internal.timeArr[i].nowTime = internal.timeStr.charAt(i);
        }

        if (internal.switchAnimate) {
          for (var i = 0 ; i < internal.timeStr.length ; i ++) {
            if (internal.timeArr[i].prevTime == 0) internal.ele.find('img').eq(i).css('top',-10*internal.domHeight);
            if (internal.timeArr[i].prevTime != internal.timeArr[i].nowTime) {
              internal.ele.find('img').eq(i).animate({
                'top' : internal.timeArr[i].nowTime * -internal.domHeight
              } , external.animated.slideTime , external.animated.easing );
              internal.timeArr[i].prevTime = internal.timeArr[i].nowTime;
            }
          } 
        }

        for (var i = 0 ; i < internal.timeStr.length ; i ++) {
          if (internal.timeArr[i].nowTime == 0) {
            internal.endFlag ++ ;
          }
        }

        if (internal.endFlag >= internal.timeStr.length) {
          clearInterval(internal.timer);
          setTimeout(function () {
            external.after();
          } ,(external.animated.slideTime + 100));
          return false;
        }
      }
    };

    // 判断开启动画切换
    if (is_true(external.animated.type)) {
      internal.switchAnimate = true ;
    } 

    if (is_string(external.className)) {
      $('.' + external.className).css({'position' : 'relative'});
      internal.domHeight = internal.ele.find('.' + external.className).outerHeight();
    } else {
      internal.ele.find('img').parent().css({'position' : 'relative'});
      internal.domHeight = internal.ele.find('img').parent().outerHeight();
    }

    fun._init();

    // 重新载入判断定时器是否开启
    if (internal.differTime <= 0) {
      clearInterval(internal.timer);
      return false;
    } 

    internal.timer = setInterval(function () {
      fun._init();
      fun._animateTime();
    } , 1000 );

  };

  var tDefault = {
    time : '2015/04/16 13:58:50' ,             /*指定时间*/
    animated : {
      type : true ,
      slideTime : 200 ,                        /*时间切换时间*/
      easing : 'swing'
    } ,
    className : '' ,
    after : $.noop
  };



  // 改双数
  function changeDouble (a) {
    if (a < 10 && a >= 0) {
      return '0' + a ;
    } else if(a < 0) {
      return '00' ;
    } else {
      return a ;
    }
  }

  // 辅助方法
  function is_null(a) {
    return (a === null);
  }
  function is_undefined(a) {
    return (is_null(a) || typeof a == 'undefined' || a === '' || a === 'undefined');
  }
  function is_array(a) {
    return (a instanceof Array);
  }
  function is_jquery(a) {
    return (a instanceof jQuery);
  }
  function is_object(a) {
    return ((a instanceof Object || typeof a == 'object') && !is_null(a) && !is_jquery(a) && !is_array(a) && !is_function(a));
  }
  function is_number(a) {
    return ((a instanceof Number || typeof a == 'number') && !isNaN(a));
  }
  function is_string(a) {
    return ((a instanceof String || typeof a == 'string') && !is_undefined(a) && !is_true(a) && !is_false(a));
  }
  function is_function(a) {
    return (a instanceof Function || typeof a == 'function');
  }
  function is_boolean(a) {
    return (a instanceof Boolean || typeof a == 'boolean' || is_true(a) || is_false(a));
  }
  function is_true(a) {
    return (a === true || a === 'true');
  }
  function is_false(a) {
    return (a === false || a === 'false');
  }
  function is_percentage(x) {
    return (is_string(x) && x.slice(-1) == '%');
  }
}) (jQuery);