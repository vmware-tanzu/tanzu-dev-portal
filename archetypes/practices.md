---
# remove "draft:true" when ready for final publication 
draft: true

title: "{{ (replace .Name "-" " ") | title }} - Page Title"
linkTitle: "{{ replace .Name "-" " " | title }} - Will Appear in Links"
description: "Short description about this practice or workshop"
# Note: remove any tags that are not relevant.
tags: ["Scoping", "Kickoff", "Discovery", "Framing", "Inception", "Transition", "Modernization", "Delivery"]
length: "Short sentence regarding how many minutes, hours, or days this workshop takes"
participants: "Who should be in this workshop? Examples include Core team, product stakeholders, designers, developers, etc."
# custom "cover" image example: "boris/boris.png"
image: "default-cover.png" 
lastmod: "{{ now.Format "2006-01-02" }}"
date: "{{ now.Format "2006-01-02" }}"
why: 
- The first reason why you might perform this practice
- Second if needed
- Third, etc.
when:
- First great time to perform his practice or workshop
- Second if needed
- Third, etc.
what:
- List of supplies and artifacts needed for this practice or workshop
- Super sticky 4x6 multicolor post-its, 4 pack
- Sharpies
- etc.

# If this practice or workshop has a Miro template: remote: true
remote: false
miro_template_url: "URL for related Miro template" 

---
## How to Use this Method
If needed, write any valuable history or context here prior to the Sample Agenda and Prompts.

***WARNING!*** ***WARNING!*** ***WARNING!*** 
 
This page will be available on public Internet! Think of the various audiences: future customers, current customers, partners, VMware employees, and anybody who happens to find this page. 

Things to keep in mind: 
 
- Assume someone at a software company found this page via Google.
- Avoid any company-specific terms or content. If in doubt about something: don't include it.
- Have several people read and vet this content before submitting it.   
- Don't assume the reader is a consultant or part of a consulting engagement. I'm looking at you, Tanzu Labs 😉. 
- No images that show customer-specific content like company names, sticky-notes, or design mock-ups
- No images of people's faces without written permission
- No links to internal sources, such as GDrive, SharePoint 
  
***WARNING!*** ***WARNING!*** ***WARNING!*** 

### Sample Agenda & Prompts
1. This is a numbered list of steps. With markdown, just keep using the `1.` and it'll automatically create the numbers.

   You'll often have multiple paragraphs in one step. Like this one.
   
   Just space them in 3 spaces `<space><space><space>` from the margin and they will fall under that step instead of creating a new step.

1. This will be the next step. It should render as `2`.

   {{< callout >}}
   Tip: This is a "callout". You can use it for Tips, Warnings, Info, Quotes, things like that. 
   {{< /callout >}}

1. You can embed images like this: 

   ![This is the default cover image as an example](/images/practices/default-cover.png)
   
   Images go in `/static/images/practices/<your-practice-folder>/the-image.png`
   
   Try not to make them to large either in pixels or disk space. 1280px on the longest side and 400KB or so max. 

## Success/Expected Outcomes
How do people know if this workshop was successful? 

## Facilitator Notes & Tips
Are there common ways by which this workshop gets off track? Notes like that are great for this section.

## Related Practices
If there are any related practices list them here.

- [Related Practice 1](/practices/related-practice-1)
- [Related Practice 2](/practices/related-practice-2)

Delete if unused.

## Variations
Are there alternative ways of performing this practice or workshop? Call out the differences here.

Delete if unused.

### Preceding
Optional. Delete if unused.

- [Specific practice that takes place before this one](/practices/related-practice-before)
 
### Following
Optional. Delete if unused.

- [Specific practice that takes place after one](/practices/related-practice-after)

## Real World Examples
Images, diagrams, or other interesting examples of this practice in the real world. Remember: no customer-identifying photos or notes, no faces. 

## Recommended Reading
Provide links to helpful books, slide decks, videos, etc. Remember: do not include links to internal resources.
