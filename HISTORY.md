# history

## 0.2.19 / 2017-09-20

* `FIXED` global verticalAlign will override single field's.

## 0.2.18 / 2017-08-21

* `CHANGED` cjs module to es module
* `CHANGED` replace `deep-equal` with `lodash/isEqual`

## 0.2.17 / 2017-08-15

* `CHANGED` instant validation fails to work due to fromRest logic.

## 0.2.15 / 2017-08-15

* `CHANGED` do not validate when props.value is changed.

## 0.2.14 / 2017-06-19

* `CHANGED` support `data-*` props

## 0.2.13 / 2017-04-20

* `CHANEGD` add view className in root mode. 

## 0.2.12 / 2017-04-07

* `FIXED` when labelMatchInputHeight is set, empty tips will take up place.

## 0.2.11 / 2017-03-29

* `FIXED` createFormField default renderView does not return value
* `CHANGED` labelMatchInputHeight only work in edit mode

## 0.2.10 / 2017-03-23

* `FIXED` label position bug if jsxshowLabel is false

## 0.2.9

* `CHANGED` add more propTypes validation

## 0.2.8

* `CHANGED` add additional className for message content.

## 0.2.7

* `CHANGED` createFormField will prevent `valuePropName` & `changePropName` passing to the component

## 0.2.6

* `NEW` add new API `createFormField`

## 0.2.5

* `CHANGED` optimize `addSpecificClass` logic

## 0.2.4

* `CHANGED` add new method `getFieldCore`

## 0.2.3

* `FIXED` handleDataChange logic bug in async validate mode.

## 0.2.2

* `CHANGED` validation will be triggered if value is changed.

## 0.2.1

* `FIXED` resolve will fail in async validation mode.

## 0.2.0

* `CHANGED` remove `_isEqual` method
* `NEW` support async validation

## 0.1.9

* `CHANGED` doValidate support always params. (form [#114](https://github.com/uxcore/uxcore-form/issues/114))

## 0.1.8

* `FIX` fix key warnings.

## 0.1.7

* `FIX` selectFormField depends on the _isEqual method of FormField

## 0.1.6

* `NEW` support a new prop `labelMatchInputHeight` which can make the label match input height.

## 0.1.5

* `CHANGED` add getProps() method

## 0.1.4

* `CHANGED` add silence param in `handleDataChange` method

## 0.1.3

* `FIX` width calculation bug in standalone mode
* `CHANGED` add setValue method which enable slient value setting.

## 0.1.2

`CHANGED` add `totalFlex` prop 