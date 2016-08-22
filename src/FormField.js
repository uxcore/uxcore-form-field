const React = require('react');
const Constants = require('uxcore-const');
const classnames = require('classnames');
const assign = require('object-assign');
const deepequal = require('deep-equal');

class FormField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      formatValue: this.formatValue(props.value),
      error: false,
      errMsg: '',
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

  componentWillReceiveProps(nextProps) {
    const me = this;
    if (!me.isEqual(nextProps.value, me.props.value)) {
      me.handleDataChange(nextProps.value, true, true);
    }
  }

  componentWillUnmount() {
    const me = this;
    if (!me.props.standalone) {
      this.props.detachFormField(this);
    }
  }

  getProps() {
    return this.props;
  }

  getLabelNode() {
    return this.refs.label;
  }

  getTipsNode() {
    return this.refs.tips;
  }

  getRequiredNode() {
    return this.refs.required;
  }

  getErrorNode() {
    return this.refs.error;
  }

  getName() {
    return this.props.jsxname;
  }

  getValue() {
    return this.formatValue(this.state.value);
  }

  setValue(value, fromReset, next) {
    const me = this;
    me.setState({
      value,
      formatValue: me.formatValue(value),
      error: !!fromReset ? false : me.state.error,
      /*
       * why set state fromReset? some field like editor cannot be reset in the common way
       * so set this state to tell the field that you need to reset by yourself.
       */
      fromReset: !!fromReset,
    }, () => {
      if (next && typeof next === 'function') {
        next();
      }
    });
  }

  /**
   * selectFormField depends on this method
   */
  _isEqual(a, b) {
    return deepequal(a, b);
  }

  /*
   * Fired when field value changes，update form's state and then trigger re-render.
   * @param fromReset {boolean} if handleDataChange is invoked by form's resetValues,
   */

  handleDataChange(value, fromReset, silence) {
    const me = this;
    me.setValue(value, fromReset, () => {
      let pass = true;
      // validateOnBlur only support InputFormField & TextAraeFormField now
      if (!fromReset && !me.props.standalone && !me.props.validateOnBlur) {
        pass = me.doValidate();
      }
      if (!!me.props.handleDataChange) {
        me.props.handleDataChange(me, {
          value,
          pass,
        }, silence);
      }
    });
  }


  /**
   * @return {boolean} if validate pass, return true, or, return false
   * if no rule, it means validate pass.
   */

  doValidate(force, always) {
    const me = this;
    let instant = true;
    if ('instantValidate' in me.props) {
      instant = me.props.instantValidate;
    } else {
      instant = me.props.jsxinstant;
    }
    // `force` has the top priority, `undefined` is not equal to `false`
    // `instant` has the sceond priority here
    // eternalsky@2016.03.15
    if (force === true || (force !== false && instant)) {
      if (me.props.jsxrules) {
        const error = me.isDirty(always);
        me.setState({
          error: error.isDirty,
          errMsg: error.errMsg,
        });
        return !error.isDirty;
      }
      return true;
    }
    return true;
  }

  /*
   * rule can be an object, containing errMsg & validator,
   * and rule can also be an array containing such objects.
   * this func will check them one by one, and return false
   * unless all rules pass
   */

  isDirty(always) {
    const me = this;
    const rules = me.props.jsxrules;
    let isDirty = false;
    let errMsg = '';
    if (typeof rules === 'object' && !Array.isArray(rules)) {
      isDirty = (always === undefined) ? !rules.validator(me.state.value) : !always;
      errMsg = rules.errMsg;
    } else if (Array.isArray(rules)) {
      for (let i = 0; i < rules.length; i++) {
        isDirty = (always === undefined) ? !rules[i].validator(me.state.value) : !always;
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

  isEqual(a, b) {
    return deepequal(a, b);
  }

  addSpecificClass() {
    return this.props.jsxprefixCls;
  }

  /*
   * You should rewrite this method，when you need to format the value as you concern.
   */

  formatValue(value) {
    return value;
  }

  renderTips() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    if (mode !== Constants.MODE.EDIT) return null;
    if (me.props.standalone && me.props.message && me.props.message.type === 'tip') {
      return (
        <li className="kuma-uxform-tips">
          <i className="kuma-icon kuma-icon-information"></i>
          <span ref="tips">{me.props.message.message}</span>
        </li>
      );
    }
    if (!!this.props.jsxtips && !me.state.error) {
      return (
        <li className="kuma-uxform-tips">
          <i className="kuma-icon kuma-icon-information"></i>
          <span ref="tips">{this.props.jsxtips}</span>
        </li>
      );
    }
    return null;
  }

  /*
   * You should rewrite this method, when you are developing a new type of form field.
   */

  renderField() {}

  renderErrorMsg() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    if (mode !== Constants.MODE.EDIT) return null;
    if (me.props.standalone && me.props.message && me.props.message.type === 'error') {
      return (
        <li className="kuma-uxform-errormsg">
          <i className="kuma-icon kuma-icon-error"></i>
          <span ref="error">{me.props.message.message}</span>
        </li>
      );
    }
    if (!!me.state.error) {
      return (
        <li className="kuma-uxform-errormsg">
          <i className="kuma-icon kuma-icon-error"></i>
          <span ref="error">{me.state.errMsg}</span>
        </li>
      );
    }
    return null;
  }

  renderLabel() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    // jsxVerticalAlign is an internal varible.
    const align = me.props.verticalAlign || me.props.jsxVerticalAlign;
    if (me.props.jsxshowLabel) {
      return (
        <label
          key="label"
          className={classnames({
            'kuma-label': true,
            'vertical-align': align,
            'label-match-input-height': me.props.labelMatchInputHeight,
          })}
        >
          <span className="required" ref="required">
            {(me.props.required && mode === Constants.MODE.EDIT) ? '* ' : ''}
          </span>
          <span
            className="label-content"
            ref="label"
            dangerouslySetInnerHTML={{
              __html: me.props.jsxlabel,
            }}
          />
        </label>
      );
    }
    return null;
  }

  renderContent() {
    const me = this;
    const mode = me.props.jsxmode || me.props.mode;
    const align = me.props.verticalAlign || me.props.jsxVerticalAlign;
    if (me.props.labelMatchInputHeight) {
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
              'has-error': !!me.state.error,
            })}
          >
            <li className="kuma-uxform-field-core">{me.renderField()}</li>
          </ul>
        </div>,
        <div
          key="tip"
          className="kuma-uxform-tip-box"
          style={{
            display: 'table',
          }}
        >
          {!align ? <label
            className={classnames({
              'kuma-label': true,
            })}
          ></label> : null}
          <ul>
            {me.renderTips()}
            {me.renderErrorMsg()}
          </ul>
        </div>,
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
          'has-error': !!me.state.error,
        })}
      >
        <li key="core" className="kuma-uxform-field-core">{me.renderField()}</li>
        {me.renderTips()}
        {me.renderErrorMsg()}
      </ul>,
    ];
  }

  render() {
    const me = this;
    const specificCls = me.addSpecificClass();
    const style = {};
    if (!me.props.standalone) {
      style.width = `${me.props.jsxflex / me.props.totalFlex * 100}%`;
    }
    return (
      <div
        className={classnames({
          [specificCls]: true,
          [me.props.className]: !!me.props.className,
        })}
        style={assign({}, style, {
          display: me.props.jsxshow ? 'table' : 'none',
        })}
      >
          {me.renderContent()}
      </div>
    );
  }
}

FormField.propTypes = {
  instantValidate: React.PropTypes.bool,
  verticalAlign: React.PropTypes.bool,
  labelMatchInputHeight: React.PropTypes.bool,
  detachFormField: React.PropTypes.func,
  value: React.PropTypes.any,
  jsxshow: React.PropTypes.bool,
  jsxmode: React.PropTypes.string,
  jsxshowLabel: React.PropTypes.bool,
  jsxprefixCls: React.PropTypes.string,
  jsxflex: React.PropTypes.number,
  jsxname: React.PropTypes.string.isRequired,
  jsxplaceholder: React.PropTypes.string,
  jsxlabel: React.PropTypes.string,
  jsxtips: React.PropTypes.string,
  jsxrules: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  totalFlex: React.PropTypes.number,
  standalone: React.PropTypes.bool,
  required: React.PropTypes.bool,
};

FormField.defaultProps = {
  verticalAlign: false,
  labelMatchInputHeight: false,
  jsxshow: true,
  jsxshowLabel: true,
  jsxprefixCls: 'kuma-uxform-field',
  jsxflex: 1,
  jsxname: '',
  jsxplaceholder: '',
  jsxlabel: '',
  jsxtips: '',
  standalone: false,
  mode: Constants.MODE.EDIT,
  required: false,
};

FormField.displayName = 'FormField';

module.exports = FormField;
