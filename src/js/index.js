// import Vconsole from 'sohu_public/utils/vconsole/3.1.0'
// new Vconsole()

import '../style/index.css'
import 'sohu_public/components/inobounce/0.1.0'
import './module/share'

import Interior from './module/Interior'
import Preloader from './module/Preloader'
import AlloyFinger from 'sohu_public/components/AlloyFinger/0.1.10'
import FastClick from 'sohu_public/utils/FastClick'
import $ from 'sohu_public/vendor/zepto'

class Page {
    constructor() {
        this.cover = document.querySelector('#cover')
        this.preloader = new Preloader(() => {
            $('.container, .btn__arrow').addClass('ani')
            window.interior = this.interior = new Interior()
            FastClick.attach(document.body)
            this.bindEvents()
        })
    }
    bindEvents() {
        new AlloyFinger(this.cover, {
            swipe: e => {
                if (e.direction === 'Up') {
                    this.interior.show()
                }
            }
        })
        $('.car__l, .car__s, .btn__arrow').on('click', e =>{
            this.interior.show()
        })
        $('[data-dialog]').on('click', function() {
            var dialogID = $(this).data('dialog')
            var $dialogElem = $(`.${dialogID}`)
            $dialogElem.addClass('active')
        })
        $('[data-dialog-close]').on('click', function() {
            $(this).parents('.dialog').removeClass('active')
        })
    }
}

window.onload = () => new Page()