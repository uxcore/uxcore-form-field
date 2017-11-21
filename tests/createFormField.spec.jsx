/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-es6-class */

import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import FormField from '../src';

const { createFormField } = FormField;

Enzyme.configure({ adapter: new Adapter() });

describe('create form field', () => {
  let instance;
  it('should work without passing options', () => {
    const CustomField = createFormField();
    instance = mount(
      <CustomField standalone />
    );
  });

  it('should pass right props to component', () => {
    const CustomField = createFormField();
    instance = mount(
      <CustomField standalone placeholder="test_placeholder" />
    );
    expect(instance.find('.kuma-input').prop('placeholder')).to.be('test_placeholder');
    expect(instance.find('.kuma-input').prop('standalone')).to.be(undefined);
  });

  it('should be able to define displayName', () => {
    const CustomField = createFormField({
      fieldName: 'CustomFormField',
    });
    expect(CustomField.displayName).to.be('CustomFormField');
  });

  it('should be able to define valuePropName/component', (done) => {
    const Input = props =>
      <input
        className="kuma-input"
        value={props.text}
        onChange={(e) => { props.onChange(e.target.value); }}
      />;

    Input.propTypes = {
      text: React.PropTypes.string,
      onChange: React.PropTypes.func,
    };
    const CustomField = createFormField({
      valuePropName: 'text',
      component: <Input />,
    });
    instance = mount(
      <CustomField standalone value="1" />
    );
    setTimeout(() => {
      expect(instance.find('.kuma-input').instance().value).to.be('1');
      done();
    }, 100);
  });

  it('should be able to define changePropName', (done) => {
    const Input = props =>
      <input
        className="kuma-input"
        value={props.value}
        onChange={(e) => { props.onSelect(e.target.value); }}
      />;

    Input.propTypes = {
      value: React.PropTypes.string,
      onSelect: React.PropTypes.func,
    };
    const CustomField = createFormField({
      changePropName: 'onSelect',
      component: <Input />,
    });
    instance = mount(
      <CustomField standalone value="1" />
    );
    instance.find('.kuma-input').simulate('change', {
      target: {
        value: '2',
      },
    });
    setTimeout(() => {
      expect(instance.find('.kuma-input').instance().value).to.be('2');
      done();
    }, 100);
  });

  it('should be able to renderView', () => {
    const CustomField = createFormField({
      renderView: () => <span className="view" />,
    });
    instance = mount(
      <CustomField standalone mode="view" />
    );
    expect(instance.find('.kuma-uxform-field-core').contains(<span className="view" />)).to.be(true);
  });

  it('should not pass valuePropName/changePropName to the component', () => {
    const Input = props =>
      <input
        className="kuma-input"
        value={props.text}
        onChange={(e) => { props.onChange(e.target.value); }}
      />;

    Input.propTypes = {
      text: React.PropTypes.string,
      onChange: React.PropTypes.func,
    };
    const CustomField = createFormField({
      valuePropName: 'text',
      component: <Input />,
    });
    instance = mount(
      <CustomField standalone text="1" />
    );
    expect(instance.find('Input').prop('text')).not.to.be(1);
  });
});
