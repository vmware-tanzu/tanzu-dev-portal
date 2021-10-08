require 'optparse'
require 'yaml'

TOPIC_KEY = "level1"
SUBTOPIC_KEY = "level2"

# Parse the command line flags
options = {}
OptionParser.new do |opts|
    opts.banner = "Usage: topic-check.rb [options]"

    opts.on("-t", "--source PATH", "Path to local TDC Source") do |s|
        options[:source] = s
    end

    opts.on("-t", "--topics PATH", "Path to topic reference YAML") do |o|
        options[:topics] = o
    end
end.parse!

# Parse the reference YAML
tYAML = YAML.load_file(options[:topics])
topicGroups = tYAML.keys
topics = {}
topicGroups.each do |g|
    topics = topics.merge(tYAML[g])
end

# Gather the list of files to parse
contentPath = File.join(options[:source], "/content/")
contentFiles = Dir.glob(File.join(contentPath, "/blog/*.md")) 
contentFiles += Dir.glob(File.join(contentPath, "/guides/**/*.md")) 
contentFiles += Dir.glob(File.join(contentPath, "/learningpaths/**/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/practices/**/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/samples/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/videos/*.md"))
#contentFiles += Dir.glob(File.join(contentPath, "/workshops/*.md"))

testsFailed = false

# Check the topics and subtopics
contentFiles.each do |f|
    fData = File.open(f).read
    contentMetadata = YAML.load(fData)
    
    if contentMetadata.has_key? TOPIC_KEY
        if not contentMetadata.has_key? SUBTOPIC_KEY
            testsFailed = true
            puts "#{f} -- Contains #{TOPIC_KEY} frontmatter but does not defined #{SUBTOPIC_KEY}"
        elsif not topics.has_key? contentMetadata[TOPIC_KEY]
            testsFailed = true
            puts "#{f} -- Undefined #{TOPIC_KEY}: #{contentMetadata[TOPIC_KEY]}"
        elsif topics.has_key? contentMetadata[TOPIC_KEY] and not topics[contentMetadata[TOPIC_KEY]].include? contentMetadata[SUBTOPIC_KEY]
            testsFailed = true
            puts "#{f} -- Unedfined #{SUBTOPIC_KEY}: #{contentMetadata[SUBTOPIC_KEY]}"
        end
    end
end

if testsFailed
    exit(1)
else
    exit(0)
end