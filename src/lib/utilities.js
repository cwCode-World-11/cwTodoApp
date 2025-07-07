export function categoryFilterFn(categoryName, dataArr) {
  switch (categoryName) {
    case "All":
      return dataArr;
    case "Uncategory":
      const Uncategory = dataArr.filter((ele) => ele?.category?.length === 0);
      return Uncategory;
    default:
      const c = [];
      dataArr.filter((ele) => {
        // console.log('e:', ele);
        ele.category.find((e) => {
          if (categoryName === e) {
            c.push(ele);
          }
        });
      });
      return c;
  }
}

export function deSelectAllNotes() {
  const noteCheckbox = document.querySelectorAll(".noteCheckbox");
  noteCheckbox.forEach((ele) => {
    ele.checked = false;
  });
}

export function quillContentToText(quillOps) {
  return quillOps
    .map((op) => op.insert)
    .join("")
    .split(" ")[0];
}
