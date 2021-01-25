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

async function stop() {
    var lastRecord = await getLastRecord();

    // todo: address race condition here between check and save
    if (!!lastRecord.wake_time) {
        console.log(`Error: Cannot record waking up twice in a row for the same sleep activity. id of ${lastRecord.id} already has a wake time`);
        return {
            "code": 400,
            "message": `Cannot record waking up twice in a row for the same sleep activity.`
        }
    }

    var now = dayjs();
    await db.query('UPDATE activity SET wake_time = $1 where id = $2', [now.format(), lastRecord.id])
        .catch(e => console.error(e.stack))
        .then(result => console.log(`Sleep timer stopped at ${now}`));
}

function interrupt() {
    var now = dayjs();
    console.log(`Sleep timer interrupted at ${now}`);
}

async function rate(rating) {
    if (rating < 1 || rating > 5) {
        console.log(`Error: sleep rating must be between 1 and 5 inclusive. Rating ${rating}`);
        return {
            "code": 400,
            "message": `Error: sleep rating must be between 1 and 5 inclusive.`
        }
    }

    var lastRecord = await getLastRecord();
    var now = dayjs();

    if (!!lastRecord && !!lastRecord.sleep_rating && !!lastRecord.wake_time && now.diff(lastRecord.wake_time, "minute") > 5) {
        console.log(`Error: Cannot override sleep rating 5 minutes after waking up. id of ${lastRecord.id} already has a rating and wake up time of ${dayjs(lastRecord.wake_time).format()}`);
        return {
            "code": 400,
            "message": `Cannot override sleep rating 5 minutes after waking up.`
        }
    }

    await db.query('UPDATE activity SET sleep_rating = $1 where id = $2', [rating, lastRecord.id])
        .catch(e => console.error(e.stack))
        .then(result => console.log(`Sleep timer rated "${rating}" at ${now}`));
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
