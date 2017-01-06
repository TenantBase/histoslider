'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Array = require('d3-array');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var histogramStyle = {
  display: 'block'
};

var Histogram = function (_Component) {
  _inherits(Histogram, _Component);

  function Histogram() {
    _classCallCheck(this, Histogram);

    return _possibleConstructorReturn(this, (Histogram.__proto__ || Object.getPrototypeOf(Histogram)).apply(this, arguments));
  }

  _createClass(Histogram, [{
    key: 'selectBucket',
    value: function selectBucket(bucket) {
      this.props.onChange([bucket.start, bucket.end]);
    }
  }, {
    key: 'bucket',
    value: function bucket(data, start, end, ticks) {
      var sorted = data.sort(_d3Array.ascending);
      var buckets = [];
      var tickIndex = 0;
      var s = ticks[tickIndex];
      var i = 0;
      var max = 0;

      while (s < end) {
        var values = [];

        while (sorted[i] < ticks[tickIndex + 1]) {
          values.push(data[i]);
          i++;
        }

        buckets.push({
          start: s,
          end: ticks[tickIndex + 1] || end,
          values: values
        });
        max = values.length > max ? values.length : max;

        tickIndex += 1;
        s = ticks[tickIndex];
      }

      return {
        buckets: buckets,
        max: max
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var innerHeight = this.props.height - this.props.padding;
      var numberOfTicks = 20;
      var ticks = [].concat(_toConsumableArray(Array(numberOfTicks).keys())).map(function (v) {
        return _this2.props.scale.range()[0] + v * (_this2.props.scale.range()[1] - _this2.props.scale.range()[0]) / numberOfTicks;
      }).map(this.props.scale.invert);

      var _bucket = this.bucket(this.props.data, this.props.start, this.props.end, ticks),
          buckets = _bucket.buckets,
          max = _bucket.max;

      var bucketWidth = 100 / buckets.length;
      var selection = this.props.selection;

      var style = this.props.showOnDrag ? {
        position: 'absolute',
        left: '-1px',
        right: '-1px',
        backgroundColor: '#fafafa',
        border: '1px solid #eaeaea',
        borderBottom: 'none',
        bottom: 'calc(100% - ' + this.props.padding + 'px)',
        marginLeft: '5%'
      } : {};

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'svg',
          { style: Object.assign({}, style, histogramStyle), width: '90%', height: this.props.height },
          _react2.default.createElement(
            'g',
            { transform: 'translate(0,' + this.props.height + ')' },
            _react2.default.createElement(
              'g',
              { transform: 'scale(1,-1)' },
              buckets.map(function (bucket, i) {
                var opacity = 0;

                if (selection[0] > bucket.end || selection[1] < bucket.start) {
                  opacity = 0;
                } else if (selection[0] <= bucket.start && selection[1] >= bucket.end) {
                  // Entire block is covered
                  opacity = 1;
                } else if (selection[0] > bucket.start && selection[1] > bucket.end) {
                  opacity = 1 - (selection[0] - bucket.start) / (bucket.end - bucket.start);
                  // Some of left block is covered
                } else if (selection[1] < bucket.end && selection[0] < bucket.start) {
                  // Some of right block is covered
                  opacity = (selection[1] - bucket.start) / (bucket.end - bucket.start);
                } else {
                  // Parital match
                  opacity = (selection[1] - selection[0]) / (bucket.end - bucket.start);
                }

                return _react2.default.createElement(
                  'svg',
                  { key: i, x: _this2.props.scale(bucket.start) + '%' },
                  _react2.default.createElement(
                    'g',
                    null,
                    _react2.default.createElement('rect', {
                      fill: '#f1f1f1',
                      width: _this2.props.scale(bucket.end) - _this2.props.scale(bucket.start) - _this2.props.histogramPadding + '%',
                      height: bucket.values.length / max * innerHeight,
                      rx: _this2.props.barBorderRadius,
                      ry: _this2.props.barBorderRadius,
                      x: _this2.props.histogramPadding / 2
                    }),
                    _react2.default.createElement('rect', {
                      fill: _this2.props.selectionColor,
                      onClick: _this2.selectBucket.bind(_this2, bucket),
                      onDoubleClick: _this2.props.reset.bind(_this2),
                      style: { opacity: opacity, cursor: 'pointer' },
                      width: _this2.props.scale(bucket.end) - _this2.props.scale(bucket.start) - _this2.props.histogramPadding + '%',
                      height: bucket.values.length / max * innerHeight,
                      rx: _this2.props.barBorderRadius,
                      ry: _this2.props.barBorderRadius,
                      x: _this2.props.histogramPadding / 2
                    })
                  )
                );
              })
            )
          )
        )
      );
    }
  }]);

  return Histogram;
}(_react.Component);

exports.default = Histogram;


Histogram.propTypes = {
  data: _react.PropTypes.arrayOf(_react.PropTypes.number).isRequired,
  selection: _react.PropTypes.arrayOf(_react.PropTypes.number).isRequired,
  start: _react.PropTypes.number,
  end: _react.PropTypes.number,
  bucketSize: _react.PropTypes.number,
  height: _react.PropTypes.number,
  padding: _react.PropTypes.number,
  selectionColor: _react.PropTypes.string,
  histogramPadding: _react.PropTypes.number,
  showOnDrag: _react.PropTypes.bool,
  reset: _react.PropTypes.func,
  onChange: _react.PropTypes.func,
  barBorderRadius: _react.PropTypes.number
};

Histogram.defaultProps = {
  barBorderRadius: 0,
  histogramPadding: 1
};
module.exports = exports['default'];
//# sourceMappingURL=Histogram.js.map