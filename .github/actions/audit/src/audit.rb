require 'csv'
require 'optparse'
require 'redcarpet'
require 'yaml'

TDC_URL = "https://tanzu.vmware.com/developer"

# Check each row for a series of criteria, adding a tag to a list
# of results that will be included as a row in the final document
def filter(options, headers, row) 
    matches = []
    
    # No Tag(s)
    if row[headers.index("tags")].size == 0
        matches.append("No Tags")
    end
    
    # No Description
    if row[headers.index("description")].size == 0
        matches.append("No Description")
    end

    # > 5000 words (potentially look at shortening)
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

    opts.on("-o", "--output PATH", "Path to write the raw results") do |o|
        options[:output] = o
    end

    opts.on("-t", "--tags PATH", "Path to write the tally results of the tags") do |t|
        options[:tags] = t
    end

    opts.on("-e", "--errors PATH", "Path to write the tally results of errors") do |e|
        options[:errors] = e
    end

end.parse!

# Prepare the CSV file to write the results
csv = CSV.open(options[:output], "w")
#csv = CSV.generate

# Gather the list of files to parse
contentPath = File.join(options[:source], "/content/")

contentFiles = Dir.glob(File.join(contentPath, "/blog/*.md")) 
contentFiles += Dir.glob(File.join(contentPath, "/guides/**/*.md")) 
contentFiles += Dir.glob(File.join(contentPath, "/outcomes/**/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/practices/**/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/samples/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/tv/**/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/videos/*.md"))
contentFiles += Dir.glob(File.join(contentPath, "/workshops/*.md"))

# Prepare the markdown renderer 
markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, extensions = {})

auditData = []
metaKeys = []

# Add the title and type columns first
metaKeys.push("title")
metaKeys.push("type")

tagsTally = {}
tanzuProductsTally = {}
errorsTally = {}

# Gather the metadata from all the files, collecting the keys as the files are read
contentFiles.each do |f|
    next if f.split("/").last == "_index.md" # Do not parse index files
    fData = File.open(f).read
    contentMetadata = YAML.load(fData)
    newMetadata = {}
    contentMetadata.keys.each do |k|
        newMetadata[k.downcase] = contentMetadata[k]
    end
    contentMetadata = newMetadata

    # Normalize dates
    if contentMetadata.has_key? "date"
        if contentMetadata["date"].is_a? String
            contentMetadata["date"] = DateTime.parse(contentMetadata["date"])
        elsif contentMetadata["date"].is_a? Date
            contentMetadata["date"] = contentMetadata["date"].to_datetime
        elsif contentMetadata["date"].is_a? Time
            contentMetadata["date"] = contentMetadata["date"].to_datetime
        end
    end

    contentMetadata["path"] = f.gsub(contentPath, "")

    # Add a column for the type of content
    contentMetadata["type"] = contentMetadata["path"].split("/").first

    # Add a column for the direct URL
    if contentMetadata["type"] == 'blog'
        contentMetadata["url"] = [TDC_URL, contentMetadata["path"].split("/")[0...-1].join("/"), contentMetadata["title"].downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')].join("/")
    else
        contentMetadata["url"] = [TDC_URL, contentMetadata["path"].gsub('.md', '')].join("/")
    end
    contentMetadata["url"] = contentMetadata["url"].gsub('---', '-').gsub('--', '-')

    # Calculate word count
    wordcount = markdown.render(fData.split("---").last).gsub(/<\/?[^>]*>/, "").split.length
    contentMetadata["wordcount"] = wordcount

    # Tally the tags
    if contentMetadata.has_key? "tags"
        contentMetadata["tags"].each do |t|
            if tagsTally.has_key? t.downcase
                tagsTally[t.downcase] += 1
            else
                tagsTally[t.downcase] = 1
            end
        end
    end
   
    # Tally the products
    if contentMetadata.has_key? "products"
        contentMetadata["products"].each do |t|
            if tanzuProductsTally.has_key? t.downcase
                tanzuProductsTally[t.downcase] += 1
            else
                tanzuProductsTally[t.downcase] = 1
            end
        end
    end

    # Add any newly discovered unique keys
    contentMetadata.keys.each do |k|
        if not metaKeys.include? k.downcase
            metaKeys.push(k.downcase)
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

            # Iterate through the filter results to tally issues
            if matches.empty?
                if errorsTally.has_key? "None"
                    errorsTally["None"] += 1
                else
                    errorsTally["None"] = 1
                end
            else 
                matches.each do |m|
                    if errorsTally.has_key? m
                        errorsTally[m] += 1
                    else
                        errorsTally[m] = 1
                    end
                end
            end

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

# If defined, write the tags tally to a CSV
if options.has_key? :tags
    CSV.open(options[:tags], "wb") do |csv|
        tagsTally.each do |t|
            csv << t
        end
    end
end

# If defined, write the errors tally to a CSV
if options.has_key? :errors
    CSV.open(options[:errors], "wb") do |csv|
        errorsTally.each do |e|
            csv << e
        end
    end
end