import React from 'react';
import PropTypes from 'prop-types';
import assign from 'object-assign';
import Constants from 'uxcore-const';
import FormField from './FormField';

const Input = props =>
  (<input
    className="kuma-input"
    {...props}
    value={props.value}
    onChange={(e) => { props.onChange(e.target.value); }}
  />);

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultOptions = {
  valuePropName: 'value',
  changePropName: 'onChange',
  fieldName: 'CustomFormField',
  component: <Input />,
  processValue: value => value,
  renderView: value => (typeof value === 'object' ? JSON.stringify(value) : value),
};

const FormFieldPropKeys = Object.keys(FormField.propTypes);

const createFormField = (options = {}) => {
  const newOptions = assign({}, defaultOptions, options);
  class CustomFormField extends FormField {
    addSpecificClass() {
      return newOptions.specificClass || '';
    }
    renderField() {
      const me = this;
      const mode = me.props.jsxmode || me.props.mode;
      const props = { ...me.props };
      FormFieldPropKeys
        .concat([newOptions.valuePropName, newOptions.changePropName])
        .forEach((key) => {
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

export default createFormField;
