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


Array.prototype.first = function (condition) {

    if (condition) {
        let filteredArray = this.where(condition);
        return filteredArray[0];
    }
    else {
        return this[0];
    }

}

Array.prototype.count = function (condition) {
    if (condition) {
        let filteredArray = this.where(condition);
        return filteredArray.length;
    } else {
        return this.length;
    }
}
