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
contentFiles = []

# contentFiles = Dir.glob(File.join(contentPath, "/blog/*.md")) 
contentFiles += Dir.glob(File.join(contentPath, "/guides/**/*.md")) 
# contentFiles += Dir.glob(File.join(contentPath, "/learningpaths/**/*.md"))
# contentFiles += Dir.glob(File.join(contentPath, "/practices/**/*.md"))
# contentFiles += Dir.glob(File.join(contentPath, "/samples/*.md"))
# contentFiles += Dir.glob(File.join(contentPath, "/videos/*.md"))
# contentFiles += Dir.glob(File.join(contentPath, "/workshops/*.md"))

# Remove the guides landing page, which does not require topic metadata
contentFiles.delete("./content/guides/_index.md")

testsFailed = false

# Check the topics and subtopics
contentFiles.each do |f|
    fData = File.open(f).read
    contentMetadata = YAML.load(fData)
    
    if contentMetadata.has_key? TOPIC_KEY
        if not contentMetadata.has_key? SUBTOPIC_KEY
            puts "#{f} -- Contains #{TOPIC_KEY} frontmatter but does not defined #{SUBTOPIC_KEY}"
            testsFailed = true
        elsif not topics.has_key? contentMetadata[TOPIC_KEY]
            puts "#{f} -- Undefined #{TOPIC_KEY}: #{contentMetadata[TOPIC_KEY]}"
            testsFailed = true
        elsif topics.has_key? contentMetadata[TOPIC_KEY] and not topics[contentMetadata[TOPIC_KEY]].include? contentMetadata[SUBTOPIC_KEY]
            puts "#{f} -- Unedfined #{SUBTOPIC_KEY}: #{contentMetadata[SUBTOPIC_KEY]}"
            testsFailed = true
        end
    else
        puts "#{f} -- Does not contain #{TOPIC_KEY} frontmatter"
        testsFailed = true
    end
end

puts testsFailed
if testsFailed
    exit(1)
else
    exit(0)
end