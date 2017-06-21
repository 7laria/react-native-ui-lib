import React, {PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import {BaseComponent} from '../../commons';

export default class ListItemPart extends BaseComponent {

  static displayName = 'ListItemPart';

  static propTypes = {
    /**
     * this part content will be aligned to left
     */
    left: PropTypes.bool,
    /**
     * this part content will be aligned to spreaded
     */
    middle: PropTypes.bool,
    /**
     * this part content will be aligned to right
     */
    right: PropTypes.bool,
    /**
     * this part content direction will be row (default)
     */
    row: PropTypes.bool,
    /**
     * this part content direction will be column
     */
    column: PropTypes.bool,
    /**
     * container style
     */
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    testId: PropTypes.string,
  };

  generateStyles() {
    this.styles = createStyles(this.props);
  }

  render() {
    const {containerStyle} = this.props;
    return (
      <View style={[this.styles.container, containerStyle]}>
        {this.props.children}
      </View>
    );
  }
}

function createStyles({left, right, middle, column}) {
  let justifyContent;
  if (!column) {
    justifyContent = 'space-between';
    if (left) {
      justifyContent = 'flex-start';
    }
    if (right) {
      justifyContent = 'flex-end';
    }
    if (middle) {
      justifyContent = 'space-between';
    }
  } else {
    justifyContent = 'center';
  }

  return StyleSheet.create({
    container: {
      flexDirection: column ? undefined : 'row',
      flex: middle ? 1 : 0,
      justifyContent,
      alignItems: column ? undefined : 'center',
    },
  });
}
