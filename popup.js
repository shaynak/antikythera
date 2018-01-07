function readTextFile(filename, rawFile) {
  file = "https://shaynak.github.io/antikythera/" + filename + ".txt";
  // code from: https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
    //var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    var allText;
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

function collectDataFromURL(filename, classifier) {
  text = readTextFile(filename, new XMLHttpRequest());
  return [text, classifier];
}

function buildDictSelective(websites) {
  var data = collectDataFromURL("words");
  var str = data[0];
  var words = str.replace(/\W/g, " ").replace("  ", " ").split(" ");
  var dictionary = [];
  var classifiers = [["classifier"]];

  for (i = 0; i < words.length; i++) { //creates a dictionary with each specific word
    var notin = true;
    for (d = 0; d < dictionary.length; d++) {
      if (words[i] == dictionary[d][0]) {
        notin = false;
      }
    }
    if (notin) {
      dictionary.push([words[i]]);
    }
  }
  for (s = 0; s < websites.length; s++) { //collects text and classifier of each site
    site = websites[s];
    var inbetween = collectDataFromURL(site[0], site[1]);
    var words = inbetween[0];
    var classify = inbetween[1];

    classifiers[0].push(classify); //adds classifier to list
    var dict = checkNumsSelective(words, dictionary); //creates dictionary for the specific website we're looking at
    for (i = 0; i < dictionary.length; i++) {
      dictionary[i].push(dict[i][1]);
    }
  }
  return classifiers.concat(dictionary);
}

function checkNumsSelective(str, dic) {
  var dict = [];
  if (dic) { //this block creates an array that contains an array for each word containing two values: word and word frequency
    for (i = 0; i < dic.length; i++) {
      dict[i] = [dic[i][0], 0];
    }
  }

  str = str.toLowerCase(); //this block creates readable text / means we have no symbols
  str = str.replace(/\W/g, " ").replace('.', ' ').replace("↵", " ").replace("—", " ").replace("“", '"').replace("”", '"').replace(",", " ").replace("’", "'").replace(".", " ").replace("--", " ").replace("-", " ").replace(";", " ").replace("?", " ").replace("!", " ").replace(":", " ").replace("(", " ").replace(")", " ").replace('"', ' ').replace("  ", " ");
  var words = str.split(" ");

  for (i = 0; i < words.length; i++) {
    if (dict) { //makes sure dict exists/no error
      for (d = 0; d < dict.length; d++) { //goes through every word in the dictionary for matching
        if (words[i] == dict[d][0]) { //if words[i] --> checks for a match
          dict[d][1] += 1; //adds a frequency to the dictionary
        }
      }  
    }
  }
  return dict; //returns the created single value dictionary
}

function nearestNeighbors(dictionary, article) { //computes nearest neighbor based on matching words
  var art = checkNumsSelective(article, dictionary);
  var arrs = [[], []];
  var dists = [[], []];
  for (comp = 1; comp < dictionary[1].length; comp++) { // goes down list
    for (i = 0; i < art.length; i++) { //for the article--goes down each word
      for (j = 1; j < dictionary.length; j++) { //goes down each word in dictionary 
        if (dictionary[j][0] == art[i][0]) { //if two words are equal...
          if (dictionary[j][comp] != art[i][1]) { //if
            arrs[0].push(dictionary[j][comp]);
            arrs[1].push(art[i][1]);
          }
        }
      }
    }
    dists[0].push(dictionary[0][comp]);
    dists[1].push(distance(arrs[0], arrs[1]))
    arrs = [[], []];
  }


  console.log(dists);
  var sorted = quickSort(dists);
  console.log(sorted);
  var nearest = sorted[0].slice(0, 5);
  console.log(nearest);
  var left = 0;
  var right = 0;
  var middle = 0;
  for (classifier of nearest) {
    console.log(classifier);
    if (classifier == "liberal") {
      left += 1;
    } else if (classifier == "conservative") {
      right += 1;
    } else {
      middle += 1;
    }
  }
  var average = (left - right)/5;
  if (average < -0.1) {
    return "conservative";
  } else if (average > 0.1) {
    return "liberal";
  } else {
    return "center";
  }
}

function distance(arr1, arr2) { //finds the distance between two arrays
  if (arr1.length != arr2.length) {
    if (arr1.length < arr2.length) {
      while (arr1.length != arr2.length) {
        arr1.push(0);
      }
    } else {
      while (arr1.length != arr2.length) {
        arr2.push(0);
      }
    }
  }
  var diffs = []
  for (i = 0; i < arr1.length; i++) {
    diff = arr1[i] - arr2[i];
    diffs.push(diff);
  }
  var sum = getSum(diffs);
  return sum**(0.5);
}

function getSum(array) {
  var sum = 0;
  for (val of array) {
    if (!isNaN(val)) {
      sum += val**2;
    }
  }
  return sum;
}

function quickSort(arr) { //sorts the arrays for a classification
  if (arr[1]) {
    if (arr[1].length == 1 || arr[1].length == 0) { //checks to make sure you don't have a single element
      return arr;

    } else if (arr[1].length == 2) { //if there are only two values left...
      if (arr[1][0] > arr[1][1]) { //if the values need to be switched...
        return [[arr[0][1], arr[0][0]], [arr[1][1], arr[1][0]]];
      }
      return arr;
    }

    var index = (arr[1].length/2).toFixed(0);
    var pivot = arr[1][index];
    var left = [[], []];
    var right = [[], []];
    for (i = 0; i < arr[1].length; i++) {
      if (arr[1][i] < pivot) {
        left[0].push(arr[0][i]);
        left[1].push(arr[1][i]);
      } else if (arr[1][i] > pivot) {
        right[0].push(arr[0][i]);
        right[1].push(arr[1][i]);
      }
    }
    var l = quickSort(left);
    var r = quickSort(right);
    return [l[0].concat([arr[0][index]], r[0]), l[1].concat([pivot], r[1])];
  }
}

function getWebsites(files) { //allows me to update text files with file names in shaynak.github.io
  var websites = [];
  for (i = 0; i < files.length; i++) {
    var data = collectDataFromURL(files[i][0], files[i][1]);
    var classifier = data[1];
    var names = data[0];
    names = names.split(" ");
    for (name = 0; name < names.length; name++) {
      websites.push([names[name], classifier]);
    }
  }
  return websites;
}

document.addEventListener('DOMContentLoaded', () => {
  var button = document.getElementById("clicker");

  var txt = chrome.extension.getBackgroundPage().txt;
    console.log(txt);

  button.addEventListener("click", () => {
    document.getElementById("class").innerText = "Loading!";
    var websites = getWebsites([["cons_files", "conservative"], ["lib_files", "liberal"], ["center_files", "center"]]);
    var diction = buildDictSelective(websites);
    var classification = nearestNeighbors(diction, txt);
    document.getElementById("class").innerText = classification;
  });
});