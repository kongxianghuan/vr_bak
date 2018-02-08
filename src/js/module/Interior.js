import C3D from 'sohu_public/vendor/css3d/0.8.4'
import Orienter from 'sohu_public/components/Orienter/0.2.0'
import AlloyFinger from 'sohu_public/components/AlloyFinger/0.1.10'
import $ from 'sohu_public/vendor/zepto'
import Luckdraw from './Luckdraw'

export default class Interior {
    constructor() {
        this.container = $('.interior')[0]
        this.wrapper = $('#interior')[0]
        this.toggleBtn = $('.btn__interior')[0]
        this.animateId = null
        this.lock = false
        this.drag = { lon: 0, lat: 0 }
        this.aim = { lon: 0, lat: 0 }
        this.fix = { lon: 0, lat: 0 }
        this.luckdraw = new Luckdraw()

        this.stage = new C3D.Stage()
        this.stage
            .size(window.innerWidth, window.innerHeight)
            .material({ color: '#000' })
            .update()

        this.skybox = new C3D.Skybox()
        this.skybox.size(1136).position(0, 0, 0).material({
            front: { image: require('../../img/interior/cube_front.jpg') },
            back: { image: require('../../img/interior/cube_back.jpg') },
            left: { image: require('../../img/interior/cube_left.jpg') },
            right: { image: require('../../img/interior/cube_right.jpg') },
            up: { image: require('../../img/interior/cube_up.jpg') },
            down: { image: require('../../img/interior/cube_down.jpg') }
        }).update()

        this.stage.addChild(this.skybox)

        this.wrapper.appendChild(this.stage.el)
        
        this.orienterControl()
        this.touchControl()
        this.createBtns()
        this.animate()
        this.bindEvents()
    }

    animate() {
        var camera = this.stage.camera
        this.animateId = requestAnimationFrame(() => this.animate())

        var _lon = (this.aim.lon + this.fix.lon + this.drag.lon) % 360
        var _lat = (this.aim.lat + this.fix.lat + this.drag.lat) * 0.35

        if (_lon - camera.rotationY > 180) camera.rotationY += 360
        if (_lon - camera.rotationY < -180) camera.rotationY -= 360
        camera.rotationY += (_lon - camera.rotationY) * 0.15
        camera.rotationX += (_lat - camera.rotationX) * 0.15
        camera.updateT()
    }

    orienterControl() {
        this.orienter = new Orienter()
        this.orienter.onOrient = obj => {
            this.aim.lat = -obj.lat
            this.aim.lon = obj.lon

            if (this.lock) {
                this.fix.lat = this.aim.lat
                this.fix.lon = this.aim.lon
            }
        }
        this.orienter.init()
    }

    touchControl() {
        this.touch = new AlloyFinger(this.wrapper, {
            pressMove: e => {
                if (!this.lock) {
                    this.drag.lon = (this.drag.lon + e.deltaX * 0.2) % 360
                    this.drag.lat = Math.max(-90, Math.min(90, this.drag.lat - e.deltaY * 0.2))
                }
            }
        })
    }

    createBtns() {
        this.btns = new C3D.Sprite()
        var btnImg = require('../../img/interior/btn_scene.png')
        var btnData = [
            { name: 'd1', position: [522, 662, 0], plane: 0, size: [132, 80] },
            { name: 'd2', position: [840, 632, 0], plane: 0, size: [100, 130] },
            { name: 'd3', position: [522, 1055, 0], plane: 0, size: [160, 160] },
            { name: 'd4', position: [980, 700, 0], plane: 2, size: [140, 120] },
            { name: 'd5', position: [860, 1055, 0], plane: 0, size: [160, 160] },
            { name: 'd6', position: [500, 935, 0], plane: 1, size: [300, 420] }
        ]
        btnData.forEach((btn, i) => {
            var btnObj = C3D.create({
                type: 'plane',
                name: btn.name,
                size: btn.size,
                position: btn.position,
                // material: [{ image: btnImg, bothsides: false }]
            })
            this.skybox.children[btn.plane].addChild(btnObj)
        })
    }

    show() {
        // this.drag = { lon: 0, lat: 0 }
        // this.aim = { lon: 0, lat: 0 }
        // this.fix = { lon: 0, lat: 0 }
        this.container.classList.add('active')
        this.luckdraw.init()
    }

    hide() {
        this.container.classList.remove('active')
    }

    bindEvents() {
        this.toggleBtn.addEventListener('click', e => this.hide())
        $('#interior').on('click', '[data-name^=d]', function () {
            var dialogID = $(this).data('name')
            $(`#${dialogID}`).addClass('active')
        })
    }
}