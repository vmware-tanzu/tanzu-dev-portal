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

    opts.on("-m", "--move", "Move the files to a flat structure") do |d|
        options[:dry] = d
    end

end.parse!

# Gather the list of files to parse
contentPath = Dir.glob(File.join(File.join(options[:source], "/content/guides/**/*.md")))

# Add alias
contentPath.each do |f|
    next if f.split("/").last == "_index.md" # Do not parse index files
    fData = File.open(f).read
    contentMetadata = YAML.load(fData)

    newAliases = contentMetadata["aliases"].nil? ? [] : contentMetadata["aliases"]
    oldPath = "/content" + f.split("/content")[1]
    newAliases << oldPath.gsub("/content", "").gsub(".md", "")
    puts newAliases
    newAliases = newAliases.uniq
    
    contentMetadata["oldPath"] = oldPath
    contentMetadata["aliases"] = newAliases

    newPath = oldPath.gsub("content", "")
    newFile = File.join(File.expand_path(File.join(File.dirname(f), "..")), File.basename(f))

    if options[:dry]
        puts "#{f} -> #{newFile}"
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