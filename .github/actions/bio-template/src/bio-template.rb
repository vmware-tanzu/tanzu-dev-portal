require 'optparse'
require 'uri'
require 'net/http'

TEMPLATE_FILENAME = "template.md"
INDEX_FILENAME = "_index.md"
MARKER_REGEX = /<!\-\- ?URL: ?(.*) ?\-\->/

# Parse the command line flags
options = {}
parser = OptionParser.new do |opts|
    opts.banner = "Usage: bio-template.rb [options]"

    opts.on("-s", "--source PATH", "Path to local TDC Source") do |s|
        options[:source] = s
    end
    opts.on("-d", "--dryrun", "Do a dry run, printing the markdown instead of writing to a file") do |d|
        options[:dryrun] = true
    end
end
parser.parse!

# Ensure the required options are included
if options[:source].nil?
    puts parser.help
    exit 1
end

# Determine if the bio template has a marker to pull in 
# external data
def processTemplate(inPath, outPath, dryrun)

    outFD = nil
    if !dryrun
        outFD = File.open(outPath, "w")
    end

    File.open(inPath).each do |l|
        if MARKER_REGEX.match(l)
             url = l.gsub(MARKER_REGEX, "\\1")
             data = fetchURL(url.strip)
             writeToFile(data, outFD, dryrun)
        else 
            writeToFile(l, outFD, dryrun)
        end 
    end
end

def writeToFile(text, outFD, dryrun)
    if dryrun
        puts text
    else
        outFD.write("#{text}\n")
    end
end

# Some URL need special handling (ie. to prevent rate limiting), so let's
# figure out if we need to handle a special case
def fetchURL(url) 
   uri = URI(url)
   headers = {}
   if uri.host == "github.com" or uri.host == "raw.githubusercontent.com"
        # Get Auth Header
   end
   return fetchContent(uri, headers)
end

# Fetch the content from the specified URL, including any required headers
def fetchContent(uri, headers)
    req = Net::HTTP::Get.new(uri)
    headers.keys.each do |h|
        req[h] = headers[h]
    end

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http|
        http.request(req)
    }

    return res.body
end


# Gather the list of files to parse
contentPath = File.join(options[:source], "/content/")
contentFiles = Dir.glob(File.join(contentPath, "/team/*/")) 

# Iterate over each team page that has a template file
contentFiles.each do |mem|
    templatePath = File.join(mem, TEMPLATE_FILENAME)
    if File.exists?(templatePath)
        outPath = File.join(mem, INDEX_FILENAME)
        processTemplate(templatePath, outPath, options[:dryrun])
    end    
end

