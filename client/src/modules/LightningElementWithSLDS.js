import { LightningElement } from 'lwc'

export default class LightningElementWithSLDS extends LightningElement {
  constructor() {
    super()
    const path = '/resources/SLDS/assets/styles/salesforce-lightning-design-system.css'
    const styles = document.createElement('link')
    styles.href = path
    styles.rel = 'stylesheet'
    this.template.appendChild(styles)
  }
}
