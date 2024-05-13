const getArrayFromTonGlossary = () => {
  const targetArray = document.querySelectorAll(".markdown-heading");
  const toResArray = [];

  targetArray.forEach((item) => {
    if (!item?.innerText || !item?.nextElementSibling) return;
    const nextElementSibling = item?.nextElementSibling;
    if (nextElementSibling?.tagName === "P") {
      toResArray.push({
        "Term:English": item?.innerText,
        "Description:English": nextElementSibling.innerText.replace(
          `${item.innerText} — `,
          ""
        ),
      });
    }
  });

  console.log(toResArray);
};

const getArrayFromWikiCs = () => {
  const targetArray = document.querySelectorAll("dt");
  const toResArray = [];

  targetArray.forEach((item) => {
    if (!item?.innerText || !item?.nextElementSibling) return;
    let nextElementSibling = item?.nextElementSibling;
    let targetDes = "";
    while (!!nextElementSibling && nextElementSibling?.tagName !== "DT") {
      // console.log(targetEl.innerText, ":", siblingEl.innerText);
      targetDes += nextElementSibling?.innerText;
      nextElementSibling = nextElementSibling?.nextElementSibling;
    }
    toResArray.push({
      "Term:English": item?.innerText,
      "Description:English": targetDes,
    });
  });

  console.log(toResArray);
};

const getArrayFromGithubLanguageOptions = () => {
  // https://github.com/search/advanced
  const targetArray = document.querySelectorAll("#search_language option");
  const toResArray = [];

  targetArray.forEach((item) => {
    if (!item?.innerText) return;
    toResArray.push({
      "Term:English": item?.innerText,
      "Description:English": item?.innerText,
    });
  });

  console.log(toResArray);
};

const getArrayFromInternetGlossary = () => {
  // https://archive.nytimes.com/www.nytimes.com/library/tech/reference/glossary.html
  const targetArray = document.querySelectorAll("blockquote > p > a[name]");
  const toResArray = [];

  targetArray.forEach((item) => {
    if (!item?.innerText) return;
    toResArray.push({
      "Term:English": item?.innerText,
      "Description:English": item.parentElement.innerText.replace(
        `${item.innerText}: `,
        ""
      ),
    });
  });

  console.log(toResArray);
};
