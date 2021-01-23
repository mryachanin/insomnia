import moment from 'moment';
import db from '../db.mjs';

function start() {
    var now = new moment();
    console.log(`Sleep timer started at ${now}`);
}

function stop() {
    var now = new moment();
    console.log(`Sleep timer stopped at ${now}`);
}

function interrupt() {
    var now = new moment();
    console.log(`Sleep timer interrupted at ${now}`);
}

function rate(rating) {
    var now = new moment();
    console.log(`Sleep timer rated "${rating}" at ${now}`);
}

var sleep = {
    "start": start,
    "stop": stop,
    "interrupt": interrupt,
    "rate": rate
};

export default sleep;
