Sentry.init({
  dsn: "https://91138cf7f17842fd8a57d45372bf538c@o448817.ingest.sentry.io/5712977",
  integrations: [new Sentry.Integrations.BrowserTracing()],
  release: "devcenter-site@{{ .GitInfo.Hash }}",
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

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

function sendAmplitudeEventOnLoad(eventType, eventProperties) {
  $(window).on('load', function(e){dataLayer.push({'event': 'logEvent', 'eventType': eventType, 'eventProperties': eventProperties});});
}
function sendAmplitudeEvent(eventType, eventProperties) {
  // Clear out persisted properties from previous/onload events
  var event = dataLayer.find(element => element["event"] == "logEvent");
  var existingProps = Object.keys(event["eventProperties"]);
  var newProps = Object.keys(eventProperties);
  var difference = existingProps.filter(x => !newProps.includes(x));
  var removeProps = {};
  difference.forEach(element => {
    var newObject = {};
    removeProps[element] = undefined;
  });
  Object.assign(eventProperties, removeProps);
  dataLayer.push({'event': 'logEvent', 'eventType': eventType, 'eventProperties': eventProperties});
}
function sendAmplitudeUserPropsOnLoad(userProperties) {
  $(window).on('load', function(e){dataLayer.push({'event': 'setUserProperties', 'userProperties': userProperties});});
}
function sendAmplitudeUserProps(userProperties) {
  dataLayer.push({'event': 'setUserProperties', 'userProperties': userProperties});
}
function setAmplitudeUserId(userId) {
  dataLayer.push({'event': 'setUserId', 'userId': userId});
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }

  return decodeURI(dc.substring(begin + prefix.length, end));
}
