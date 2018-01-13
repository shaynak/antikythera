# antikythera
a bias checking chrome extension

This extension uses a 5-nearest neighbors clustering algorithm to determine the bias in a page. 
It analyzes word patterns in the HTML of a page and compares it to specific comparators.
The words used in the analysis are found in the phrases mentioned in this study https://papers.ssrn.com/sol3/papers.cfm?abstract_id=947640, in addition to the words: [donald trump barack obama mike pence joe biden hillary clinton alt right].
It is not 100% accurate, but I intend on further improving the capabilities of the extension as time goes on.
The articles used in the test set were pulled from the New York Times' "Right and Left React" columns (the columns themselves are not used).
I have copied the text of the articles into text files hosted in my shaynak.github.io repository under "antikythera". Links to sources are located in the same repository in the "sources.txt" file.
I will add more sources as time goes on to improve the accuracy of my clusterer. 
