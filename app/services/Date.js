Date.prototype.date = function () {
    var day = this.getDate();
    var month = this.getMonth();
    var year = this.getFullYear();

    return new Date(year, month, day);
};

Date.prototype.yyyyMMdd = function () {
    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();

    return [year, month, day].join('-');
}