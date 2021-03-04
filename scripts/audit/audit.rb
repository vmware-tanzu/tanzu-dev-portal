require 'optparse'
require 'yaml'
require 'redcarpet'


def filter(options, headers, row) 
    matches = []
    
    if row[headers.index("tags")].size == 0
        matches.append("No Tags")
    end

    if row[headers.index("topics")].size == 0
        matches.append("No Topics")
    end
    
    if row[headers.index("description")].size == 0
        matches.append("No Description")
    end

    if row[headers.index("wordcount")].to_i > 5000
        matches.append("> 5000 words")
    end

    return matches
end

options = {}
OptionParser.new do |opts|
    opts.banner = "Usage: audit.rb [options]"

    opts.on("-s", "--source SOURCE", "Path to local TDC Source") do |s|
        options[:source] = s
    end

    opts.on("-f", "--filter", "Only include entries that match criteria for review") do |f|
        options[:filter] = true
    end
end.parse!

contentPath = File.join(options[:source], "/content/")
contentFiles = Dir.glob(File.join(contentPath, "/blog/*.md")) + Dir.glob(File.join(contentPath, "/guides/**/*.md"))

# Prepare the markdown renderer 
markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, extensions = {})

auditData = []
metaKeys = []

# First iteration to determain metadata keys
contentFiles.each do |f|
    next if f.split("/").last == "_index.md"
    fData = File.open(f).read
    contentMetadata = YAML.load(fData)
    contentMetadata["path"] = f.gsub(contentPath, "")
    
    # Calculate word count
    wordcount = markdown.render(fData.split("---").last).gsub(/<\/?[^>]*>/, "").split.length
    contentMetadata["wordcount"] = wordcount

    # Add any newly discovered unique keys
    contentMetadata.keys.each do |k|
        if not metaKeys.include? k
            metaKeys.push(k)
        end
    end

    auditData.push(contentMetadata)
end

# Print headers
if options[:filter]
    puts ["title", "path", "issues"].join("|")
else
    puts metaKeys.join("|")
end

auditData.each do |content|
    row = []
    metaKeys.each do |k|
        if content.has_key? k
            if content[k].is_a? Array
                row.push(content[k].join(", "))
            else
                row.push(content[k].to_s.strip)
            end
        else
            row.push("")
        end
    end

    if options[:filter]
        matches = filter(options, metaKeys, row)
        if matches.size > 0
            puts [
                row[metaKeys.index("title")], 
                row[metaKeys.index("path")], 
                matches.join(",")
            ].join("|")
        end
    else
        puts row.join("|")
    end
end