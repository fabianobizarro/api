
exports.dataFormatada = function (stringDate) {
    
    var data = stringDate.split('/');

    return {
        dia: data[0],
        mes: data[1],
        ano: data[2]
    };

}