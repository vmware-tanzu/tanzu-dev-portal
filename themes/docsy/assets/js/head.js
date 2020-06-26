var liveShowName, liveShowLink;
function isTvShowLive(showName) {   

  var episodeShowNames = [], episodeLinks = [], episodeDates = [], episodeTimes = [], episodeLengths = [];
      {{ range where (where .Site.Pages "Type" "tv-episode") "Date.YearDay" "ge" now.YearDay }}  
        var epDate = new Date("{{ .Params.Date }}");
        episodeDates.push(epDate.toLocaleDateString());
        episodeTimes.push(epDate.toLocaleTimeString());
        episodeLengths.push({{ .Params.minutes }});
        episodeShowNames.push("{{ .Parent.Title }}");
        episodeLinks.push("{{ .Parent.Permalink | relURL }}");
      {{ end }}
      var currentDate = (new Date(Date.now())).toLocaleDateString();
      var index = episodeDates.indexOf(currentDate);
      var isLive = false;
      if (index > -1) {
        var startTime = (new Date(episodeDates[index] + " " + episodeTimes[index])).getTime();
        var endTime = startTime + (episodeLengths[index] * 60 * 1000);
        var currentTime = (new Date(Date.now())).getTime();
        
        if (showName == null)
          isLive = (currentTime < endTime && currentTime > startTime); 
        else
          isLive = (currentTime < endTime && currentTime > startTime && episodeShowNames[index] == showName); 
        
        if (isLive) {
          liveShowName = episodeShowNames[index];
          liveShowLink = episodeLinks[index];
        }
      }

      return isLive;
}

var savedTheme = localStorage.getItem("light-dark-mode-storage") || "dark";
changeTheme(savedTheme);
function changeTheme(mode) {
    if (mode === "light") {
      var head = document.head;
      var link = document.createElement("link");

      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = {{ printf "%s" "/css/light-theme.css" | relURL }};
      link.id = "light-theme"

      head.prepend(link);
      
      document.documentElement.classList.add('light-mode')
    } 
}