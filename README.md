# antikythera
a bias checking chrome extension

This extension uses a 5-nearest neighbors clustering algorithm to determine the bias in a page. 
It analyzes word patterns in the HTML of a page and compares it to specific comparators.
It is not 100% accurate, but I intend on further improving the capabilities of the extension as time goes on.
The articles used in the test set were pulled from the New York Times' "Right and Left React" columns (the columns themselves are not used).
I have copied the text of the articles into text files hosted in my shaynak.github.io repository under "antikythera".
I will add more sources as time goes on to improve the accuracy of my clusterer.
They are listed below.

From https://www.nytimes.com/2017/12/05/us/politics/right-and-left-react-to-the-republican-tax-plan.html:

Conservative:
	https://www.bloomberg.com/view/articles/2017-12-04/trump-s-economic-revolution-is-all-about-investment
	http://www.nationalreview.com/article/454300/republicans-tax-bill-congresss-downward-spiral
	
Liberal:
	http://nymag.com/daily/intelligencer/2017/12/the-trump-tax-cuts-for-the-rich-must-and-will-be-repealed.html
	https://slate.com/business/2017/12/the-republican-tax-bill-is-for-winners.html
	
Center:
	https://theconversation.com/the-gop-doesnt-care-if-you-like-its-tax-plan-heres-why-88467
	https://www.usatoday.com/story/opinion/2017/11/30/senate-tax-bill-cuts-insurance-responsibility-editorials-debates/902769001/


From https://www.nytimes.com/2017/11/16/us/politics/right-and-left-al-franken.html:

Conservative:
	http://www.weeklystandard.com/al-franken-even-worse-than-you-think/article/2010505
	https://www.mediaite.com/online/i-loathe-al-franken-but-it-sure-seems-like-he-is-getting-totally-railroaded/
	http://www.nationalreview.com/article/453810/bill-clinton-allegations-liberals-admit-wrong
	
Liberal:
	https://www.washingtonpost.com/news/act-four/wp/2017/11/16/no-man-accused-of-sexually-harassing-a-woman-is-irreplaceable-not-even-al-franken/?utm_term=.401e65295140
	https://www.vox.com/policy-and-politics/2017/11/16/16666004/al-franken-donald-trump-sexual-harassment
	http://nymag.com/daily/intelligencer/2017/11/the-reckoning-over-sexual-misconduct-comes-to-the-democrats.html
	
Center:
	https://www.usnews.com/opinion/thomas-jefferson-street/articles/2017-11-14/democrats-must-confront-sexual-misconduct-from-bill-clinton-to-ted-kennedy
	http://theweek.com/articles/737817/al-franken-just-beginning
	http://www.cnn.com/2017/11/16/politics/franken-apology/index.html


From https://www.nytimes.com/2017/12/01/us/politics/right-and-left-michael-flynn-russia.html:

Conservative:
	http://www.nationalreview.com/article/454269/michael-flynn-plea-no-breakthrough-russia-investigation
	http://thefederalist.com/2017/12/01/mere-contact-foreigners-crime-obama-shouldve-locked-2008/
	
Liberal:
	https://www.newyorker.com/news/daily-comment/what-michael-flynns-plea-means-to-robert-muellerand-to-donald-trump
	https://www.thenation.com/article/flynn-pleads-guilty-is-he-singing-on-trump-russia/
	
Center:
	http://thehill.com/opinion/judiciary/362813-the-good-the-bad-and-the-ugly-of-the-flynn-indictment
	https://www.bloomberg.com/view/articles/2017-12-01/how-the-flynn-charges-box-in-trump
