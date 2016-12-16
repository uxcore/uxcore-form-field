const React = require('react');
const assign = require('object-assign');
const Constants = require('uxcore-const');

const FormField = require('./FormField');

const Input = props =>
  <input
    className="kuma-input"
    {...props}
    value={props.value}
    onChange={(e) => { props.onChange(e.target.value); }}
  />;

Input.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

const defaultOptions = {
  valuePropName: 'value',
  changePropName: 'onChange',
  fieldName: 'CustomFormField',
  component: <Input />,
  processValue: value => value,
  renderView: (value) => { JSON.stringify(value); },
};

const FormFieldPropKeys = Object.keys(FormField.propTypes);

const createFormField = (options = {}) => {
  const newOptions = assign({}, defaultOptions, options);
  class CustomFormField extends FormField {
    renderField() {
      const me = this;
      const mode = me.props.jsxmode || me.props.mode;
      const props = { ...me.props };
      FormFieldPropKeys.forEach((key) => {
        delete props[key];
      });

      if (mode === Constants.MODE.VIEW) {
        return newOptions.renderView(me.state.value);
      }

      return React.cloneElement(newOptions.component, {
        [newOptions.valuePropName]: me.state.value,
        [newOptions.changePropName]: (...args) => {
          me.handleDataChange(newOptions.processValue(...args));
        },
        ...props,
      });
    }
  }
  CustomFormField.defaultProps = assign({}, FormField.defaultProps);
  CustomFormField.propTypes = assign({}, FormField.propTypes);
  CustomFormField.displayName = newOptions.fieldName;
  return CustomFormField;
};

module.exports = createFormField;
