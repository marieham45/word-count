// CAT API
function fetchCatImage() {
  fetch("https://api.thecatapi.com/v1/images/search")
    .then((resp) => resp.json())
    .then((json) => {
      const newKitten = document.createElement("img");
      newKitten.classList.add("kitten");
      newKitten.loading = "eager";
      newKitten.src = json[0].url;
      document.querySelector(".kitten-area").append(newKitten);
    });
}

// ELEMENTS
const input = document.getElementById("fileinput");
const selection = document.getElementsByName("select");
const inputFileNames = document.querySelector(".file");
const inputWordCounts = document.querySelector(".word");
const resultWordCount = document.querySelector(".result-word-count");
const btnWordCount = document.querySelector(".btn-word-count");

// DATA
let wordCounts = [];
let fileNamesArray = [];
let fileNameArrayUnique = [];
let wordsReduced = [];

// RESET
const reset = function () {
  resultWordCount.innerHTML = "";
  wordCounts = [];
  fileNamesArray = [];
  fileNameArrayUnique = [];
  wordsReduced = [];
  document.querySelector(".kitten-area").innerHTML = "";
};

// FILE UPLOAD
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

      // getting word counts
      linesOfInterest.forEach((line) => {
        wordCounts.push(Number(line[36]));
      });

      // getting language abbreviations
      const fileN = [];
      linesOfInterest.forEach((line) => {
        fileN.push(line[0]);
      });

      for (let i = 0; i < fileN.length; i++) {
        const lastItem = fileN[i][fileN[i].length - 1].split("");
        let ending = "";
        if (lastItem.includes("_")) {
          ending += lastItem[lastItem.length - 6];
          ending += lastItem[lastItem.length - 5];
          if (ending === "fr") {
            ending += "-";
            ending += lastItem[lastItem.length - 3];
            ending += lastItem[lastItem.length - 2];
          }
        } else {
          ending += lastItem[lastItem.length - 3];
          ending += lastItem[lastItem.length - 2];
        }

        fileNamesArray.push(ending.toUpperCase());
      }

      // word count and lang. abbreviation reduction
      const wcObject = {};

      fileNamesArray.forEach((item) => {
        wcObject[item] = 0;
      });

      for (let i = 0; i < wordCounts.length; i++) {
        wcObject[fileNamesArray[i]] += wordCounts[i];
      }

      fileNameArrayUnique = [...Object.keys(wcObject)];

      wordsReduced = [...Object.values(wcObject)].map((num) =>
        num < 100 ? (num = 100) : (num = num)
      );
    };
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
  reset();
}
input.addEventListener("change", readSingleFile);

// GENERATE WORD COUNT LIST
const getWordCountList = (arr1, arr2) => {
  const wordCountList = [];
  for (let i = 0; i < arr1.length; i++) {
    const langItem = `${arr1[i]}: ${Math.round(arr2[i])}`;
    wordCountList.push(langItem);
  }
  return wordCountList.join("<br>");
};

// PROCESSING DATA
btnWordCount.addEventListener("click", function () {
  // cat image
  document.querySelector(".kitten-area").innerHTML = "";
  fetchCatImage();

  // generating list
  resultWordCount.innerHTML = `<b>Word count:</b> <br><br> ${getWordCountList(
    fileNameArrayUnique,
    wordsReduced
  )}`;
});
