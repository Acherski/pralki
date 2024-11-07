export function hideHTMLElement(element: HTMLElement) {
  element.style.visibility = "hidden";
}

export function showHTMLElement(element: HTMLElement, isInherit = false) {
  element.style.visibility = isInherit ? "inherit" : "visible";
}
