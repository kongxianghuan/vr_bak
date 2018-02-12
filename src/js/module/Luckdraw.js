import { proxy, formValid } from 'sohu_public/utils/jtool/1.0.0'
import swal from 'sohu_public/components/Sweetalert'
import $ from 'sohu_public/vendor/zepto'

var API = '//app.gd.sohu.com/minisite/mazda/20180216/do.php'

window.alert = str => swal({ title: str, button: '确认' }) 

export default class Luckdraw {
    constructor() {
        this.drawElemtsIndex = []
        this.drawElemtsSize = 6
        this.drawDataSize = 0
        this.pending = false
        this.bindEvents()
        // this.init()
    }
    init() {
        this.clear()
        this.drawDataSize = this.random(1, 6)
        this.drawElemtsIndex = this.getRandomArrayElements(
            Array.from(new Array(this.drawElemtsSize), (val, index) => index + 1),
            this.drawDataSize
        )
        this.drawData = []
        this.getDrawData()
    }
    clear() {
        $('.dialog__detail').data('type', 'null')
    }
    random(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1))
    }
    getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0)
        var i = arr.length
        var min = i - count
        var temp
        var index
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }
    getDrawData() {
        proxy.pushData({
            url: API,
            method: 'get',
            data: { act: 'get', packet: this.drawDataSize },
            onStart: null,
            callback: rs => {
                if (rs.status == 100) {
                    this.setDrawData(rs.data)
                } else {
                    alert('网络出错！')
                }
            }
        })
    }
    setDrawData(codeArr) {
        codeArr.forEach((v, i) => {
            var code = codeArr[i]
            var index = this.drawElemtsIndex[i]
            var $dialog = $(`#d${index}`)
            $dialog.data('type', 'lm')
            $dialog.find('.lm').data('code', code)
        })
    }
    getDrawList() {
        proxy.pushData({
            url: API,
            method: 'get',
            data: { act: 'list' },
            onStart: null,
            callback: rs => {
                if (rs.status == 100) {
                    if (rs.data.jd.reverse) {
                        var jdList = rs.data.jd.reverse().map((v, i) => {
                            var telMosaic = this.mosaicTel(v)
                            return `<li>${telMosaic}<li>`
                        })
                        $('.dialog__award').find('ul').html(jdList.join('')).scrollTop(0)
                    }
                    var shSum = rs.data.sh || '0'
                    $('#mcard-sum').text(shSum)
                    // if (rs.data.jd.length > 14) {
                    //     $('.dialog__award').find('.tip').addClass('active')       
                    // }
                } else {
                    alert('获取获奖名单失败！')
                }
            }
        })
    }
    checkDrawCode(code) {
        if (!this.pending) {
            this.pending = true
            proxy.pushData({
                url: API,
                method: 'get',
                data: { act: 'checkCode', code: code },
                onStart: null,
                callback: rs => {
                    this.pending = false
                    if (rs.status == 100) {
                        // jd card
                        $('.dialog__drawtip--ecard').addClass('active')
                    } else if (rs.status == 200) {
                        // sohu card
                        $('.dialog__drawtip--mcard').addClass('active')
                        $('#mcardID').text(rs.data)
                    } else {
                        // 没中奖                    
                        var type = this.random(1, 6);
                        $('.dialog__drawtip--null')
                            .addClass('active')
                            .find('.redpacket__blessing')
                            .data('type', type)
                        // $('.dialog__detail').removeClass('active')
                    }
                }
            })
        }
    }
    submitUserInfo() {
        var valid = formValid({ contextEl: $('.form-userinfo') });
        if (valid.status == 1 && !this.pending) {
            var name = $('#name').val().trim();
            var tel = $('#tel').val().trim();
            var email = $('#email').val().trim();
            var data = { act: 'fill', nick: name, tel, email }
            this.pending = true
            proxy.pushData({
                url: API,
                method: 'get',
                data: data,
                onStart: null,
                callback: rs => {
                    this.pending = false
                    if (rs.status == 100){
                        $('.dialog__success').addClass('active');
                        $('.dialog__userinfo').removeClass('active').find('input').val('')
                    } else if (rs.status == 102) {
                        alert('你已经提交过获奖信息。每个电话号码只能登记一次，不能重复获奖。').then(val => {
                            if (val) {
                                $('.dialog__detail, .dialog__drawtip, .dialog__userinfo')
                                    .removeClass('active')
                            }
                        })
                    } else {
                        alert('网络出错请重新尝试！')
                    }
                }
            });
        }
    }
    mosaicTel(tel) {
        return tel.toString().replace(/(\d{3})(\d{4})(.+)/, '$1****$3')
    }
    bindEvents() {
        var self = this
        $('.luckdraw-tip.lm').on('click', function(e) {
            var code = $(this).data('code')
            self.checkDrawCode(code)
        })
        $('#submit-userinfo').on('click', this.submitUserInfo)
        $('.btn__award').on('click', e => this.getDrawList())
        $('.btn__continue').on('click', e => {
            $('.dialog__detail').removeClass('active')
        })
        $('[data-dialog="dialog__share"]').on('click', e => {
            $('.dialog__success').removeClass('active')
        })
        $('.dialog__share').on('click', e => {
            $('.dialog__detail, .dialog__drawtip, .dialog__userinfo').removeClass('active')
        })
    }
}