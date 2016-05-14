/**
 * 
 * @authors specialCoder (sdkjd_dk2013@sina.com)
 * @date    2016-04-30 09:24:58
 * @version $1.1.0$
  */
var EventUtil = {
        getStyle:function(obj,attr){
            if(typeof obj.currentStyle != "undefined"){
                return obj.currentStyle[attr];
            }else{
                return getComputedStyle(obj,false)[attr];
            }
        },
        //attr:obj.clientWidth/scrollWidth/scrollLeft/clientHeight/scrollHeight/scrollTop
        getCompat:function(attr){
            if (document.compatMode == "BackCompat") {
                return document.body[attr];
            }else if(document.compatMode == "CSS1Compat"){ 
                return document.documentElement[attr];
            }
        },
        addHandler:function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler, false);//标准浏览器
                //true表示在捕获阶段处理事件，false表示在冒泡阶段处理事件
            }else if(element.attachEvent){
                element.attachEvent("on"+type, handler);//IE浏览器

            }else{
                element["on"+type]=null; //DOM0级事件 指定事件处理程序或设为空
            }
        },
        //调用示例：
        /*var handler=function(){
        *                           alert("hello");
        *                        }
        *EventUtil.addHandler(btn,"click",handler);
        */
        removeHandler:function(element,type,handler){
            if(element.removeEvenetListener){
                element.removeEventListener(type,handler,false);
            }else if(element.detachEvent){
                element.detachEvent(type,handler);
            }else{
                element["on"+type]=null;
            }
        },
        getEvent:function(event){
            return event ? event : window.event;//兼容处理浏览器获取事件的前提条件
        },
        getTarget:function(event){
            return event.target ? event.target : event.srcElement;
        },
        preventDefault:function(event){
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue=false;
            }
        },
        stopPropagation:function(){
            if(event.propagation){
                event.propagation();
            }else{
                event.cancelBubble=true;
            }
        },
    //调用示例：
    /*btn.onclick=function(event){
        event=EventUtil.getEvent(event);
        var target=EventUtil.getTarget(event);
    }
    */
   //检测是否支持DoM2级事件
   //document.implementation.hasFeature("HTMLEvents","2.0");
   //事件类型一览表：
   /*用户界面事件：UIEvent 3.0; HTMLEVents 2.0:load unload resize scroll
     鼠标事件：MOuseEvents 2.0(dbclick mouseEnter mouseLeave除外) /3.0全部鼠标事件：click mousemove mousedown mouseup     mouseout mouseover contextmenu(鼠标右击)
     滚轮事件：mousewheel(wheelDetail) 不详 :clientX clientY pageX pageY screenX screenY
     Firefox:DOMMouseScroll(detail) 
     键盘事件：keydown keypress keyup
     焦点事件：FocusEvent DoM3.0:focusout blur DOMFocusOut focusin focus DOMFocusIn
     文本事件：textInput DOM3:属性data (用户输入的字符而非字符编码)
     复合事件：IE9+唯一支持
     变动事件：MutationEvents DOM2.0  DOMNodeInserted(appendChild() replaceChild() insertChild()) DOMNodeRemoved（removeChild() replaceChild）
     模拟(鼠标)事件:创建event=createEvent("MouseEvents") 初始化event.initMouseEvent() 触发:ele.dispatchEvent()
     等等
    1.页面坐标位置：
     var div=docuement.getElementBy("div");
     EventUtil.addHandler(div,"click",function(event){
        var event=EventUtil.getEvent(event);
        var pageX=event.pageX;
        var pageY=event.pageY;
        if(pageX===undefined){
            pageX=event.clientX+(document.body.scrollLeft || document.documentElement.scrollLeft);
        }
        if(pageY===undefined){
            pageY=event.clientY+(document.body.scrollTop || document.documentElement.scrollTop);
        }

        
     });
     内存和性能：
    （1）事件委托：利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有时间.
            对“事件处理程序过多”问题的解决方案就是事件委托
            一般的，最好的办法就是在页面卸载之前，先通过onunload事件移除所有的事件处理程序。我们可以想象成：
        只要是通过onload事件添加的东西，都要通过将onunload事件处理程序它门移除
     var list=document.getElementById("myLinks");
     EventUntil.addHandler(list,"click",function(event){
        event=EventUntil.getEvent(event);
        var target=EventUntil.getTarget（event);
        switch(target.id){
            case 1:
                    document.title="";
                    break;
            case 2:
                    document.title="";
                    break;
            ...
        }
     })
  
   */
   getRelateTarget:function(event){
      if(event.getRelateTarget){
        return event.getRelateTarget;
      }else if(event.toElement){
        return event.toElement;
      }else if(event.fromElement){
        return event.fromElement;
      }else{
        return null;
      }
   },
   /*
   *鼠标事件：0表示主鼠标按键，1表示中间的鼠标按钮，2表示次鼠标按钮
    */
   getButton:function(event){
        if(document.implementation.hasFeature("MouseEvents","2.0")){
            return event.button;
        }else{
            switch(event.button){//return:跳出函数；break:跳出switch循环，继续执行函数下面的代码
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                        return 0;
                        break;
                case 2:
                case 6:
                        return 2;
                        break;
                case 4:
                        return 1;
                        break;
            }
        }
   },
   /*调用示例：
    var div=document.getelementById("div");
    EventUtil.addHandler(div,"mousedown",function(event){
        event=EventUtil.getEvent(Event);//首先获取event
        alert(EventUtil.getButton(event));//调用相关函数
    }){
    
    }
   */
   getWheelDelta:function(event){
        if(event.wheelDelta){
             //除火狐浏览器外，其他浏览器支持mousewheel事件,有关鼠标滚轮信息保存在wheelDelta属性中
             //opera浏览器版本问题：9.5以前与之后WheelDelta数值关系为-1
            return (client.engine.opera&&client.engine.opera<9.5 ? -wheelDelta : wheelDelta);
        }else{
            //Firefox支持一个DOMMouseScroll事件，有关鼠标滚轮信息保存在detail属性中：向前是-3的倍数，向后是3的倍数
            return -event.detail*40;//-120表示滚轮向下滚动，120表示滚轮向上滚动
        }
   },
   getCharCode:function(event){
    //大部分都支持charCode属性，这个属性只有在keyPress的时候才会包含值，这个值是按下的那个键所代表字符的ASCLL编码
        if(typeof event.charCode == "number"){
            return event.charCode;
        }else{
            //opera和IE8之前的版本的event支持keyCode
            return event.keyCode;
        }
        /*取的字符编码之后可以使用string.fromCharCode()将其转化为实际的字符*/
   },
   /*   表单脚本
   表单基础知识：
    action:接受请求的URL
    elements:表单中所有控件的集合
    length:表单中控件数量
    method:要发送的HTTP请求类型，通常是post/get
    name:  表单的名称
    reset():将所有表单域重置为默认值
    submit():提交表单
    target:用于发送请求和接收响应的窗口的名称
    enctype:请求的编码类型
    acceptCharset:服务器能够处理的字符集

    表单事件：提交表单submit()
    重置表单reset()
    表单字段document.forms[].elements[数字/控件名字]
    //避免多次提交表单
    EventUntil.addHandler(form,"submit",function(event){
        event=EventUntil.getEvent(event);
        var target=EventUntil.getTarget(event);//获取目标表单
        var btn=target.elements["submit-btn"];//在目标表单下查找提交按钮
        btn.disabled=true;//禁用它
    })
    共有的表单字段方法：(input.)focus()/blur()
    EventUntil.addHandler(window,"load",function(event){
     var element=document.forms[0].elements[0];
     if(element.autofocus!==true){//首先检测是否设置了autofocus属性
        element.focus();//然后调用focus
     }
    })
    选择文本：select()选择文本框中所有的文本(适用<input type="text">、<textarea>)
    var textbox=document.forms[0].elements["textbox1"];
    //textbox.select()
    EventUntil.addHandler(textbox,"select",function(event){
    var alert("Text selected"+textbox.value);
    })



   */
  //操作剪切板
  //clipboardData对象有三个方法：gatData() setData() clearData()
   getClipboardText:function(event){
        var clipboardData=(document.clipboardData||window.clipboardData);//IE中是window对象
        return clipboardData.getData("text");//基本上都可以用getData()
   },
   setClipboardText:function(event,value){
        if(event.clipboardData){
            return event.clipboardData.setData("text/plain",value);//safari Chrome
        }else if(window.clipboardData){
            return window.clipboardData.setData("text",value);//IE做法
        }
   },
   //安全的类型检测
   //函数：Function 数组：Array 正则表达式:RegExp
   getInstance:function(value){//return:跳出函数；break:跳出switch循环，继续执行函数下面的代码
    var result=null;
    var instance=Object.prototype.toString.call(value);
            switch(instance){
                case '[object Array]':
                    result = "Array";
                    break;
                case '[object Function]':
                    result = "Function";
                    break;
                case '[object RegExp]':
                    result = "RegExp";
                    break;
            }
        return result;
    },
    //函数绑定，类似于原生的bind()
    bind:function(fn,context){//返回闭包
        return function(){
            return fn.apply(context,arguments);//arguments指函数内部的而非bind的
        }();
    },
    //用setTimeout模仿setInterval
   setInterval:function(fn,interval){
        setTimeout(function(){
        //doSomething
        fn();
        setTimeout(arguments.callee, interval);
     }, interval);
    }
    };   
