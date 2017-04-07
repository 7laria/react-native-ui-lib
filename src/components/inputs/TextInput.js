import React, {PropTypes} from 'react';
import {View, TextInput as RNTextInput, StyleSheet, Animated} from 'react-native';
import _ from 'lodash';
import BaseInput from './BaseInput';
import Text from '../text';
import {Colors, Typography} from '../../style';
import {Constants} from '../../helpers';
import {Modal} from '../../screensComponents';
import TextArea from './TextArea';

export default class TextInput extends BaseInput {

  static displayName = 'TextInput';
  static propTypes = {
    ...RNTextInput.propTypes,
    ...BaseInput.propTypes,
    /**
     * should placeholder have floating behavior
     */
    floatingPlaceholder: PropTypes.bool,
    /**
     * hide text input underline, by default false
     */
    hideUnderline: PropTypes.bool,
    /**
     * should text input be align to center
     */
    centered: PropTypes.bool,
    /**
     * input error message, should be empty if no error exists
     */
    error: PropTypes.string,
    /**
     * should the input component support error messages
     */
    enableErrors: PropTypes.bool,
    /**
     * should the input expand to another text area modal
     */
    expandable: PropTypes.bool,
    testId: PropTypes.string,
  };

  static defaultProps = {
    placeholderTextColor: Colors.dark60,
    enableErrors: true,
  }

  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.updateFloatingPlaceholderState = this.updateFloatingPlaceholderState.bind(this);
    this.toggleExpandableModal = this.toggleExpandableModal.bind(this);
    this.onDoneEditingExpandableInput = this.onDoneEditingExpandableInput.bind(this);

    const typography = this.getTypography();
    this.state = {
      inputWidth: typography.fontSize * 2,
      widthExtendBreaks: [],
      value: props.value,
      floatingPlaceholderState: new Animated.Value(this.hasText(props.value) ? 1 : 0),
      showExpandableModal: false,
    };
  }

  generateStyles() {
    this.styles = createStyles(this.props);
  }

  getUnderlineStyle() {
    const {focused} = this.state;
    const {error} = this.props;
    if (error) {
      return this.styles.errorUnderline;
    } else if (focused) {
      return this.styles.focusedUnderline;
    }

    return null;
  }

  hasText(value) {
    return !_.isEmpty(value || this.state.value);
    // const {value} = this.state;
    // return value && value.length > 0;
  }

  renderPlaceholder() {
    const {floatingPlaceholderState} = this.state;
    const {floatingPlaceholder, centered, expandable, placeholder} = this.props;
    const typography = this.getTypography();

    if (!floatingPlaceholder && !centered && !expandable) {
      return null;
    }

    if (centered && this.hasText()) {
      return null;
    }

    return (
      <Animated.Text
        style={[
          this.styles.placeholder,
          typography,
          centered && this.styles.placeholderCentered,
          !centered && {
            top: floatingPlaceholderState.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
            fontSize: floatingPlaceholderState.interpolate({
              inputRange: [0, 1],
              outputRange: [typography.fontSize, Typography.text80.fontSize],
            }),
            lineHeight: this.hasText() ? Typography.text80.lineHeight : typography.lineHeight,
          },
        ]}
        onPress={() => expandable && this.toggleExpandableModal(true)}
      >
        {placeholder}
      </Animated.Text>
    );
  }

  renderError() {
    const {enableErrors, error} = this.props;
    if (enableErrors) {
      return (
        <Text style={this.styles.errorMessage}>{error}</Text>
      );
    }
  }

  renderExpandableModal() {
    const {showExpandableModal} = this.state;
    return (
      <Modal
        animationType={'slide'}
        visible={showExpandableModal}
        onRequestClose={() => this.toggleExpandableModal(false)}
      >
        <Modal.TopBar
          onCancel={() => this.toggleExpandableModal(false)}
          onDone={this.onDoneEditingExpandableInput}
        />
        <View style={this.styles.expandableModalContent}>
          <TextArea
            ref={(textarea) => { this.expandableInput = textarea; }}
            {...this.props}
            value={this.state.value}
          />
        </View>
      </Modal>
    );
  }

  renderExpandableInput() {
    const typography = this.getTypography();
    const {value} = this.state;

    return (
      <Text
        style={[this.styles.input, typography]}
        numberOfLines={3}
        onPress={() => this.toggleExpandableModal(true)}
      >
        {value}
      </Text>
    );
  }

  renderTextInput() {
    const color = this.props.color || this.extractColorValue();
    const typography = this.getTypography();
    const {style, placeholder, floatingPlaceholder, centered, multiline, ...others} = this.props;
    const {inputWidth, value} = this.state;
    const inputStyle = [
      this.styles.input,
      typography,
      color && {color},
      style,
      {height: (multiline && !centered) ? typography.lineHeight * 3 : typography.lineHeight},
      centered && {width: inputWidth},
    ];

    return (
      <RNTextInput
        {...others}
        value={value}
        placeholder={(floatingPlaceholder || centered) ? undefined : placeholder}
        underlineColorAndroid="transparent"
        style={inputStyle}
        multiline={centered || multiline}
        onChangeText={this.onChangeText}
        onContentSizeChange={this.onContentSizeChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        ref={(input) => { this.input = input; }}
      />
    );
  }

  render() {
    const {expandable, containerStyle} = this.props;
    const underlineStyle = this.getUnderlineStyle();

    return (
      <View style={[this.styles.container, underlineStyle, containerStyle]}>
        <View style={this.styles.innerContainer}>
          {this.renderPlaceholder()}
          {expandable ? this.renderExpandableInput() : this.renderTextInput()}
          {this.renderExpandableModal()}
        </View>
        {this.renderError()}
      </View>
    );
  }

  toggleExpandableModal(value) {
    this.setState({showExpandableModal: value});
  }

  updateFloatingPlaceholderState(withoutAnimation) {
    if (withoutAnimation) {
      this.state.floatingPlaceholderState.setValue(this.hasText() ? 1 : 0);
    } else {
      Animated.spring(
        this.state.floatingPlaceholderState,
        {
          toValue: this.hasText() ? 1 : 0,
          duration: 150,
        },
      ).start();
    }
  }

  onDoneEditingExpandableInput() {
    const expandableInputValue = _.get(this.expandableInput, 'state.value');
    this.setState({
      value: expandableInputValue,
    });
    this.state.floatingPlaceholderState.setValue(expandableInputValue ? 1 : 0);
    _.invoke(this.props, 'onChangeText', expandableInputValue);
    this.toggleExpandableModal(false);
  }

  onChangeText(text) {
    _.invoke(this.props, 'onChangeText', text);

    this.setState({
      value: text,
    }, this.updateFloatingPlaceholderState);

    const {widthExtendBreaks, width} = this.state;
    if (text.length < _.last(widthExtendBreaks)) {
      const typography = this.getTypography();
      this.setState({
        inputWidth: width - typography.fontSize,
        widthExtendBreaks: widthExtendBreaks.slice(-1),
      });
    }
  }

  onContentSizeChange(event) {
    const {multiline, centered} = this.props;
    if (multiline && !centered) return;
    const typography = this.getTypography();
    const initialHeight = typography.lineHeight + 10;
    const {width, height} = event.nativeEvent.contentSize;
    const {widthExtendBreaks, value} = this.state;
    if (height > initialHeight) {
      this.setState({
        inputWidth: width + typography.fontSize,
        widthExtendBreaks: widthExtendBreaks.concat(value.length),
      });
    }
  }
}

function createStyles({placeholderTextColor, hideUnderline, centered}) {
  return StyleSheet.create({
    container: {
    },
    innerContainer: {
      flexDirection: 'row',
      borderBottomWidth: hideUnderline ? 0 : 1,
      borderColor: Colors.dark80,
      justifyContent: centered ? 'center' : undefined,
      paddingTop: 20,
    },
    focusedUnderline: {
      borderColor: Colors.blue30,
    },
    errorUnderline: {
      borderColor: Colors.red30,
    },
    input: {
      flex: (centered && Constants.isIOS) ? undefined : 1,
      marginBottom: 10,
      padding: 0,
      textAlign: centered ? 'center' : undefined,
      minWidth: 40,
      backgroundColor: 'transparent',
    },
    placeholder: {
      position: 'absolute',
      color: placeholderTextColor,
    },
    placeholderCentered: {
      left: 0,
      right: 0,
      textAlign: 'center',
    },
    errorMessage: {
      color: Colors.red30,
      ...Typography.text90,
      height: Typography.text90.lineHeight,
      textAlign: centered ? 'center' : undefined,
      marginTop: 1,
    },
    expandableModalContent: {
      flex: 1,
      paddingTop: 15,
      paddingHorizontal: 20,
    },
  });
}
