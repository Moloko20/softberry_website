const through = require('through2');
const browserify = require('browserify');
// const tsify = require('tsify');

const vinyl = (options = {}) => {
    let _options = Object.assign({}, options);

    return through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            return cb(guErr('Streaming not supported'));
        }

        if (file.isNull()) {
            return cb(null, file);
        }

        let bundler = browserify(file.path);

        // bundler.transform('babelify', _options);
        bundler.plugin('tsify', _options);

        bundler.bundle((err, src) => {
            if (err !== null) {
                return cb(new Error(err));
            } else {
                file.contents = Buffer.from(src.toString(enc || 'utf-8'), enc);

                return cb(null, file);
            }
        });
    });
};

module.exports = vinyl;
