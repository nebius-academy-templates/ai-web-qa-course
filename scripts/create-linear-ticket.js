// create-linear-ticket.js
// ============================================================
// LESSON 2.3.3 - the NOTIFICATION layer, swapped from Jira to
// Linear.
//
// This file is the whole diff. escalate() in autofix-pipeline.js
// is untouched: it still builds a report and returns it. Only
// the registered callback changed.
//
// Jira vs Linear, the differences that actually matter:
//   transport    REST POST /rest/api/3/issue   ->  GraphQL POST /graphql
//   auth         Basic (email:token, base64)   ->  Authorization: <api key>
//   container    project key ("QA")            ->  teamId (a UUID)
//   category     issuetype: { name: "Bug" }    ->  labels (no issue types)
//   priority     { name: "High" }              ->  integer 1-4 (2 = High)
//   description  ADF document tree             ->  plain markdown string
//
// The report fields consumed are IDENTICAL. That is the point.
//
//   LINEAR_MOCK=true  -> print the GraphQL payload instead of posting
// ============================================================

const LINEAR_API_URL = 'https://api.linear.app/graphql';

// Linear priority is an integer, not a name. 0=none 1=urgent
// 2=high 3=normal 4=low. Same policy as the Jira version:
// escalations are High by default, because the automated net
// already failed to catch this one.
const PRIORITY_HIGH = 2;

// Labels must already exist on the team - see resolveLabelIds below.
// "Bug" is the direct translation of Jira's issuetype: { name: "Bug" }:
// same policy, expressed as a label because Linear has no issue types.
const ESCALATION_LABELS = ['Bug', 'qa-needed'];

// ============================================================
// CREDENTIALS - same Module 1 rule, same guard clause.
// Silently failing to notify is a false green at the process
// level. Fail loudly at startup, never silently at delivery.
// ============================================================
function loadLinearConfig() {
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
  const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

  if (!LINEAR_API_KEY || !LINEAR_TEAM_ID) {
    throw new Error('Linear credentials not configured. Check environment variables: LINEAR_API_KEY, LINEAR_TEAM_ID.');
  }
  return { LINEAR_API_KEY, LINEAR_TEAM_ID };
}

async function linearRequest(cfg, query, variables) {
  const res = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Linear takes the key raw - no "Bearer", no base64.
      'Authorization': cfg.LINEAR_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Linear API error: ${res.status} ${await res.text()}`);
  }

  const body = await res.json();
  // GraphQL returns HTTP 200 on business-logic errors. Checking
  // res.ok alone is exactly the false green we keep warning about.
  if (body.errors?.length) {
    throw new Error(`Linear GraphQL error: ${body.errors.map(e => e.message).join('; ')}`);
  }
  return body.data;
}

// Linear labels are referenced by UUID, not by name, so the names
// above have to be resolved against the team first. Unknown names
// are dropped rather than created - a notification path should not
// mutate the tracker's taxonomy behind your back.
async function resolveLabelIds(cfg, names) {
  const data = await linearRequest(cfg, `
    query TeamLabels($teamId: String!) {
      team(id: $teamId) {
        labels { nodes { id name } }
      }
    }`, { teamId: cfg.LINEAR_TEAM_ID });

  const byName = new Map(data.team.labels.nodes.map(l => [l.name.toLowerCase(), l.id]));
  const missing = names.filter(n => !byName.has(n.toLowerCase()));
  if (missing.length) {
    console.warn(`   Linear labels not found on team, skipping: ${missing.join(', ')}`);
  }
  return names.map(n => byName.get(n.toLowerCase())).filter(Boolean);
}

// ============================================================
// LINEAR ISSUE CREATION - the delivery step.
// Field mapping, unchanged in shape from the Jira version:
//   suggested_jira_title        -> title
//   suggested_jira_description  -> description (markdown, as-is)
//   labels                      -> labelIds  (Linear has no issue types)
//   priority                    -> 2 (High)
//   team id                     -> from env, never hardcoded
// ============================================================
async function createLinearTicket(report) {
  const cfg = loadLinearConfig();

  const input = {
    teamId: cfg.LINEAR_TEAM_ID,
    title: report.suggested_jira_title,
    // Linear takes markdown directly - no ADF document tree to build.
    description: report.suggested_jira_description,
    priority: PRIORITY_HIGH,
  };

  const mutation = `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { identifier url }
      }
    }`;

  if (process.env.LINEAR_MOCK === 'true') {
    console.log('\n[LINEAR_MOCK] GraphQL payload that would be posted:');
    console.log(JSON.stringify({
      query: mutation.trim(),
      variables: { input: { ...input, labels: ESCALATION_LABELS } },
    }, null, 2));
    // Mirrors the real TRI team's key prefix so the mock and live
    // paths are indistinguishable on screen.
    return { key: 'TRI-142', url: 'https://linear.app/tripleten-pandele/issue/TRI-142' };
  }

  input.labelIds = await resolveLabelIds(cfg, ESCALATION_LABELS);

  const data = await linearRequest(cfg, mutation, { input });
  if (!data.issueCreate.success) {
    throw new Error('Linear issueCreate returned success: false');
  }

  const issue = data.issueCreate.issue;
  return { key: issue.identifier, url: issue.url };
}

module.exports = { createLinearTicket, loadLinearConfig };
