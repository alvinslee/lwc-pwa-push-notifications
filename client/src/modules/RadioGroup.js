import { api } from 'lwc'
import LightningElementWithSLDS from './LightningElementWithSLDS';

export default class OptionsGroup extends LightningElementWithSLDS {
  VALID_VALUES = []
  @api value

  constructor (validValues = []) {
    super()
    if (validValues.length) {
      this.VALID_VALUES = validValues
    }
  }

  @api setValue (value) {
    this.check(value)
    this.uncheckAllBut(value)
  }

  @api disable() {
    this.template.querySelectorAll('my-radio-option').forEach(radio => radio.disable())
  }

  @api enable () {
    this.template.querySelectorAll('my-radio-option').forEach(radio => radio.enable())
  }

  uncheckAllBut (value) {
    const otherRadios = this.template.querySelectorAll(`my-radio-option:not([data-value="${value}"])`)
    otherRadios.forEach(radio => radio.uncheck())
  }

  check (value) {
    if (this.VALID_VALUES.length && !this.VALID_VALUES.includes(value)) {
      return
    }
    this.template.querySelector(`my-radio-option[data-value="${value}"]`).check()
    this.value = value
    this.dispatchEvent(new CustomEvent('valuechanged'))
  }

  radioCheckedHandler (evt) {
    const value = evt.target.getAttribute('data-value')
    if (this.valueChanging(value)) {
      this.check(value)
      this.uncheckAllBut(value)
    }
  }
  
  valueChanging (newValue) {
    return (newValue !== this.value)
  }
}
