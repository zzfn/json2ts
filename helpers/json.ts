
// found it on stackoverflow
//
export function isJson(item: any) {
  item = typeof item !== "string"
    ? JSON.stringify(item)
    : item

  try { item = JSON.stringify(item) }
  catch (e) {
    return false
  }

  return typeof item === "object" && item !== null;


}
