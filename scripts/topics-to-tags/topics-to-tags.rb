require 'optparse'
require 'yaml'

# Parse the command line flags
options = {}
OptionParser.new do |opts|
    opts.banner = "Usage: add-alias.rb [options]"

    opts.on("-s", "--source PATH", "Path to local TDC Source") do |s|
        options[:source] = s
    end

    opts.on("-d", "--dryrun", "Path to write the raw results") do |d|
        options[:dry] = d
    end
end.parse!

# Gather the list of files to parse
contentPath = Dir.glob(File.join(File.join(options[:source], "/content/guides/**/*.md")))
contentPath << Dir.glob(File.join(File.join(options[:source], "/content/learningpaths/**/*.md")))
contentPath << Dir.glob(File.join(File.join(options[:source], "/content/blog/*/*.md")))
contentPath << Dir.glob(File.join(File.join(options[:source], "/content/videos/*.md")))
contentPath << Dir.glob(File.join(File.join(options[:source], "/content/samples/*.md")))
contentPath << Dir.glob(File.join(File.join(options[:source], "/content/workshops/*.md")))
contentPath.flatten!
# Add alias
contentPath.each do |f|
    fData = File.open(f).read
    contentMetadata = YAML.load(fData)

    newTags = contentMetadata["tags"].nil? ? [] : contentMetadata["tags"]
    topics = contentMetadata["topics"].nil? ? [] : contentMetadata["topics"]
    newTags.append(contentMetadata["topics"])
    newTags = newTags.flatten.uniq.compact
    newTags = newTags.nil? ? [] : newTags
    contentMetadata["tags"] = newTags
    contentMetadata.delete("topics")

    # Most frontmatter should start with "---", meaning we split on the second occurance.
    # However we should double check to make sure
    splitFirst = false
    if not fData.start_with? "---"
        splitFirst = true
    end

    sContent = fData.split("---")
    frontMatter, articleContent = ""

    frontMatter = YAML.dump(contentMetadata)

    if splitFirst
        articleContent = sContent[1..]
    else
        articleContent = sContent[2..].join("---")
    end

    if not options[:dry]
        outFile = f
        puts "Writing to #{outFile} . . ."
        File.open(outFile, "w") { |f|
            f.write "#{frontMatter}---#{articleContent}"
        }
    end
end