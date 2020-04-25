
exports.dataFormatada = function (stringDate) {

    var regexDataBR = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g;
    var regexDataUS = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;

    if (regexDataBR.test(stringDate)) {

        var data = stringDate.split('/');
        return {
            dia: data[0],
            mes: data[1],
            ano: data[2]
        };


    }
    else if (regexDataUS.test(stringDate)) {

        var data = stringDate.split('-');
        return {
            dia: data[2],
            mes: data[1],
            ano: data[0]
        };

    }
    else
        return null;



}