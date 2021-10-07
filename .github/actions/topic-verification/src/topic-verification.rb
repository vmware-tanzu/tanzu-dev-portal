require 'optparse'
require 'yaml'

# Parse the command line flags
options = {}
OptionParser.new do |opts|
    opts.banner = "Usage: topic-verification.rb [options]"

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
