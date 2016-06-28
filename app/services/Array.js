Array.prototype.where = function (condition) {
    var r = [];
    for (var index = 0; index < this.length; index++) {
        var element = this[index];
        if (condition(element)) {
            r.push(element);
        }
    }
    return r;
}
