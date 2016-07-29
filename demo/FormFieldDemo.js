/**
 * FormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const FormField = require('../src');
const Form = require('uxcore-form/build/Form');
const FormRow = require('uxcore-form-row');

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Form>
          <FormRow>
            <FormField
              jsxname="test1"
              jsxlabel="表单1"
              jsxflex={2}
              jsxrules={{
                validator: () => false,
                errMsg: 'error test',
              }}
            />
            <FormField jsxname="test2" jsxlabel="表单2" />
          </FormRow>
        </Form>
        <FormField
          standalone
          jsxname="1"
          jsxlabel="test"
          message={{
            type: 'error',
            message: 'error test',
          }}
        />
      </div>
    );
  }
}

module.exports = Demo;
