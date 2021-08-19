require 'optparse'
require 'yaml'
require 'csv'

# Parse the command line flags
options = {}
OptionParser.new do |opts|
    opts.banner = "Usage: import-nav-reorg.rb [options]"

    opts.on("-s", "--source [STRING]", "Path to local TDC Source") do |s|
        options[:source] = s
    end

    opts.on("-c", "--csv [STRING]", "Path to CSV file with changes") do |c|
        options[:csv] = c
    end

    opts.on("-t", "--types [STRING]", "CSV list of types of content to update") do |t|
        options[:types] = t
    end

    opts.on("-d", "Dry run") do |d|
        options[:dry] = d
    end

end.parse!

# Reference hash for types of content to update
types = options[:types].split(",")

# Parse the CSV and begin adding the meta data to each piece of content
c = CSV.parse(File.read(options[:csv]), headers: true)
c.each do |row|
    level1 = row["Level 1"] || ""
    level2 = row["Level 2"] || ""
    path = row["path"]
    type = row["type"]
   
    # Only update the file if dictated to do so from the CLI arguments
    if types.include? type
        contentPath = File.join(File.join(options[:source], "/content/#{path}"))
        
        fData = File.open(contentPath).read
        contentMetadata = YAML.load(fData)

        contentMetadata["level1"] = level1
        contentMetadata["level2"] = level2

        if not options[:dry]
            # Most frontmatter should start with "---", meaning we split on the second occurance.
            # However we should double check to make sure
            splitFirst = false
            if not fData.start_with? "---"
                splitFirst = true
            end

            # Gather the frontmatter and content to write 
            sContent = fData.split("---")
            frontMatter, articleContent = ""
            frontMatter = YAML.dump(contentMetadata)
            if splitFirst
                articleContent = sContent[1..]
            else
                articleContent = sContent[2..].join("---")
            end

            # Write the changes to the file
            outFile = contentPath
            puts "Writing to #{outFile} . . ."
            File.open(outFile, "w") { |f|
                f.write "#{frontMatter}---#{articleContent}"
            }
        else
            # Dry run
            #puts "#{path} -> #{level1} // #{level2}"
            puts "-----------------"
            puts contentMetadata
            puts "-----------------"
        end
    end

end