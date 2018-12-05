<template>
  <div class="Activity1">
    <div class="ring">
      <!-- 圆盘 -->
      <div class="round" ref="turntable">
          <ul class="cvs_imgs">
              <li v-for="(item, index) in gifts" :key="index" :style="{ transform: 'rotate('+ index*60 +'deg)'}">
                    <p>{{item.txt1}}</p>
                    <span>{{item.txt2}}</span>
              </li>
          </ul>
      </div>
      <!-- 按钮 -->
      <div class="start" @click="clickStart">
        <span>启动</span>
      </div>
    </div>
    <div class="goShare">
      <button @click="goExchange">{{exchange}}</button>
      <button @click="goShare">立即分享</button>
    </div>
    <div class="rule">
      <div>活动规则</div>
      <div>
        <ul>
          <li>1.凡是登录兴证通的客户可参加幸运大转盘活动；</li>
          <li>2.活动时间：11.1-11.11，每日10点准时开始，每日1000万积分，先到先抢，抢完即止；</li>
          <li>3.每个兴证通账户每日只可参加一次转盘抽积分活动；</li>
          <li>4.该活动解释权由兴业证券股份有限公司所有。</li>
        </ul>
      </div>
    </div>

    <!-- 弹出层-中奖 -->
    <transition name="fade">
      <div class="popup-prize" v-show="mask.getPrize">
        <div class="mask"></div>
        <div class="content">
          <h3>提示</h3>
          <div v-if="status == 0">
            <span>恭喜你！<br>抽中{{score}}积分奖品！</span>
          </div>
          <div v-if="status == 1">
            <span>切莫贪心,你已经领过一次了！<br>明日10点不见不散！</span>
          </div>
          <div v-if="status == 2">
            <span>oh宝贝你来晚了,<br>今日1000万积分红包已抢完,<br>明天早点来哦！</span>
          </div>
          <div v-if="status == 3">
            <span>亲爱的用户,<br>双11红包将在每日10点开始,<br>记得准时来抢！</span>
          </div>
          <button @click="mask.getPrize=false">我知道了</button>
          <i @click="mask.getPrize=false"></i>
        </div>
      </div>
    </transition>

    <!-- 弹出层-分享(如果在微信中) -->
    <transition name="fade">
      <div class="popup-weixin" v-show="mask.isWeixin">
        <div class="mask" @click="mask.isWeixin = false"></div>
        <div class="content"></div>
      </div>
    </transition>

    <!-- 弹出层-微信登录(如果在微信中) -->
    <transition name="fade">
      <div class="popup-isLogin" v-show="mask.isLogin">
        <div class="mask" @click="mask.isLogin = false"></div>
        <div class="content">
          <h4>登录</h4>
          <div>
            <img src="../assets/activity1/login_ico_tel.png" alt="">
            <input type="number" placeholder="手机号" v-model="mobile">
          </div>
          <div>
            <img src="../assets/activity1/login_ico_yzm.png" alt="">
            <input type="number" placeholder="验证码" v-model="code">
            <button @click="sendCode" :disabled="codeDisabled" :class="{disabled : codeDisabled}">{{codeStr}}</button>
          </div>
          <div>
            <button @click="login">登 录</button>
          </div>
          <img src="../assets/activity1/login_ico_close.png" alt="" @click="mask.isLogin = false">
        </div>
      </div>
    </transition>

    <!-- 弹出层-未中奖 -->
    <!-- <transition name="fade">
      <div class="popup-no-prize" v-show="mask.noGetPrize">
        <div class="mask"></div>
        <div class="content">
          <h3>哎呀，本次没有抽中～</h3>
          <span>谢谢参与</span>
          <div>
            <button @click="clickStart">再玩一次</button>
            <button @click="mask.noGetPrize=false">确认</button>
          </div>
          <i @click="mask.noGetPrize=false"></i>
        </div>
      </div>
    </transition> -->

    <!-- 弹出层-账户没有绑定资金帐号 -->
    <!-- <transition name="fade">
      <div class="popup-no-point" v-if="mask.account">
        <div class="mask"></div>
        <div class="content">
          <h3>请先绑定资金帐号</h3>
          <div>
            <button @click="toBind">去绑定</button>
          </div>
          <i @click="mask.account=false"></i>
        </div>
      </div>
    </transition> -->

    <!-- 弹出层-不在优理宝中 -->
    <!-- <transition name="fade">
      <div class="popup-no-point" v-if="mask.share">
        <div class="mask"></div>
        <div class="content">
          <h3>本活动仅支持在优理宝</h3>
          <span>APP参与~</span>
          <div>
            <button @click="toDownload">立即下载</button>
          </div>
          <i @click="mask.share=false"></i>
        </div>
      </div>
    </transition> -->
    <!-- 加载 -->
    <Loading v-show="mask.loading"></Loading>
  </div>
</template>

<script>
import Loading from './common/Loading'
// import { clearInterval } from 'timers';
// import { constants } from 'http2';
// import { constants } from 'http2';

export default {
  name: 'Activity1',
  props: ['propData', 'cordova', 'setWeixinShare'],
  data () {
    return {
      gifts: [ // 抽奖礼品
        {txt1: 50, txt2: '积分'},
        {txt1: 100, txt2: '积分'},
        {txt1: 222, txt2: '积分'},
        {txt1: 500, txt2: '积分'},
        {txt1: 1111, txt2: '积分'},
        {txt1: 10000, txt2: '积分'}
      ],
      score: -1, // 抽中积分
      degrees: [0, -60, -120, -180, -240, -300], // 旋转角度
      status: 0, // 0,抽中奖品，1,切莫贪心,你已经领过一次了!明日10点不见不散!，2,oh宝贝你来晚了,今日1000万积分红包已抢完,明天早点来哦，3,亲爱的用户,双11红包将在每日10点开始,记得准时来抢!
      count: 0, // 旋转次数
      shareData: { // 分享
        title: '双11幸运大转盘，狂撒1000万积分！快来参加', // 标题
        desc: '双11幸运大转盘，狂撒1000万积分！快来参加', // 描述
        outUrl: 'https://static.xyzq.cn/activity/lucky-turntable/index.html#/', // 地址（出）
        imgUrl: 'https://static.xyzq.cn/activity/lucky-turntable/static/images/img_share.png' // 图标地址
      },
      exchange: '兑换积分商品', // 兑换积分商品
      mask: { // 弹出框
        getPrize: false, // 中奖
        noGetPrize: false, // 未中奖
        noPoint: false, // 积分不足
        noTimes: false, // 没有抽奖机会了
        account: false, // 账户没有绑定资金帐号
        share: false, // 分享页弹窗
        loading: false,
        isWeixin: false, // 是否在微信
        isLogin: false // 在微信中是否登录
      },
      codeStr: '获取验证码', // 验证码字符串-微信
      mobile: '', // 手机号-微信
      code: '', // 验证码-微信
      codeDisabled: false // 验证码按钮点击是否无效-微信
    }
  },
  components: { // 公共组件
    Loading
  },
  watch: {
    // 'propData.userinfo.xuid': function () {
    //   this.getPrizeTimes() // 抽奖次数
    // },
    'propData.windowOnload': function () {
      if (this.propData.isWeixin) {
        this.setWeixinShare(this.shareData)
      }
    }
  },
  mounted () {
    if (this.propData.inUlb) {
      this.exchange = '兑换积分商品'
      console.info('在优理宝中')
    } else {
      this.exchange = '去兑换'
      // 如果在微信中，本地存储是否含有xuid
      if (localStorage.getItem('xuid')) {
        console.info(localStorage.getItem('xuid'))
        this.mask.isLogin = false
      } else {
        console.info('微信中没有xuid')
        this.mask.isLogin = true
      }
    }
    // if (this.propData.isWeixin) {
    //   this.exchange = '去兑换'
    //   // 如果在微信中，本地存储是否含有xuid
    //   if (localStorage.getItem('xuid')) {
    //     console.info(localStorage.getItem('xuid'))
    //     this.mask.isLogin = false
    //   } else {
    //     console.info('微信中没有xuid')
    //     this.mask.isLogin = true
    //   }
    // } else {
    //   this.exchange = '兑换积分商品'
    //   console.info('不在微信')
    // }
  },
  methods: {
    /**
     * 点击开始
     */
    clickStart () {
      // 优理宝APP_1积分转盘_主页_启动 埋点
      // window.TDAPP.onEvent('ylbapp_1point-turn_main_action', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      // 不在优理宝 且 不在微信中
      // if (!this.propData.inUlb && !this.propData.isWeixin) {
      //   // this.mask.share = true
      //   return
      // }
      // 在微信中
      // if (this.propData.isWeixin && !localStorage.getItem('xuid')) {
      //   this.mask.isLogin = true
      //   return
      // }
      // 如果不在优理宝中且没有xuid
      if (!this.propData.inUlb && !localStorage.getItem('xuid')) {
        this.mask.isLogin = true
        return
      }
      // 未加载完成
      if (!this.propData.userinfo.loadingCompleted) return
      // 在优理宝中且未登录
      if (this.propData.inUlb && !this.propData.userinfo.isLogin) {
        // 重新登陆
        this.cordova({
          reloginflag: '1',
          accounttype: '1'
        })
        return
      }
      var that = this
      this.mask.loading = true
      var xuid = ''
      if (this.propData.inUlb) { // 优理宝中
        xuid = this.propData.userinfo.xuid
      } else { // 非优理宝中
        xuid = localStorage.getItem('xuid')
      }
      // if (this.propData.isWeixin) { // 微信取xuid
      //   xuid = localStorage.getItem('xuid')
      // } else { // 优理宝取xuid
      //   xuid = this.propData.userinfo.xuid
      // }
      console.info(xuid)
      this.$ajax({
        url: '/lottery',
        params: {
          account: xuid
        }
      }).then((res) => {
        that.count++
        let giftsIndex = -1 // 抽中积分需要旋转的角度-下标（默认）
        console.info(res.data)
        // 1000 未知错误
        // 1001 参数错误
        // 1002 获取验证码失败
        // 1003 验证码校验失败
        // 1004 注册失败
        // 1005 切莫贪心,你已经领过一次了!明日10点不见不散!
        // 1006 oh宝贝你来晚了,今日1000万积分红包已抢完,明天早点来哦
        // 1007 积分发放失败
        // 1008 亲爱的用户,双11红包将在每日10点开始,记得准时来抢!
        if (res.data.resphead.respcode === '0000') { // 抽奖成功
          if (res.data.respbody !== null) {
            that.score = res.data.respbody.score // 抽中积分
            switch (that.score) {
              case 50:
                giftsIndex = 0
                break
              case 100:
                giftsIndex = 1
                break
              case 222:
                giftsIndex = 2
                break
              case 500:
                giftsIndex = 3
                break
              case 1111:
                giftsIndex = 4
                break
              case 10000:
                giftsIndex = 5
                break
            }
            that.$refs.turntable.style.transform = 'rotate(' + (3 * that.count * 360 + that.degrees[giftsIndex]) + 'deg)'
            setTimeout(() => {
              that.status = 0
              that.mask.getPrize = true
            }, 3000)
          }
        } else if (res.data.resphead.respcode === '1005') { // 切莫贪心,你已经领过一次了!明日10点不见不散!
          that.status = 1
          that.mask.getPrize = true
          console.info(res.data.resphead.respdetails)
        } else if (res.data.resphead.respcode === '1006') { // oh宝贝你来晚了,今日1000万积分红包已抢完,明天早点来哦
          that.status = 2
          that.mask.getPrize = true
          console.info(res.data.resphead.respdetails)
        } else if (res.data.resphead.respcode === '1008') { // 亲爱的用户,双11红包将在每日10点开始,记得准时来抢!
          that.status = 3
          that.mask.getPrize = true
          console.info(res.data.resphead.respdetails)
        } else {
          // alert('服务器繁忙，请稍后重试')
          alert(JSON.stringify(res.data))
        }
        console.info(that.score)
        this.mask.loading = false
        // console.info(that.degrees[giftsIndex])
      }).catch((err) => {
        console.info(err)
        this.mask.loading = false
        alert('服务器繁忙，请稍后重试')
      })
    },
    /**
     * 发送验证码-微信
     */
    sendCode () {
      console.info('发送')
      var params = new FormData()
      params.append('mobile', this.mobile)
      this.$ajax({
        method: 'post',
        url: '/sendSMS',
        data: params
      }).then((res) => {
        console.info(res.data)
        if (res.data.resphead.respcode === '0000') {
          let num = 60
          let time = setInterval(() => {
            if (num) {
              num--
              this.codeDisabled = true
              this.codeStr = num + 's重新发送'
            } else {
              clearInterval(time)
              this.codeDisabled = false
              this.codeStr = '获取验证码'
            }
          }, 1000)
        } else {
          alert('请输入正确的手机号！')
        }
        // 1000 未知错误
        // 1001 参数错误
        // 1002 获取验证码失败
        // 1003 验证码校验失败
        // 1004 注册失败
      }).catch((err) => {
        console.info(err)
        alert('服务器繁忙，请稍后重试')
      })
    },
    /**
     * 登录-微信
     */
    login: function () {
      var params = new FormData()
      params.append('mobile', this.mobile)
      params.append('code', this.code)
      this.$ajax({
        method: 'post',
        url: '/verifyCode',
        data: params
      }).then((res) => {
        console.info(res.data)
        // 1000 未知错误
        // 1001 参数错误
        // 1002 获取验证码失败
        // 1003 验证码校验失败
        // 1004 注册失败
        if (res.data.resphead.respcode === '0000') {
          console.info('登录成功')
          console.info('非优理宝xuid====>', res.data.respbody)
          // 设置微信xuid
          localStorage.setItem('xuid', res.data.respbody)
          this.mask.isLogin = false
        } else {
          alert('请输入正确的手机号或验证码！')
        }
      }).catch((err) => {
        console.info(err)
        alert('服务器繁忙，请稍后重试')
      })
    },
    /**
     * 兑换积分商品
     */
    goExchange: function () {
      console.info('兑换积分商品')
      if (this.propData.inUlb) {
        navigator.uniaccount.jumpActivity({'linkType': '2', 'link': 'https://estock.xyzq.com.cn/points/'})
      } else {
        window.location.href = 'http://wap.xyzq.com.cn'
      }
      // if (this.propData.isWeixin) {
      //   window.location.href = 'http://wap.xyzq.com.cn'
      // } else {
      //   if (this.propData.inUlb) {
      //     navigator.uniaccount.jumpActivity({'linkType': '2', 'link': 'https://estock.xyzq.com.cn/points/'})
      //   } else {
      //     alert('请在优理宝或者微信中登录')
      //   }
      // }
    },
    /**
     * 分享
     */
    goShare () {
      // 优理宝APP_1积分转盘_主页_分享 埋点
      // window.TDAPP.onEvent('ylbapp_1point-turn_main_share', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      // 优理宝分享
      // navigator.uniaccount.ulbShare(this.shareData.title, this.shareData.imgUrl, this.shareData.desc, this.shareData.outUrl)
      if (this.propData.isWeixin) {
        console.info('weixin')
        this.mask.isWeixin = true
      } else {
        this.mask.isWeixin = false
        if (this.propData.inUlb) {
          console.info('ulb')
          navigator.uniaccount.ulbShare(
            '双11幸运大转盘，狂撒1000万积分！快来参加！',
            'https://static.xyzq.cn/activity/lucky-turntable/static/images/img_share.png',
            '双11幸运大转盘，狂撒1000万积分！快来参加！',
            'https://static.xyzq.cn/activity/lucky-turntable/index.html#/'
          )
        } else {
          console.info('非优理宝非微信中')
        }
      }
    }
    /**
     * 点击 去绑定
     */
    // toBind: function () {
    //   this.mask.account = false
    //   navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://static.xyzq.cn/mhall/main.html#/uniacct/mgr/relateacct/list'})
    // },
    /**
     * 点击 去下载
     */
    // toDownload: function () {
    //   window.location.href = 'http://wap.xyzq.com.cn'
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .Activity1{
    background: url(../assets/activity1/bg.png) no-repeat left top;
    background-size: 100% auto;
    min-height: 17.92rem;
    .ring{
      height: 6.5139rem; // 938
      width: 6.5139rem; // 938
      margin: 0 auto;
      margin-top: 4.2014rem; // 605
      position: relative;
      .round{ // 转盘
        position: absolute;
        height: 6.5139rem; // 938
        width: 6.5139rem; // 938
        background: url(../assets/activity1/turntable.png) no-repeat center center;
        background-size: 100% 100%;
        transform: rotate(0deg);
        transition:all 3s ease 0s;
        overflow: hidden;
        .cvs_imgs{
          height: 6.5139rem; // 938
          width: 6.5139rem; // 938
          li{
            float: left;
            height: 100%;
            width: 1.3889rem; // 200
            position: absolute;
            left: 50%;
            top: 0;
            margin-left: -0.6944rem; // 100
            text-align: center;
            font-family: PingFangSC-Medium;
            p{
              margin-top: 1.1111rem; // 160
              font-size: .5rem; // 72
              line-height: normal;
              letter-spacing: .0139rem; // 2
              color: #eb612a;
            }
            span{
              font-size: .25rem; // 36
              // height: .2361rem; // 34
              letter-spacing: .0069rem; // 1
              color: #eb612a;
            }
          }
          li:nth-of-type(odd){
            p{
              color: #fff;
            }
            span{
              color: #fff;
            }
          }
        }
      }
      .start{ // 开始按钮
        text-align: center;
        height: 2.4306rem; // 350
        width: 2.1528rem; // 310
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1.0764rem; // 155
        margin-top: -1.2153rem; // 175
        color: #eb612a;
        font-family: PingFangSC-Semibold;
        background: url(../assets/activity1/btn_startup.png) no-repeat center center;
        // background-size: 100% 100%;
        background-size: cover;
        >span{
          display: inline-block;
          margin-top: .9028rem; // 130
          font-size: .5417rem; // 78
        }
      }
    }
    .goShare{
      margin-top: 1.5486rem; // 223
      // display: flex;
      // justify-content: space-around;
      // align-items: center;
      >button{
        border: 0 none;
        width: 2.9583rem; // 426
        height: .8056rem; // 116
        font-family: PingFangSC-Medium;
        font-size: .3611rem; // 52
        line-height: .1597rem; // 23
        letter-spacing: .0139rem; // 2
        color: #ffffff;
        margin-left: .4861rem; // 70
      }
      >button:nth-of-type(1){
        background: url(../assets/activity1/btn_purple.png) no-repeat center center;
        background-size: 100% 100%;
      }
      >button:nth-of-type(2){
        background: url(../assets/activity1/btn_red.png) no-repeat center center;
        background-size: 100% 100%;
        color: #fff15f;
      }
    }
    .rule{
      margin-top: .8333rem; // 120
      >div:nth-of-type(1){
        text-align: center;
        width: 2.5694rem; // 370
        height: .6111rem; // 88
        margin: 0 auto;
        background: url(../assets/activity1/title_bg.png) no-repeat center center;
        background-size: 100% 100%;
        font-family: PingFangSC-Semibold;
        font-size: .4722rem; // 68
        font-weight: normal;
        font-stretch: normal;
        line-height: .5208rem; // 75
        letter-spacing: .0139rem; // 2
        color: #f7365b;
      }
      >div:nth-of-type(2){
        margin: 0 auto;
        // margin-left: .5208rem; // 75
        margin-top: .2083rem; // 30
        width: 6.9444rem; // 1000
        font-family: PingFangSC-Regular;
        font-size: .2639rem; // 38
        font-weight: normal;
        font-stretch: normal;
        line-height: .3958rem; // 57
        color: #f7365b;
        opacity: 0.9;
        ul{
          padding: 0 .1rem 0 .2431rem; // 35
        }
      }
    }

    // 弹出层-中奖
    .popup-prize{
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      .mask{
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background: #000;
        background: rgba(0, 0, 0, 0.5 );
      }
      .content{
        position: absolute;
        width: 5.9583rem; // 858
        height: 4.5rem; // 648
        left: 50%;
        top: 50%;
        margin-left: -2.9792rem; // 429
        margin-top: -2.25rem; // 324
        background: url(../assets/activity1/popup_bg.png) no-repeat;
        background-size: cover;
        text-align: center;
        h3{
          padding-top: .5833rem; // 84
          font-family: PingFangSC-Semibold;
          font-size: .4444rem; // 64
          font-weight: normal;
          font-stretch: normal;
          line-height: .5833rem; // 84
          letter-spacing: 0px;
          color: #ffffff;
        }
        >div{
          margin-top: .3rem;
          font-family: PingFangSC-Medium;
          font-size: .3194rem; // 46
          font-weight: normal;
          font-stretch: normal;
          line-height: .5833rem; // 84
          letter-spacing: 0px;
          color: #ffffff;
          opacity: 0.9;
        }
        button{
          position: absolute;
          border: 0 none;
          width: 2.9583rem; // 426
          height: .8056rem; // 116
          left: 50%;
          bottom: .3472rem; // 50
          margin-left: -1.4792rem; // 213
          font-family: PingFangSC-Medium;
          font-size: .3611rem; // 52
          font-weight: normal;
          font-stretch: normal;
          line-height: .1597rem; // 23
          letter-spacing: .0139rem; //2
          color: #fff15f;
          background: url(../assets/activity1/btn_red.png) no-repeat center center;
          background-size: 100% 100%;
        }
        >i{
          position: absolute;
          width: .3542rem; /* 51 */
          height: .3542rem; /* 51 */
          right: .7639rem; // 110
          top: .3819rem; // 55
          background: url(../assets/activity1/popup_ico_close.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    // 弹出层-分享(如果在微信中)
    .popup-weixin{
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      .mask{
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background: #000;
        background: rgba(0, 0, 0, 0.5 );
      }
      .content{
        position: absolute;
        width: 3.2222rem; // 464
        height: 3.3681rem; // 485
        right: .1389rem; // 20
        top: .1389rem;
        background: url(../assets/activity1/point.png) no-repeat;
        background-size: cover;
        text-align: center;
      }
    }

    // 弹出层-微信登录(如果在微信中)
    .popup-isLogin{
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      .mask{
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background: #000;
        background: rgba(0, 0, 0, 0.5 );
      }
      .content{
        position: absolute;
        background: #fff;
        width: 5.4861rem; // 790
        height: 4.7917rem; // 690
        left: 50%;
        top: 50%;
        margin-left: -2.7431rem; // 395
        margin-top: -2.3958rem; // 345
        border-radius: .1667rem; // 24
        h4{
          text-align: center;
          padding-top: .3472rem; // 50
          font-family: PingFangSC-Semibold;
          font-size: .4444rem; // 64
          font-weight: normal;
          font-stretch: normal;
          line-height: .5833rem; // 84
          letter-spacing: 0px;
          color: #333333;
        }
        >div:nth-of-type(1){
          margin: 0 auto;
          margin-top: .3472rem; // 50
          width: 4.8611rem; // 700
          height: .9028rem; // 130
          border-radius: .1111rem; // 16
          border: solid 1px #eeeeee; // 2
          display: flex;
          align-items: center;
          img{
            width: .4444rem; // 64
            height: .4444rem; // 64
            margin: 0 .2778rem 0 .1944rem; // 40 28
          }
          input{
            height: 100%;
            flex: 1;
            font-size: .3333rem; // 48
          }
        }
        >div:nth-of-type(2){
          margin: 0 auto;
          margin-top: .1944rem; // 28
          width: 4.8611rem; // 700
          height: .9028rem; // 130
          border-radius: .1111rem; // 16
          border: solid 1px #eeeeee; // 2
          display: flex;
          // justify-content: space-between;
          align-items: center;
          img{
            width: .4444rem; // 64
            height: .4444rem; // 64
            margin: 0 .2778rem 0 .1944rem; // 40 28
          }
          input{
            width: 2.0833rem; // 300
            height: 100%;
            font-size: .3333rem; // 48
            // flex: 1;
          }
          button{
            // margin-left: .2083rem; // 30
            border: 0 none;
            color: #f7365b;
            font-size: .3056rem; // 44
            font-family: PingFangSC-Regular;
            font-weight: normal;
            font-stretch: normal;
            line-height: .5833rem; // 84
            letter-spacing: 0px;
            background: #fff;
          }
          button.disabled{
            color: #999;
          }
        }
        >div:nth-of-type(3){
          margin-top: .3125rem; // 45
          text-align: center;
          button{
            border: 0 none;
            width: 4.4444rem; // 640
            height: .8056rem; // 116
            font-family: PingFangSC-Medium;
            font-size: .3611rem; // 52
            font-weight: normal;
            font-stretch: normal;
            line-height: .1597rem; // 23
            letter-spacing: .0139rem; // 2
            color: #ffffff;
            background-color: #f7365b;
            border-radius: .4028rem; // 58
            color: #fff;
          }
        }
        >img{
          position: absolute;
          top: .4722rem; // 68
          right: .3125rem; // 45
          width: .25rem; // 36
          height: .25rem;
        }
      }
    }

    // 弹出层-账户没有积分---- 弹出层-没有抽奖次数
    .popup-no-point,.popup-no-num{
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      .mask{
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background: #000;
        background: rgba(0, 0, 0, 0.5 );
      }
      .content{
        position: absolute;
        width: 5.0556rem; // 728
        height: 5rem;
        left: 50%;
        top: 50%;
        margin-left: -2.5278rem; // 364
        margin-top: -2.5rem;
        color: #1263d0;
        // background: url(../assets/activity1/popup_bg.png) no-repeat;
        background-size: cover;
        text-align: center;
        h3{
          padding-top: 2.2917rem; // 330
          font-size: .3194rem; // 46
        }
        span{
          font-size: .3194rem; // 46
        }
        >div{
          margin-top: .5347rem; // 77
          button{
            font-size: .3542rem; // 51
            color: #fff;
            border: 0 none;
            outline: none;
            width: 3.125rem; // 450
            height: .8194rem; // 118
            line-height: .8194rem; // 118
            border-radius: .3819rem; // 55
            // background: url(../assets/activity1/popup_btn_orange_big.png) no-repeat;
            background-size: 100% 100%;
          }
        }
        >i{
          position: absolute;
          width: .6944rem; /* 100 */
          height: .6944rem; /* 100 */
          left: 50%;
          margin-left: -.3472rem; /* 50 */
          bottom: -1.0417rem; // 150
          // background: url(../assets/activity1/popup_ico_close.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    /* vue过渡类 */
    .fade-enter-active, .fade-leave-active {
      transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>
