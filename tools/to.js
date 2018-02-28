(function () {

    function type(v) {
        return Object.prototype.toString.apply(v).slice(8,-1)
    }

    function extend(t,o) {
        for(var n in o){
            t[n]=o[n]
        }
    }

    function inArray(v,arr) {
        for (var i=0;i<arr.length;i++){
            if(v == arr[i]){
                return true
            }
        }
        return false
    }

    function each(v,f) {
        var t = type(v)
        if (t==='Array'||t==='NodeList'||t==='Arguments') {
            for (var i=0;i<v.length;i++) {
                f(i,v[i])
            }
        }
        else if(t==='Object'){
            for (var k in v) {
                f(k,v[k])
            }
        }
        else if(t==='Number'){
            for (var i=0;i<v;i++) {
                f(i,v)
            }
        }
    }

    // Class To
    function To(p) {
        this.value = p
    }

    // common
    extend(To.prototype,{
        type:function () {
            return type(this.value)
        },
        extendBy:function (o) {
            extend(this.value,o)
            return this
        },
        inArray:function (arr) {
            return inArray(this.value,arr)
        },
        each:function (f) {
            each(this.value,f)
            return this
        }
    })

    // event
    function addEvent(el,t,cb) {
        el.addEventListener(t,cb)
    }
    function delEvent(el,t,cb) {
        el.removeEventListener(t,cb)
    }
    function onceEvent(el,t,cb) {
        function tmp() {
            delEvent(el,t,tmp)
            cb()
        }
        addEvent(el,t,tmp)
    }
    extend(To.prototype,{
        addEvent:function (t,cb) {
            addEvent(this.value,t,cb)
            return this
        },
        delEvent:function (t,cb) {
            delEvent(this.value,t,cb)
            return this
        },
        onceEvent:function (t,cb) {
            onceEvent(this.value,t,cb)
            return this
        },
        click:function (cb) {
            addEvent(this.value,'click',cb)
            return this
        }
    })

    // value(set|get)
    extend(To.prototype,{
        val:function (val) {
            var thisType = type(this.value)
            if(thisType === 'Array'){
                if(val||val==='') {
                    var valType = type(val)
                    if (valType === 'Array'){
                        each(this.value,function (k,v) {
                            v[type(v)==='HTMLInputElement'?'value':'innerHTML'] = val[k]
                        })
                    }
                    else{
                        each(this.value,function (k,v) {
                            v[type(v)==='HTMLInputElement'?'value':'innerHTML'] = val
                        })
                    }
                }
                else {
                    var tmp = []
                    each(this.value,function (k,v) {
                        tmp.push(type(v)==='HTMLInputElement'?v.value:v.innerHTML)
                    })
                    return tmp
                }
            }
            else{
                var isInput = thisType === 'HTMLInputElement'
                if(val||val===''){
                    this.value[isInput?'value':'innerHTML'] = val
                }
                else {
                    return isInput?this.value.value:this.value.innerHTML
                }
            }
            return this
        }
    })

    // property(set|get)
    extend(To.prototype,{
        attr:function () {
            var arg = arguments
            var arr = type(this.value)==='Array'?this.value:[this.value]
            if(arg.length===1){
                if(type(arg[0])==='String'){
                    if(arr.length===1){
                        return arr[0].getAttribute(arg[0])
                    }
                    else{
                        var tmp=[]
                        each(arr,function (k,v) {
                            tmp.push(v.getAttribute(arg[0]))
                        })
                        return tmp
                    }
                }
                else if(type(arg[0])==='Object'){
                    each(arr,function (k,v) {
                        each(arg[0],function (k1,v1) {
                            v.setAttribute(k1,v1)
                        })
                    })
                    return this
                }
            }
            else if(arg.length===2){
                each(arr,function (k,v) {
                    v.setAttribute(arg[0],arg[1])
                })
                return this
            }
        }
    })

    // style(set|get)
    function toIntArray(arr) {
        var array = []
        each(arr,function (k,v) {
            array.push = parseInt(v)
        })
        return array
    }
    function css2int(o,t,v) {
        if(type(v)=== 'Number'){
            return o.css(t,v+'px')
        }
        else{
            var tmp = o.css(t)
            return type(tmp)==='String'?parseInt(tmp):toIntArray(tmp)
        }
    }
    extend(To.prototype,{
        css:function () {
            var arg = arguments
            var arr = type(this.value)==='Array'?this.value:[this.value]
            if(arg.length===1){
                if(type(arg[0])==='String'){
                    if(arr.length===1){
                        return window.getComputedStyle(arr[0]).getPropertyValue(arg[0])
                    }
                    else{
                        var tmp = []
                        each(arr,function (k,v) {
                            tmp.push(window.getComputedStyle(v).getPropertyValue(arg[0]))
                        })
                        return tmp
                    }
                }
                else if(type(arg[0])==='Object'){
                    each(arr,function (k,v) {
                        each(arg[0],function (k1,v1) {
                            v.style[k1] = v1
                        })
                    })
                    return this
                }
            }
            else if(arg.length===2){
                each(arr,function (k,v) {
                    v.style[arg[0]] = arg[1]
                })
                return this
            }
        },
        W:function (v) {
            return css2int(this,'width',v)
        },
        H:function (v) {
            return css2int(this,'height',v)
        },
        L:function (v) {
            return css2int(this,'left',v)
        },
        T:function (v) {
            return css2int(this,'top',v)
        },
        R:function (v) {
            return css2int(this,'right',v)
        },
        B:function (v) {
            return css2int(this,'bottom',v)
        },
        fontSize:function (v) {
            return css2int(this,'font-size',v)
        },
        hide:function () {
            this.display = this.css('display')
            return this.css('display','none')
        },
        show:function () {
            return this.css('display',this.display?this.display:'block')
        }
    })

    // element(insert|render)
    function insert(el,d,m) {
        var mode = m?m:'beforeEnd'
        var arr = type(d) === 'Array'?d:[d]
        each(arr,function (k,v) {
            if(type(v) === 'String'){
                el.insertAdjacentHTML(mode, v)
            }
            else{
                el.insertAdjacentElement(mode, v)
            }
        })
    }
    function render(el,d,add) {
        if(!add){
            el.innerHTML = ''
        }
        var t = type(d)
        if(t === 'Array'){
            each(d,function (k,v) {
                var t = type(v)
                if(t === 'Object'){
                    if(v.childs){
                        render(v.el,v.childs)
                    }
                    insert(el,v.el)
                }
                else{
                    insert(el,v)
                }
            })
        }
        else if(t === 'Object'){
            if(d.childs){
                render(d.el,d.childs)
            }
            insert(el,d.el)
        }
        else{
            insert(el,d)
        }
    }
    extend(To.prototype,{
        insert:function (d,m) {
            insert(this.value,d,m)
            return this
        },
        render:function (d,add) {
            render(this.value,d,add)
            return this
        }
    })

    // Function _To
    function _To(p) {
        return new To(p)
    }

    function create(name,id,classList,value,attrs,event) {
        var el = document.createElement(name)
        if(id){
            el.id = id
        }
        if(classList){
            var classT = type(classList)
            if(classT === 'String'){
                el.className = classList
            }
            else if(classT === 'Array'){
                each(classList,function (k,v) {
                    el.classList.add(v)
                })
            }
        }
        if(value){
            if(type(el)==='HTMLInputElement')
                el.value = value
            else
                el.innerHTML = value
        }
        if(attrs){
            each(attrs,function (k,v) {
                el.setAttribute(k,v)
            })
        }
        if(event){
            addEvent(el,event.type,event.handle)
        }
        return el
    }
    extend(_To,{
        version: '1.0.0',
        prototype:To.prototype,//可扩展
        log: function (s) {
            console.log(s)
        },
        start:function (cb) {
            onceEvent(document,'DOMContentLoaded',cb)
        },
        //element create
        el: function (name) {
            return create(name)
        },
        elId: function (name,id) {
            var el = create(name)
            return create(name,id)
        },
        elClass: function (name,classes) {
            return create(name,false,classes)
        },
        elVal:function (name,value) {
            return create(name,false,false,value)
        },
        elAttr:function (name,attrs) {
            return create(name,false,false,false,attrs)
        },
        elEvent:function (name,event) {
            return create(name,false,false,false,false,event)
        },
        elIdClass: function (name,id,classes) {
            return create(name,id,classes)
        },
        elIdVal:function (name,id,value) {
            return create(name,id,false,value)
        },
        elIdAttr:function (name,id,attrs) {
            return create(name,id,false,false,attrs)
        },
        elIdEvent:function (name,id,event) {
            return create(name,id,false,false,false,event)
        },
        elClassVal:function (name,classes,value) {
            return create(name,false,classes,value)
        },
        elClassAttr:function (name,classes,attrs) {
            return create(name,false,classes,false,attrs)
        },
        elClassEvent:function (name,classes,event) {
            return create(name,false,classes,false,false,event)
        },
        elValAttr:function (name,value,attrs) {
            return create(name,false,false,value,attrs)
        },
        elValEvent:function (name,value,event) {
            return create(name,false,false,value,false,event)
        },
        elAttrEvent:function (name,attrs,event) {
            return create(name,false,false,false,attrs,event)
        },
        elIdClassVal:function (name,id,classes,value) {
            return create(name,id,classes,value)
        },
        elIdClassAttr:function (name,id,classes,attrs) {
            return create(name,id,classes,false,attrs)
        },
        elIdClassEvent:function (name,id,classes,event) {
            return create(name,id,classes,false,false,event)
        },
        elIdValAttr:function (name,id,value,attrs) {
            return create(name,id,false,value,attrs)
        },
        elIdValEvent:function (name,id,value,event) {
            return create(name,id,false,value,false,event)
        },
        elIdAttrEvent:function (name,id,attrs,event) {
            return create(name,id,false,false,attrs,event)
        },
        elClassValAttr:function (name,classes,value,attrs) {
            return create(name,false,classes,value,attrs)
        },
        elClassValEvent:function (name,classes,value,event) {
            return create(name,false,classes,value,false,event)
        },
        elClassAttrEvent:function (name,classes,attrs,event) {
            return create(name,false,classes,false,attrs,event)
        },
        elValAttrEvent:function (name,value,attrs,event) {
            return create(name,false,false,value,attrs,event)
        },
        elIdClassValAttr:function (name,id,classes,value,attrs) {
            return create(name,id,classes,value,attrs)
        },
        elIdClassValEvent:function (name,id,classes,value,event) {
            return create(name,id,classes,value,false,event)
        },
        elIdClassAttrEvent:function (name,id,classes,attrs,event) {
            return create(name,id,classes,false,attrs,event)
        },
        elIdValAttrEvent:function (name,id,value,attrs,event) {
            return create(name,id,false,value,attrs,event)
        },
        elClassValAttrEvent:function (name,classes,value,attrs,event) {
            return create(name,false,classes,value,attrs,event)
        },
        create:create
    })

    // support commonjs
    if (typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = _To
    }
    else{
        window.To = _To
    }

})()