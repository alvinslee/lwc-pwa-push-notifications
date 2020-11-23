import RadioGroup from '../../RadioGroup';

export default class NotificationType extends RadioGroup {
  constructor () {
    super(['iss', 'quote', 'activity'])
  }
}
