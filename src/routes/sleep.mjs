import db from '../db.mjs';

function start() {
    console.log("Sleep timer started");
}

function stop() {
    console.log("Sleep timer stopped");
}

function interrupt() {
    console.log("Sleep timer interrupted");
}

function rate(rating) {
    console.log(`Sleep timer rated: ${rating}`);
}

var sleep = {
    "start": start,
    "stop": stop,
    "interrupt": interrupt,
    "rate": rate
};

export default sleep;
