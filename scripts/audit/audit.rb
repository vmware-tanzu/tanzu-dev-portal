require 'csv'
require 'optparse'
require 'redcarpet'
require 'yaml'

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

# Parse the command line flags
options = {}
OptionParser.new do |opts|
    opts.banner = "Usage: audit.rb [options]"

    opts.on("-s", "--source PATH", "Path to local TDC Source") do |s|
        options[:source] = s
    end

    opts.on("-o", "--output PATH", "Path to write the results") do |o|
        options[:output] = o
    end
end.parse!


# Prepae the CSV file to write the results
csv = CSV.open(options[:output], "w")
#csv = CSV.generate

# Gather the list of files to parse
contentPath = File.join(options[:source], "/content/")
contentFiles = Dir.glob(File.join(contentPath, "/blog/*.md")) + Dir.glob(File.join(contentPath, "/guides/**/*.md"))

# Prepare the markdown renderer 
markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, extensions = {})

auditData = []
metaKeys = []

# Gather the meta data from all the files, collecting the keys as the files are read
contentFiles.each do |f|
    next if f.split("/").last == "_index.md" # Do not parse index files
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

# Add extra column for audit data
metaKeys.push("audit")
csv << metaKeys

auditData.each do |content|
    # Process an individual row, add filter data
    row = []
    metaKeys.each do |k|
        if k == "audit"
            matches = filter(options, metaKeys, row)
            if matches.empty?
                row.push("")
            else
                row.push(matches.join(", "))
            end
        elsif content.has_key? k
            if content[k].is_a? Array
                row.push(content[k].join(", "))
            else
                row.push(content[k].to_s.strip)
            end
        else
            row.push("")
        end
    end

    csv << row
end

csv.close