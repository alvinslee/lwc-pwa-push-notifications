import { api } from 'lwc'
import LightningElementWithSLDS from '../../LightningElementWithSLDS'

export default class Subscribe extends LightningElementWithSLDS {
  @api isSubscribed

  handleClick () {
    this.dispatchEvent(new CustomEvent('toggle'))
  }
}
