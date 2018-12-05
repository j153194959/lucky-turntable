(function () {
  // 设置rem
  function resRem() {
    var deviceWidth = document.documentElement.clientWidth
    document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px' // 1080/7.5 = 144
  }
  resRem()
  window.onresize = resRem

  /* 判断手机是安卓还是ios */
  function isAndroid() {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) {
      return true
    }
    return false
  }
  // 是否是安卓600
  function isAndroid600() {
    var u = navigator.userAgent
    var isAndroid600 = u.indexOf('android-ulb-cordova6.0.0') > -1// android600�ն�
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios�ն�
    if (isAndroid600) {
      return true
    }
    return false
  }

  // 判断微信环境
  function isWeixin() {
    var ua = navigator.userAgent.toLowerCase()
    if ((ua.match(/MicroMessenger/i) + '') === 'micromessenger') {
      return true
    } else {
      return false
    }
  }

  /* 引入微信分享文件 */
  function addWechatShare() {
    var head, script1, scriptSrc1
    head = document.getElementsByTagName('head')[0]
    script1 = document.createElement('script')
    scriptSrc1 = './static/lib/jweixin/jweixin-1.2.0.js'
    script1.src = scriptSrc1
    head.appendChild(script1)
  }

  /* 引入cordova */
  function addCordova() {
    var head, script1, scriptSrc1
    if (isAndroid600()) {
      scriptSrc1 = 'https://static.xyzq.cn/common/js/cordova/1.0.15/android/cordova600.js'
    } else if (isAndroid()) {
      scriptSrc1 = 'https://static.xyzq.cn/common/js/cordova/1.0.15/android/cordova.js'
    } else {
      scriptSrc1 = 'https://static.xyzq.cn/common/js/cordova/1.0.15/ios/cordova.js'
    }
    head = document.getElementsByTagName('head')[0]
    script1 = document.createElement('script')
    script1.src = scriptSrc1
    head.appendChild(script1)
  }

  /**
   * 获取url地址参数
   * @param  {[type]} name [地址参数名]
   * @return {[type]}      [description]
   */
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }

  /**
   * 判断优理宝环境
   */
  function isUlb() {
    var params = getQueryString('inUlb')
    if (params) {
      return true
    } else {
      return false
    }
  }

  function loadFile() {
    if (isWeixin()) {
      addWechatShare()
      return
    }
    if (isUlb()) {
      addCordova()
    }
  }
  loadFile()
})()
