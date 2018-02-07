import Preload from "sohu_public/utils/preload/2.0.1"

const IMG_SRC = [
    // cover 
    require('../../img/btn_award.png'),
    require('../../img/btn_intro.png'),
    require('../../img/logo.png'),
    require('../../img/title_main.png'),
    require('../../img/title_sub.png'),
    require('../../img/car1.png'),
    require('../../img/car2.png'),
    require('../../img/lm_group.png'),

    // interior
    require('../../img/interior/cube_front.jpg'),
    require('../../img/interior/cube_back.jpg'),
    require('../../img/interior/cube_left.jpg'),
    require('../../img/interior/cube_right.jpg'),
    require('../../img/interior/cube_up.jpg'),
    require('../../img/interior/cube_down.jpg')
]

export default class Preloader {
    constructor(done) {
        this.imgSrc = IMG_SRC
        this.done = done
        this.imgLoad()
    }
    imgLoad() {
        this.imgLoader = new Preload.ImageLoad({
            timeOut: 10,
            timeOutCB(res) {
                // console.log('timeout=', res)
            },
            progress(i, count) {
                // console.log(i, count)
            }
        })
        this.imgLoader.load(this.imgSrc)
            .then((res) => {
                // console.log('res', res)
                this.done()
            })
            .catch((err) => console.log(err))
    }
}
