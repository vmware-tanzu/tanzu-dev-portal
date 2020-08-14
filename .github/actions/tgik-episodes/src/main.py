#!/usr/bin/env python3

import os, re, pyyoutube, jinja2, urllib.request
from jinja2 import Template

API_KEY = os.environ["API_KEY"]
EPISODES_PATH = os.environ["EPISODES_PATH"]
IMAGES_PATH = os.environ["IMAGES_PATH"]
PLAYLIST_ID = os.environ["PLAYLIST_ID"]
TEMPLATE_FILE = os.environ["TEMPLATE_FILE"]


TITLE_PREFIX = "TGI Kubernetes"
TITLE_SUFFIX = ":"

def getLatestExistingEpisodeNumber():
    filelist = os.listdir(EPISODES_PATH)
    episodes = []
    for filename in filelist:
        try:
            episodes.append(int(re.compile(r"(\d+)").match(filename).group(1)))
        except:
            pass
    return max(episodes)


def getEpisodeNumberFromTitle(title):
  return int(title.split(TITLE_SUFFIX)[0][len(TITLE_PREFIX):])

def getNewEpisodesInPlaylist(playlistId, above):
    api = pyyoutube.Api(api_key=API_KEY)
    list = api.get_playlist_items(playlist_id=playlistId,count=None)
    episodes = []

    for item in list.items:
        videoId = item.snippet.resourceId.videoId
        videoList = api.get_video_by_id(video_id=videoId,parts=["snippet"])
        videoInfo = videoList.items[0].snippet
        episodeNumber = getEpisodeNumberFromTitle(videoInfo.title)
        video = {
            "videoId": videoId,
            "title": videoInfo.title,
            "description": videoInfo.description,
            "imageUrl": videoInfo.thumbnails.medium.url,
            "publishDate": videoInfo.publishedAt,
            "episode": str(episodeNumber).zfill(4),
            "live": videoInfo.liveBroadcastContent
        }
        if (episodeNumber > above):
            episodes.append(video)
            print("Saving episode " + video["episode"] + "...")
        else:
            print("Skipping episode " + video["episode"] + " (already have it)...")
    return episodes
        
def writeNewEpisodeFiles(videos):
    templateLoader = jinja2.FileSystemLoader(searchpath="./")
    templateEnv = jinja2.Environment(loader=templateLoader)
    template = templateEnv.get_template(TEMPLATE_FILE)
    for video in videos:
        imageFilename = IMAGES_PATH + video["episode"] + ".jpg"
        markdownFilename = EPISODES_PATH + video["episode"] + ".md"
        urllib.request.urlretrieve(video["imageUrl"], imageFilename)
        video["image"] = imageFilename
        outputText = template.render(video=video)
        f = open(markdownFilename, "w")
        f.write(outputText)
        f.close()

latestExistingEpisode = getLatestExistingEpisodeNumber()
videos = getNewEpisodesInPlaylist(PLAYLIST_ID, latestExistingEpisode)
writeNewEpisodeFiles(videos)



