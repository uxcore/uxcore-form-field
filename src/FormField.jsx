import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import Constants from 'uxcore-const';
import classnames from 'classnames';
import assign from 'object-assign';
import isEqualWith from 'lodash/isEqualWith';
import cloneDeep from 'lodash/cloneDeep';
import Promise from 'lie';
import { polyfill } from 'react-lifecycles-compat';
import Tooltip from 'uxcore-tooltip';
import Icon from 'uxcore-icon';
import Validator from 'uxcore-validator';

// eslint-disable-next-line consistent-return
const deepequal = (value, other) => isEqualWith(value, other, (a, b) => {
  if (isValidElement(a) || isValidElement(b)) {
    return a === b;
  }
});

/* eslint-disable class-methods-use-this */
class FormField extends React.Component {
  static formatValue = value => value;

  static isDirty = ({
    always, async = false, value, rules = [],
  }) => {
    let isDirty = false;
    let errMsg = '';
    if (!async) {
      if (typeof rules === 'object' && !Array.isArray(rules)) {
        isDirty = (always === undefined) ? !rules.validator(value) : !always;
        ({ errMsg } = rules);
      } else if (Array.isArray(rules)) {
        for (let i = 0; i < rules.length; i++) {
          isDirty = (always === undefined) ? !rules[i].validator(value) : !always;
          if (isDirty) {
            ({ errMsg } = rules[i]);
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

  componentDidUpdate(prevProps, prevState) {
    const { handleDataChange } = this.props;
    const { value, error } = this.state;
    if (handleDataChange && !deepequal(prevState.value, value)) {
      handleDataChange(this, {
        value,
        pass: !error,
      }, true);
    }
  }

  componentWillUnmount() {
    const { standalone, detachFormField } = this.props;
    if (!standalone) {
      detachFormField(this);
    }
  }
  static getRules(props) {
    const { asyncValidate, jsxrules, required, requiredErrMsg } = props;
    if (asyncValidate || !required || !requiredErrMsg) {
      return jsxrules
    }
    const emptyCheck = {
      validator: Validator.isNotEmptyIncludeFalse,
      errMsg: requiredErrMsg || '必填字段'
    }
    if (!jsxrules) {
      return emptyCheck
    } else {
      if (Array.isArray(jsxrules)) {
        return [
          ...jsxrules,
          emptyCheck
        ]
      } else {
        if (typeof jsxrules === 'object' && jsxrules.validator) {
          return [
            jsxrules,
            emptyCheck
          ]
        }
      }
    }
  }

  static getValidateStatus = ({
    force, always, props, value,
  }) => {
    let instant = true;
    const async = props.asyncValidate || false;
    const defaultPassStatus = {
      error: false,
    };
    if (props.instantValidate !== undefined) {
      instant = props.instantValidate;
    } else {
      instant = props.jsxinstant;
    }
    const rules = FormField.getRules(props);
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
          FormField.isDirty({
            always, async, rules, value,
          }).then((errMsg) => {
            resolve({
              error: true,
              errMsg,
            });
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
    const { jsxname } = this.props;
    return jsxname;
  }

  getValue() {
    const { value } = this.state;
    return this.formatValue(value);
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
    return FormField.getValidateStatus({
      force, always, props: this.props, value,
    });
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
          resolve(!stat.error);
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
    const { value } = this.state;
    const { jsxrules } = this.props;
    return FormField.isDirty({
      always,
      async,
      value,
      rules: jsxrules,
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
    const { jsxtips, formPrefixCls, tipInLabel, showTipAlways } = this.props;
    if ((mode !== Constants.MODE.EDIT || tipInLabel) && !showTipAlways) return null;
    if (me.props.standalone && me.props.message && me.props.message.type === 'tip') {
      return (
        <li className={`${formPrefixCls}-tips`}>
          <span ref={me.saveRef('tips')} className={`${formPrefixCls}-message-content`}>
            {me.props.message.message}
          </span>
        </li>
      );
    }
    if (!!jsxtips && !me.state.error) {
      return (
        <li className={`${formPrefixCls}-tips`}>
          <span className={`${formPrefixCls}-message-content`} ref={me.saveRef('tips')}>
            {jsxtips}
          </span>
        </li>
      );
    }
    return null;
  }

  /*
   * You should rewrite this method, when you are developing a new type of form field.
   */

  renderField() { }

  renderFieldAddon() {
    const { jsxmode, mode, renderFieldAddon } = this.props;
    const trueMode = jsxmode || mode;
    return renderFieldAddon({ mode: trueMode });
  }

  renderErrorMsg() {
    const me = this;
    const { formPrefixCls } = this.props;
    const mode = me.props.jsxmode || me.props.mode;
    if (mode !== Constants.MODE.EDIT) return null;
    if (this.isMessageError()) {
      return (
        <li className={`${formPrefixCls}-errormsg`}>
          <span ref={me.saveRef('errorNode')} className={`${formPrefixCls}-message-content`}>
            {me.props.message.message}
          </span>
        </li>
      );
    }
    if (me.state.error) {
      return (
        <li className={`${formPrefixCls}-errormsg`}>
          <span ref={me.saveRef('errorNode')} className={`${formPrefixCls}-message-content`}>
            {me.state.errMsg}
          </span>
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

  renderTipInLabel() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    const {
      jsxtips, message, standalone, tipInLabel, jsxprefixCls,
    } = this.props;
    if (mode !== Constants.MODE.EDIT || !tipInLabel) return null;
    const tip = standalone ? message.message : jsxtips;
    if (tip) {
      return (
        <Tooltip
          overlay={(
            <div style={{ maxWidth: 400 }}>
              {tip}
            </div>
          )}
          placement="topLeft"
        >
          <Icon
            name="tishi-full"
            className={`${jsxprefixCls}-tip-icon`}
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              marginLeft: 4,
            }}
          />
        </Tooltip>
      );
    }
    return null;
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
          <span style={{
            display: me.props.tipInLabel ? 'inline-block' : 'inline',
            maxWidth: 'calc(100% - 20px)',
          }}
          >
            <span className="required" ref={me.saveRef('required')}>
              {(me.props.required && mode === Constants.MODE.EDIT) ? '* ' : ''}
            </span>
            {this.renderLabelContent()}
          </span>
          {this.renderTipInLabel()}
        </label>
      );
    }
    return null;
  }

  renderContent() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    const align = me.props.verticalAlign || me.props.jsxVerticalAlign;
    const { jsxshowLabel, jsxprefixCls, formPrefixCls } = me.props;
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
              [`${jsxprefixCls}-content`]: true,
              'view-mode': mode === Constants.MODE.VIEW,
              'edit-mode': mode === Constants.MODE.EDIT,
              'has-error': !!me.state.error || this.isMessageError(),
            })}
            style={fieldStyle}
          >
            <li
              ref={me.saveRef('fieldCore')}
              className={`${jsxprefixCls}-core`}
            >
              {me.renderField()}
              {me.renderFieldAddon()}
            </li>
          </ul>
        </div>,
        (tips || errorMsg) ? (
          <div
            key="tip"
            className={`${formPrefixCls}-tip-box`}
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
          </div>
        ) : null,
      ];
    }
    return [
      me.renderLabel(),
      <ul
        key="content"
        className={classnames({
          [`${jsxprefixCls}-content`]: true,
          'view-mode': mode === Constants.MODE.VIEW,
          'edit-mode': mode === Constants.MODE.EDIT,
          'has-error': !!me.state.error || this.isMessageError(),
        })}
        style={fieldStyle}
      >
        <li
          key="core"
          ref={me.saveRef('fieldCore')}
          className={`${jsxprefixCls}-core`}
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
  formPrefixCls: PropTypes.string,
  tipInLabel: PropTypes.bool,
  requiredErrMsg: PropTypes.string,
  showTipAlways: PropTypes.bool
};

FormField.defaultProps = {
  labelMatchInputHeight: false,
  jsxshow: true,
  jsxshowLabel: true,
  jsxprefixCls: 'kuma-uxform-field',
  formPrefixCls: 'kuma-uxform',
  jsxflex: 1,
  jsxlabel: '',
  jsxtips: '',
  standalone: false,
  mode: Constants.MODE.EDIT,
  required: false,
  renderFieldAddon: () => { },
  attachFormField: undefined,
  detachFormField: undefined,
  getValues: undefined,
  resetValues: undefined,
  handleDataChange: undefined,
  processValue: undefined,
  style: {},
  labelWidth: undefined,
  inputBoxMaxWidth: undefined,
  gridLayout: undefined,
  message: undefined,
  instantValidate: undefined,
  verticalAlign: undefined,
  value: undefined,
  jsxmode: undefined,
  jsxrules: undefined,
  totalFlex: undefined,
  tipInLabel: false,
  requiredErrMsg: '',
  showTipAlways: false
};

FormField.displayName = 'FormField';

polyfill(FormField);

export default FormField;
