#!/usr/bin/env node

GLOBAL.path = require("path");
GLOBAL.fs = require("fs");
GLOBAL.BigNumber = require("bignumber.js");
GLOBAL.Decimal = require("decimal.js");
GLOBAL.scrypt = require("./lib/scrypt");
GLOBAL.keccak = require("./lib/keccak");
GLOBAL.uuid = require("node-uuid");
GLOBAL._ = require("lodash");
GLOBAL.chalk = require("chalk");
GLOBAL.moment = require("moment");
GLOBAL.longjohn = require("longjohn");
GLOBAL.EthTx = require("ethereumjs-tx");
GLOBAL.EthUtil = require("ethereumjs-util");
GLOBAL.web3 = require("web3");
GLOBAL.contracts = require("augur-contracts");
GLOBAL.abi = require("augur-abi");
GLOBAL.constants = require("./src/constants");
GLOBAL.utils = require("./src/utilities");
GLOBAL.Tx = contracts.Tx;
GLOBAL.augur = (GLOBAL.reload = function () {
    return utils.setup(utils.reset("./src/index"), process.argv.slice(2));
})();
GLOBAL.comments = augur.comments;
augur.rpc.setLocalNode("http://127.0.0.1:8545");
GLOBAL.b = augur.branches.dev;
GLOBAL.log = console.log;

longjohn.async_trace_limit = 25;
longjohn.empty_frame = "";

web3.setProvider(new web3.providers.HttpProvider(process.env.AUGUR_HOST));

GLOBAL.accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
GLOBAL.c = augur.coinbase;

GLOBAL.balances = (GLOBAL.balance = function (account, branch) {
    account = account || augur.from;
    var balances = {
        cash: augur.getCashBalance(account),
        reputation: augur.getRepBalance(branch || augur.branches.dev, account),
        ether: abi.bignum(augur.rpc.balance(account)).dividedBy(constants.ETHER).toFixed()
    };
    console.log(balances);
    return balances;
})();

console.log(chalk.cyan("Network"), chalk.green(augur.network_id));

console.log(chalk.cyan("Balances:"));
console.log("Cash:       " + chalk.green(balances.cash));
console.log("Reputation: " + chalk.green(balances.reputation));
console.log("Ether:      " + chalk.green(balances.ether));

var reportingInfo = (GLOBAL.reporting = function (branch) {
    var info = {
        vote_period: augur.getVotePeriod(b),
        current_period: augur.getCurrentPeriod(b),
        num_reports: augur.getNumberReporters(b)
    };
    info.num_events = augur.getNumberEvents(b, info.vote_period);
    return info;
})(b);

console.log(chalk.cyan("Vote period"), chalk.green(reportingInfo.vote_period) + chalk.cyan(":"));
console.log("Current period:     ", chalk.green(reportingInfo.current_period));
console.log("Number of events:   ", chalk.green(reportingInfo.num_events));
console.log("Number of reporters:", chalk.green(reportingInfo.num_reports));

GLOBAL.vote_period = reportingInfo.vote_period;
GLOBAL.current_period = reportingInfo.current_period;
GLOBAL.num_events = reportingInfo.num_events;
GLOBAL.num_reports = reportingInfo.num_reports;
