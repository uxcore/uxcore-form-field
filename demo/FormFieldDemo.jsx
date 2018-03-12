/**
 * FormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';

import Form from 'uxcore-form/build/Form';
import FormRow from 'uxcore-form-row';
import FormField from '../src';

const { createFormField } = FormField;
const CustomField = createFormField();

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Form
          jsxvalues={{
            custom: '111',
          }}
        >
          <FormRow>
            <FormField
              inputBoxMaxWidth="normal"
              data-spm="2"
              jsxname="test1"
              jsxlabel={<span>{'表单1'}</span>}
              jsxflex={2}
              jsxrules={{
                validator: () => false,
                errMsg: 'error test',
              }}
            />
            <FormField jsxname="test2" jsxlabel="表单2" />
          </FormRow>
          <CustomField
            jsxname="custom"
            jsxlabel="字很多字很多字很多字很多字"
            placeholder="111"
            jsxtips="提示"
            gridLayout={[6, 12]}
            labelMatchInputHeight={false}
            // verticalAlign
          />
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

export default Demo;
