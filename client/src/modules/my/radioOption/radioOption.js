import { api } from 'lwc'
import LightningElementWithSLDS from '../../LightningElementWithSLDS';

export default class Option extends LightningElementWithSLDS {
  @api id
  @api name
  @api value
  @api label

  @api check () {
    this.radio().setAttribute('checked', true)
  }

  @api uncheck () {
    this.radio().removeAttribute('checked')
  }

  @api disable () {
    this.radio().setAttribute('disabled', true)
    this.labelElement().setAttribute('disabled', true)

  }

  @api enable () {
    this.radio().removeAttribute('disabled')
    this.labelElement().removeAttribute('disabled')
  }

  checkRadio () {
    this.dispatchEvent(new CustomEvent('radiochecked'))
  }

  radio () {
    return this.template.querySelector('input[type="radio"]')
  }

  labelElement () {
    return this.template.querySelector('label')
  }
}
