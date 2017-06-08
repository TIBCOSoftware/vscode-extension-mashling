export function removeQuotesfromString(str : String) : any {
    return str.split("").map(char=> char.replace("\"", "")).join("");
}

export function removeWhiteSpacesfromString(str : String) : any {
    return str.replace(/\s/g, "");
}
