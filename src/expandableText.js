import React from 'react'
import PropTypes from 'prop-types'

import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

export default class ExpandableText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: true,
      numberOfLines: null,
      showExpandView: false,
      containerHeight: 0,
      expandText: 'Expand',
    }
    this.numberOfLines = props.numberOfLines
    this.needExpand = true
    this.measureFlag = true
  }


  onTextLayout(event) {
    if (this.measureFlag) {
      if (this.state.expanded) {
        this.maxHeight = event.nativeEvent.layout.height
        this.setState({ expanded: false, numberOfLines: this.numberOfLines, containerHeight: 'auto' })
      } else {
        this.mixHeight = event.nativeEvent.layout.height
        if (this.mixHeight === this.maxHeight) {
          this.needExpand = false
        } else {
          this.needExpand = true
          this.setState({ showExpandView: true })
        }
        this.measureFlag = false
      }
    }
  }

  onPressExpand() {
    if (!this.state.expanded) {
      this.setState({ numberOfLines: null, expandText: 'Collapse', expanded: true })
      if (this.props.onCollapse) {
        this.props.onCollapse()
      }
    } else {
      this.setState({ numberOfLines: this.numberOfLines, expandText: 'Expand', expanded: false })
      if (this.props.onExpand) {
        this.props.onExpand()
      }
    }
  }

  render() {
    const { numberOfLines, expandTextStyle, ...rest } = this.props
    console.tron.logImportant(this.state.expandText);
    let renderExpandView = <Text style={[this.props.style, styles.expandText, expandTextStyle]}>
      {this.state.expandText}
    </Text>
    const {expandView, unexpandView} = this.props
    if (!this.state.expanded && expandView) {
      renderExpandView = expandView()
    }
    if (this.state.expanded && unexpandView) {
      renderExpandView = unexpandView()
    }
    renderExpandView = this.state.showExpandView ? renderExpandView : null
    return (
      <View style={{height: this.state.containerHeight}}>
        <Text
          numberOfLines={this.state.numberOfLines}
          onLayout={this.onTextLayout.bind(this)}
          {...rest}
        >
          {this.props.children}
        </Text>
        <TouchableOpacity style={{alignSelf: 'flex-end', bottom: this.state.expandText === 'Collapse' ? 20 : 0, backgroundColor: 'white'}} onPress={this.onPressExpand.bind(this)}>
          {renderExpandView}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  expandText: {
    color: 'gray',
    marginTop: 0,
    textAlign: 'center',
  },
})

ExpandableText.propTypes = {
  children: PropTypes.string.isRequired,
  numberOfLines: PropTypes.number,
  expandView: PropTypes.func,
  unexpandView: PropTypes.func,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
}

ExpandableText.defaultProps = {
  numberOfLines: 5,
}
