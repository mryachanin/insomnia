import dayjs from 'dayjs';
import _ from 'underscore'

async function start(db) {
    var lastRecord = await getLastRecord(db);

    if (!!lastRecord && !lastRecord.wake_time) {
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

async function stop(db) {
    var lastRecord = await getLastRecord(db);

    if (!lastRecord)
    {
        console.log(`Error: Cannot stop sleep before starting any tracking.`);
        return {
            "code": 400,
            "message": `Cannot stop sleep before starting any tracking`
        }
    }

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

async function interrupt(db) {
    var lastRecord = await getLastRecord(db);

    if (!lastRecord)
    {
        console.log(`Error: Cannot interrupt sleep before starting any tracking.`);
        return {
            "code": 400,
            "message": `Cannot interrupt sleep before starting any tracking`
        }
    }

    // todo: address race condition here between check and save
    if (!!lastRecord.wake_time) {
        console.log(`Error: Cannot interrupt sleep after having already woken. id of ${lastRecord.id} already has a wake time`);
        return {
            "code": 400,
            "message": `Cannot interrupt sleep after having already woken.`
        }
    }

    var lastInterrupt = await db.query(`select * from interruption where sleep_id = $1 order by id desc limit 1`, [lastRecord.id])
        .catch(e => console.error(e.stack));
    var now = dayjs();
    var lastInterruptTime = !!lastInterrupt && !!lastInterrupt.rows[0] && lastInterrupt.rows[0].interrupt_time;
    var timeSinceLastInterrupt = !!lastInterruptTime ?
        now.diff(lastInterruptTime, "minute") :
        Number.MAX_SAFE_INTEGER;

    if (timeSinceLastInterrupt < 5) {
        console.log(`Error: Sleep was already registered as interrupted less than 5 minutes ago. Current time: ${now.format()}. Last interrupt time: ${dayjs(lastInterruptTime).format()}. Diff: ${timeSinceLastInterrupt}`);
        return {
            "code": 400,
            "message": `Chill my dude. An interruption was recorded ${timeSinceLastInterrupt} minutes ago.`
        }
    }

    await db.query('INSERT into interruption(sleep_id, interrupt_time) VALUES($1, $2)', [lastRecord.id, now.format()])
        .catch(e => console.error(e.stack))
        .then(result => console.log(`Sleep timer interrupted at ${now}`));
}

async function rate(db, rating) {
    var lastRecord = await getLastRecord(db);
    var now = dayjs();

    if (!lastRecord)
    {
        console.log(`Error: Cannot rate sleep before starting any tracking.`);
        return {
            "code": 400,
            "message": `Cannot rate sleep before starting any tracking`
        }
    }

    if (rating < 1 || rating > 5) {
        console.log(`Error: sleep rating must be between 1 and 5 inclusive. Rating ${rating}`);
        return {
            "code": 400,
            "message": `Error: sleep rating must be between 1 and 5 inclusive.`
        }
    }

    if (!!lastRecord.sleep_rating && !!lastRecord.wake_time && now.diff(lastRecord.wake_time, "minute") > 5) {
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

async function getLastRecord(db) {
    var lastRecord = await db.query('select * from activity order by id desc limit 1')
        .catch(e => console.error(e.stack));
    return !!lastRecord ? lastRecord.rows[0] : null;
}

var sleep = {
    "start": start,
    "stop": stop,
    "interrupt": interrupt,
    "rate": rate
};

export default sleep;
