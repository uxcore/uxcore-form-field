import React from 'react';
import PropTypes from 'prop-types';
import Constants from 'uxcore-const';
import classnames from 'classnames';
import assign from 'object-assign';
import deepequal from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import Promise from 'lie';
import { polyfill } from 'react-lifecycles-compat';

/* eslint-disable class-methods-use-this */
class FormField extends React.Component {
  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { processValue, value } = nextProps;
    if (!deepequal(value, prevState.prevValue)) {
      const newValue = typeof processValue === 'function' ? processValue(cloneDeep(value)) : value;
      const newState = {
        value: newValue,
        formatValue: FormField.formatValue(value),
        fromReset: true,
        prevValue: value,
      };
      return newState;
    }
    return null;
  };

  static formatValue = value => value;

  static getValidateStatus = ({ force, always, props, value }) => {
    let instant = true;
    const async = props.asyncValidate || false;
    const defaultPassStatus = {
      error: false,
    };
    if ('instantValidate' in props) {
      instant = props.instantValidate;
    } else {
      instant = props.jsxinstant;
    }
    const rules = props.jsxrules;
    // `force` has the top priority, `undefined` is not equal to `false`
    // `instant` has the sceond priority here
    // eternalsky@2016.03.15
    if (force === true || (force !== false && instant)) {
      if (rules) {
        if (!async) {
          const error = FormField.isDirty({ always, value, rules });
          return {
            error: error.isDirty,
            errMsg: error.errMsg,
          };
        }
        return new Promise((resolve) => {
          FormField.isDirty({ always, async, rules, value }).then((errMsg) => {
            if (typeof errMsg === 'string') {
              resolve({
                error: true,
                errMsg,
              });
            }
          }).catch((err) => {
            if (typeof err === 'object' && err.stack) {
              console.error(err.stack);
            } else {
              resolve(defaultPassStatus);
            }
          });
        });
      }
      return defaultPassStatus;
    }
    return defaultPassStatus;
  };

  static isDirty = ({ always, async = false, value, rules = [] }) => {
    let isDirty = false;
    let errMsg = '';
    if (!async) {
      if (typeof rules === 'object' && !Array.isArray(rules)) {
        isDirty = (always === undefined) ? !rules.validator(value) : !always;
        errMsg = rules.errMsg;
      } else if (Array.isArray(rules)) {
        for (let i = 0; i < rules.length; i++) {
          isDirty = (always === undefined) ? !rules[i].validator(value) : !always;
          if (isDirty) {
            errMsg = rules[i].errMsg;
            break;
          }
        }
      }
      return {
        isDirty,
        errMsg,
      };
    }
    if (typeof rules !== 'function') {
      console.error('Form Validate: In async validation mode,'
        + ' jsxrules(rules) should be a function');
      return {
        isDirty: false,
      };
    }
    return new Promise((resolve, reject) => {
      rules(value, reject, resolve);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      formatValue: FormField.formatValue(props.value),
      error: false,
      errMsg: '',
      prevValue: props.value,
    };
  }

  componentDidMount() {
    const me = this;
    if (!me.props.standalone) {
      me.props.attachFormField(me);
      me.props.handleDataChange(me, {
        value: me.props.value,
        pass: true,
      }, true);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const me = this;
  //   if (!deepequal(nextProps.value, me.props.value)) {
  //     me.handleDataChange(nextProps.value, true, true, true);
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.handleDataChange && !deepequal(prevState.value, this.state.value)) {
      this.props.handleDataChange(this, {
        value: this.state.value,
        pass: !this.state.error,
      }, true);
    }
  }

  componentWillUnmount() {
    const me = this;
    if (!me.props.standalone) {
      this.props.detachFormField(this);
    }
  }

  getGridLayoutPercent(index) {
    const me = this;
    const gridLayout = me.props.gridLayout || me.props.jsxGridLayout;
    const newGrid = [gridLayout[0] || 6, gridLayout[1] || 12];
    return `${(newGrid[index] * 100) / (24 - (index === 1 ? newGrid[0] : 0))}%`;
  }

  getSize() {
    const me = this;
    return me.props.size || me.props.jsxsize;
  }

  getProps() {
    return this.props;
  }

  getLabelContentNode() {
    return this.labelContent;
  }

  getLabelNode() {
    return this.label;
  }

  getTipsNode() {
    return this.tips;
  }

  getRequiredNode() {
    return this.required;
  }

  getErrorNode() {
    return this.errorNode;
  }

  getFieldCore() {
    return this.fieldCore;
  }

  getName() {
    return this.props.jsxname;
  }

  getValue() {
    return this.formatValue(this.state.value);
  }

  setValue(value, fromReset, fromPropsChange, next) {
    const me = this;
    const { standalone, validateOnBlur, asyncValidate } = me.props;
    let newState = {
      value,
      formatValue: me.formatValue(value),
      /*
       * why set state fromReset? some field like editor cannot be reset in the common way
       * so set this state to tell the field that you need to reset by yourself.
       */
      fromReset: !!fromReset,
    };
    let pass = true;
    // validateOnBlur only support InputFormField & TextAraeFormField now
    if (!fromReset && !standalone && !validateOnBlur) {
      if (!asyncValidate) {
        const validatePass = me.getValidateStatus({ value });
        newState = { ...newState, ...validatePass };
        pass = !validatePass.error;
      } else {
        me.doValidate(undefined, undefined, value);
      }
    }
    if (fromReset && fromPropsChange === undefined) {
      newState.error = false;
    }
    me.setState(newState, () => {
      if (next && typeof next === 'function') {
        next(pass);
      }
    });
  }

  getDataProps() {
    const dataProps = {};
    Object.keys(this.props).forEach((propName) => {
      if (/^data-/.test(propName)) {
        dataProps[propName] = this.props[propName];
      }
    });
    return dataProps;
  }

  getDom() {
    return this.fieldRoot;
  }

  getValidateStatus({ force, always, value }) {
    return FormField.getValidateStatus({ force, always, props: this.props, value });
  }

  /*
   * Fired when field value changes，update form's state and then trigger re-render.
   * @param fromReset {boolean} if handleDataChange is invoked by form's resetValues,
   */

  handleDataChange(value, fromReset, silence, fromPropsChange) {
    const me = this;
    const { processValue, handleDataChange } = me.props;
    const newValue = typeof processValue === 'function' ? processValue(cloneDeep(value)) : value;
    me.setValue(newValue, fromReset, fromPropsChange, (pass) => {
      if (handleDataChange) {
        handleDataChange(me, {
          value: newValue,
          pass,
        }, silence);
      }
    });
  }


  /**
   * @return {boolean} if validate pass, return true, or, return false
   * if no rule, it means validate pass.
   */

  doValidate(force, always, value = this.state.value) {
    const status = this.getValidateStatus({ force, always, value });
    if (status.then) {
      return new Promise((resolve) => {
        status.then((stat) => {
          this.setState(stat);
          resolve(!status.error);
        });
      });
    }
    this.setState(status);
    return !status.error;
  }

  /*
   * rule can be an object, containing errMsg & validator,
   * and rule can also be an array containing such objects.
   * this func will check them one by one, and return false
   * unless all rules pass
   */

  isDirty(always, async = false) {
    return FormField.isDirty({
      always,
      async,
      value: this.state.value,
      rules: this.props.jsxrules,
    });
  }

  isMessageError() {
    const { standalone, message } = this.props;
    return standalone && message && message.type === 'error';
  }


  addSpecificClass() {
    return '';
  }

  /*
   * You should rewrite this method，when you need to format the value as you concern.
   */

  formatValue(value) {
    return value;
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  shouldLayoutAsGrid() {
    const me = this;
    const gridLayout = me.props.gridLayout || me.props.jsxGridLayout;
    const align = me.props.verticalAlign || me.props.jsxVerticalAlign;
    return !align && Array.isArray(gridLayout) && gridLayout.length > 0;
  }

  renderTips() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    if (mode !== Constants.MODE.EDIT) return null;
    if (me.props.standalone && me.props.message && me.props.message.type === 'tip') {
      return (
        <li className="kuma-uxform-tips">
          <span ref={me.saveRef('tips')} className="kuma-uxform-message-content">{me.props.message.message}</span>
        </li>
      );
    }
    if (!!this.props.jsxtips && !me.state.error) {
      return (
        <li className="kuma-uxform-tips">
          <span className="kuma-uxform-message-content" ref={me.saveRef('tips')}>{this.props.jsxtips}</span>
        </li>
      );
    }
    return null;
  }

  /*
   * You should rewrite this method, when you are developing a new type of form field.
   */

  renderField() {}

  renderFieldAddon() {
    const mode = this.props.jsxmode || this.props.mode;
    return this.props.renderFieldAddon({ mode });
  }

  renderErrorMsg() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    if (mode !== Constants.MODE.EDIT) return null;
    if (this.isMessageError()) {
      return (
        <li className="kuma-uxform-errormsg">
          <span ref={me.saveRef('errorNode')} className="kuma-uxform-message-content">{me.props.message.message}</span>
        </li>
      );
    }
    if (me.state.error) {
      return (
        <li className="kuma-uxform-errormsg">
          <span ref={me.saveRef('errorNode')} className="kuma-uxform-message-content">{me.state.errMsg}</span>
        </li>
      );
    }
    return null;
  }

  renderLabelContent() {
    const me = this;
    const contentProps = {
      className: 'label-content',
      ref: me.saveRef('labelContent'),
    };
    if (React.isValidElement(me.props.jsxlabel)) {
      contentProps.children = me.props.jsxlabel;
    } else {
      contentProps.dangerouslySetInnerHTML = {
        __html: me.props.jsxlabel,
      };
    }
    return (
      <span
        {...contentProps}
      />
    );
  }

  renderLabel() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    // jsxVerticalAlign is an internal varible.
    let align = me.props.verticalAlign;
    if (align === undefined) {
      align = me.props.jsxVerticalAlign;
    }
    const style = {
      width: me.props.labelWidth,
    };
    if (this.shouldLayoutAsGrid()) {
      style.width = this.getGridLayoutPercent(0);
    }
    if (me.props.jsxshowLabel) {
      return (
        <label
          key="label"
          ref={this.saveRef('label')}
          className={classnames({
            'kuma-label': true,
            'vertical-align': align,
            'label-match-input-height': (me.props.labelMatchInputHeight && mode === Constants.MODE.EDIT),
          })}
          style={style}
        >
          <span className="required" ref={me.saveRef('required')}>
            {(me.props.required && mode === Constants.MODE.EDIT) ? '* ' : ''}
          </span>
          {this.renderLabelContent()}
        </label>
      );
    }
    return null;
  }

  renderContent() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    const align = me.props.verticalAlign || me.props.jsxVerticalAlign;
    const { jsxshowLabel } = me.props;
    const fieldStyle = {
      width: this.shouldLayoutAsGrid() ? this.getGridLayoutPercent(1) : undefined,
    };
    if (me.props.labelMatchInputHeight && mode === Constants.MODE.EDIT) {
      const tips = me.renderTips();
      const errorMsg = me.renderErrorMsg();
      return [
        <div
          key="content"
          style={{
            display: 'table',
          }}
        >
          {me.renderLabel()}
          <ul
            className={classnames({
              'kuma-uxform-field-content': true,
              'view-mode': mode === Constants.MODE.VIEW,
              'edit-mode': mode === Constants.MODE.EDIT,
              'has-error': !!me.state.error || this.isMessageError(),
            })}
            style={fieldStyle}
          >
            <li
              ref={me.saveRef('fieldCore')}
              className="kuma-uxform-field-core"
            >
              {me.renderField()}
              {me.renderFieldAddon()}
            </li>
          </ul>
        </div>,
        (tips || errorMsg) ? <div
          key="tip"
          className="kuma-uxform-tip-box"
          style={{
            display: 'table',
            width: '100%',
          }}
        >
          {(!align && jsxshowLabel) ? (
            <label
              className={classnames({
                'kuma-label': true,
              })}
              style={{
                width: this.shouldLayoutAsGrid() ? this.getGridLayoutPercent(0) : undefined,
              }}
            />
          ) : null}
          <ul style={fieldStyle}>
            {me.renderTips()}
            {me.renderErrorMsg()}
          </ul>
        </div> : null,
      ];
    }
    return [
      me.renderLabel(),
      <ul
        key="content"
        className={classnames({
          'kuma-uxform-field-content': true,
          'view-mode': mode === Constants.MODE.VIEW,
          'edit-mode': mode === Constants.MODE.EDIT,
          'has-error': !!me.state.error || this.isMessageError(),
        })}
        style={fieldStyle}
      >
        <li
          key="core"
          ref={me.saveRef('fieldCore')}
          className="kuma-uxform-field-core"
        >
          {me.renderField()}
          {me.renderFieldAddon()}
        </li>
        {me.renderTips()}
        {me.renderErrorMsg()}
      </ul>,
    ];
  }

  render() {
    const me = this;
    const specificCls = me.addSpecificClass();
    const mode = me.props.jsxmode || me.props.mode;
    const align = me.props.verticalAlign || me.props.jsxVerticalAlign;
    const dataProps = this.getDataProps();
    const style = {};
    if (!me.props.standalone) {
      style.width = `${(me.props.jsxflex / me.props.totalFlex) * 100}%`;
    }
    const size = this.getSize();
    return (
      <div
        className={classnames({
          [me.props.jsxprefixCls]: true,
          [specificCls]: !!specificCls,
          [`${me.props.jsxprefixCls}-${size}`]: !!size,
          [me.props.className]: !!me.props.className,
          [`${me.props.jsxprefixCls}__layout-${align ? 'v' : 'h'}`]: true,
          [`${me.props.jsxprefixCls}__view`]: mode === Constants.MODE.VIEW,
          [`${me.props.jsxprefixCls}__input-box-${me.props.inputBoxMaxWidth}`]: ['middle', 'large'].indexOf(me.props.inputBoxMaxWidth) !== -1,
          // all view mode in a formrow
          [`${me.props.jsxprefixCls}__all-view`]: !!me.props.isAllViewMode,
        })}
        style={assign({}, style, {
          display: me.props.jsxshow ? 'table' : 'none',
        })}
        ref={(c) => { this.fieldRoot = c; }}
        {...dataProps}
      >
        {me.renderContent()}
      </div>
    );
  }
}

FormField.propTypes = {
  instantValidate: PropTypes.bool,
  verticalAlign: PropTypes.bool,
  labelMatchInputHeight: PropTypes.bool,
  value: PropTypes.any,
  jsxshow: PropTypes.bool,
  mode: PropTypes.string,
  jsxmode: PropTypes.string,
  jsxshowLabel: PropTypes.bool,
  jsxprefixCls: PropTypes.string,
  jsxflex: PropTypes.number,
  jsxname: PropTypes.string.isRequired,
  jsxlabel: PropTypes.node,
  jsxtips: PropTypes.string,
  jsxrules: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.func,
  ]),
  totalFlex: PropTypes.number,
  standalone: PropTypes.bool,
  required: PropTypes.bool,
  attachFormField: PropTypes.func,
  detachFormField: PropTypes.func,
  getValues: PropTypes.func,
  resetValues: PropTypes.func,
  handleDataChange: PropTypes.func,
  processValue: PropTypes.func,
  style: PropTypes.object,
  labelWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  inputBoxMaxWidth: PropTypes.oneOf(['middle', 'large']),
  gridLayout: PropTypes.array,
  message: PropTypes.object,
  renderFieldAddon: PropTypes.func,
};

FormField.defaultProps = {
  labelMatchInputHeight: false,
  jsxshow: true,
  jsxshowLabel: true,
  jsxprefixCls: 'kuma-uxform-field',
  formPrefixCls: 'kuma-uxform',
  jsxflex: 1,
  jsxname: '',
  jsxlabel: '',
  jsxtips: '',
  standalone: false,
  mode: Constants.MODE.EDIT,
  required: false,
  renderFieldAddon: () => {},
};

FormField.displayName = 'FormField';

polyfill(FormField);

export default FormField;
