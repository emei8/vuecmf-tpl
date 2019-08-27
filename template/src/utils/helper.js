//合并对象
export function mergeObj(obj1,obj2){
    if(obj1 == null) return obj2
    if(obj2 == null) return obj1
    obj2.forEach((item) => {
        obj1.push(item)
    })
    return obj1
}

//整型转换IP
export function int2ip(number) {
    let ip = "";
    if(number <= 0) {
        return ip;
    }
    let ip3 = (number << 0 ) >>> 24;
    let ip2 = (number << 8 ) >>> 24;
    let ip1 = (number << 16) >>> 24;
    let ip0 = (number << 24) >>> 24

    ip += ip3 + "." + ip2 + "." + ip1 + "." + ip0;

    return ip;
}


/**
 * 时间戳格式化函数
 * @param  {string} format    格式
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间
 * @return {string}           格式化的时间字符串
 */
export function date(format, timestamp){
    let jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
    let pad = function(n, c){
        if((n = n + "").length < c){
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    let txtWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let txtOrdin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
    let txtMonths = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let f = {
        // Day
        d: function(){return pad(f.j(), 2)},
        D: function(){return f.l().substr(0,3)},
        j: function(){return jsdate.getDate()},
        l: function(){return txtWeekdays[f.w()]},
        N: function(){return f.w() + 1},
        S: function(){return txtOrdin[f.j()] ? txtOrdin[f.j()] : 'th'},
        w: function(){return jsdate.getDay()},
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},

        // Week
        W: function(){
            let a = f.z(), b = 364 + f.L() - a;
            let nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                return 1;
            } else{
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime()/1000));
                } else{
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month
        F: function(){return txtMonths[f.n()]},
        m: function(){return pad(f.n(), 2)},
        M: function(){return f.F().substr(0,3)},
        n: function(){return jsdate.getMonth() + 1},
        t: function(){
            let n;
            if( (n = jsdate.getMonth() + 1) === 2 ){
                return 28 + f.L();
            } else{
                if( (n & 1 && n < 8) || (!(n & 1) && n > 7) ){
                    return 31;
                } else{
                    return 30;
                }
            }
        },

        // Year
        L: function(){let y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
        //o not supported yet
        Y: function(){return jsdate.getFullYear()},
        y: function(){return (jsdate.getFullYear() + "").slice(2)},

        // Time
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},
        A: function(){return f.a().toUpperCase()},
        B: function(){
            // peter paul koch:
            let off = (jsdate.getTimezoneOffset() + 60)*60;
            let theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            let beat = Math.floor(theSeconds/86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length === 1) beat = "00"+beat;
            if ((String(beat)).length === 2) beat = "0"+beat;
            return beat;
        },
        g: function(){return jsdate.getHours() % 12 || 12},
        G: function(){return jsdate.getHours()},
        h: function(){return pad(f.g(), 2)},
        H: function(){return pad(jsdate.getHours(), 2)},
        i: function(){return pad(jsdate.getMinutes(), 2)},
        s: function(){return pad(jsdate.getSeconds(), 2)},
        //u not supported yet

        // Timezone
        //e not supported yet
        //I not supported yet
        O: function(){
            let t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
            return t;
        },
        P: function(){let O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},
        //T not supported yet
        //Z not supported yet

        // Full Date/Time
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},
        //r not supported yet
        U: function(){return Math.round(jsdate.getTime()/1000)}
    };

    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
        let ret = '';
        if(t !== s){
            // escaped
             ret = s;
        } else if( f[s] ){
            // a date function exists
             ret = f[s]();
        } else{
            // nothing special
             ret = s;
        }
        return ret;
    });
}

/**
 * 获取按钮显示权限
 * @param btnOperate
 * @param permissionList
 */
export function getBtnAuth(btnOperate,permissionList) {
    for(let index in permissionList){
        if(btnOperate === permissionList[index] || btnOperate === index){
            return true
        }
    }
    return false
}
