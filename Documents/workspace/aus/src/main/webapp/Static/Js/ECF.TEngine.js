
/*!
 * Javascript Template Parse Engine v0.0.1-beta
 *
 * Includes ECF.js
 *
 * Copyright 2011, 2014 , shaipe
 *
 * Date: 2014-07-16T21:02Z
*/

/*!
 * Javascript Template Parse Engine v0.0.1-beta
 *
 * Includes ECF.js
 *
 * Copyright 2011, 2014 , shaipe
 *
 * Date: 2014-07-16T21:02Z
*/

eval(function (p, a, c, k, e, d) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) d[e(c)] = k[c] || e(c); k = [function (e) { return d[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('(6($e,2C){4 1r=3=$e.1r=$e.3=6(){4 M=[].2B.1B(1a);M.1d(3.5);8(M[0].13(/^\\s*#([\\w:\\-\\.]+)\\s*$/l)){M[0].c(/^\\s*#([\\w:\\-\\.]+)\\s*$/l,6($,$1V){4 1T=39;4 1s=1T&&1T.3u($1V);M[0]=1s?(1s.P||1s.3g):$})}8(1a.L==1){7 3.1I.20(3,M)}8(1a.L>=2){7 3.2i.20(3,M)}};4 1m=X.1m={2n:{\'<\':\'&3l;\',\'>\':\'&3r;\',\'&\':\'&3h;\',\'"\':\'&3w;\',"\'":\'&#33;\',\'/\':\'&#38;\'},2y:6(k){7 X.1m.2n[k]},23:6(1l){7 x(1l)!==\'3o\'?1l:1l.c(/[&<>"]/l,b.2y)},1A:6(Q){7 x(Q)==\'T\'?\'\':Q}};4 18=6(1h){8(x(R)!="T"){8(R.2x){R.2x(1h);7}8(R.1G){R.1G(1h);7}}2z(1h)};4 19=6(o,1k){o=o!==1y(o)?{}:o;8(o.2v){o.2v=1k;7 o}4 1F=6(){};4 n=1y.2u?1y.2u(1k):m(1F.1E=1k,1F);K(4 i 1b o){8(o.Z(i)){n[i]=o[i]}}7 n};3.1c={};3.3n="0.0.1-3m";3.2r=H;3.f={};3.h={G:\'{@\',I:\'}\',2q:\'\\\\${\',2p:\'}\',2o:\'\\\\$\\\\${\',2m:\'}\',2l:\'\\\\{#\',2k:\'\\\\}\'};3.5={2b:10,1t:10,2s:10,1A:10,d:19({1R:1m,18:18,2j:3},{})};3.1L=6(){4 12=3.h.G+\'1w\\\\s*([^}]*?)\\\\s*3k\\\\s*(\\\\w*?)\\\\s*(,\\\\s*\\\\w*?)?\'+3.h.I;4 1g=3.h.G+\'\\\\/1w\'+3.h.I;4 14=3.h.G+\'8\\\\s*([^}]*?)\'+3.h.I;4 1i=3.h.G+\'\\\\/8\'+3.h.I;4 1j=3.h.G+\'1u\'+3.h.I;4 15=3.h.G+\'1u 8\\\\s*([^}]*?)\'+3.h.I;4 16=3.h.2q+\'([\\\\s\\\\S]+?)\'+3.h.2p;4 1n=3.h.2o+\'([\\\\s\\\\S]+?)\'+3.h.2m;4 1o=3.h.2l+\'[^}]*?\'+3.h.2k;4 1q=3.h.G+\'1w\\\\s*(\\\\w*?)\\\\s*1b\\\\s*3c\\\\(([^}]+?)\\\\s*,\\\\s*([^}]+?)\\\\)\'+3.h.I;4 V=3.h.G+\'V\\\\s*([^}]*?)\\\\s*,\\\\s*([^}]*?)\'+3.h.I;3.f.12=m y(12,\'l\');3.f.1g=m y(1g,\'l\');3.f.14=m y(14,\'l\');3.f.1i=m y(1i,\'l\');3.f.1j=m y(1j,\'l\');3.f.15=m y(15,\'l\');3.f.16=m y(16,\'l\');3.f.1n=m y(1n,\'l\');3.f.1o=m y(1o,\'l\');3.f.1q=m y(1q,\'l\');3.f.V=m y(V,\'l\')};3.1L();3.1f=6(D,P){4 E=b;4 2e=6(v){7 v.c(/[\\$\\(\\)\\[\\]\\+\\^\\{\\}\\?\\*\\|\\.]/l,6($){7\'\\\\\'+$})};4 1f=6(D,P){4 1p=D.13(/^1p::(.*)$/i);8(1p){E.h[1p[1]]=2e(P);E.1L();7}E.5[D]=P};8(1a.L===2){1f(D,P);7}8(D===1y(D)){K(4 i 1b D){8(D.Z(i)){1f(i,D[i])}}}};3.2Z=6(Y,29){4 d=b.5.d;8(d.Z(Y)){7 H}7 d[Y]=29};3.2X=6(Y){4 d=b.5.d;8(d.Z(Y)){7 25 d[Y]}};3.28=6(5){4 E=b;b.5=5;b.1Q=6(p,24,5){4 11=p.B("|"),1S=11[0]||"",1z;8(11.L>1){p=11.1P();1z=11.1P().B(",");1S="d."+1z.1P()+".1B({},"+[p].2T(1z)+")"}7\'<%= \'+(24?\'d.1R.23\':\'\')+\'(\'+(!5||5.1A!==H?\'d.1R.1A\':\'\')+\'(\'+1S+\')\'+\')\'+\' %>\'};b.1X=6(a,5){4 1N=0;a=a.c(3.f.12,6($,p,1e,U){4 1e=1e||\'P\',U=U&&U.2L(1);4 z=\'i\'+1N++;7\'<% ~6() {\'+\'K(4 \'+z+\' 1b \'+p+\') {\'+\'8(\'+p+\'.Z(\'+z+\')) {\'+\'4 \'+1e+\'=\'+p+\'[\'+z+\'];\'+(U?(\'4 \'+U+\'=\'+z+\';\'):\'\')+\' %>\'}).c(3.f.1g,\'<% }}}(); %>\').c(3.f.14,6($,1x){7\'<% 8(\'+1x+\') { %>\'}).c(3.f.1i,\'<% } %>\').c(3.f.1j,6($){7\'<% } 1u { %>\'}).c(3.f.15,6($,1x){7\'<% } 1u 8(\'+1x+\') { %>\'}).c(3.f.1n,6($,p){7 E.1Q(p,H,5)}).c(3.f.16,6($,p){7 E.1Q(p,10,5)}).c(3.f.1o,\'\').c(3.f.1q,6($,p,2c,2d){4 z=\'j\'+1N++;7\'<% ~6() {\'+\'K(4 \'+z+\'=\'+2c+\';\'+z+\'<\'+2d+\';\'+z+\'++) {{\'+\'4 \'+p+\'=\'+z+\';\'+\' %>\'}).c(3.f.V,6($,a,Q){7\'<%= d.2j(\'+a+\', \'+Q+\'); %>\'});8(3.2r){R.1G(a)}8(!5||5.2s!==H){a=\'<% 1O { %>\'+a;a+=\'<% } 1K(e) {d.18("3 3i 2g: "+e.2h);} %>\'}7 a};b.1Y=6(a,5){7 b.2f(a,!5||5.1t)};b.1W=6(a){4 q=[];4 W=[];4 1v=\'\';4 1U=[\'8\',\'1w\',\'N\',\'d\',\'R\',\'3f\',\'3e\',\'1K\',\'3d\',\'3b\',\'3a\',\'25\',\'37\',\'36\',\'K\',\'6\',\'1b\',\'34\',\'m\',\'7\',\'32\',\'b\',\'2z\',\'1O\',\'x\',\'4\',\'30\',\'2Y\',\'2W\',\'2V\',\'x\',\'2U\',\'2S\',\'3x\',\'2Q\',\'2P\',\'2O\',\'2N\',\'2M\',\'2K\',\'2J\',\'2I\',\'2H\',\'2G\',\'2F\',\'2E\',\'2D\',\'1a\',\'10\',\'H\',\'T\',\'2A\'];4 J=6(17,1J){8(2t.1E.J&&17.J===2t.1E.J){7 17.J(1J)}K(4 i=0;i<17.L;i++){8(17[i]===1J)7 i}7-1};4 O=6($,u){u=u.13(/\\w+/l)[0];8(J(q,u)===-1&&J(1U,u)===-1&&J(W,u)===-1){8(x(X)!==\'T\'&&x(X[u])===\'6\'&&X[u].27().13(/^\\s*?6 \\w+\\(\\) \\{\\s*?\\[26 22\\]\\s*?\\}\\s*?$/i)){7 $}8(x(1C)!==\'T\'&&x(1C[u])===\'6\'&&1C[u].27().13(/^\\s*?6 \\w+\\(\\) \\{\\s*?\\[26 22\\]\\s*?\\}\\s*?$/i)){7 $}8(x(3.5.d[u])===\'6\'||3.5.d.Z(u)){W.1d(u);7 $}q.1d(u)}7 $};a.c(3.f.12,O).c(3.f.16,O).c(3.f.14,O).c(3.f.15,O).c(3.f.V,O).c(/[\\+\\-\\*\\/%!\\?\\|\\^&~<>=,\\(\\)\\[\\]]\\s*([A-3q-3p]+[0-9]+)/l,O);K(4 i=0;i<q.L;i++){1v+=\'4 \'+q[i]+\'=N.\'+q[i]+\';\'}K(4 i=0;i<W.L;i++){1v+=\'4 \'+W[i]+\'=d.\'+W[i]+\';\'}7\'<% \'+1v+\' %>\'};b.2f=6(a,1t){4 q=[].F(\'\');q+="\'3t 3s\';";q+="4 N=N||{};";q+="4 C=\'\';C+=\'";8(1t!==H){q+=a.c(/\\\\/g,"\\\\\\\\").c(/[\\r\\t\\n]/g," ").c(/\'(?=[^%]*%>)/g,"\\t").B("\'").F("\\\\\'").B("\\t").F("\'").c(/<%=(.+?)%>/g,"\';C+=$1;C+=\'").B("<%").F("\';").B("%>").F("C+=\'")+"\';7 C;";7 q}q+=a.c(/\\\\/g,"\\\\\\\\").c(/[\\r]/g,"\\\\r").c(/[\\t]/g,"\\\\t").c(/[\\n]/g,"\\\\n").c(/\'(?=[^%]*%>)/g,"\\t").B("\'").F("\\\\\'").B("\\t").F("\'").c(/<%=(.+?)%>/g,"\';C+=$1;C+=\'").B("<%").F("\';").B("%>").F("C+=\'")+"\';7 C.c(/[\\\\r\\\\n]\\\\s+[\\\\r\\\\n]/g, \'\\\\r\\\\n\');";7 q};b.2a=6(a,5){4 1Z=b;8(!5||5.31!==H){a=b.1W(a)+a}a=b.1X(a,5);a=b.1Y(a,5);b.21=m 3j(\'N, d\',a);b.1H=6(N,d){8(!d||d!==E.5.d){d=19(d,E.5.d)}7 1Z.21.1B(b,N,d)};7 b}};3.1I=6(a,5){8(!5||5!==b.5){5=19(5,b.5)}1O{4 1M=b.1c[a]?b.1c[a]:m b.28(b.5).2a(a,5);8(!5||5.2b!==H){b.1c[a]=1M}7 1M}1K(e){18(\'1r 35 2g: \'+e.2h);7{1H:6(){}}}};3.2i=6(a,Q,5){8(!5||5!==b.5){5=19(5,b.5)}7 b.1I(a,5).1H(Q,5.d)};x(1D)!==\'T\'&&1D.2w?1D.2w=3:b.3=3;$e.3v.1d("1r")})(2R,X);', 62, 220, '|||jte|var|options|function|return|if||tpl|this|replace|_method||settings||tags||||igm|new|||_name|buffer||||statement|||typeof|RegExp|_iterate||split|_out|conf|that|join|operationOpen|false|operationClose|indexOf|for|length|args|_|variableAnalyze|value|data|console||undefined|key|include|method|window|fname|hasOwnProperty|true|_define|forstart|match|ifstart|elseifstart|interpolate|array|_throw|_creator|arguments|in|_cache|push|alias|set|forend|error|ifend|elsestart|proto|str|_escapeHtml|noneencode|inlinecomment|tag|rangestart|jsTEngine|elem|strip|else|prefix|each|condition|Object|_cluster|detection|call|global|module|prototype|empty|log|render|compile|item|catch|tagInit|engine|_counter|try|shift|_interpolate|_escapehtml|_fn|_document|reserved|id|_lexicalAnalyze|_removeShell|_toNative|_that|apply|_render|code|escaping|_escape|delete|native|toString|template|fn|parse|cache|start|end|escapePattern|_convert|Exception|message|toHtml|_jte|commentClose|commentOpen|noneencodeClose|escapehash|noneencodeOpen|interpolateClose|interpolateOpen|debug|errorhandling|Array|create|_proto_|exports|warn|escapereplace|throw|NaN|slice|win|const|yield|static|public|protected|private|package|let|substr|interface|implements|super|import|extends|ECF|enum|concat|class|null|with|unRegister|while|register|void|loose|switch|x27|instanceof|Compile|finally|do|x2f|document|default|debugger|range|continue|case|break|innerHTML|amp|Render|Function|as|lt|Beta|version|string|z_|Za|gt|strict|use|getElementById|plugin|quot|export'.split('|'), 0, {}))




// 格式化数据
function formatFloat(o, len) {
    o = parseFloat(o);
    if (isNaN(o)) {
        o = 0.00;
    }

    if (len == undefined) {
        len = 2;
    }

    return formatNumber(o, len);

    function formatNumber(num, exponent) {
        if (exponent < 1) return num;
        var str = num.toString();
        if (str.indexOf(".") != -1) {
            if (str.split(".")[1].length == exponent) {
                return str;
            }
            else if (str.split(".")[1].length > exponent) {
                return str.split(".")[0] + '.' + str.split(".")[1].substr(0, len);
            }
            else {
                return formatNumber(str + "0", exponent);
            }
        }
        else {
            return formatNumber(str + ".0", exponent);
        }
    };
};

// 从日期时间中取出日期
function formatDate(d) {
    var myDate = new Date(Date.parse(d.replace(/-/g, "/")));
    if (isNaN(myDate)) {
        var arys = d.split('-');
        myDate = new Date(arys[0], arys[1], arys[2]);
    }
    return myDate.toLocaleDateString();
}

// 处理缩略图地址
function thumbImage(src, w, h) {
    if (src) {
        if (src.length == 0) return "";
        if (arguments.length < 2) {
            return src;
        }
        if (arguments.length == 2) {
            h = w;
        }
        var ext = src.substr(src.lastIndexOf("."));
        return src + "_" + w + "X" + h + ext;
    }
    return "";
};

function imgDomain(src) {
    if (window.imageDomain) {
        return window.imageDomain + src;
    }
    return src;
}

function formatTime(t) {
    var date = t.split(" ")[0].split("/");
    return date[0].substr(2, 3) + "年" + (date[1].length == 1 ? "0" : "") + date[1] + "月" + date[2] + "日";
}

function waterMark(src) {
    if (src) {
        if (src.length == 0) return "";
        var ext = src.substr(src.lastIndexOf("."));
        return src + "_Mark" + ext;
    }
    return "";
}

function plus(orl, val) {
    if (orl) {
        if (!val) val = 1;
        return parseInt(orl) + val;
    }
    return orl;
}

// 格式化数组中的值
function formatArray(val, dic){
    if(dic){
        return dic[val];
    }
    return val;
}

// 将Json对象转换为字符串
function jsonToString(json) {
    if (typeof (JSON.stringify) == "function") {
        return JSON.stringify(json);
    }
}

jte.register("formatDate", formatDate);
jte.register("formatFloat", formatFloat);
jte.register("thumbImage", thumbImage);
jte.register("imgDomain", imgDomain);
jte.register("formatTime", formatTime);
jte.register("waterMark", waterMark);
jte.register("plus", plus);
jte.register("formatArray",formatArray);
jte.register("toString", jsonToString);