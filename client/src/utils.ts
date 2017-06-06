export function removeQuotesfromString(str : String) : any {
    return str.split("").map(n=> n.replace("\"", "")).join("");
}

export function removeWhiteSpacesfromString(str : String) : any {
    return str.replace(/\s/g, "");
}
