'use strict';

exports.getErrorMessage = function (err) {
    if (err.errors) {

        let messages = [];
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                messages.push(err.errors[errName].message);
                //return err.errors[errName].message;
        }
        return messages;
    }
    else if (err.message) {
        return err.message;
    }
    else {
        return 'Unknown server error';
    }
};
