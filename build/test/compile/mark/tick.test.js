/* tslint:disable quotemark */
// TODO:
// test mark-tick with the following test cases,
// looking at mark-point.test.ts as inspiration
//
// After finishing all test, make sure all lines in mark-tick.ts is tested
// (except the scaffold labels() method)
import { assert } from 'chai';
import { SIZE, X, Y } from '../../../src/channel';
import { tick } from '../../../src/compile/mark/tick';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Tick', function () {
    describe('with stacked x', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "tick",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick.encodeEntry(model);
        it('should use stack_end on x', function () {
            assert.deepEqual(props.xc, { scale: X, field: 'sum_a_end' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "tick",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick.encodeEntry(model);
        it('should use stack_end on y', function () {
            assert.deepEqual(props.yc, { scale: Y, field: 'sum_a_end' });
        });
    });
    describe('with quantitative x', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': { 'x': { 'field': 'Horsepower', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick.encodeEntry(model);
        it('should be centered on y', function () {
            assert.deepEqual(props.yc, {
                mult: 0.5,
                signal: 'height'
            });
        });
        it('should scale on x', function () {
            assert.deepEqual(props.xc, { scale: X, field: 'Horsepower' });
        });
        it('width should tick thickness with orient vertical', function () {
            assert.deepEqual(props.width, { value: 1 });
        });
    });
    describe('with quantitative y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': { 'y': { 'field': 'Cylinders', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick.encodeEntry(model);
        it('should be centered on x', function () {
            assert.deepEqual(props.xc, {
                mult: 0.5,
                signal: 'width'
            });
        });
        it('should scale on y', function () {
            assert.deepEqual(props.yc, { scale: Y, field: 'Cylinders' });
        });
        it('height should tick thickness with orient horizontal', function () {
            assert.deepEqual(props.height, { value: 1 });
        });
    });
    describe('with quantitative x and ordinal y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' }
            },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick.encodeEntry(model);
        it('should scale on x', function () {
            assert.deepEqual(props.xc, { scale: X, field: 'Horsepower' });
        });
        it('should scale on y', function () {
            assert.deepEqual(props.yc, { scale: Y, field: 'Cylinders' });
        });
        it('wiidth should be tick thickness with default orient vertical', function () {
            assert.deepEqual(props.width, { value: 1 });
        });
        it('height should be matched to field with default orient vertical', function () {
            assert.deepEqual(props.height, { value: 14 });
        });
    });
    describe('vertical ticks', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'config': { 'mark': { 'orient': 'vertical' } },
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick.encodeEntry(model);
        it('maps size to height', function () {
            assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': SIZE });
        });
    });
    describe('vertical ticks with size in mark def', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': { 'type': 'tick', 'size': 5 },
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick.encodeEntry(model);
        it('maps size to height in Vega', function () {
            assert.deepEqual(props.height, { value: 5 });
        });
    });
    describe('vertical ticks (implicit)', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick.encodeEntry(model);
        it('maps size to height in Vega', function () {
            assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': SIZE });
        });
    });
});
//# sourceMappingURL=tick.test.js.map