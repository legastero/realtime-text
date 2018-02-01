import * as tape from 'tape';
import {
    DisplayBuffer,
    RTTEvent
} from '../src/index';

const test = tape.test;


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

    test('[Display] Insert at end', async t => {
        const display = new DisplayBuffer();

        let text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Lance', pos: 0 }
            ],
            event: 'new',
            seq: 0
        });
        t.equal(text, 'Lance', 'Rendered "Lance"');

        text = await processEvent(display, {
            actions: [
                { type: 'insert', text: ' McClain', pos: 5 }
            ],
            event: 'edit',
            seq: 1
        });
        t.equal(text, 'Lance McClain', 'Rendered "Lance McClain"');

        t.end();
    });

    test('[Display] Insert at start', async t => {
        const display = new DisplayBuffer();

        let text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Kogane', pos: 0 }
            ],
            event: 'new',
            seq: 0
        });
        t.equal(text, 'Kogane', 'Rendered "Kogane"');

        text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'eith K', pos: 1 }
            ],
            event: 'edit',
            seq: 1
        });
        t.equal(text, 'Keith Kogane', 'Rendered "Keith Kogane"');

        t.end();
    });

    test('[Display] Insert in middle', async t => {
        const display = new DisplayBuffer();

        let text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Shiro is our most popular character.', pos: 0 }
            ],
            event: 'new',
            seq: 0
        });
        t.equal(text, 'Shiro is our most popular character.', 'Rendered "Shiro is our most popular character."');

        text = await processEvent(display, {
            actions: [
                { type: 'insert', text: '"the Hero" ', pos: 6 }
            ],
            event: 'edit',
            seq: 1
        });
        t.equal(text, 'Shiro "the Hero" is our most popular character.', 'Rendered "Shiro \"the Hero\" is our most popular character."');

        t.end();
    });

    test('[Display] Replace at beginning', async t => {
        const display = new DisplayBuffer();

        let text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Lance McClain', pos: 0 }
            ],
            event: 'new',
            seq: 0
        });
        t.equal(text, 'Lance McClain', 'Rendered "Lance McClain"');

        text = await processEvent(display, {
            actions: [
                { type: 'erase', num: 5, pos: 5 },
                { type: 'insert', text: 'Keith', pos: 0 }
            ],
            event: 'edit',
            seq: 1
        });
        t.equal(text, 'Keith McClain', 'Rendered "Keith McClain"');

        t.end();
    });

    test('[Display] Replace at end', async t => {
        const display = new DisplayBuffer();

        let text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Lance McClain', pos: 0 }
            ],
            event: 'new',
            seq: 0
        });
        t.equal(text, 'Lance McClain', 'Rendered "Lance McClain"');

        text = await processEvent(display, {
            actions: [
                { type: 'erase', num: 7, pos: 13 },
                { type: 'insert', text: 'Kogane', pos: 6 }
            ],
            event: 'edit',
            seq: 1
        });
        t.equal(text, 'Lance Kogane', 'Rendered "Lance Kogane"');

        t.end();
    });

    test('[Display] Replace in middle', async t => {
        const display = new DisplayBuffer();

        let text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Garrison Cargo Pilot', pos: 0 }
            ],
            event: 'new',
            seq: 0
        });
        t.equal(text, 'Garrison Cargo Pilot', 'Rendered "Garrison Cargo Pilot"');

        text = await processEvent(display, {
            actions: [
                { type: 'erase', num: 5, pos: 14 },
                { type: 'insert', text: 'Fighter', pos: 9 }
            ],
            event: 'edit',
            seq: 1
        });
        t.equal(text, 'Garrison Fighter Pilot', 'Rendered "Garrison Fighter Pilot"');

        t.end();
    });

    test('[Display] Replace entirely', async t => {
        const display = new DisplayBuffer();

        let text = await processEvent(display, {
            actions: [
                { type: 'insert', text: 'Prorok', pos: 0 }
            ],
            event: 'new',
            seq: 0
        });
        t.equal(text, 'Prorok', 'Rendered "Prorok"');

        text = await processEvent(display, {
            actions: [
                { type: 'erase', num: 6, pos: 6},
                { type: 'insert', text: 'Robeast', pos: 0 }
            ],
            event: 'edit',
            seq: 1
        });
        t.equal(text, 'Robeast', 'Rendered "Robeast"');

        t.end();
    });
}
