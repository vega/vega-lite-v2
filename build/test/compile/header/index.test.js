import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { getHeaderGroups, getTitleGroup, labelAlign, labelBaseline } from '../../../src/compile/header';
import { getHeaderProperties } from '../../../src/compile/header/index';
import { HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP } from '../../../src/header';
import { parseFacetModel } from '../../util';
describe('compile/header/index', function () {
    describe('label aligns correctly according to angle', function () {
        assert.deepEqual(labelAlign(23), { align: { value: 'right' } });
        assert.deepEqual(labelAlign(135), { align: { value: 'left' } });
        assert.deepEqual(labelAlign(50), { align: { value: 'right' } });
    });
    describe('label baseline adjusted according to angle', function () {
        assert.deepEqual(labelBaseline(10), { baseline: 'middle' });
        assert.deepEqual(labelBaseline(90), { baseline: 'top' });
    });
    describe('getHeaderGroups', function () {
        it('should correctly process sort descending', function () {
            var model = parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal', sort: 'ascending' },
                    column: { field: 'a', type: 'ordinal', sort: 'descending' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseScale();
            model.parseLayoutSize();
            model.parseAxisAndHeader();
            var rowHeaderGroups = getHeaderGroups(model, 'row');
            var columnHeaderGroups = getHeaderGroups(model, 'column');
            assert.equal(rowHeaderGroups[0].sort.order, 'ascending');
            assert.equal(columnHeaderGroups[0].sort.order, 'descending');
        });
        it('should correctly process sort field', function () {
            var model = parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal', sort: { field: 'd', op: 'min' } }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseScale();
            model.parseLayoutSize();
            model.parseAxisAndHeader();
            var rowHeaderGroups = getHeaderGroups(model, 'row');
            assert.equal(rowHeaderGroups[0].sort.field, 'datum["min_d"]');
        });
    });
    describe('getTitleGroup', function () {
        var model = parseFacetModel({
            facet: {
                row: { field: 'a', type: 'ordinal' },
                column: { field: 'a', type: 'ordinal' }
            },
            spec: {
                mark: 'point',
                encoding: {
                    x: { field: 'b', type: 'quantitative' },
                    y: { field: 'c', type: 'quantitative' }
                }
            }
        });
        model.parseScale();
        model.parseLayoutSize();
        model.parseAxisAndHeader();
        describe('for column', function () {
            var columnLabelGroup = getTitleGroup(model, 'column');
            var title = columnLabelGroup.title, columnTitleGroupTopLevelProps = tslib_1.__rest(columnLabelGroup, ["title"]);
            it('returns a header group mark with correct name, role, and type.', function () {
                assert.deepEqual(columnTitleGroupTopLevelProps, {
                    name: 'column-title',
                    type: 'group',
                    role: 'column-title'
                });
            });
            var name = title.text;
            it('contains a correct title definition, including the correct name and orientation', function () {
                assert.deepEqual(title, {
                    text: name,
                    offset: 10,
                    orient: undefined,
                    style: 'guide-title'
                });
            });
        });
        describe('for row', function () {
            var rowTitleGroup = getTitleGroup(model, 'row');
            var title = rowTitleGroup.title, rowTitleGroupTopLevelProps = tslib_1.__rest(rowTitleGroup, ["title"]);
            it('returns a header group mark with correct name, role, and type.', function () {
                assert.deepEqual(rowTitleGroupTopLevelProps, {
                    name: 'row-title',
                    type: 'group',
                    role: 'row-title'
                });
            });
            var name = title.text;
            it('contains a correct title definition, including the correct name and orientation.', function () {
                assert.deepEqual(title, {
                    text: name,
                    offset: 10,
                    orient: 'left',
                    style: 'guide-title'
                });
            });
        });
    });
    describe('getHeaderProperties', function () {
        describe('for title properties', function () {
            var titleSpec = parseFacetModel({
                config: { header: { titleFontSize: 20 } },
                facet: {
                    row: { field: 'a', type: 'ordinal', header: { titleFontSize: 40 } }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            titleSpec.parseScale();
            titleSpec.parseLayoutSize();
            titleSpec.parseAxisAndHeader();
            var config = titleSpec.config;
            var facetFieldDef = titleSpec.component.layoutHeaders['row'].facetFieldDef;
            var headerTitleProps = getHeaderProperties(undefined, facetFieldDef, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP);
            it('should return the correct title property from header', function () {
                assert.deepEqual(headerTitleProps, { fontSize: 40 });
            });
            var configTitleProps = getHeaderProperties(config, undefined, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP);
            it('should return the correct title property from config', function () {
                assert.deepEqual(configTitleProps, { fontSize: 20 });
            });
            var bothTitleProps = getHeaderProperties(config, facetFieldDef, HEADER_TITLE_PROPERTIES, HEADER_TITLE_PROPERTIES_MAP);
            it('should overwrite the config title property with the header title property', function () {
                assert.deepEqual(bothTitleProps, { fontSize: 40 });
            });
        });
        describe('for label properties', function () {
            var labelSpec = parseFacetModel({
                config: { header: { labelFontSize: 20 } },
                facet: {
                    row: { field: 'a', type: 'ordinal', header: { labelFontSize: 40 } }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            labelSpec.parseScale();
            labelSpec.parseLayoutSize();
            labelSpec.parseAxisAndHeader();
            var config = labelSpec.config;
            var facetFieldDef = labelSpec.component.layoutHeaders['row'].facetFieldDef;
            var headerLabelProps = getHeaderProperties(undefined, facetFieldDef, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP);
            it('should return the correct label property from header', function () {
                assert.deepEqual(headerLabelProps, { fontSize: 40 });
            });
            var configLabelProps = getHeaderProperties(config, undefined, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP);
            it('should return the correct label property from config', function () {
                assert.deepEqual(configLabelProps, { fontSize: 20 });
            });
            var bothLabelProps = getHeaderProperties(config, facetFieldDef, HEADER_LABEL_PROPERTIES, HEADER_LABEL_PROPERTIES_MAP);
            it('should overwrite the config label property with the header label property', function () {
                assert.deepEqual(bothLabelProps, { fontSize: 40 });
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map