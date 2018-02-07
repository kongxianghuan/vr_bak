import WXshare from 'sohu_public/components/WXshare/1.0.0'
import $ from 'sohu_public/vendor/zepto'

const WX_CONFIG = {
    titleShare : document.title,
    urlShare: location.href,
    picShare: 'http://img.gd.sohu.com/norefer/changan/20180216/0.jpg',
    txtShare: ''
}

function isWeixin() {
    let ua = window.navigator.userAgent.toLowerCase()
    return ua.match(/MicroMessenger/i) == 'micromessenger'
}

class Share {
    constructor() {
        WXshare(WX_CONFIG)
        const shareType = isWeixin() ? 'wx' : 'app' 
        $('.dialog__share')
            .addClass(shareType)
            .on('click', e => $('.dialog__drawtip--mcard').removeClass('active'))
    }
}

const share = new Share()

export default share


