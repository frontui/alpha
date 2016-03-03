/**!
 * 页面共同部分
 * by frontpay F2E Team
 * created on 2015-08-25
 */

function is360se() {
  var ret = false,
      ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("chrome") > -1) {
    ret = (ua.indexOf("qqbrowser") > -1 || ua.indexOf(" se ") > -1 || ua.indexOf("360ee") == -1) ? false : true
  }
  try {
    if (window.external && window.external.twGetRunPath) {
      var r = external.twGetRunPath();
      if (r && (r.toLowerCase().indexOf("360se") > -1 )) {
        ret = true;
      }
    }
  } catch (ign) {
    ret = false;
  }
  return ret;
}

function isLBBrowser() {
  var ua = navigator.userAgent;
  return ua.indexOf('LBBROWSER') > -1;
}


~(function(root, $) {

    // 判断IE版本
    var isIE = function(ver){
      var b = document.createElement('b');
      b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
      return b.getElementsByTagName('i').length === 1;
    };

    var FrontUI = {
        pwdLock: function(option) {
          var defaults = {
            title: '您的账户由于支付密码连续错误，已锁定！',
            content: '不可进行提现、交易及安全设置操作，账户将于明日解锁，如有其他疑问，请拨打：',
            tel: '400-106-6698',
            link: '/',
            linkText: '返回账户总览',
            callback: $.noop
          };

          var config = $.extend(defaults, option);

          var template = '<h3 class="fn-mb-10">'+ config.title +'</h3>'+
                          '<p class="fn-mb-5">'+ config.content +'</p>'+
                          '<p><b class="warning-FontColor fs-18">'+ config.tel +'</b></p>'+
                          '<div class="text-align-center fn-mt-30">'+
                          '  <button class="btn primary" data-dismiss="modal">确认</button>'+
                          '  <a href="'+ config.link +'" class="btn links">'+ config.linkText +'</a>'+
                          '</div>';

          $('#modal_pwdLock').modal({ title: '提示', content: template, callback: function() {
            $(this).on('hide.ui.modal', config.callback);
          }})

        }
    };

    var commApi = function() {
      // 设置第三方iframe高度
      typeof setIframeHeight == "function" && setIframeHeight();
    };

    var App = {
        // 页面初始化
        initPage: function(){
            for(var i in App) {
                i != 'initPage' && typeof App[i] === 'function' && App[i]();
            }
        },
        // 提现金额展开隐藏
        amountRemind: function(){
            $("#sh").on('click', function(){
                var isOpen = $(this).data('isOpen'), strText = $(this).text(), strLabel = $(this).data('label'), target = $(this).data('target');
                if(isIE(7)) { // i7 bug
                  $("#arb")[isOpen ? 'hide': 'show']();
                  $(target).slider('init');
                  // 共同接口
                  commApi();
                } else {
                  $("#arb")[isOpen ? 'slideUp': 'slideDown'](function(){
                    //console.log(target);
                    if($(this).is(':visible')) {
                      $(target).slider('init');
                    }
                    // 共同接口
                    commApi();
                  });
                }
                $(this).html(strLabel).data('label', strText).data('isOpen', !isOpen);



            });
        },
        moreBanks:function(){
            var $ul=$(".j-banks-more"),
                $li=$ul.find("li"),
                $btn=$ul.find(".more-ebank"),
                iLen=$li.length,
                e = $.Event('bankMore:action'),
                Toggle={
                    isHidden:!0,
                    init:function(){
                        this[this.isHidden?"show":"hide"]();

                        $ul.trigger(e)
                    },
                    show:function(){
                        this.isHidden=!1,
                            $li.show(),
                            $btn.html("收起").hide()
                    },
                    hide:function(){
                        this.isHidden=!0,
                            $li.slice(8,iLen-1).hide(),
                            $btn.html("查看更多")
                    }
                };
            Toggle.hide(),
            $btn.on("click",$.proxy(Toggle.init,Toggle))
        },
        // 搜索框
        searchInput: function(){
          var handler = {
            // 延迟隐藏
            timer: null,
            // 自动隐藏，如果input是focus状态则不自动隐藏
            autoHide: true,
            // 按钮是否点击，点击保持不隐藏，等input再次blur隐藏
            clicked: false,
            // 显示 obj-按钮, ip 是否input触发
            show: function(obj, ip){
              if(!obj) return;
              clearTimeout(this.timer);
              // 设置自动隐藏状态
              this.autoHide = ip ? true : false;
              $(obj).removeClass('hidden');
            },
            // 隐藏 obj-按钮, ip 是否input触发
            hide: function(obj, ip) {
              if(!obj) return;
              var that = this;
              clearTimeout(this.timer);
              this.timer = setTimeout(function(){
                $(obj).addClass('hidden');
                // 设置自动隐藏状态
                that.autoHide = true;
              }, 500)
            }
            //},
            //bindEvent: function(obj) {
            //  var that = this;
            //  // 按钮鼠标移入移开
            //  $(obj).off('mouseenter mouseleave').on('mouseenter mouseleave', function(e) {
            //    if(e.type == 'mouseenter') {
            //      handler.show(obj, 1);
            //    } else {
            //      if(!that.clicked && that.autoHide) { // 未点击，自动隐藏
            //        handler.hide(obj, 1);
            //      }
            //    }
            //  });
            //  // 按钮点击
            //  $(obj).off('click').on('click', function(){
            //    that.clicked = true;
            //    that.show($(this), 1)
            //  });
            //}
          };
          $('[data-toggle="searchInput"]').on('focus blur', function(e){
            var obj = $(this).next('button');
            //if(e.type == 'focus') {
            //  handler.show(obj, 0);
            //} else {
            //  if($.trim($(this).val()) == '' && $(this).val().length == 0) {
            //    handler.hide(obj, 0);
            //  }
            //}
            // input触发显示隐藏
            handler[e.type == 'focus' ? 'show' : 'hide'](obj, 0);
            // 按钮鼠标滑过、移开、点击事件
            //handler.bindEvent(obj)
          });
        },
      // 密码输入框禁止复制黏贴
      pwdLimit: function() {
      	//var tips;
        $('input[type="password"]').on('copy paste cut', function(e) { e.preventDefault(); return false; })
        							.on('keyup', function(e) {  // 不能输入空格
        								if(e.keyCode == 32) {
        									$(this).val($.trim($(this).val()));
        									//!tips && $.notify({message: '<i class="icon-info"></i> 密码不能包括空格！', timeout: 1000, onClose: function(){ tips = false }});
        									//tips = !0;
        									e.preventDefault();
        								}
        							})

      },
      // 扩展 tab
      extTab: function() {
        $('.tabs-btn').on('shown.ui.tab', function(e) {
          var $current = $(this),
              $prev = $(e.relatedTarget),
              panel = $current.attr('data-panel'),
              prevPanel = $prev.attr('data-panel');
          var $panel = $(panel),
              $prevPanel = $(prevPanel);

          if(panel !== prevPanel) {
            !!$panel.length && $panel.show();
            !!$prevPanel.length && $prevPanel.hide();
          }
        });
      }
    };

    $(document).ready(App.initPage);

    root.FrontUI = FrontUI;
})(window, jQuery);
