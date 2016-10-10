/**
 * Our local d3 build. This is so we can use it as we expect:
 * d3.scaleLinear, d3.line, d3.nest, etc.
 */
import * as array from 'd3-array';
import * as collection from 'd3-collection';

export default Object.assign({},
  array,
  collection,
);
