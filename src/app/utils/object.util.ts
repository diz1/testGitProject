const checkObjectEntry = (
  object: { [key: string]: string | number },
  [key, value]: [string, string | number]
) => {
  if (value) {
    object[key] = value
  }
}

export const trimObj = <T>(object: T): T => {
  const resultObject: any = {}
  Object.entries(object).forEach(entry => checkObjectEntry(resultObject, entry))
  return resultObject as T
}
