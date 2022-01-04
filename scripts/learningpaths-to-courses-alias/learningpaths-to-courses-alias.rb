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
contentPath = Dir.glob(File.join(File.join(options[:source], "/content/learningpaths/**/*.md")))

# Add alias
contentPath.each do |f|
    fData = File.open(f).read
    contentMetadata = YAML.load(fData)

    newAliases = contentMetadata["aliases"].nil? ? [] : contentMetadata["aliases"]
    oldPath = "/content/learningpaths" + f.split("/content/learningpaths")[1]
    newAliases << oldPath.gsub("/content", "").gsub(".md", "").gsub("_index", "")
    puts newAliases
    newAliases = newAliases.uniq
    
    contentMetadata["oldPath"] = oldPath
    contentMetadata["aliases"] = newAliases

    newPath = oldPath.gsub("content", "")

    if options[:dry]
        puts "---"
        puts contentMetadata["aliases"]
        puts "---"
    end 

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