var searchresultscontainermain = document.getElementById('search-results-container');

var searchLinks = document.createElement("div");
searchLinks.setAttribute("class","search-links");
searchresultscontainermain.appendChild(searchLinks);	

var searchresultscontainer = document.createElement("div");
searchresultscontainer.setAttribute("class","searchresultscontainer");
searchresultscontainermain.appendChild(searchresultscontainer);	

var searchResults = document.createElement("div");
searchResults.setAttribute("id","searchResults");
searchresultscontainer.appendChild(searchResults);	

var searchResultsMore = document.createElement("div");
searchResultsMore.setAttribute("id","searchResultsMore");
searchresultscontainer.appendChild(searchResultsMore);	


var cssElm = document.createElement("link");
cssElm.setAttribute("rel","stylesheet");
cssElm.setAttribute("media","all");
cssElm.setAttribute("href","/developer/css/search.css");
cssElm.setAttribute("type","text/css");
document.body.appendChild(cssElm);	



var searchEngineID = "3hzywhss5ik"
var searchResultsText = "Search results for "


function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}

var query = getQueryStringValue("q");

if (query) {

	if (getQueryStringValue("tbm")) {
		var tbm = '&tbm=' + getQueryStringValue("tbm");
		var tbmvalue = getQueryStringValue("tbm");
	} else {
		var tbm = '';
		var tbmvalue = '';		
	}

	var start = getQueryStringValue("start");

	if (start === "1&" || document.URL.indexOf("start=") === -1)
	start = 1;

	document.getElementById("search-results-info").innerHTML = searchResultsText + "\"" + query.replace(/\+/g,' ').replace(/%3A/g,':').replace(/</g, '&lt;').replace(/"/g, '&quot;') + "\"";


	function hndlr(response) {

	if (response.items == null) {
		document.getElementById("searchResultsMore").innerHTML = "No Results";
		if (tbm) {
			window.location.href.replace("search?start=" + (start - 10) + "&q=" + query + tbm);
		} else {
			window.location.href.replace("search?start=" + (start - 10) + "&q=" + query);
		}
		return;
	}


	//Clear div
	document.getElementById("searchResults").innerHTML = "";
		

	for (var i = 0; i < response.items.length; i++) {
		var item = response.items[i];
		var content = "";

		content += "<div class='gs-webResult gs-result'>" + "<table class='gsc-table-result'><tbody><tr>";

		//Link
		content += "<td><a class='gs-title' href='" + item.link + "'>" + item.htmlTitle + "</a><br/>";

		//Description

		content += item.htmlSnippet.replace(/\<br\>/g,' ') + "<div class='gs-bidi-page-align gs-visibleUrl gs-visibleUrl-long' dir='ltr' style='word-break:break-all;'>" + item.htmlFormattedUrl +"</div>" +
		"</td></tr></tbody></table></div>";

		document.getElementById("searchResults").innerHTML += content;
	}


	//Page Controls

	var totalPages = Math.ceil(response.searchInformation.totalResults / 10);

	var currentPage = Math.floor(start / 10 + 1);

	var pageControls = "<div class='gsc-results'><div class='gsc-cursor-box gs-bidi-start-align' dir='ltr'><div class='gsc-cursor'>";


	//Page change controls, 10 max.

	for (var x = 1; x <= totalPages && x<=10; x++) {
		
		pageControls += "<div class='gsc-cursor-page";
		
		if (x === currentPage)

			pageControls += " gsc-cursor-current-page";
		
			var pageLinkStart = x * 10 - 9;
		
			pageControls+="'><a href='search.html?start="+pageLinkStart+"&q="+query+tbm+"'>"+x+"</a></div>";
		}

		pageControls += "</div></div></div>";

		document.getElementById("searchResults").innerHTML += pageControls;
	}


	function search(filter) {
		//Load the script src dynamically to load script with query to call.
		// DOM: Create the script element
		var jsElm = document.createElement("script");

		// set the type attribute
		jsElm.type = "application/javascript";

		// make the script element load file
		jsElm.src = "https://www.googleapis.com/customsearch/v1?key=AIzaSyBnXTSF8N2EJNAb7D5UkFfVwbyxte7hjh0&cx=012029519579280034868:"+searchEngineID+"&start="+start+"&q=" +query +"&callback=hndlr" + filter;

		// finally insert the element to the body element in order to load the script
		document.body.appendChild(jsElm);	
	}

	var allLink = document.createElement("div");
	allLink.setAttribute("id","all-link");
	allLink.setAttribute("class","gsc-tabHeader gsc-inline-block active-tab");
	searchLinks.appendChild(allLink);	


	if (window.location.search.indexOf('tbm') > -1) {


		var elems = document.querySelectorAll(".active-tab");

		[].forEach.call(elems, function(el) {
		    el.classList.remove("active-tab");
		});


		if (start) {
			var filterLink = window.location.search.replace(tbm,'').replace(start,'1');
		} else {
			var filterLink = window.location.search.replace(tbm,'');
		}

	} else {

		if (start) {
			var filterLink = window.location.search.replace(start,'1');
		} else {
			var filterLink = window.location.search;
		}		

	}


	var allText = document.createElement("span");
	allText.innerHTML = "All Results";
	allLink.appendChild(allText);	

	allLink.onclick = allClick;

	function allClick() {
		window.location.search = filterLink;
	}


	var pivioLink = document.createElement("div");
	pivioLink.setAttribute("id","pivio-link");
	pivioLink.setAttribute("class","gsc-tabHeader gsc-inline-block");
	searchLinks.appendChild(pivioLink);	

	var pivioText = document.createElement("span");
	pivioText.innerHTML = "Pivotal.io";
	pivioLink.appendChild(pivioText);	

	pivioLink.onclick = pivioClick;

	function pivioClick() {
		window.location.search = filterLink + '&tbm=pivio';
	}
	 

	var cntntLink = document.createElement("div");
	cntntLink.setAttribute("id","cntnt-link");
	cntntLink.setAttribute("class","gsc-tabHeader gsc-inline-block");
	searchLinks.appendChild(cntntLink);	

	var cntntText = document.createElement("span");
	cntntText.innerHTML = "Blog &amp; Resources";
	cntntLink.appendChild(cntntText);	

	cntntLink.onclick = cntntClick;

	function cntntClick() {
		window.location.search = filterLink + '&tbm=cntnt';
	}


	var docsLink = document.createElement("div");
	docsLink.setAttribute("id","docs-link");
	docsLink.setAttribute("class","gsc-tabHeader gsc-inline-block");
	searchLinks.appendChild(docsLink);

	var docsText = document.createElement("span");
	docsText.innerHTML = "Documentation";
	docsLink.appendChild(docsText);		

	docsLink.onclick = docsClick;

	function docsClick() {
		window.location.search = filterLink + '&tbm=docs';
	}


	var kbLink = document.createElement("div");
	kbLink.setAttribute("id","kb-link");
	kbLink.setAttribute("class","gsc-tabHeader gsc-inline-block");
	searchLinks.appendChild(kbLink);

	var kbText = document.createElement("span");
	kbText.innerHTML = "Community";
	kbLink.appendChild(kbText);			

	kbLink.onclick = kbClick;

	function kbClick() {
		window.location.search = filterLink + '&tbm=kb';
	}


	var ntwrkLink = document.createElement("div");
	ntwrkLink.setAttribute("id","ntwrk-link");
	ntwrkLink.setAttribute("class","gsc-tabHeader gsc-inline-block");
	searchLinks.appendChild(ntwrkLink);	

	var ntwrkText = document.createElement("span");
	ntwrkText.innerHTML = "Downloads";
	ntwrkLink.appendChild(ntwrkText);	

	ntwrkLink.onclick = ntwrkClick;

	function ntwrkClick() {
		window.location.search = filterLink + '&tbm=ntwrk';
	}


	if (window.location.search.indexOf('pivio') > -1) {

		document.getElementById("pivio-link").classList.add('active-tab');

		var pivioFilter = "&siteSearch=tanzu.vmware.com/developer&siteSearchFilter=i"

		search(pivioFilter);

	} else if (window.location.search.indexOf('cntnt') > -1) {

		document.getElementById("cntnt-link").classList.add('active-tab');

		var cntntFilter = "&siteSearch=tanzu.vmware.com/developer/blog&siteSearchFilter=i"

		search(cntntFilter);

	} else if (window.location.search.indexOf('docs') > -1) {

		document.getElementById("docs-link").classList.add('active-tab');

		var docsFilter = "&siteSearch=docs.pivotal.io&siteSearchFilter=i"

		search(docsFilter);

	} else if (window.location.search.indexOf('kb') > -1) {

		document.getElementById("kb-link").classList.add('active-tab');

		var kbFilter = "&siteSearch=community.pivotal.io&siteSearchFilter=i"

		search(kbFilter);

	} else if (window.location.search.indexOf('ntwrk') > -1) {

		document.getElementById("ntwrk-link").classList.add('active-tab');

		var ntwrkFilter = "&siteSearch=network.pivotal.io&siteSearchFilter=i"

		search(ntwrkFilter);

	} else {

		document.getElementById("all-link").classList.add('active-tab');

		var noFilter = '';

		search(noFilter);

	}

}//end if query
