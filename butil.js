exports.clean = function (a) {
    r = a.replace('<', '&lt;').replace('>', '&gt;');
    return r;
}