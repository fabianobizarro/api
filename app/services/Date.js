Date.prototype.date = function () {
    var day = this.getDate();
    var month = this.getMonth();
    var year = this.getFullYear();

    return new Date(year, month, day);
}