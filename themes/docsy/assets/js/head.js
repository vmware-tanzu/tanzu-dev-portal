var liveShowName, liveShowLink, liveShowStream;
function isTvShowLive(showName) {   

  var episodeShowNames = [], episodeLinks = [], episodeDates = [], episodeTimes = [], episodeLengths = [], episodeStreams = [];
      {{ range where (where .Site.Pages "Type" "tv-episode") "Date.Unix" "ge" now.Unix }}
        var epDate = new Date("{{ .Params.Date }}");
        episodeDates.push(epDate.toLocaleDateString());
        episodeTimes.push(epDate.toLocaleTimeString());
        episodeLengths.push({{ default 0 .Params.minutes }});
        episodeShowNames.push("{{ .Parent.Title }}");
        episodeLinks.push("{{ .Parent.Permalink | relURL }}");
        {{ if isset .Params "twitch" }}episodeStreams.push("twitch");{{ else }}episodeStreams.push("{{ .Params.youtube }}");{{ end }}
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
          liveShowStream = episodeStreams[index];
        }
      }
      return isLive;
}

var savedTheme = localStorage.getItem("light-dark-mode-storage") || "dark";
changeTheme(savedTheme);
function changeTheme(mode) {
    if (mode === "light") {
      var iframe = document.getElementById('auth-iframe');
      var head = document.head;
      var link = document.createElement("link");

      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = "{{ printf "%s" "/css/light-theme.css" | relURL }}";
      link.id = "light-theme"

      head.prepend(link);
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('light', '*');
      }
      document.documentElement.classList.add('light-mode')
    } 
}
