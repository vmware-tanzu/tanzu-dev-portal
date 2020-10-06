#!/usr/bin/env python3

import os, re, pyyoutube, jinja2, urllib.request, requests, json, uuid, yaml, pprint, datetime
import dateutil.parser as dparser
from jinja2 import Template
from operator import itemgetter

API_KEY = os.environ["API_KEY"]
EPISODES_PATH = os.environ["EPISODES_PATH"]
IMAGES_REL_PATH = os.environ["IMAGES_REL_PATH"]
IMG_PATH_PREFIX = os.environ["IMG_PATH_PREFIX"]
PLAYLIST_ID = os.environ["PLAYLIST_ID"]
TEMPLATE_FILE = os.environ["TEMPLATE_FILE"]

TITLE_PREFIX = os.environ["TITLE_PREFIX"] #"TGI Kubernetes"
TITLE_SUFFIX = os.environ["TITLE_SUFFIX"] #":"

def loadHugoFrontMatter(file):
    with open(file, 'r') as f:
        content = f.read().splitlines()
    counter = 0
    if content[0] == "---":
        content = content[1:]
    for line in content:
        if line == "---":
            content = content[0:counter]
            break
        counter+=1
    return "\n".join(content)

def getExistingEpisodes():
    print("==> Processing existing episodes in " + EPISODES_PATH)
    filelist = os.listdir(EPISODES_PATH)
    episodes = []
    numbers = []
    youtubeIDs = []
    for filename in filelist:
        try:
            if filename.endswith('.md'):
                frontMatter = loadHugoFrontMatter(os.path.join(EPISODES_PATH,filename))
                episode = yaml.load(frontMatter, Loader=yaml.SafeLoader)
                if episode["type"] == "tv-episode":
                    if episode["episode"] != "":
                        numbers.append(int(episode["episode"]))
                    if episode["youtube"] != "":
                        youtubeIDs.append(episode["youtube"])
                    episodes.append(episode)
        except:
            pass
    if len(numbers) > 0:
        maxEpisode = max(numbers)
    else:
        maxEpisode = 0
    return episodes, maxEpisode, youtubeIDs

def getEpisodeNumberFromTitle(title):
    try:
        number = int(title.split(TITLE_SUFFIX)[0][len(TITLE_PREFIX):])
    except:
        return 0
    return number

def fuzzyDate(date):
    try:
        return dparser.parse(str(date),fuzzy=True,ignoretz=True)
    except:
        return None

def getNewEpisodesInPlaylist(playlistId, above, existingVideoIDs):
    print ("==> Fetching youtube video metadata for playlist " + playlistId)
    api = pyyoutube.Api(api_key=API_KEY)
    list = api.get_playlist_items(playlist_id=playlistId,count=None)
    episodes = []

    YT_API_BASE_URL = "https://www.googleapis.com/youtube/v3/videos"
    YT_API_QS = "?part=snippet%2CliveStreamingDetails&key=" + API_KEY

    for item in list.items:
        print("----> Processing metadata for video " + item.snippet.resourceId.videoId)
        videoId = item.snippet.resourceId.videoId
        response = requests.get(YT_API_BASE_URL + YT_API_QS + "&id=" + videoId)
        videoList = json.loads(response.text)
        videoInfo = videoList["items"][0]["snippet"]
        liveInfo = {}
        try:
            liveInfo = videoList["items"][0]["liveStreamingDetails"]
        except:
            liveInfo["scheduledStartTime"] = None

        episodeDate = fuzzyDate(videoInfo["title"]) or fuzzyDate(liveInfo["scheduledStartTime"]) or fuzzyDate(videoInfo["publishedAt"]) or datetime.time()

        video = {
            "videoId": videoId,
            "title": videoInfo["title"],
            "description": videoInfo["description"],
            "imageUrl": videoInfo["thumbnails"]["medium"]["url"],
            "date": episodeDate,
        }
        episodes.append(video)

    print ("==> Comparing Youtube Videos with Episode List")
    episodes = sorted(episodes, key=itemgetter('date'), reverse=False)
    updateEpisodes = []
    for episode in episodes:
        print("---> episode: " + episode["title"] + ":")
        if getEpisodeNumberFromTitle(episode["title"]) == 0:
            above+=1
            episode["episode"] = str(above)
        else:
            episode["episode"] = str(getEpisodeNumberFromTitle(episode["title"]))

        if (not episode["date"]) or (episode["episode"] == 0):
            video["draft"] = "true"

        if int(episode["episode"]) in range(above-4, above+1): # Do the last 5 episodes all the time to make sure we update them
            updateEpisodes.append(episode)
            print("----> Updating as #" + episode["episode"] + "...")
        elif int(episode["episode"]) > above: # create new episodes
            updateEpisodes.append(episode)
            print("----> Saving as #" + episode["episode"] + "...")
        elif episode["videoId"] not in existingVideoIDs:
            updateEpisodes.append(episode)
            print("----> Adding Youtube Video to #" + episode["episode"] + "...")
        else:
            print("----> Skipping episode #" + episode["episode"] + " (already have it)...")
    return updateEpisodes

def writeNewEpisodeFiles(videos):
    templateLoader = jinja2.FileSystemLoader(searchpath="./")
    templateEnv = jinja2.Environment(loader=templateLoader)
    template = templateEnv.get_template(TEMPLATE_FILE)
    print("==> Writing episodes to hugo")
    for video in videos:
        imageFilename = IMG_PATH_PREFIX + IMAGES_REL_PATH + video["episode"] + ".jpg"
        markdownFilename = EPISODES_PATH + video["episode"] + ".md"
        print("---> fetching preview image from " + video["imageUrl"])
        urllib.request.urlretrieve(video["imageUrl"], imageFilename)
        video["image"] = IMAGES_REL_PATH + video["episode"] + ".jpg"
        outputText = template.render(video=video)
        print("---> writing " + markdownFilename)
        f = open(markdownFilename, "w")
        f.write(outputText)
        f.close()

existingEpisodes, latestExistingEpisode, YoutubeIDs = getExistingEpisodes()
videos = getNewEpisodesInPlaylist(PLAYLIST_ID, int(latestExistingEpisode), YoutubeIDs)
writeNewEpisodeFiles(videos)
