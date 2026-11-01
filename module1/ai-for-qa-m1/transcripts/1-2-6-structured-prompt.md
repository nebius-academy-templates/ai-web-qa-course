# Structured prompt: 20 UK customer records

**Used in:** 1.2.6 walkthrough steps 4 to 7

**STATUS: CAPTURED in a real claude.ai chat on 2026-10-31.** The prompt was typed into the claude.ai web chat (signed-in Pro account, driven through a browser), and the output below is copied from that conversation's own data, unedited. This replaces the 2026-10-09 subagent capture.

## Structured prompt (a fresh conversation)

**Prompt (paste exactly):**

```
Generate 20 fictional customer records for an online TechShop. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:17 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `0c129dee-de7e-4cc4-a9cd-c860d8cf9018` (new chat)

**Verbatim output:**

Claude saved the records as a CSV file and also showed them as a table in the chat. Both are below. Lines in square brackets such as `[tool call: mcp__Claude_Docs__update]` mark where Claude used a tool between chat messages; they are not part of the text Claude wrote.

### Chat reply

````
I'll create the 20 records as a spreadsheet you can sort and export.

[tool call: Artifact]

[tool call: Write]

[tool call: SendUserFile]

Here are the 20 customer records in techshop_customers.csv, ready to import into Excel, Google Sheets or a database:

| ID | Name | Email | Phone | Shipping address |
|---|---|---|---|---|
| TS-0001 | Olivia Hartley | olivia.hartley@example.com | 07700 900101 | 14 Rosewood Avenue, Bristol, BS6 7QT |
| TS-0002 | James Whitcombe | j.whitcombe@example.com | 07700 900214 | Flat 3 Albion Court, Manchester, M14 5RL |
| TS-0003 | Priya Chandran | priya.chandran@example.com | 07700 900327 | 52 Linden Grove, Leicester, LE2 3FN |
| TS-0004 | Callum McAllister | callum.mcallister@example.com | 07700 900438 | 7 Kelvinhaugh Street, Glasgow, G3 8NX |
| TS-0005 | Sophie Bramwell | sophie.bramwell@example.com | 07700 900519 | 21 Mill Lane, York, YO31 7TP |
| TS-0006 | Daniel Okafor | dan.okafor@example.com | 07700 900642 | 88 Ashford Road, Croydon, CR0 2HW |
| TS-0007 | Eleanor Pritchard | eleanor.pritchard@example.com | 07700 900753 | 4 Heol Y Coed, Cardiff, CF14 6JB |
| TS-0008 | Harry Lindqvist | harry.lindqvist@example.com | 07700 900866 | The Old Forge, Church Street, Ludlow, SY8 1AQ |
| TS-0009 | Amelia Rourke | amelia.rourke@example.com | 07700 900977 | 39 Ormeau Park Terrace, Belfast, BT7 3GK |
| TS-0010 | Mohammed Rahman | m.rahman@example.com | 07700 900188 | 112 Coventry Road, Birmingham, B10 0RX |
| TS-0011 | Grace Fenwick | grace.fenwick@example.com | 07700 900293 | 6 Jesmond Vale, Newcastle upon Tyne, NE2 1PL |
| TS-0012 | Thomas Ellery | tom.ellery@example.com | 07700 900374 | 17 Harbour View, Falmouth, TR11 3DS |
| TS-0013 | Isla Drummond | isla.drummond@example.com | 07700 900415 | Flat 2F1, 45 Marchmont Road, Edinburgh, EH9 1HU |
| TS-0014 | Oliver Kaczmarek | oliver.kaczmarek@example.com | 07700 900526 | 63 Station Road, Reading, RG1 4LG |
| TS-0015 | Chloe Ashdown | chloe.ashdown@example.com | 07700 900631 | 9 Beechcroft Close, Norwich, NR4 7DZ |
| TS-0016 | Benjamin Hughes-Taylor | ben.hughestaylor@example.com | 07700 900748 | 26 Clarendon Street, Leamington Spa, CV32 5SR |
| TS-0017 | Aisha Begum | aisha.begum@example.com | 07700 900859 | 140 Granby Street, Liverpool, L8 2US |
| TS-0018 | Lewis Treharne | lewis.treharne@example.com | 07700 900962 | 3 Mumbles Road, Swansea, SA3 4EA |
| TS-0019 | Hannah Sorensen | hannah.sorensen@example.com | 07700 900075 | 58 Ecclesall Road, Sheffield, S11 8PX |
| TS-0020 | George Whitlock | george.whitlock@example.com | 07700 900180 | 11 Kingsmead Square, Bath, BA1 2AD |

To keep the data fictional and safe to use in testing:
- **Phone numbers** come from Ofcom's 07700 900000–900999 range, which is reserved for fiction and never assigned to real people.
- **Emails** use example.com, a domain reserved for documentation, so test emails can never reach a real inbox.
- **Addresses** use real towns and valid-format postcodes so they pass address validation. The house numbers, flat details and names are made up, but some street names exist, so don't send real post to them.

The CSV also splits the address into line 1, town, county and postcode columns. I can add order history, account creation dates or more records if you need them.
````

### techshop_customers.csv (the file Claude wrote, unedited)

````csv
customer_id,first_name,last_name,email,phone,address_line_1,town_city,county,postcode
TS-0001,Olivia,Hartley,olivia.hartley@example.com,07700 900101,14 Rosewood Avenue,Bristol,Bristol,BS6 7QT
TS-0002,James,Whitcombe,j.whitcombe@example.com,07700 900214,Flat 3 Albion Court,Manchester,Greater Manchester,M14 5RL
TS-0003,Priya,Chandran,priya.chandran@example.com,07700 900327,52 Linden Grove,Leicester,Leicestershire,LE2 3FN
TS-0004,Callum,McAllister,callum.mcallister@example.com,07700 900438,7 Kelvinhaugh Street,Glasgow,Glasgow City,G3 8NX
TS-0005,Sophie,Bramwell,sophie.bramwell@example.com,07700 900519,21 Mill Lane,York,North Yorkshire,YO31 7TP
TS-0006,Daniel,Okafor,dan.okafor@example.com,07700 900642,88 Ashford Road,Croydon,Greater London,CR0 2HW
TS-0007,Eleanor,Pritchard,eleanor.pritchard@example.com,07700 900753,4 Heol Y Coed,Cardiff,South Glamorgan,CF14 6JB
TS-0008,Harry,Lindqvist,harry.lindqvist@example.com,07700 900866,The Old Forge Church Street,Ludlow,Shropshire,SY8 1AQ
TS-0009,Amelia,Rourke,amelia.rourke@example.com,07700 900977,39 Ormeau Park Terrace,Belfast,County Antrim,BT7 3GK
TS-0010,Mohammed,Rahman,m.rahman@example.com,07700 900188,112 Coventry Road,Birmingham,West Midlands,B10 0RX
TS-0011,Grace,Fenwick,grace.fenwick@example.com,07700 900293,6 Jesmond Vale,Newcastle upon Tyne,Tyne and Wear,NE2 1PL
TS-0012,Thomas,Ellery,tom.ellery@example.com,07700 900374,17 Harbour View,Falmouth,Cornwall,TR11 3DS
TS-0013,Isla,Drummond,isla.drummond@example.com,07700 900415,Flat 2F1 45 Marchmont Road,Edinburgh,City of Edinburgh,EH9 1HU
TS-0014,Oliver,Kaczmarek,oliver.kaczmarek@example.com,07700 900526,63 Station Road,Reading,Berkshire,RG1 4LG
TS-0015,Chloe,Ashdown,chloe.ashdown@example.com,07700 900631,9 Beechcroft Close,Norwich,Norfolk,NR4 7DZ
TS-0016,Benjamin,Hughes-Taylor,ben.hughestaylor@example.com,07700 900748,26 Clarendon Street,Leamington Spa,Warwickshire,CV32 5SR
TS-0017,Aisha,Begum,aisha.begum@example.com,07700 900859,140 Granby Street,Liverpool,Merseyside,L8 2US
TS-0018,Lewis,Treharne,lewis.treharne@example.com,07700 900962,3 Mumbles Road,Swansea,West Glamorgan,SA3 4EA
TS-0019,Hannah,Sorensen,hannah.sorensen@example.com,07700 900075,58 Ecclesall Road,Sheffield,South Yorkshire,S11 8PX
TS-0020,George,Whitlock,george.whitlock@example.com,07700 900180,11 Kingsmead Square,Bath,Somerset,BA1 2AD
````

## What to check when capturing

- Count the rows: the lesson notes Claude occasionally returns 19 or 21.
- Verification pass (the learner does this, not Claude): all 20 records with all five fields; emails syntactically valid; UK-plausible phone numbers; any two identical emails. Run `node scripts/check-duplicate-emails.ts <this file>` to check duplicates.
- Record the result honestly: unique emails in this run prove nothing about the prompt, because it never asked for uniqueness.

## Result

- **Rows:** exactly 20 (TS-0001 to TS-0020).
- **Fields:** all five, plus a customer_id the prompt didn't ask for. The CSV splits the address into line 1, town, county and postcode.
- **Emails:** syntactically valid, all on example.com. `check-duplicate-emails.ts` found 0 repeats.
- **Phones:** all in Ofcom's 07700 900xxx drama range, so UK-plausible, with no repeats.
- **Format:** a downloadable CSV file plus a table in the chat.

As the notes above say, unique emails in this run prove nothing about the prompt, which never asked for uniqueness.

## Result

- **Rows:** exactly 20 (TS-0001 to TS-0020).
- **Fields:** all five, plus a customer_id the prompt didn't ask for. The CSV splits the address into line 1, town, county and postcode.
- **Emails:** syntactically valid, all on example.com. `check-duplicate-emails.ts` found 0 repeats within the 20 records.
- **Phones:** all in Ofcom's 07700 900xxx drama range, so UK-plausible, with no repeats.
- **Format:** a downloadable CSV file plus a table in the chat.

As the notes above say, unique emails in this run prove nothing about the prompt, which never asked for uniqueness.

**Checker caveat:** run directly on this file, `check-duplicate-emails.ts` reports 20 repeated emails. They are not real duplicates: the reply shows the same records twice in one reply (a table plus a CSV or JSON copy), and the checker counts each copy. The counts above use only the tables. Strip the second copy, or check one copy per worker, before running it.
