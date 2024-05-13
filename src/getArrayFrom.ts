const getArrayFromTonGlossay = () => {
  let targetArray: NodeListOf<HTMLElement> =
    document.querySelectorAll(".markdown-heading");
  let toResArray: Array<{ title: string; text: string }> = [];

  targetArray.forEach((item) => {
    if (!item?.innerText || !item?.nextElementSibling) return;
    const nextElementSibling: HTMLElement =
      item?.nextElementSibling as HTMLElement;
    if (nextElementSibling?.tagName === "P") {
      toResArray.push({
        title: item?.innerText,
        text: nextElementSibling.innerText.replace(`${item.innerText} — `, ""),
      });
    }
  });

  console.log(toResArray);
};
