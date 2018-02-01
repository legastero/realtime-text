import * as tape from 'tape';
import { InputBuffer } from '../src/index';

const test = tape.test;


export default function runTests() {

    test('[Input Diff] Insert at end', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Lance');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Lance',
            type: 'insert'
        }, 'Insert "Lance"');

        input.update('Lance McClain');
        event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 5,
            text: ' McClain',
            type: 'insert'
        }, 'Insert " McClain"');


        t.end();
    });

    test('[Input Diff] Insert at start', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Kogane');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Kogane',
            type: 'insert'
        }, 'Insert "Kogane"');

        input.update('Keith Kogane');
        event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 1,
            text: 'eith K',
            type: 'insert'
        }, 'Insert "Keith "');

        t.end();
    });

    test('[Input Diff] Insert in middle', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Shiro is our most popular character.');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Shiro is our most popular character.',
            type: 'insert'
        }, 'Insert "Shiro is our most popular character."');

        input.update('Shiro "the Hero" is our most popular character.');
        event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 6,
            text: '"the Hero" ',
            type: 'insert'
        }, 'Insert "\"the Hero\" "');

        t.end();
    });

    test('[Input Diff] Replace at beginning', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Lance McClain');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Lance McClain',
            type: 'insert'
        }, 'Insert "Lance McClain"');

        input.update('Keith McClain');
        event = input.diff();
        t.deepEqual(event!.actions![0], {
            num: 5,
            pos: 5,
            type: 'erase'
        }, 'Erase "Lance"');
        t.deepEqual(event!.actions![1], {
            pos: 0,
            text: 'Keith',
            type: 'insert'
        }, 'Insert "Keith"');

        t.end();
    });

    test('[Input Diff] Replace at end', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Lance McClain');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Lance McClain',
            type: 'insert'
        }, 'Insert "Lance McClain"');

        input.update('Lance Kogane');
        event = input.diff();
        t.deepEqual(event!.actions![0], {
            num: 7,
            pos: 13,
            type: 'erase'
        }, 'Erase "McClain"');
        t.deepEqual(event!.actions![1], {
            pos: 6,
            text: 'Kogane',
            type: 'insert'
        }, 'Insert "Kogane"');

        t.end();
    });

    test('[Input Diff] Replace in middle', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Garrison Cargo Pilot');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Garrison Cargo Pilot',
            type: 'insert'
        }, 'Insert "Garrison Cargo Pilot"');

        input.update('Garrison Fighter Pilot');
        event = input.diff();
        t.deepEqual(event!.actions![0], {
            num: 5,
            pos: 14,
            type: 'erase'
        }, 'Erase "Cargo"');
        t.deepEqual(event!.actions![1], {
            pos: 9,
            text: 'Fighter',
            type: 'insert'
        }, 'Insert "Fighter "');

        t.end();
    });


    test('[Input Diff] Replace entirely', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Prorok');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Prorok',
            type: 'insert'
        }, 'Insert "Prorok"');

        input.update('Robeast');
        event = input.diff();
        t.deepEqual(event!.actions![0], {
            num: 6,
            pos: 6,
            type: 'erase'
        }, 'Erase "Prorok"');
        t.deepEqual(event!.actions![1], {
            pos: 0,
            text: 'Robeast',
            type: 'insert'
        }, 'Insert "Robeast"');

        t.end();
    });

    test('[Input Diff] Replace multiple sections', t => {
        const input = new InputBuffer(undefined, true);
        input.start();

        input.update('Lance is the Blue Paladin');
        let event = input.diff();
        t.deepEqual(event!.actions![0], {
            pos: 0,
            text: 'Lance is the Blue Paladin',
            type: 'insert'
        }, 'Insert "Lance is the Blue Paladin"');

        input.update('Keith is the Red Paladin');
        event = input.diff();
        t.equal(event!.actions!.length, 2, 'Only one erase and insert are used');
        t.deepEqual(event!.actions![0], {
            num: 17,
            pos: 17,
            type: 'erase'
        }, 'Erase "Lance is the Blue"');
        t.deepEqual(event!.actions![1], {
            pos: 0,
            text: 'Keith is the Red',
            type: 'insert'
        }, 'Insert "Keith is the Red"');

        t.end();
    });
}
