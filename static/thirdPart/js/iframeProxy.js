/**!
 * iframe嵌套跨域 高度自适应
 * @author: tommyshao <jinhong.shao@frontpay.cn>
 * @copyright www.frontpay.cn
 * @date:   2015-06-18
 * @update: 2015-09-24
 */
~(function(root, d, undefined){
  // 配置proxyUrl地址
  // if(!root['proxyUrl']) return;
  var proxyUrl = root['proxyUrl'], proxyIframe;
  var parent = root.top;
  var isFrame = root != parent;

  function getStyle( elem, attr ) {
    var oStyle = elem.currentStyle? elem.currentStyle : window.getComputedStyle(elem, null);
    return oStyle[attr];
  }


  function setIframeHeight(height){
    // 不被iframe嵌套时不操作
    if(!isFrame) return;
    var oBody = d.body;
    // var docHeight = oBody.scrollHeight;
    var docHeight = 0;
    var oContainer = oBody.children[0];
    var i = 0, len = 0;
    var childrens = oContainer.children;
    //docHeight = oContainer ? oContainer.offsetHeight : docHeight;
    for(len = childrens.length; i < len; i++) {
      docHeight += childrens[i].offsetHeight;
      docHeight += parseInt(getStyle(childrens[i], 'marginTop'));
      //console.log(getStyle(childrens[i], 'marginTop'));
    }

    // docHeight = h;
    //alert(oContainer.offsetHeight)
    alert(docHeight);

    if(!proxyIframe){
      var container = d.createElement("div");
      container.innerHTML = '<iframe style="display:none;" src="'+ proxyUrl +'#height='+ docHeight +'" scrolling="no" height="0" width="0"></iframe>';
      proxyIframe = container.firstChild;
      oBody.appendChild(proxyIframe);
    } else {
      height = height || docHeight;
      proxyIframe.src = proxyUrl+'#height='+height;
    }
  }

  // 隐藏滚动条
  function setStyle(){
    var cssText = 'html,body{ overflow: hidden; height: 100%}';
    var oHead = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet) {
      try{
        style.styleSheet.cssText = cssText;
      }catch(e){}
    } else{
      var textNode = document.createTextNode(cssText);
      style.appendChild(textNode);
    }

    oHead.appendChild(style);
  }


  var loaded = function(element, fn){
    if(element.attachEvent){ // ie
      element.attachEvent("onreadystatechange", fn);
    }else if(element.addEventListener){
      element.addEventListener('DOMContentLoaded', fn, false)
    } else {
      window.onload = fn;
    }
  };

  if(isFrame && root['proxyUrl']){
    setStyle();
    loaded(window, function(){
      setIframeHeight();
    })
  }

  root.setIframeHeight = setIframeHeight;

})(window, document);
