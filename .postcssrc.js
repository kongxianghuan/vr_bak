const path = require('path');
const getParentPath = require('./build/util').getParentPath;
const ROOT = getParentPath('html');

module.exports = (ctx) => {
    return {
        plugins: {
            'postcss-import': { path: [ ROOT ] },
            'postcss-cssnext': {},
            'cssnano': { autoprefixer: false }
        }
    }
}