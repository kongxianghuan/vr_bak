import WXshare from 'sohu_public/components/WXshare/1.0.0'
import $ from 'sohu_public/vendor/zepto'

var WX_CONFIG = {
    titleShare : document.title,
    urlShare: location.href,
    picShare: 'https://img.gd.sohu.com/norefer/changan/20180216/0.jpg',
    txtShare: '抢VR红包，得新年好彩头'
}

function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) == 'micromessenger'
}

class Share {
    constructor() {
        WXshare(WX_CONFIG)
        var shareType = isWeixin() ? 'wx' : 'app' 
        $('.dialog__share').addClass(shareType)
    }
}

var share = new Share()

export default share


