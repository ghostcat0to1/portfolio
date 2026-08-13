import { LegalShell, LegalH2, LegalP, LegalUl } from '../components/LegalShell'

const CONTACT = 'hqe.moreira@gmail.com'

export default function Privacy({ theme = 'dark' }) {
  return (
    <LegalShell theme={theme} title="Privacy">
      <LegalP>
        This is the personal website of Henrique Moreira, maintained from Espoo, Finland. It presents biography
        and project descriptions. It is not a commercial storefront and does not create user accounts.
      </LegalP>

      <section>
        <LegalH2>Site maintainer & contact</LegalH2>
        <LegalP>
          Maintained by: Henrique Moreira, private individual · Espoo, Finland.
          Contact: <a href={`mailto:${CONTACT}`} style={{ color: '#D4891E' }}>{CONTACT}</a>.
        </LegalP>
      </section>

      <section>
        <LegalH2>What this site collects</LegalH2>
        <LegalUl>
          <li>No account database. You cannot register or log in on this site.</li>
          <li>No first-party cookies or localStorage for analytics or preferences. Theme preference is held in memory only for the current session.</li>
          <li>If you email the contact address, ordinary email metadata and message content are processed as correspondence.</li>
        </LegalUl>
      </section>

      <section>
        <LegalH2>Processors & third parties</LegalH2>
        <LegalUl>
          <li><strong>Vercel</strong> — hosts this site. Standard server/request logs may be processed by the hosting provider.</li>
          <li><strong>Vercel Analytics</strong> — cookieless page analytics (no consent banner required for this mechanism alone).</li>
          <li><strong>Google Fonts</strong> — fonts load from Google&apos;s CDN; your IP address may be visible to Google when fonts are fetched.</li>
          <li><strong>Mistral</strong> — AI provider for any live model calls served by this project&apos;s API routes. No Gemini or OpenAI models are used.</li>
          <li>Linked product sites (LYCAON, GRYPS, Velu, Grantemia FI/PT, and others) have their own privacy notices where applicable.</li>
        </LegalUl>
      </section>

      <section>
        <LegalH2>AI on this site (EU AI Act)</LegalH2>
        <LegalP>
          Classification for AI features associated with this portfolio: <strong>limited-risk</strong> under
          Regulation (EU) 2024/1689 — not minimal-risk. This site does not claim prohibited or high-risk AI use.
          It does not make automated decisions with legal or similarly significant effects on individuals.
        </LegalP>
        <LegalUl>
          <li>
            This Site currently has <strong>no embedded live AI demo</strong>. Project cards may link
            to separate personal prototypes (including shelved ones such as LYCAON).
          </li>
          <li>
            <strong>Any live AI endpoint</strong> on this deployment (including the Mistral-backed API route,
            if enabled) discloses AI at the point of exposure, uses <strong>Mistral only</strong>, and is
            subject to human oversight by the site maintainer. Portal/UI chrome is human-authored; model text is
            AI-generated when a live call occurs.
          </li>
          <li>Article 50 transparency: AI is disclosed where AI output is shown; humans remain responsible for the site and linked projects.</li>
        </LegalUl>
      </section>

      <section>
        <LegalH2>Retention</LegalH2>
        <LegalP>
          Hosting and analytics logs follow each provider&apos;s retention. Email correspondence is retained
          only as long as needed to respond and for ordinary personal record-keeping. There is no product
          user database on this site.
        </LegalP>
      </section>

      <section>
        <LegalH2>Your rights (GDPR)</LegalH2>
        <LegalP>
          Depending on applicable law, you may have rights of access, rectification, erasure, restriction,
          objection, and data portability regarding personal data processed about you. To exercise rights
          related to this site, email {CONTACT}. You may also lodge a complaint with your supervisory authority
          (in Finland: the Office of the Data Protection Ombudsman).
        </LegalP>
      </section>

      <section>
        <LegalH2>Changes</LegalH2>
        <LegalP>
          If this personal site&apos;s AI surfaces or processors change in a way that affects this notice,
          the Privacy and Terms pages will be revised accordingly. This is a personal site notice, not a
          commercial service schedule.
        </LegalP>
      </section>
    </LegalShell>
  )
}
