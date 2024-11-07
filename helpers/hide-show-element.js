export function hideHTMLElement(element) {
    element.style.visibility = "hidden";
}
export function showHTMLElement(element, isInherit = false) {
    element.style.visibility = isInherit ? "inherit" : "visible";
}
