/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var rpc = require("ethrpc");
var contracts = require("augur-contracts");

require('it-each')({ testPerIteration: true });

describe("Read contracts", function () {

    var test = function (c, network) {
        var res = rpc.read(contracts[network][c]);
        assert.notProperty(res, "error");
        assert.notStrictEqual(res, "0x");
    };

    var contract_list = [];
    for (var c in contracts["7"]) {
        if (!contracts["7"].hasOwnProperty(c)) continue;
        if (c === "namereg") continue;
        contract_list.push(c);
    }

    it.each(contract_list, "read %s", ['element'], function (element, next) {
        rpc.reset();
        rpc.version(function (network) {
            test(element, network);
            next();
        });
    });

});
