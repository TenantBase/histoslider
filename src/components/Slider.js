  import React, { Component, PropTypes } from 'react'
  import { format } from 'd3-format'

const sliderStyle = {
  display: 'block',
  paddingBottom: '8px',
  zIndex: '2',
  marginLeft: '5%',
}

const handleStyle = {
  cursor: 'move'
}

export default class Slider extends Component {

  componentDidMount () {
    window.addEventListener('mousemove', this.mouseMove.bind(this), false)
    window.addEventListener('mouseup', this.dragEnd.bind(this), false)
    window.addEventListener('touchmove', this.mouseMove.bind(this), false)
    window.addEventListener('touchend', this.dragEnd.bind(this), false)
  }

  componentWilUnmount () {
    window.removeEventListener('mousemove', this.mouseMove.bind(this), false)
    window.removeEventListener('mouseup', this.dragEnd.bind(this), false)
    window.removeEventListener('touchmove', this.mouseMove.bind(this), false)
    window.removeEventListener('touchend', this.dragEnd.bind(this), false)
  }

  constructor () {
    super()
    this.state = {
      dragging: false
    }
  }

  dragStart (index, e) {
    e.stopPropagation()
    if (!this.state.dragging) {
      this.setState({
        dragging: true,
        dragIndex: index
      }, () => {
        this.props.dragChange(true)
      })
    }
  }

  dragEnd (e) {
    e.stopPropagation()
    this.setState({
      dragging: false
    }, () => {
      this.props.dragChange(false)
    })
  }

  dragFromSVG (e) {
    if (!this.state.dragging) {
      const x = (e.nativeEvent.layerX || e.nativeEvent.touches[0].pageX) / $('.Histoslider').width() * 100;
      let selection = [...this.props.selection]
      let selected = this.props.scale.invert(x)
      let dragIndex

      if (Math.abs(selected - selection[0]) > Math.abs(selected - selection[1])) {
        selection[1] = selected
        dragIndex = 0
      } else {
        selection[0] = selected
        dragIndex = 1
      }

      this.props.onChange(selection)
      this.setState({
        dragging: true,
        dragIndex
      }, () => {
        this.props.dragChange(true)
      })
    }
  }

  mouseMove (e) {
    if (this.state.dragging) {
      let selection = [...this.props.selection]
      selection[this.state.dragIndex] = this.props.scale.invert((e.layerX || e.touches[0].pageX) / $('.Histoslider').width() * 100);
      this.props.onChange(selection)
    }
  }

  render () {
    const selection = this.props.selection
    const selectionWidth = Math.abs(this.props.scale(selection[1]) - this.props.scale(selection[0]))
    const f = format(this.props.selectionFormat);

    return (
      <svg
        style={sliderStyle}
        height={this.props.height - 10}
        x='5%'
        width={'90%'}
        onMouseDown={this.dragFromSVG.bind(this)}
        onTouchStart={this.dragFromSVG.bind(this)}
        onDoubleClick={this.props.reset}
      >
        <rect
          height={4}
          fill={'#f1f1f1'}
          x={'0%'}
          y={10}
          width={'100%'}
        />
        <rect
          height={4}
          fill={this.props.selectionColor}
          x={this.props.scale(this.props.selectionSorted[0]) + '%'}
          y={10}
          width={selectionWidth + '%'}
        />
        {
          this.props.selection.map((m, i) => {
            return (
              <svg x={this.props.scale(m) + '%'} key={i}>
              <g transform={'translate(0, 0)'}>
                <circle
                  style={handleStyle}
                  r={10}
                  cx={0}
                  cy={12.5}
                  fill='#ddd'
                  strokeWidth='1'
                />
                <circle
                  style={handleStyle}
                  onMouseDown={this.dragStart.bind(this, i)}
                  onTouchStart={this.dragStart.bind(this, i)}
                  r={9}
                  cx={0}
                  cy={12}
                  fill='white'
                  stroke='#ccc'
                  strokeWidth='1'
                />
                <text
                  textAnchor='middle'
                  x={0}
                  y={36}
                  fill='#666'
                  fontSize={12}
                >
                  {this.props.sliderPrefix + f(m)}
                </text>
              </g>
              </svg>
            )
          })
        }
      </svg>
    )
  }
}

Slider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  selection: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectionSorted: PropTypes.arrayOf(PropTypes.number).isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  bucketSize: PropTypes.number,
  selectionColor: PropTypes.string,
  histogramPadding: PropTypes.number,
  scale: PropTypes.func,
  reset: PropTypes.func,
  dragChange: PropTypes.func,
  onChange: PropTypes.func,
  selectionFormat: PropTypes.string,
  sliderPrefix: PropTypes.string,
}
