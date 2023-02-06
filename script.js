const input = document.getElementById("fileinput");

const selection = document.getElementsByName("select");

const inputFileNames = document.querySelector(".file");
const inputWordCounts = document.querySelector(".word");
const resultWordCount = document.querySelector(".result-word-count");
const btnWordCount = document.querySelector(".btn-word-count");

const reset = function () {
  resultWordCount.innerHTML = "";
  fileNamesArray = [];
  wordCountsProof = [];
  wordCountsTrans = [];
};

const getWordCountList = (arr1, arr2) => {
  const wordCountList = [];
  for (let i = 0; i < arr1.length; i++) {
    const langItem = `${arr1[i]}: ${arr2[i]}`;
    wordCountList.push(langItem);
  }
  return wordCountList.join("<br>");
};
let wordCountsProof = [];
let wordCountsTrans = [];

let fileNamesArray = [];

function readSingleFile(evt) {
  const f = evt.target.files[0];
  if (f) {
    const r = new FileReader();
    r.onload = function (e) {
      const contents = e.target.result;
      const linesOfInterest = contents
        .split("\n")
        .filter((_, i, arr) => i > 1 && i < arr.length - 1)
        .map((item) => item.split(";").map((itm) => itm.split(" ")));

      linesOfInterest.forEach((line) => {
        wordCountsProof.push(String(line[4]));
      });

      linesOfInterest.forEach((line) => {
        wordCountsTrans.push(String(Math.round(Number(line[36]))));
      });

      const fileN = [];
      linesOfInterest.forEach((line) => {
        fileN.push(line[0]);
      });

      for (let i = 0; i < fileN.length; i++) {
        const lastItem = fileN[i][fileN[i].length - 1].split("");
        let ending = "";
        ending += lastItem[lastItem.length - 6];
        ending += lastItem[lastItem.length - 5];
        if (ending === "fr") {
          ending += "-";
          ending += lastItem[lastItem.length - 3];
          ending += lastItem[lastItem.length - 2];
        }
        fileNamesArray.push(ending.toUpperCase());
      }
    };
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
  reset();
}
input.addEventListener("change", readSingleFile);

btnWordCount.addEventListener("click", function () {
  let selectedStep = "";

  for (let i = 0; i < selection.length; i++) {
    if (selection[i].checked) {
      selectedStep = selection[i].value;
    }
  }

  if (selectedStep === "proof") {
    resultWordCount.innerHTML = `Word count for Proofreaders: <br><br> ${getWordCountList(
      fileNamesArray,
      wordCountsProof
    )}`;
  }
  if (selectedStep === "trans") {
    resultWordCount.innerHTML = `Word count for Translators: <br><br> ${getWordCountList(
      fileNamesArray,
      wordCountsTrans
    )}`;
  }
});
