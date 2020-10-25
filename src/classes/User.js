/**
 * The canonical Contact. This should be used whenever representing a Contact instance.
 */
export default class Contact {
  _name: string;

  constructor(uid: string, data, type: string, id: string) {
    this.name = data.name;
  }

  asFirestoreData(updateLastSaveDate: boolean) {
    return {
      name: this.name,
    };
  }

  hasName() {
    return this._stringDefined(this.company);
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
