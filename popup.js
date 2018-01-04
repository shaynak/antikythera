var theText = "";
var diction = [];


function readTextFile(file) {
  // code from: https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
  // also known as: not my own code; I'm not particularly practiced with XMLHttpRequest
    var rawFile = new XMLHttpRequest();
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
  text = readTextFile(filename);
  return [text, classifier];
}

function buildDicts(websites) { //creates a dictionary for every website
  var dictionary = [["classifier"]];
  for (i = 0; i < websites.length; i+=2) {
    var inbetween = collectDataFromURL(websites[i][0], websites[i][1]);
    var words = inbetween[0];
    var classify = inbetween[1];
    dictionary[0].push(classify); //adds classifier to list
    var dict = checkNums(words, dictionary.slice(1)); //creates dictionary for the specific website we're looking at
    //next: adds the words in dict as a new line in dictionary
    for (j = 0; j < dict.length; j++) {
      var indict = false;
      for (d = 1; d < dictionary.length; d++) {
        if (dict[j][0] == dictionary[d][0]) {
          dictionary[d][dictionary[d].length] = dict[j][1];
          indict = true;
        }
      }
      if (!indict) {
        dictionary[dictionary.length] = [dict[j][0]];
        for (p = 1; p < dictionary[1].length - 1; p++) {
          dictionary[dictionary.length - 1][p] = 0;
        }
        dictionary[dictionary.length - 1][dictionary[dictionary.length - 1].length] = dict[j][1];
      }
    }
  }
  return dictionary;
}

function checkNums(str, dict) { //adds value from a string to a dictionary
  if (dict) {
    for (i = 0; i < dict.length; i++) {
      dict[i][1] = 0;
    }
  }
  str = str.replace(",", " ").replace(".", " ").replace("--", " ").replace("-", " ").replace(";", " ").replace("?", " ").replace("!", " ").replace(":", " ").replace("(", " ").replace(")", " ").replace('"', ' ');
  var words = str.split(" ");
  for (i = 0; i < words.length; i++) {
    if (words[i] != "") {
      var isin = false;
      if (dict) {
        for (d = 0; d < dict.length; d++) {
          if (words[i] == dict[d][0]) {
            dict[d][1] += 1;
            dict[d] = dict[d].slice(0, 2);
            isin = true;
          }
        }
        if (!isin) {
          dict.push([words[i], 1]);
        }
      }
    }
  }
  return dict;
}

function nearestNeighbors(dictionary, article) { //computes nearest neighbor based on matching words
  var art = checkNums(article, dictionary);
  var arrs = [[], []];
  var dists = [[], []]
  for (comp = 1; comp < dictionary[1].length; comp++) {
    for (i = 0; i < article.length; i++) {
      for (j = 1; j < dictionary.length; j++) {
        if (dictionary[j][0] == article[i][0]) {
          arrs[0].push(dictionary[j][comp]);
          arrs[1].push(article[i][1]);
        }
      }
    }
    dists[0].push(dictionary[0][comp]);
    dists[1].push(distance(arrs[0], arrs[1]))
  }
  var sorted = quickSort(dists);
  var nearest = sorted[0].slice(0, 5);
  var left = 0;
  var right = 0;
  var middle = 0;
  for (classifier in nearest) {
    if (classifier == "liberal") {
      left += 1;
    } else if (classifier == "conservative") {
      right += 1;
    } else {
      middle += 1;
    }
  }
  var average = (left + 0.5*middle)/5;
  if (average < 0.37) {
    return "conservative";
  } else if (average > 0.63) {
    return "liberal";
  } else {
    return "center";
  }
}

function distance(arr1, arr2) { //finds the distance between two arrays
  if (arr1.length != arr2.length) {
    if (arr1.length < arr2.length) {
      while (arr1.length != arr2.length) {
        arr1[arr1.length] = 0;
      }
    } else {
      while (arr1.length != arr2.length) {
        arr2[arr2.length] = 0;
      }
    }
  }
  var sum = 0;
  for (i = 0; i < arr1.length; i++) {
    sum += (arr1[i] - arr2[i])**2;
  }
  return sum**(0.5);
}

function quickSort(arr) { //sorts the arrays for a classification
  if (arr[1].length == 1 || arr[1].length == 0) {
    return arr;
  }
  var index = int(arr.length/2);
  var pivot = arr[1][index];
  var left = [];
  var right = [];
  for (i = 0; i < arr.length; i++) {
    if (arr[1][i] < pivot) {
      left[0].push(arr[0][i]);
      left[1].push(arr[1][i]);
    } else if (arr[1][i] > pivot) {
      right[0].push(arr[0][i]);
      right[1].push(arr[1][i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
}

function collectText(node) {
  // Idea for this code came from this StackOverflow post:
  // https://stackoverflow.com/questions/5904914/javascript-regex-to-replace-text-not-in-html-attributes/5904945#5904945
  // albeit slightly modified
  // thank you CS61A for linked lists & trees
  var first, rest;
  if (node.nodeType == 11 || node.nodeType == 1 || node.nodeType == 9) {
    first = node.firstChild;
    while (first) {
      rest = first.nextSibling;
      collectText(first);
      first = rest;
    }
  } else if (node.nodeType == 3) {
    theText += node.nodeValue;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  collectText(document.body);
  var txt = theText;
  var dictionary = buildDicts([["https://shaynak.github.io/assets/conservative1.txt", "right"]]);
  var classification = nearestNeighbors(dictionary, txt);
  document.getElementById("class").innerHTML = classification;
});
