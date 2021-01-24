import dayjs from 'dayjs';
import util from 'util';
import _ from 'underscore'
import db from '../db.mjs';

async function start() {
    var lastRecord = await getLastRecord();

    if (!lastRecord.wake_time) {
        console.log(`Error: Cannot create a new sleep record twice in a row. id of ${lastRecord.id} does not have a wake time`);
        return {
            "code": 400,
            "message": `Cannot create a new sleep record twice in a row.`
        }
    }
    var now = dayjs();
    await db.query('INSERT INTO activity(sleep_time) VALUES ($1)', [now.format()])
        .catch(e => console.error(e.stack))
        .then(result => console.log(`Sleep timer started at ${now}`));
}

function stop() {
    var now = dayjs();
    console.log(`Sleep timer stopped at ${now}`);
}

function interrupt() {
    var now = dayjs();
    console.log(`Sleep timer interrupted at ${now}`);
}

function rate(rating) {
    var now = dayjs();
    console.log(`Sleep timer rated "${rating}" at ${now}`);
}

async function getLastRecord() {
    var lastRecord = await db.query('select * from activity order by id desc limit 1')
        .catch(e => console.error(e.stack));
    return lastRecord.rows[0];
}

var sleep = {
    "start": start,
    "stop": stop,
    "interrupt": interrupt,
    "rate": rate
};

export default sleep;
