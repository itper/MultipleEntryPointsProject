export function htmlDecode(str){
    var ary1=['&amp;','&lt;','&gt;','&nbsp;','&#39;','&quot;'];
    var ary2=['&','<','>',' ','\'','\"'];
    for(var i=0;i<ary1.length;i++){
        var reg=new RegExp(''+ary1[i]+'','gm');
        str = str.replace(reg,ary2[i]);
    }
    return str;
}

export function isArray(obj){
    if(typeof obj==='object'&&obj.constructor===Array){
        return true;
    }
    return false;
}