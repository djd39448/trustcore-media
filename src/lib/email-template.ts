interface BriefSection {
  title: string;
  items: { title: string; source: string; link: string; snippet: string }[];
}

interface BriefData {
  date: string;
  sections: BriefSection[];
  totalHeadlines: number;
}

export function buildBriefEmailHtml(brief: BriefData): string {
  const sectionHtml = brief.sections
    .map(
      (section) => `
    <tr>
      <td style="padding: 24px 0 12px 0;">
        <h2 style="margin:0; font-size:16px; color:#${section.title === "Crypto" ? "f59e0b" : "6366f1"}; text-transform:uppercase; letter-spacing:1px;">
          ${section.title}
        </h2>
      </td>
    </tr>
    ${section.items
      .map(
        (item) => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #262626;">
        <a href="${escapeHtml(item.link)}" style="color:#ededed; text-decoration:none; font-size:14px; font-weight:500; line-height:1.4;">
          ${escapeHtml(item.title)}
        </a>
        <div style="margin-top:4px; font-size:12px; color:#737373;">
          ${escapeHtml(item.source)}${item.snippet ? ` &mdash; ${escapeHtml(item.snippet.slice(0, 120))}` : ""}
        </div>
      </td>
    </tr>`
      )
      .join("")}`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#0a0a0a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0; border-bottom:1px solid #262626;">
              <h1 style="margin:0; font-size:20px; color:#ededed; font-weight:700;">TrustCore Media</h1>
              <p style="margin:4px 0 0 0; font-size:13px; color:#737373;">${escapeHtml(brief.date)} &middot; ${brief.totalHeadlines} headlines scanned</p>
            </td>
          </tr>
          <!-- Sections -->
          ${sectionHtml}
          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0; text-align:center;">
              <p style="margin:0; font-size:11px; color:#525252;">
                TrustCore Media &middot; Powered by TrustCore Systems<br/>
                <a href="{{unsubscribe_url}}" style="color:#525252;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildBriefEmailText(brief: BriefData): string {
  let text = `TrustCore Media — ${brief.date}\n${brief.totalHeadlines} headlines scanned\n\n`;

  for (const section of brief.sections) {
    text += `=== ${section.title.toUpperCase()} ===\n\n`;
    for (const item of section.items) {
      text += `* ${item.title}\n  ${item.source} — ${item.link}\n\n`;
    }
  }

  text += "---\nTrustCore Media | Powered by TrustCore Systems\n";
  return text;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
