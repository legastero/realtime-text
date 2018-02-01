import * as tape from 'tape';
import {
    DisplayBuffer,
    InputBuffer,
    RTTEvent,
    WaitAction
} from '../src/index';

const test = tape.test;


const sleep = (time: number) => {
    return new Promise<void>(resolve => {
        setTimeout(resolve, time);
    });
};

const processEvent = async (display: DisplayBuffer, event: RTTEvent) => {
    return new Promise<string>(resolve => {
        display.onStateChange = ({ text, drained }) => {
            if (drained) {
                resolve(text);
            }
        };
        display.process(event);
    });
};


export default function runTests() {

    test('[Wait] Input delays', async t => {
        const input = new InputBuffer();
        input.start();

        input.update('When I say Vol, you say Tron!');
        await sleep(200);
        input.update('Vol!');

        const event = input.diff();

        const waitEvent = event!.actions![1] as WaitAction;

        t.equal(waitEvent.type, 'wait', 'Wait action present');
        t.ok(waitEvent.num >= 200, 'Wait action for 200+ milliseconds: ' + waitEvent.num);
        t.equal(event!.actions!.length, 4);
        t.end();
    });

    test('[Wait] Display delays', async t => {
        const display = new DisplayBuffer();

        const startTime = Date.now();
        const text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Uhhhh', pos: 0 },
                { type: 'wait', num: 200 },
                { type: 'erase', num: 5, pos: 4 },
                { type: 'insert', text: 'Vol', pos: 0 },
                { type: 'wait', num: 200 },
                { type: 'insert', text: 'tron?', pos: 3 }
            ],
            event: 'new',
            seq: 1
        });
        const endTime = Date.now();

        const time = endTime - startTime;

        t.equal(text, 'Voltron?', 'Rendered "Voltron?"');
        t.ok(time >= 400, 'Wait actions were 400+ milliseconds total: ' + time);

        t.end();
    });
}
