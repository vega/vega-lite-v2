import { assert } from 'chai';
import { dateTimeExpr } from '../src/datetime';
import * as log from '../src/log';
describe('datetime', function () {
    describe('dateTimeExpr', function () {
        it('should drop day if day is combined with year/month/date', log.wrap(function (localLogger) {
            var d = {
                year: 2007,
                day: 'monday'
            };
            var expr = dateTimeExpr(d, true);
            assert.equal(expr, 'datetime(2007, 0, 1, 0, 0, 0, 0)');
            assert.equal(localLogger.warns[0], log.message.droppedDay(d));
        }));
        it('should normalize numeric quarter correctly', function () {
            var expr = dateTimeExpr({
                quarter: 2
            }, true);
            assert.equal(expr, 'datetime(0, 1*3, 1, 0, 0, 0, 0)');
        });
        it('should log warning for quarter > 4', log.wrap(function (localLogger) {
            assert.equal(dateTimeExpr({
                quarter: 5
            }, true), 'datetime(0, 4*3, 1, 0, 0, 0, 0)');
            assert.equal(localLogger.warns[0], log.message.invalidTimeUnit('quarter', 5));
        }));
        it('should throw error for invalid quarter', function () {
            assert.throws(function () {
                dateTimeExpr({ quarter: 'Q' }, true);
            }, Error, log.message.invalidTimeUnit('quarter', 'Q'));
        });
        it('should normalize numeric month correctly', function () {
            var expr = dateTimeExpr({
                month: 1
            }, true);
            assert.equal(expr, 'datetime(0, 0, 1, 0, 0, 0, 0)');
        });
        it('should normalize month name correctly', function () {
            assert.equal(dateTimeExpr({
                month: 'January'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
            assert.equal(dateTimeExpr({
                month: 'january'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
            assert.equal(dateTimeExpr({
                month: 'Jan'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
            assert.equal(dateTimeExpr({
                month: 'jan'
            }, true), 'datetime(0, 0, 1, 0, 0, 0, 0)');
        });
        it('should throw error for invalid month', function () {
            assert.throws(function () {
                dateTimeExpr({ month: 'J' }, true);
            }, Error, log.message.invalidTimeUnit('month', 'J'));
        });
        it('should normalize numeric day (of week) correctly', function () {
            assert.equal(dateTimeExpr({
                day: 0
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            assert.equal(dateTimeExpr({
                day: 7
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
        });
        it('should normalize day name correctly and use year 2006 to ensure correct', function () {
            assert.equal(dateTimeExpr({
                day: 'Sunday'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            assert.equal(dateTimeExpr({
                day: 'sunday'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            assert.equal(dateTimeExpr({
                day: 'Sun'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
            assert.equal(dateTimeExpr({
                day: 'sun'
            }, true), 'datetime(2006, 0, 0+1, 0, 0, 0, 0)');
        });
        it('should throw error for invalid day', function () {
            assert.throws(function () {
                dateTimeExpr({ day: 'S' }, true);
            }, Error, log.message.invalidTimeUnit('day', 'S'));
        });
        it('should use utc expression if utc is specified', function () {
            var d = {
                year: 2007,
                day: 'monday',
                utc: true
            };
            var expr = dateTimeExpr(d, true);
            assert.equal(expr, 'utc(2007, 0, 1, 0, 0, 0, 0)');
        });
        // Note: Other part of coverage handled by timeUnit.fieldExpr's test
    });
});
//# sourceMappingURL=datetime.test.js.map