import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Eye, Building, Mail, Phone, FileText, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="privacy-modal-overlay" onClick={onClose}>
      <div 
        className="privacy-modal-card privacy-modal-card-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top #d52893 Signature Accent Line */}
        <div className="privacy-top-color-line" />

        {/* Modal Header */}
        <div className="privacy-modal-header">
          <div className="privacy-header-title-group">
            <div className="privacy-badge-icon">
              <ShieldCheck size={26} color="#d52893" />
            </div>
            <div>
              <h3 className="privacy-modal-title">
                Privacy Policy • Ceylon Cold Stores PLC (Elephant House)
              </h3>
              <p className="privacy-modal-subtitle">
                Official Privacy Notice • Registration PQ4 • Personal Data Protection Act No. 9 of 2022
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="privacy-close-btn" 
            onClick={onClose}
            aria-label="Close Privacy Policy"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="privacy-modal-body privacy-body-expanded">
          
          {/* Legal Preamble Box */}
          <div className="privacy-legal-preamble">
            <Building size={20} color="#d52893" style={{ flexShrink: 0, marginTop: 2 }} />
            <p>
              This Privacy Notice ("Notice") describes how <strong>Ceylon Cold Stores PLC</strong> ("we", "us", "our"), a company registered in Sri Lanka bearing registration number <strong>PQ4</strong> and having its registered office at <strong>No. 117, Sir Chittampalam A. Gardiner Mawatha, Colombo 2</strong> processes your Personal Data.
            </p>
          </div>

          {/* Complete 21 Sections Document */}
          <div className="privacy-full-document">
            
            {/* Section 1 */}
            <div className="privacy-doc-section" id="sec-1">
              <h4>1. Scope</h4>
              <p>This Notice applies when you:</p>
              <ul>
                <li>Visit our offices or production sites;</li>
                <li>Visit websites operated by us and other websites owned or controlled by us;</li>
                <li>Use our mobile applications;</li>
                <li>Interact with us on our social media;</li>
                <li>Use our services online or in-person;</li>
                <li>Participate in events organized by us (including the Elephant House Wonder CSR Campaign);</li>
                <li>Contact us by phone, mail or email; or</li>
                <li>Contract with us.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="privacy-doc-section" id="sec-2">
              <h4>2. What is Personal Data?</h4>
              <ul>
                <li>Personal Data is any information that could directly or indirectly, by itself or in combination with other information, identify you.</li>
                <li>Personal Data excludes anonymous data or data that has been anonymized.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="privacy-doc-section" id="sec-3">
              <h4>3. What type of Personal Data do we collect from you?</h4>
              <p>We may collect Personal Data or other data which when combined identifies you, that falls within the following categories:</p>
              <ul>
                <li>General identifiers such as your name, gender and contact information;</li>
                <li>Publicly available data made available by you directly or by linking social media or other accounts with us;</li>
                <li>Communication and feedback information;</li>
                <li>Online activity and behavior such as Internet Protocol (IP) address, online user identification profiles and browsing behaviour;</li>
                <li>Site access information such as log in credentials (e.g., user name for accessing restricted content);</li>
                <li>Organizational and professional information;</li>
                <li>Location data such as IP address, MAC address, GPS, devices, cell towers, Wi-Fi access points;</li>
                <li>Government verified information such as information from identity cards or passports;</li>
                <li>Account and registration information; or</li>
                <li>Financial information including credit debit or other payment data.</li>
              </ul>
              <p className="privacy-note-text"><em>Please note that there may be overlaps between the categories of Personal Data that will be processed by us.</em></p>
            </div>

            {/* Section 4 */}
            <div className="privacy-doc-section" id="sec-4">
              <h4>4. Do we collect non-Personal Data?</h4>
              <ul>
                <li>Yes, we may collect non-Personal Data such as aggregated and anonymized data or statistical and demographic data which may sometimes be derived from your Personal Data but which cannot be used to identify you either directly or indirectly.</li>
                <li>Such data may be used for analytical activities with the objective of improving our operations.</li>
                <li>Aggregated and anonymized data may be shared (not sold) with our business partners to perform these analytical operations.</li>
                <li>If the anonymized and aggregated data results in your direct or indirect identification, such data will be treated as Personal Data.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="privacy-doc-section" id="sec-5">
              <h4>5. Can you refuse to provide Personal Data?</h4>
              <p>Yes, you can always refuse to supply Personal Data, except that it may prevent you from engaging in certain website, platform related activities or limit your access to our services.</p>
            </div>

            {/* Section 6 */}
            <div className="privacy-doc-section" id="sec-6">
              <h4>6. What happens if you provide false or inaccurate Personal Data to us?</h4>
              <p>If you do not provide the Personal Data we need to process because of a law or for the performance of a contract, we may not be able to meet your requests or continue providing our services to you.</p>
              <p>Additionally, if we believe the Personal Data you have provided is false or fraudulent, we can refuse services, terminate the contract, and report you to authorities.</p>
            </div>

            {/* Section 7 */}
            <div className="privacy-doc-section" id="sec-7">
              <h4>7. What are your obligations if you are providing Personal Data of a third party?</h4>
              <p>If you are providing the Personal Data of a third party you do so on the basis that that person has given you prior consent and that person is aware of the contents of this Notice and their rights in respect of the Personal Data provided to us.</p>
            </div>

            {/* Section 8 */}
            <div className="privacy-doc-section privacy-highlight-box" id="sec-8">
              <h4>8. Do we process the Personal Data of children?</h4>
              <ul>
                <li>We do not and our software and services do not target, and are not structured to attract, children under the age of 16.</li>
                <li>We do not collect any registration information from users who indicate they are under the age of 16.</li>
                <li>If you provide us with Personal Data about your child, or a child to whom you are the legal guardian, that will be deemed to be consent to the collection and processing of that child’s data.</li>
                <li>We will not sell the personal data of any person who we know is under the age of 16 without express, valid authorization.</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="privacy-doc-section" id="sec-9">
              <h4>9. How do we use your Personal Data?</h4>
              <p>Our use of your Personal Data is prescribed by law and the following table sets out the lawful bases for processing your Personal Data:</p>
              
              <div className="privacy-table-wrapper">
                <table className="privacy-legal-table">
                  <thead>
                    <tr>
                      <th>Use Purpose</th>
                      <th>Lawful Basis for Processing Personal Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>To provide our services to you and to conduct our business.</td>
                      <td>Contract performance • Legitimate interests • Consent</td>
                    </tr>
                    <tr>
                      <td>To facilitate the use of our websites and to ensure content is relevant.</td>
                      <td>Legitimate interests • Consent • Contract performance</td>
                    </tr>
                    <tr>
                      <td>For marketing and business development purposes (with opt-out option).</td>
                      <td>Legitimate interests • Consent</td>
                    </tr>
                    <tr>
                      <td>For research and development purposes.</td>
                      <td>Legitimate interests (improving services)</td>
                    </tr>
                    <tr>
                      <td>For recruitment purposes.</td>
                      <td>Legitimate interests • Contract performance</td>
                    </tr>
                    <tr>
                      <td>To fulfil our legal, regulatory, or risk management obligations (KYC, AML, fraud prevention).</td>
                      <td>Legal obligations • Legitimate interests • Substantial public interest</td>
                    </tr>
                    <tr>
                      <td>To ensure that we are paid for services.</td>
                      <td>Contract performance • Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>To inform you of changes to our services or policies and notices.</td>
                      <td>Legitimate interests</td>
                    </tr>
                    <tr>
                      <td>To reorganize or make changes to our business.</td>
                      <td>Legitimate interests</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 10 */}
            <div className="privacy-doc-section" id="sec-10">
              <h4>10. How do we share your Personal Data?</h4>
              <p>We do not sell, trade, or rent your Personal Data.</p>
              <p>We may share your personal data with our service providers, agents, and trusted associates to facilitate your purchases, promote our products, and conduct business, data analytics, and promotional activities. These business partners are bound by contract to maintain confidentiality and to limit the processing of your Personal Data for the limited purpose of fulfilling the contractual obligation.</p>
            </div>

            {/* Section 11 */}
            <div className="privacy-doc-section" id="sec-11">
              <h4>11. How do we use cookies?</h4>
              <p>For more information on our use of cookies and how you can change your cookies preferences, please refer to our Cookie Policy on our official site.</p>
            </div>

            {/* Section 12 */}
            <div className="privacy-doc-section" id="sec-12">
              <h4>12. Why do we record CCTV footage?</h4>
              <ul>
                <li>We may use CCTV on our premises to ensure the safety of our customers, patrons, employees, service providers and business partners.</li>
                <li>This CCTV footage may be used to monitor the behaviour of the people within our premises, and where relevant to aid investigations into potential or actual criminal, fraudulent incidents or other incidents of a related nature.</li>
                <li>We may share such footage with law enforcement authorities and/or judicial authorities to assist with investigations, proceedings or other legal action.</li>
                <li>Such footage may also be used in internal disciplinary inquiries.</li>
              </ul>
            </div>

            {/* Section 13 */}
            <div className="privacy-doc-section" id="sec-13">
              <h4>13. For how long will we retain your Personal Data?</h4>
              <p>We will only retain your Personal Data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, compliance or reporting requirements.</p>
            </div>

            {/* Section 14 */}
            <div className="privacy-doc-section" id="sec-14">
              <h4>14. How are we protecting your Personal Data?</h4>
              <ul>
                <li>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your Personal Data.</li>
                <li>Where your Personal Data must be shared with business partners, Personal Data will only be shared with business partners who need it to perform their services under confidentiality obligations.</li>
              </ul>
            </div>

            {/* Section 15 */}
            <div className="privacy-doc-section privacy-highlight-box" id="sec-15">
              <h4>15. What are your rights as a data subject?</h4>
              <p>You have the right to exercise the following rights by submitting a written request:</p>
              <ul>
                <li>Withdraw your consent to the processing of your Personal Data;</li>
                <li>Access your Personal Data;</li>
                <li>Request the rectification or completion of inaccurate or incomplete Personal Data;</li>
                <li>Request the erasure of your Personal Data if:
                  <ul>
                    <li>We have breached our obligations under the Personal Data Protection Act, No. 9 of 2022;</li>
                    <li>You have withdrawn your consent; or</li>
                    <li>We are required by law to do so.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Section 16 */}
            <div className="privacy-doc-section" id="sec-16">
              <h4>16. How do we handle your written request pursuant to Section 15?</h4>
              <p>We will respond within <strong>21 working days</strong> to confirm if:</p>
              <ul>
                <li>We have granted your request;</li>
                <li>We have refused your request with reason for such refusal; and</li>
                <li>We have refrained from further processing your personal data.</li>
              </ul>
            </div>

            {/* Section 17 */}
            <div className="privacy-doc-section" id="sec-17">
              <h4>17. How are changes made to this Privacy Notice?</h4>
              <p>This Notice is kept under review and is subject to change in line with our Privacy Policy. We therefore encourage you to review them when you visit the website to stay informed of how we are using Personal Data.</p>
              <p><em>This Notice was last updated on 2 December 2024.</em></p>
            </div>

            {/* Section 18 */}
            <div className="privacy-doc-section" id="sec-18">
              <h4>18. Interaction with our other policies and procedures</h4>
              <p>This Notice supplements our other privacy and legitimate interest notices or policies and is not intended to override them.</p>
            </div>

            {/* Section 19 */}
            <div className="privacy-doc-section" id="sec-19">
              <h4>19. What happens if the Sinhala or Tamil versions of this Notice differ?</h4>
              <p>This Notice may be translated into different languages, and in the event of any inconsistency among the versions, the English version shall prevail.</p>
            </div>

            {/* Section 20 */}
            <div className="privacy-doc-section privacy-contact-box" id="sec-20">
              <h4>20. How can you contact us?</h4>
              <p>If you have any enquiries or feedback on our personal data protection policies and procedures; or need more information on or access to the Personal Data you have provided us, please contact our Data Protection Officer:</p>
              <div className="privacy-contact-card">
                <p><strong>Ceylon Cold Stores PLC (Elephant House)</strong></p>
                <p>20th Floor, The Offices at Cinnamon Life, No.05, Justice Akbar Mawatha, Colombo 02 / No. 117, Sir Chittampalam A. Gardiner Mawatha, Colombo 2</p>
                <p><strong>Email:</strong> <a href="mailto:ccs@keells.com">ccs@keells.com</a></p>
                <p><strong>Telephone:</strong> <a href="tel:+94772723976">(+94) 77-2723976</a> / <a href="tel:+94112318798">+94 (0) 11 231 87 98</a></p>
              </div>
            </div>

            {/* Section 21 */}
            <div className="privacy-doc-section" id="sec-21">
              <h4>21. Your Acceptance</h4>
              <ul>
                <li>By using this site, you acknowledge that you have read and understood this Notice.</li>
                <li>If you do not agree with the terms outlined, you should refrain from using the site. Continued use of the site after any updates to this Notice will be considered as your acceptance of those updates.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="privacy-modal-footer">
          <span className="privacy-copyright-tag">
            © 2026 Ceylon Cold Stores PLC (Elephant House) • Registration PQ4
          </span>
          <button 
            type="button" 
            className="btn-privacy-agree" 
            onClick={onClose}
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
