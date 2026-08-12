import { LegalShell, LegalH2, LegalP, LegalUl } from '../components/LegalShell'

const LAST_UPDATED = '12 August 2026'
const CONTACT = 'hqe.moreira@gmail.com'

export default function Terms({ theme = 'dark' }) {
  return (
    <LegalShell theme={theme} title="Terms" lastUpdated={LAST_UPDATED}>
      <LegalP>
        These terms cover the personal website at henriquemoreira.eu (the &quot;Site&quot;), operated by
        Henrique Moreira from Espoo, Finland. By using the Site you agree to these terms.
        This is not legal advice.
      </LegalP>

      <section>
        <LegalH2>Operator</LegalH2>
        <LegalP>
          The Site is operated by Henrique Moreira, sole operator, based in Espoo, Finland.
          Contact: <a href={`mailto:${CONTACT}`} style={{ color: '#D4891E' }}>{CONTACT}</a>.
        </LegalP>
      </section>

      <section>
        <LegalH2>Nature of the Site</LegalH2>
        <LegalUl>
          <li>Personal portfolio and research showcase — not a commercial marketplace.</li>
          <li>Project cards and demos describe personal R&amp;D initiatives. Linked products may have their own terms.</li>
          <li>No user accounts are offered on this Site.</li>
        </LegalUl>
      </section>

      <section>
        <LegalH2>Intellectual property</LegalH2>
        <LegalP>
          Unless otherwise stated, the Site content, branding, and associated personal project materials
          are owned by Henrique Moreira (sole operator, Espoo, Finland). All rights reserved.
          You may not copy, scrape, or redistribute Site content for commercial use without prior written permission.
        </LegalP>
      </section>

      <section>
        <LegalH2>AI features & EU AI Act</LegalH2>
        <LegalUl>
          <li>
            AI features associated with this Site are classified as <strong>limited-risk</strong> under
            Regulation (EU) 2024/1689 — not minimal-risk.
          </li>
          <li>AI provider for live model calls: <strong>Mistral only</strong> (no Gemini or OpenAI on this Site).</li>
          <li>Article 50: AI is disclosed at the point of exposure; human oversight applies; no prohibited or high-risk claims are made.</li>
          <li>The Site does not make automated decisions with legal or similarly significant effects on individuals.</li>
          <li>
            The Site does not currently embed a live AI demo. Linked prototypes are separate and may be
            exploratory or shelved. Portal chrome is human-authored. Where a live AI call returns text,
            that text is AI-generated.
          </li>
        </LegalUl>
      </section>

      <section>
        <LegalH2>Disclaimer</LegalH2>
        <LegalP>
          Content is provided as-is for informational and portfolio purposes. No warranty of completeness,
          fitness, or uninterrupted availability. Project descriptions may evolve; linked services are
          outside these Site terms unless expressly stated.
        </LegalP>
      </section>

      <section>
        <LegalH2>Liability</LegalH2>
        <LegalP>
          To the fullest extent permitted by applicable law, the operator is not liable for indirect or
          consequential damages arising from use of the Site. Nothing here limits liability that cannot
          be limited under Finnish or EU mandatory law.
        </LegalP>
      </section>

      <section>
        <LegalH2>Governing law</LegalH2>
        <LegalP>
          These terms are governed by the laws of Finland, without prejudice to mandatory consumer
          protections that may apply in your country of residence.
        </LegalP>
      </section>

      <section>
        <LegalH2>Changes</LegalH2>
        <LegalP>
          Terms may be updated when Site features — especially AI surfaces — change. The
          &quot;Last updated&quot; date at the top will be bumped in the same change set as Privacy.
        </LegalP>
      </section>
    </LegalShell>
  )
}
