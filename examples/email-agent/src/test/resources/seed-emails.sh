#!/bin/bash
# Seed test emails to GreenMail server
# Simulates a meeting planning thread with 5 emails
#
# Prerequisites:
#   - GreenMail running (docker compose up -d)
#   - swaks installed (sudo apt install swaks)
#
# Usage:
#   chmod +x seed-emails.sh
#   ./seed-emails.sh

SMTP="localhost:3025"
TO="user@test.local"

echo "Seeding test emails to GreenMail..."

# Email 1: Initial meeting request from Alice
swaks --to "$TO" --from "alice@test.local" \
  --server "$SMTP" \
  --header "Subject: Q1 Planning Meeting - January 15th" \
  --header "Date: Mon, 6 Jan 2025 09:00:00 -0800" \
  --body "Hi team,

I'd like to schedule our Q1 planning meeting for January 15th.

Please let me know your availability for that day. I'm thinking we could meet in the afternoon, around 2-4pm.

Topics to discuss:
- Q1 budget review
- Hiring plans
- Product roadmap updates

Let me know if you have any scheduling conflicts.

Best,
Alice"

echo "Email 1 sent: Initial meeting request"

# Email 2: Reply from Bob with agenda suggestions
swaks --to "$TO" --from "bob@test.local" \
  --server "$SMTP" \
  --header "Subject: Re: Q1 Planning Meeting - January 15th" \
  --header "Date: Mon, 6 Jan 2025 10:30:00 -0800" \
  --header "In-Reply-To: <meeting-1@test.local>" \
  --body "Hi Alice,

January 15th works for me. 2pm is perfect.

For the agenda, I'd also like to add:
- Engineering team capacity review
- Q4 retrospective highlights
- Technical debt priorities

I can prepare a brief presentation on the engineering roadmap if helpful.

Thanks,
Bob"

echo "Email 2 sent: Bob's reply with agenda items"

# Email 3: Carol adds more topics
swaks --to "$TO" --from "carol@test.local" \
  --server "$SMTP" \
  --header "Subject: Re: Q1 Planning Meeting - January 15th" \
  --header "Date: Mon, 6 Jan 2025 11:15:00 -0800" \
  --header "In-Reply-To: <meeting-1@test.local>" \
  --body "Hi all,

Count me in for January 15th at 2pm.

A few additional items from the product side:
- Customer feedback summary from Q4
- Feature prioritization for Q1
- Competitive analysis update

Also, can we book Conference Room A? It has the video setup for remote attendees.

Thanks,
Carol"

echo "Email 3 sent: Carol's additions"

# Email 4: Alice confirms details
swaks --to "$TO" --from "alice@test.local" \
  --server "$SMTP" \
  --header "Subject: Re: Q1 Planning Meeting - January 15th" \
  --header "Date: Mon, 6 Jan 2025 14:00:00 -0800" \
  --header "In-Reply-To: <meeting-1@test.local>" \
  --body "Great, thanks everyone!

Confirmed: Q1 Planning Meeting
Date: Wednesday, January 15th
Time: 2:00 PM - 4:00 PM
Location: Conference Room A

Video link for remote attendees:
https://meet.example.com/q1-planning

I've created a shared agenda doc here:
https://docs.example.com/q1-planning-agenda

Please add any additional topics by EOD Tuesday.

See you all there!
Alice"

echo "Email 4 sent: Alice confirms meeting"

# Email 5: Bob shares pre-meeting materials
swaks --to "$TO" --from "bob@test.local" \
  --server "$SMTP" \
  --header "Subject: Re: Q1 Planning Meeting - January 15th" \
  --header "Date: Tue, 14 Jan 2025 16:30:00 -0800" \
  --header "In-Reply-To: <meeting-1@test.local>" \
  --body "Hi team,

I've uploaded my engineering roadmap slides to the shared folder:
https://drive.example.com/engineering-q1-roadmap

Key highlights:
- 3 major feature releases planned
- 2 infrastructure upgrades
- 15% time allocated for tech debt

Would appreciate if everyone could review before tomorrow's meeting so we can jump straight into discussion.

See you tomorrow at 2pm!
Bob"

echo "Email 5 sent: Bob's pre-meeting materials"

echo ""
echo "Done! 5 test emails seeded to GreenMail."
echo ""
echo "To verify, start the email-agent app and check:"
echo "  curl http://localhost:8081/api/test/emails"
