var Spinner = function() {
    var spinner = [];
    var randomInt = function() {
        var low = 0, high = 5;
    return Math.floor(Math.random() * (high - low + 1) + low);
    }
    var randomBonus = function() {
        var low = 0, high = 1;
    return Math.floor(Math.random() * (high - low + 1) + low);
    }

    var runSpinner = function() {
    spinner = {
        sX: randomInt(),
        sY: randomInt(),
        sZ: randomInt(),
        sB: randomBonus(),
    }
    return spinner;
    }

    return {
        runSpinner: runSpinner
    }
};

exports.Spinner = Spinner;