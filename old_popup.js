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

function buildDicts(websites) { //creates a dictionary for every website
  var dictionary = [["classifier"]]; //adds a "classifier" thing to the column that holds classifiers

  for (let site of websites) { //collects text and classifier of each site
    console.log(dictionary);
    var inbetween = collectDataFromURL(site[0], site[1]);
    var words = inbetween[0];
    var classify = inbetween[1];

    dictionary[0].push(classify); //adds classifier to list
    var dict = checkNums(words, dictionary.slice(1)); //creates dictionary for the specific website we're looking at

    //next: adds the words in dict as a new line in dictionary
    for (j = 0; j < dict.length; j++) { //for each word in dictionary
      var indict = false; //assumes not in dictionary
      for (d = 1; d < dictionary.length; d++) { //for word in dictionary
        if (dict[j][0] == dictionary[d][0]) { //if words are same
          dictionary[d].push(dict[j][1]); //add word to end of dictionary list
          indict = true;
        }
      }

      if (!indict) { //if a word present isn't present in the dictionary
        var added = [dict[j][0]]
        for (p = 1; p < dictionary[1].length - 1; p++) { //goes to everything but the last value
          added.push(0);
        }
        added.push(dict[j][1]);
        dictionary.push(added); //adds the current value
      }
    }
  }
  return dictionary;
}

function checkNums(str, dict) { //adds value from a string to a dictionary
  if (dict) { //this block creates an array that contains an array for each word containing two values: word and word frequency
    for (i = 0; i < dict.length; i++) {
      dict[i] = dict[i].slice(0, 2);
      dict[i][1] = 0;
    }
  }

  str = str.toLowerCase(); //this block creates readable text / means we have no symbols
  str = str.replace(/\W/g, " ").replace('.', ' ').replace("↵", " ").replace("—", " ").replace("“", '"').replace("”", '"').replace(",", " ").replace("’", "'").replace(".", " ").replace("--", " ").replace("-", " ").replace(";", " ").replace("?", " ").replace("!", " ").replace(":", " ").replace("(", " ").replace(")", " ").replace('"', ' ').replace("  ", " ");
  var words = str.split(" ");

  for (i = 0; i < words.length; i++) {
    if (words[i] != "") { //makes sure no values in teh dictionary are ""
      var isin = false; //assumes word isn't in the dictionary
      if (dict) { //makes sure dict exists/no error
        for (d = 0; d < dict.length; d++) { //goes through every word in the dictionary for matching
          if (words[i] == dict[d][0]) { //if words[i] --> checks for a match
            dict[d][1] += 1; //adds a frequency to the dictionary
            isin = true; //sets isin
          }
        }
        if (!isin) { //if the word isn't in the dictionary...
          dict.push([words[i], 1]); //adds it to the dictionary
        }
      }
    }
  }
  return dict; //returns the created single value dictionary
}

function nearestNeighbors(dictionary, article) { //computes nearest neighbor based on matching words
  var art = checkNums(article, dictionary);
  console.log(art);
  console.log(dictionary);
  var arrs = [[], []];
  var dists = [[], []];
  var lolz = [];
  for (comp = 1; comp < dictionary[1].length; comp++) {
    for (i = 0; i < art.length; i++) {
      for (j = 1; j < dictionary.length; j++) {
        if (dictionary[j][0] == art[i][0]) {
          if (dictionary[j][comp] > 0 && art[i][1] > 0) {
            lolz.push(dictionary[j][0]);
          }
          if (dictionary[j][comp] != art[i][1]) {
            arrs[0].push(dictionary[j][comp]);
            arrs[1].push(art[i][1]);
          }
        }
      }
    }
    console.log(lolz);
    dists[0].push(dictionary[0][comp]);
    dists[1].push(distance(arrs[0], arrs[1]))
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
    if (arr[1].length == 1 || arr[1].length == 0) {
      return arr;
    } else if (arr[1].length == 2) {
      if (arr[1][0] > arr[1][1]) {
        return [[arr[0][1], arr[0], [0]], [arr[1][1], arr[1][0]]];
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


document.addEventListener('DOMContentLoaded', () => {
  var button = document.getElementById("clicker");

  var txt = chrome.extension.getBackgroundPage().txt;
  console.log(txt);

  button.addEventListener("click", () => {
    console.log(txt);
    document.getElementById("class").innerText = "Loading!";
    var dictionary = buildDicts([["cons_bloom_tax", "conservative"], ["cons_mediaite_franken", "conservative"], ["cons_natrev_tax", "conservative"], ["cons_weeklystand_franken", "conservative"], ["lib_nymag_tax", "liberal"], ["lib_vox_franken", "liberal"], ["lib_wpost_franken", "liberal"], ["lib_slate_tax", "liberal"], ["center_convo_tax", "center"], ["center_usatod_tax", "center"]]);
    var classification = nearestNeighbors(dictionary, txt);
    document.getElementById("class").innerText = classification;
  });
});