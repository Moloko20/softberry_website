const through = require('through2');
const browserify = require('browserify');
const path = require('path');

const vinyl = (options = {}) => {
    const _options = Object.assign({}, options);

    return through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            return cb(guErr('Streaming not supported'));
        }

        if (file.isNull()) {
            return cb(null, file);
        }

        const bundler = browserify(file.path);

        bundler.plugin('tsify', _options);

        bundler.bundle((err, src) => {
            if (err !== null) {
                return cb(new Error(err));
            } else {
                const filePath = path.parse(file.path);

                filePath.base = filePath.base.replace(path.extname(file.path), '.js');

                file.path = path.format(filePath);
                file.contents = Buffer.from(src.toString(enc || 'utf-8'), enc);

                return cb(null, file);
            }
        });
    });
};

module.exports = vinyl;
