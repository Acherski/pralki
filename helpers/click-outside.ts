export const onClickOutside = (element: any, callback: any) => {
  document.addEventListener("click", (e) => {
    if (!element.contains(e.target)) callback();
  });
};
