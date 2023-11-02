export class ObjectColletionUtils {
  private static _singleton?: ObjectColletionUtils;

  public static build(): ObjectColletionUtils {
    if (this._singleton === undefined) {
      this._singleton = new ObjectColletionUtils();
    }
    return new ObjectColletionUtils();
  }

  private constructor() {
  }

  public getMapKeysAsList<TKeyType, TDataType>(map: Map<TKeyType, TDataType>): TKeyType[] {
    const list: TKeyType[] = [];
    map.forEach((value, key) => list.push(key));
    return list;
  }

  public getMapValuesAsList<TKeyType, TDataType>(map: Map<TKeyType, TDataType>): TDataType[] {
    const list: TDataType[] = [];
    map.forEach((value, key) => list.push(value));
    return list;
  }

  public fillMapFromObject<TDataType>(map: Map<string, TDataType>, object: any): void {
    for (const key of Object.keys(object)) {
      map.set(key, object[key]);
    }
  }
}
