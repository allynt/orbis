import React, { useState } from 'react';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import { ReactComponent as OrbisLogo } from '../orbis.svg';

import styles from './terms-and-conditions.module.css';

const PRIVACY_POLICY = 'PRIVACY_POLICY';
const EULA = 'EULA';

const PrivacyPolicy = () => {
  return (
    <div className={styles.text}>
      <h1 className={styles.textHeader}>Privacy Policy</h1>
      <div className={styles.description}>
        <strong>STEVENSON ASTROSAT LIMITED</strong> a company incorporated in Scotland (Number SC423073) and whose
        Registered Office is at Copernicus Kirk, 200 High Street, Musselburgh EH21 7DX trading as OR3IS&trade;
        understands that your privacy is important to you and that you care about how your personal data is used and
        shared online. We respect and valuethe privacy of Customers and will only collect and use personal data in ways
        that are described here, and in a mannerthat is consistent with Our obligations and your rights under the
        law.Please read this Privacy Policy carefully and ensure that you understand it. If you do not accept and agree
        with thisPrivacy Policy, you must stop using Our Subscription Services immediately.
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>1. Definitions and Interpretation</h2>
        <div className={styles.description}>
          In this Policy, the following terms shall have the following meanings:
          <ul className={styles.list}>
            <li>
              <span>"Account"</span>
              <div>means an account required to access and/or useSubscription Service(s);</div>
            </li>
            <li>
              <span>"Cookie"</span>
              <div>
                means a small text file placed on your computer or deviceby Our Subscription Services when you visit
                certain partsof Our Subscription Services and/or when you use certainfeatures of Our Subscription
                Services. Details of theCookies used by Our Subscription Services are set out insection 12, below;
              </div>
            </li>
            <li>
              <span>“Cookie Law”</span>
              <div>
                means the relevant parts of the Privacy and ElectronicCommunications (EC Directive) Regulations 2003
              </div>
            </li>
            <li>
              <span>“personal data”</span>
              <div>
                means any and all data that relates to an identifiableperson who can be directly or indirectly
                identified fromthat data. In this case, it means personal data that you giveto Us via Our Subscription
                Services. This definition shall,where applicable, incorporate the definitions provided inthe EU
                Regulation 2016/679 – the General Data ProtectionRegulation (“GDPR”); and
              </div>
            </li>
            <li>
              <span>“We/Us/Our”</span>
              <div>means the said Stevenson Astrosat Limited trading astrading as OR3IS™ (as above).</div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2. Information About Us</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>2.1.1</span>
              <div>Our VAT number is GB 150 4887 06</div>
            </li>
            <li>
              <span>2.1.2</span>
              <div>
                Our Data Protection Officer is Steven Hunt, and can be contacted by email atsteven.hunt@astrosat.net, by
                telephone on 0131 516 8864, or by post at Copernicus Kirk,200 High Street, Musselburgh EH21 7DX.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>What Does This Policy Cover?</h2>
        <div className={styles.description}>
          This Privacy Policy applies only to our use of data gathered by Us in your use of the Subscription Services.
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>4. Your Rights</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>1.1.1</span>
              <div>
                As a data subject, you have the following rights under the GDPR, which this Policy and Ouruse of
                personal data have been designed to uphold:
                <ul className={styles.list}>
                  <li>
                    <span>4.1.1.a.1</span>
                    <div>4.1.1.a.1The right to be informed about Our collection and use of personal data;</div>
                  </li>
                  <li>
                    <span>4.1.1.a.2</span>
                    <div>
                      The right of access to the personal data We hold about you or your employees (see section11);
                    </div>
                  </li>
                  <li>
                    <span>4.1.1.a.3</span>
                    <div>
                      The right to rectification if any personal data We hold about you or your employees isinaccurate
                      or incomplete (please contact Us using the details in section 13);
                    </div>
                  </li>
                  <li>
                    <span>4.1.1.a.4</span>
                    <div>
                      The right to be forgotten – i.e. the right to ask Us to delete any personal data We hold aboutyou
                      or your employees (We only hold personal data for a limited time, as explained in section6 but if
                      you would like Us to delete it sooner, please contact Us using the details in section 13). Please
                      note that deletion of certain personal data may prevent the Subscription Servicesfrom functioning;
                    </div>
                  </li>
                  <li>
                    <span>4.1.1.a.5</span>
                    <div>The right to restrict (i.e. prevent) the processing of personal data;</div>
                  </li>
                  <li>
                    <span>4.1.1.a.6</span>
                    <div>
                      The right to data portability (obtaining a copy of personal data to re-use with another serviceor
                      organisation);
                    </div>
                  </li>
                  <li>
                    <span>4.1.1.a.7</span>
                    <div>The right to object to Us using personal data for particular purposes; and</div>
                  </li>
                  <li>
                    <span>4.1.1.a.8</span>
                    <div>Rights with respect to automated decision making and profiling.</div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <span>4.1.2</span>
              <div>
                If you have any cause for complaint about Our use of personal data, please contact Us usingthe details
                provided in section 13 and We will do Our best to solve the problem for you. If Weare unable to help,
                you also have the right to lodge a complaint with the UK’s supervisoryauthority, the Information
                Commissioner’s Office details of which can be found here:{' '}
                <a className={styles.link} href="https://ico.org.uk/">
                  https://ico.org.uk/
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>5. What Data Do We Collect?</h2>
        <div className={styles.description}>
          We may collect some or all of the following personal and non-personal data:
          <ul className={styles.list}>
            <li>
              <span>a)</span>
              <div>Name</div>
            </li>
            <li>
              <span>b)</span>
              <div>Email address</div>
            </li>
            <li>
              <span>c)</span>
              <div>Name of the company, organization, legal entity</div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>6. How Do We Use Your Data?</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>1.1.1</span>
              <div>
                All personal data is processed and stored securely, for no longer than is necessary in lightof the
                reason(s) for which it was first collected. We will comply with Our obligations andsafeguard your rights
                under the GDPRat all times. For more details on security see section7, below.
              </div>
            </li>
            <li>
              <span>6.1.1</span>
              <div>
                0ur use of personal data will always have a lawful basis, either because it is necessary forOur
                performance of a contract with you, because you have consented to Our use of personaldata (e.g. by
                subscribing to emails or for delivery of the Subscription Services), or becauseit is in Our legitimate
                interests. Specifically, We may use personal data for the followingpurposes:
                <ul className={styles.list}>
                  <li>
                    <span>1.1.1.a.1</span>
                    <div>[Providing and managing your Account;]</div>
                  </li>
                  <li>
                    <span>6.1.1.a.1</span>
                    <div>[Providing and managing your access to the Subscription Services;]</div>
                  </li>
                  <li>
                    <span>6.1.1.a.2</span>
                    <div>[Personalising and tailoring your experience in the Subscription Services;]</div>
                  </li>
                  <li>
                    <span>6.1.1.a.3</span>
                    <div>
                      [Supplying Our [products] AND/OR[services] to you (please note that We require yourpersonal data
                      in order to enter into a contract with you);]
                    </div>
                  </li>
                  <li>
                    <span>6.1.1.a.4</span>
                    <div>[Personalising and tailoring Our [products]AND/OR [services] for you;]</div>
                  </li>
                  <li>
                    <span>6.1.1.a.5</span>
                    <div>[Replying to emails from you;]</div>
                  </li>
                  <li>
                    <span>6.1.1.a.6</span>
                    <div>
                      [Supplying you with emails that you have opted into (you may unsubscribe or opt-out at anytime
                    </div>
                  </li>
                  <li>
                    <span>6.1.1.a.7</span>
                    <div>[Market research;]</div>
                  </li>
                  <li>
                    <span>6.1.1.a.8</span>
                    <div>
                      [Analysing your use of Our Subscription Services [and gathering feedback] to enable Us
                      tocontinually improve Our Subscription Services and your user experience;]
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <span>6.1.2</span>
              <div>
                With your permission and/or where permitted by law, We may also use your data formarketing purposes
                which may include contacting you by email. We will not, however, sendyou any unsolicited marketing or
                spam and will take all reasonable steps to ensure that Wefully protect your rights and comply with Our
                obligations under the GDPR and the Privacyand Electronic Communications (EC Directive) Regulations 2003.
              </div>
            </li>
            <li>
              <span>6.1.3</span>
              <div>
                You have the right to withdraw your consent to Us using your personal data at any time, andto request
                that We delete it; however this may adversely affect the delivery, use and functionof the Subscription
                Services.
              </div>
            </li>
            <li>
              <span>6.1.4</span>
              <div>
                We do not keep personal data for any longer than is necessary in light of the reason(s) forwhich it was
                first collected.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>7. How and Where Do We Store Your Data?</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>1.1.1</span>
              <div>
                We only keep personal data for as long as We need to in order to use it as described abovein section 6,
                and/or for as long as We have your permission to keep it.
              </div>
            </li>
            <li>
              <span>7.1.2</span>
              <div>
                Your data will only be stored within the European Economic Area (“the EEA”) (The EEA consists of all EU
                member states, plus Norway, Iceland, and Liechtenstein).
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>8. Do We Share Your Data?</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>8.1.1</span>
              <div>
                We may share your data with other companies in Our group for administrative and internalmanagement. This
                includes Our subsidiariesand/orOur holding company and itssubsidiaries.
              </div>
            </li>
            <li>
              <span>8.1.1</span>
              <div>
                We may sometimes contract with third parties to supply products and services to you onOur behalf. These
                may include payment processing, delivery of goods, search enginefacilities, advertising, and marketing.
                In some cases, the third parties may require access tosome or all of your data. Where any of your data
                is required for such a purpose, We will takeall reasonable steps to ensure that your data will be
                handled safely, securely, and inaccordance with your rights, Our obligations, and the obligations of the
                third party under thelaw.
              </div>
            </li>
            <li>
              <span>8.1.2</span>
              <div>
                We may compile statistics about the use of products and services including theSubscription Services
                including data on traffic, usage patterns, user numbers, sales, andother information. All such data will
                be anonymised and will not include any personallyidentifying data, or any anonymised data that can be
                combined with other data and used toidentify you or your employees [or customers]. We may from time to
                time share such datawith third parties such as prospective investors, affiliates, partners, and
                advertisers. Datawill only be shared and used within the bounds of the law.
              </div>
            </li>
            <li>
              <span>8.1.3</span>
              <div>
                In certain circumstances, We may be legally required to share certain data held by Us, which may include
                your personal data, for example, where We are involved in legal proceedings, where We are complying with
                legal requirements, a court order, or a governmental authority.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>9. What Happens If Our Business Changes Hands?</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>1.1.1</span>
              <div>
                We may, from time to time, expand or reduce Our business and this may involve the saleand/or the
                transfer of control of all or part of Our business. Any personal data that you haveprovided will, where
                it is relevant to any part of Our business that is being transferred, betransferred along with that part
                and the new owner or newly controlling party will, under theterms of this Privacy Policy, be permitted
                to use that data only for the same purposes forwhich it was originally collected by Us.
              </div>
            </li>
            <li>
              <span>9.1.1</span>
              <div>
                In the event that any of your data is to be transferred in such a manner, you will not becontacted in
                advance and informed of the changes.{' '}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>10. How Can You Control Your Data?</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>1.1.1</span>
              <div>
                When you submit personal data to us, you may be given options to restrict Our use of yourdata. In
                particular, We aim to give you strong controls on Our use of your data for directmarketing purposes
                (including the ability to opt-out of receiving emails from Us which youmay do by unsubscribing using the
                links provided in Our emailsandat the point ofproviding your detailsand by managing your Account).
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>11. How Can You Access Your Data?</h2>
        <div className={styles.description}>
          You have the right to ask for a copy of any of your personal data held by Us (where such data is held).
          Pleasecontact Us for more details at steven.hunt@astrosat.netor using the contact details below in section 13.
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>12. Contacting us</h2>
        <div className={styles.description}>
          If you have any questions about Our Subscription Services or this Privacy Policy, please contact Us by emailat
          steven.hunt@astrosat.net, by telephone on 0131 516 8864, or by post at Copernicus Kirk, 200 High
          Street,Musselburgh EH21 7DX. Please ensure that your query is clear, particularly if it is a request for
          informationabout the data We hold about you (as under section 11, above).
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>13. Changes to Our Privacy Policy</h2>
        <div className={styles.description}>
          We may change this Privacy Policy from time to time (for example, if the law changes). Any changes will be
          immediately posted on Our Subscription Services and you will be deemed to have accepted the terms of
          thePrivacy Policy on your first use of Our Subscription Services following the alterations. We recommend
          thatyou check this page regularly to keep up-to-date.
        </div>
      </div>
    </div>
  );
};

const EndUserLicenseAgreement = () => {
  return (
    <div className={styles.text}>
      <h1 className={styles.textHeader}>End User License Agreement</h1>
      <div className={styles.description}>
        This agreement is between <span className={styles.emphasis}>STEVENSON ASTROSAT LIMITED</span> a company
        incorporated in Scotland (Number SC423073) and whose Registered Office is at Copernicus Kirk, 200 High Street,
        Musselburgh EH21 7DX trading as OR3IS&trade; &#153; (<span className={styles.emphasis}>“OR3IS”</span>) and you (
        <span className={styles.emphasis}>“the User”</span>). This is a Click to Agree Contract from within the Software
        if the User wishes to be bound by these Terms and Conditions. If the User does not agree to be bound by these
        Terms and Conditions, the User cannot USE the Software.
      </div>
      <div className={styles.description}>
        The contract (“Agreement”) between the User and OR3IS will comprise:{' '}
        <ul className={styles.list}>
          <li>
            <span>1.</span>
            <div>these Terms and Conditions; and</div>
          </li>
          <li>
            <span>2.</span>
            <div>the Privacy Policy;</div>
          </li>
        </ul>
      </div>
      <div className={styles.title}>
        <h1>PART ONE – SUBSCRIPTION SERVICES.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>1: Access to the Software.</h2>
        <div className={styles.description}>
          OR3IS grants to the User a non-exclusive, royalty based, non-sublicensable licence to Use the Software for the
          User’s personal business use for the duration of this Agreement, subject to the following conditions: -
          <ul className={styles.list}>
            <li>
              <span>1.1.</span>
              <div>
                The Software is located on the Platform. OR3IS has full administrative access rights to the Platform.
                Users may access the Software but have no right to administer the Platform or receive a copy of the
                object code or source code to the Software.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2: Conditions of Use.</h2>
        <div className={styles.description}>
          The rights to use the Software provided to the User are non-exclusive, non-transferable and are for the User’s
          personal business use only. The User’s right to use the Software is subject to the following conditions:- the
          User shall not:
          <ul className={styles.list}>
            <li>
              <span>2.1.</span>
              <div> Transfer to any other person any of its rights to use the Software;</div>
            </li>
            <li>
              <span>2.2.</span>
              <div>Sell, license, rent or lease the Software;</div>
            </li>
            <li>
              <span>2.3.</span>
              <div> Make the Software available to anyone who is not a User;</div>
            </li>
            <li>
              <span>2.4.</span>
              <div>Create any derivative works based upon the Software or Documentation;</div>
            </li>
            <li>
              <span>2.5.</span>
              <div>
                Copy any feature, design or graphic in, or reverse engineer the Software (including without prejudice to
                the foregoing generality the graphical user interface and menu command hierarchy);
              </div>
            </li>
            <li>
              <span>2.6.</span>
              <div>
                Access the Software (i) in order to build a competitive solution or to assist someone else to build a
                competitive solution; or (ii) if the User is an employee or contractor of a OR3IS competitor;
              </div>
            </li>
            <li>
              <span>2.7.</span>
              <div>Use the Software in a way that violates any criminal or civil law;</div>
            </li>
            <li>
              <span>2.8.</span>
              <div>Load test the Software in order to test scalability; or,</div>
            </li>
            <li>
              <span>2.9</span>
              <div>Exceed any specified usage limits listed the Documentation.</div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>3: User Content/Security</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>3.1.</span>
              <div>
                Users provide all data for use in the Software, and OR3IS is not obliged to modify or add to User
                Content except as specified in Clause 4. The User is solely responsible for User Content and the
                accuracy of User Content.
              </div>
            </li>
            <li>
              <span>3.2.</span>
              <div>
                User Content belongs to the User or its licensors, and OR3IS makes no claim to any right of ownership in
                it.
              </div>
            </li>
            <li>
              <span>3.3.</span>
              <div>OR3IS shall keep User Content confidential in accordance with Clause 10 of this Agreement.</div>
            </li>
            <li>
              <span>3.4.</span>
              <div>
                Subject to the terms of Clause 4, OR3IS shall only be entitled to use User Content strictly as necessary
                to carry out its obligations under this Agreement, and for no other purpose. However, OR3IS:
                <ul className={styles.list}>
                  <li>
                    <span>3.4.1.</span>
                    <div>
                      may observe and report back to the User on the User’s usage of the Software, and make
                      recommendations for improved usage of the Software;
                    </div>
                  </li>
                  <li>
                    <span>3.4.2.</span>
                    <div>
                      may identify trends and publish reports on its findings provided the reports include data
                      aggregated from more than one site of the User and do not identify the User;
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <span>3.5.</span>
              <div>
                The parties shall comply with the principles of the Privacy Legislation and in accordance with the
                Privacy Policy.
              </div>
            </li>
            <li>
              <span>3.6.</span>
              <div>
                Sharing of accounts is not permitted unless expressly authorised in writing by OR3IS. Users must keep
                account details confidential and Users should not reveal their username or password to any unauthorised
                third parties. OR3IS accepts no liability for any losses or damages incurred as a result of account
                details being shared in breach of the terms of this Agreement. It is recommended that Users do not save
                account details in their internet browser.
              </div>
            </li>
            <li>
              <span>3.7.</span>
              <div>Passwords must be strong, robust, robust and difficult to break and changed on a regular basis.</div>
            </li>
            <li>
              <span>3.8.</span>
              <div>
                Whereas as part of the Subscription Services, OR3IS may host email accounts or other online
                communications infrastructure or subscription accounts (including the OR3IS subscription itself) for
                Users, OR3IS accepts no responsibility and shall not be liable for third parties accessing such email,
                online communications accounts or subscription accounts by way of breaking or hacking passwords. It is
                the responsibility of Users to ensure that all email, online communications accounts and subscription
                accounts are properly protected with robust passwords. The terms of Clause 4 apply to the use of any
                such email, online communications accounts and subscription accounts.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>4: Acceptable Usage Policy</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>4.1.</span>
              <div>
                Without prejudice to the generality of Clause 2.7, when using the Software; Users should do so in
                accordance with the following rules:
                <ul className={styles.list}>
                  <li>
                    <span>4.1.1.</span>
                    <div>Users must not use obscene or vulgar language;</div>
                  </li>
                  <li>
                    <span>4.1.2.</span>
                    <div>
                      User Sites may not contain any material that is unlawful or otherwise objectionable (including
                      that which may be in breach of rules, regulations or legislation in force in the United Kingdom or
                      any other jurisdiction in which the User’s User Site can be lawfully accessed. This does not
                      extend to material which may be automatically blocked in certain jurisdictions but that is lawful
                      in the User’s home country);
                    </div>
                  </li>
                  <li>
                    <span>4.1.3.</span>
                    <div>
                      User Sites may not contain any material that is intended to promote or incite violence or any
                      other unlawful conduct against any group, individual or animal. This includes, but is not limited
                      to, the provision of instructions on how to assemble weapons of any kind, bombs, grenades or other
                      explosive devices;
                    </div>
                  </li>
                  <li>
                    <span>4.1.4.</span>
                    <div>
                      User Sites may not infringe the Intellectual Property rights of any third party including, but not
                      limited to, copyright, trademarks, patents and designs;
                    </div>
                  </li>
                  <li>
                    <span> 4.1.5.</span>
                    <div>
                      User Sites may not contain any material that may contain viruses or other software or instructions
                      that may damage or disrupt other software, computer hardware or communications networks;
                    </div>
                  </li>
                  <li>
                    <span>4.1.6.</span>
                    <div>
                      User Sites may not be used for unauthorised mass-communications such as “spam” or “junk mail”; and
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <span>4.2.</span>
              <div>
                OR3IS does not screen or pre-approve any User Site or User Content (although Users acknowledge that
                OR3IS may do so if it wishes).
              </div>
            </li>
            <li>
              <span>4.3.</span>
              <div>
                OR3IS may edit a User Site to comply with the provisions of sub-Clause 4.1 without prior consultation.
                In cases of severe breaches of the provisions of sub-Clause 4.1, a User Site may be taken down and the
                relevant account may be suspended or terminated. The User will not be informed in writing of the reasons
                for such alterations or take downs.
              </div>
            </li>
            <li>
              <span>4.4.</span>
              <div>
                OR3IS accepts no responsibility or liability for any infringement of third-party rights by User Sites.
              </div>
            </li>
            <li>
              <span>4.5.</span>
              <div>
                OR3IS will not be liable in any way or under any circumstances for any loss or damage that any User may
                incur as a result of such User Sites, or OR3IS exercising its rights under this Agreement, nor for any
                errors or omissions in User Sites. Use of and reliance upon User Sites is entirely at the User’s own
                risk.
              </div>
            </li>
            <li>
              <span>4.6.</span>
              <div>
                The User acknowledges that OR3IS may retain copies of any and all communications, information, User
                Content and User Sites sent to OR3IS.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>5: Intellectual Property</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>5.1.</span>
              <div>
                Subject to the exceptions in Clause 6 of this Agreement, all Content, that is not User Content, and the
                Database and the Software and the Documentation are the property of OR3IS, or OR3IS’ Affiliates or
                licensors. By continuing to use the Software the User acknowledges that such material is protected by
                applicable United Kingdom and international Intellectual Property and other laws.
              </div>
            </li>
            <li>
              <span>5.2.</span>
              <div>
                You may print, reproduce, copy, distribute, store or in any other fashion re-use Content from the
                Software for personal or educational purposes only unless otherwise given OR3IS’ express written
                permission to do so. Specifically, the User agrees that it will not systematically copy Content from the
                Software with a view to creating or compiling any form of comprehensive collection, compilation,
                directory or database unless given OR3IS’ express written permission to do so.
              </div>
            </li>
            <li>
              <span>5.3.</span>
              <div>
                In the event that new inventions, designs or processes evolve in performance of or as a result of this
                Agreement, the User acknowledges that the same shall be the property of OR3IS unless otherwise agreed in
                writing by OR3IS.
              </div>
            </li>
            <li>
              <span>5.4.</span>
              <div>
                Any trade mark, trade name or logo such as “Powered by OR3IS” appearing on or in the Software is the
                property of OR3IS and must not be copied, obscured or removed from the Software.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>6: User Site Intellectual Property</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>6.1.</span>
              <div>
                The Intellectual Property rights subsisting in the User Content of User Sites belong to the User to
                which that/those User Site(s) belong(s) unless it is expressly stated otherwise.
              </div>
            </li>
            <li>
              <span>6.2.</span>
              <div>
                Where expressly indicated, certain Content available through User Sites and the Intellectual Property
                rights subsisting therein belongs to other parties.
              </div>
            </li>
            <li>
              <span>6.3.</span>
              <div>
                The third party Content described in this Clause 6, unless expressly stated to be so, is not covered by
                any permission granted by Clause 5 of these Terms and Conditions to use Content.
              </div>
            </li>
            <li>
              <span>6.4.</span>
              <div>
                For the avoidance of doubt, the Database (excluding the User Content therein) shall not be considered
                User Content.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>7: Third Party Intellectual Property</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>7.1.</span>
              <div>
                Unless otherwise expressly indicated, all Intellectual Property rights including, but not limited to,
                Copyright and Trademarks, in Content belong to the manufacturers or distributors of such products as may
                be applicable.
              </div>
            </li>
            <li>
              <span>7.2.</span>
              <div>
                Subject to Clause 5 the User may not reproduce, copy, distribute, store or in any other fashion re-use
                Content unless otherwise indicated on the Software or the Documentation or unless given express written
                permission to do so by the relevant manufacturer or supplier.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>8: Warranty Disclaimer</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>8.1.</span>
              <div>
                Except as expressly provided in this Agreement, the Software and Professional Services are provided with
                no other warranties of any kind, and OR3IS disclaims all other warranties, express or implied, including
                without limitation any warranty of merchantability or fitness for a particular purpose. OR3IS does not
                warrant that the use of the Subscription Services shall be uninterrupted or error-free.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>9: Limitation of Liability</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>9.1.</span>
              <div>
                Neither party shall be liable under this Agreement for any indirect, special, incidental, punitive or
                consequential damages (including without limitation damages for loss of goodwill, work stoppage,
                computer failure or malfunction, lost or corrupted data, lost profits, lost business or lost
                opportunity), or any other similar damages under any theory of liability (whether in contract,
                tort/delict, strict liability or any other theory), even if the other party has been informed of this
                possibility. Each party’s total liability for any direct loss, cost, claim or damages of any kind
                related to this Agreement or the relevant Order Form shall not exceed the sum of £10,000. However, there
                is no limitation on direct loss, claim or damages arising as a result of an infringement of either
                party’s Intellectual Property rights by the other party, or a breach of the Privacy Legislation by the
                other party.
              </div>
            </li>
            <li>
              <span>9.2.</span>
              <div>
                OR3IS’ liability under this Agreement (except where provided otherwise in this agreement to a lesser
                extent) shall be limited to the amount of professional indemnity insurance underwritten in the name of
                OR3IS which shall be £1,000,000. This limitation shall not apply to a breach of the Privacy Legislation.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>10: Confidentiality</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>10.1.</span>
              <div>
                Each party may be given access to Confidential Information from the other party in order to perform its
                obligations under this Agreement. A party’s Confidential Information shall not be deemed to include
                information that (i) is now, or subsequently becomes, through no act or failure to act on the part of
                receiving party (the “Receiver”), generally known or available; (ii) is known by the Receiver at the
                time of receiving such information, as evidenced by the Receiver’s records; (iii) is subsequently
                provided to the Receiver by a third party, as a matter of right and without restriction on disclosure;
                or (iv) is required to be disclosed by law, provided that the party to whom the information belongs is
                given prior written notice of any such proposed disclosure.
              </div>
            </li>
            <li>
              <span>10.2.</span>
              <div>
                Subject to clauses 10.4, each party shall hold the other’s Confidential Information in confidence and
                not make the other’s Confidential Information available to any third party (other than to a consultant
                or a Sub-contractor for the purposes of this Agreement and which consultant or Sub-contractor shall have
                entered into undertakings of confidentiality in relation to the Confidential Information on terms no
                less onerous than those contained in this Clause 10), or use the other’s Confidential Information for
                any purpose other than to carry out its obligations under this Agreement.
              </div>
            </li>
            <li>
              <span>10.3.</span>
              <div>
                Each party shall take all reasonable steps to ensure that the other’s Confidential Information to which
                it has access is not disclosed or distributed by its employees or agents in violation of the terms of
                this Agreement.
              </div>
            </li>
            <li>
              <span>10.4.</span>
              <div>
                A party may disclose Confidential Information to the extent such Confidential Information is required to
                be disclosed by law, by any governmental or other regulatory authority or by a court or other authority
                of a competent jurisdiction, provided that, to the extent it is legally permitted to do so, it gives the
                other party as much notice of such disclosure as possible and, where notice of disclosure is not
                prohibited and is given in accordance with this clause 10.4, it takes into account the reasonable
                requests of the other party in relation to the content of such disclosure.
              </div>
            </li>
            <li>
              <span>10.5.</span>
              <div>
                No party shall make, or permit any person to make, any public announcement concerning this Agreement
                without the prior written consent of the other parties (such consent not to be unreasonably withheld or
                delayed), except as required by law, any governmental or regulatory authority (including without
                limitation, any relevant securities exchange), any court or other authority of competent jurisdiction.
              </div>
            </li>
            <li>
              <span>10.6.</span>
              <div>
                This clause 10 shall survive termination of this Agreement or any Order Form, howsoever arising.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>11: Indenification by the User</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>11.1.</span>
              <div>
                The User shall indemnify and hold harmless OR3IS, its Affiliates, directors, and employees from any
                damages finally awarded against OR3IS (including, without limitation, reasonable costs and legal fees
                incurred by OR3IS) arising out of any third party suit, claim or other legal action (including but not
                limited to any governmental investigations, complaints and actions) in connection with the User Content,
                including, without limitation, any action for infringement of any trademark, copyright, trade secret,
                right of publicity or privacy (including defamation), patent or other proprietary right with respect to
                the User Content (“Legal Claim”).
              </div>
            </li>
            <li>
              <span>11.2.</span>
              <div>
                OR3IS shall give written notice to the User of any Legal Claim no later than 30 days after first
                receiving notice of a Legal Claim and shall give copies to the User of all communications, notices
                and/or other actions relating to the Legal Claim. OR3IS shall give the User the sole control of the
                defence of any Legal Claim, shall act in accordance with the reasonable instructions of the User and
                shall give the User such assistance as the User reasonably requests to defend or settle such claim. The
                User shall conduct its defence at all times in a manner which is not adverse to OR3IS’ interests. OR3IS
                may employ its own counsel to assist it with respect to any such claim. OR3IS shall bear all costs of
                engaging its own counsel, unless engagement of counsel is necessary because of a conflict of interest
                with the User or its counsel, or because the User fails to assume control of the defence. OR3IS shall
                not settle or compromise any Legal Claim without the User’s express written consent.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>12: Law</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>12.1.</span>
              <div>
                This Agreement shall be governed by the laws of Scotland. The parties consent to the exercise of
                exclusive jurisdiction of the Courts of Scotland.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>13: Feedback and Modifications</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>13.1.</span>
              <div>
                The User hereby acknowledges that upon submitting Feedback to OR3IS, the User automatically grants to
                OR3IS a worldwide, perpetual, irrevocable, royalty free licence to use that Feedback in any way OR3IS
                deems appropriate including, but not limited to:
                <ul className={styles.list}>
                  <li>
                    <span>13.1.1.</span>
                    <div>
                      The use, publication, distribution, transmission, broadcasting, licensing, sub-licensing, leasing,
                      lending and sale of the Feedback; and
                    </div>
                  </li>
                  <li>
                    <span>13.1.2.</span>
                    <div>
                      The creation, use, publication, distribution, transmission, broadcasting, licensing,
                      sub-licensing, leasing, lending and sale of any derivative works based upon the Feedback.
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <span>13.2.</span>
              <div>OR3IS’ use of the Feedback shall not bestow any rights or interests upon the User whatsoever.</div>
            </li>
            <li>
              <span>13.3.</span>
              <div>
                The User hereby acknowledges that any modifications made to the Software at the request or suggestion of
                the User will belong to and be the Intellectual Property of OR3IS.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.title}>
        <h1>PART 2 - DEFINITIONS</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>14: Glossary</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>14.1.</span>
              <div>
                “Affiliate” means an entity which controls, is controlled by, or is under common control with, a party,
                and control means the ability to vote 50% or more of the voting securities of any entity or otherwise
                having the ability to influence and direct the polices and direction of an entity;
              </div>
            </li>
            <li>
              <span>14.2.</span>
              <div>
                “Content” means any text, graphics, images, audio, video, software, data compilations including, but not
                limited to, text, graphics, logos, icons, sound clips, video clips, data compilations, page layout,
                underlying code and software and any other form of information capable of being stored in a computer
                that appears on, is uploaded to or forms part of the Software or the Platform; BUT excluding User
                Content;
              </div>
            </li>
            <li>
              <span>14.3.</span>
              <div>“Database” means the database stored on the Platform which contains inter alia User Content;</div>
            </li>
            <li>
              <span>14.4.</span>
              <div>
                “DPA” means the Data Protection Act 2018 and any modification, amendment or re-enactment thereof;
              </div>
            </li>
            <li>
              <span>14.5.</span>
              <div>
                “Documentation” means user documentation provided electronically by OR3IS for use with the Software, as
                periodically updated;
              </div>
            </li>
            <li>
              <span>14.6.</span>
              <div>
                “Feedback” means all comments, suggestions, requests, requirements, improvements, feedback, or other
                input the User provides regarding any products or Services owned or supplied by OR3IS, its Affiliates
                and licensees;
              </div>
            </li>
            <li>
              <span>14.7.</span>
              <div>
                “GDPR” means the General Data Protection Regulation (Regulation (EU) 2016/679) as amended, replaced,
                supplemented or adopted into United Kingdom Legislation;
              </div>
            </li>
            <li>
              <span>14.8.</span>
              <div>
                “Intellectual Property” means patents, trademarks, trade name, service mark, copyright, trade secrets,
                know-how, process, technology, development tool, ideas, concepts, design right, domain names, moral
                right, database right, methodology, algorithm and invention, and any other proprietary information
                (whether registered, unregistered, pending or applied for);
              </div>
            </li>
            <li>
              <span>14.9.</span>
              <div>
                “Platform” means the hardware and software environment in which the software element of the Software
                operates, which comprises one or more server computers (whether virtual or not),
                mirroring/duplicating/back-up and storage systems and relative hardware operating software, virtual
                machine software (where relevant), operating system software, database software, anti-virus and security
                software, switches, power supplies and telecommunications infrastructure;
              </div>
            </li>
            <li>
              <span>14.10.</span>
              <div>
                “Privacy Legislation” means the GDPR, the DPA, the Data Protection Directive (95/46/EC), the Regulation
                of Investigatory Powers Act 2000, the Telecommunications (Lawful Business Practice) (Interception of
                Communications) Regulations 2000 (SI 2000/2699), the Electronic Communications Data Protection Directive
                (2002/58/EC), the Privacy and Electronic Communications (EC Directive) Regulations 2003 (SI 2426/2003)
                and all applicable laws and regulations relating to the processing of personal data and privacy,
                including where applicable the guidance and codes of practice issued by the Information Commissioner.
                (as amended or replaced from time to time);
              </div>
            </li>
            <li>
              <span>14.11.</span>
              <div>
                “Privacy Policy” means OR3IS’ policy relating to User Content and compliance with (amongst others) the
                DPA and the GDPR from time to time, the current version of which is located here
                https://or3is.com/privacy-policy ;
              </div>
            </li>
            <li>
              <span>14.12.</span>
              <div>
                “Software” means the OR3IS™ proprietary operating software and the Third Party Software written in
                object and source code residing on and used for operating the Platform and the Software as Updated and
                Upgraded from time to time;
              </div>
            </li>
            <li>
              <span>14.13.</span>
              <div>
                “Third Party Software” means software other than the Software which belongs to third parties and in
                relation to which OR3IS has the right to grant sub-licenses;
              </div>
            </li>
            <li>
              <span>14.14.</span>
              <div>
                “Update” means any update, update rollup, service pack, feature pack, critical update, security update,
                or hotfix that is used to improve or to fix a software product;
              </div>
            </li>
            <li>
              <span>14.15.</span>
              <div>
                “Upgrade” means a software package that replaces an installed version of a product with a newer version
                of the same product, typically leaving existing customer data and preferences intact while replacing the
                existing software with the newer version;
              </div>
            </li>
            <li>
              <span>14.16.</span>
              <div>
                “User” means the person that has permission to accesses the Software as a named user and is not employed
                by OR3IS and acting in the course of their employment;
              </div>
            </li>
            <li>
              <span>14.17.</span>
              <div>
                “User Content” means any text, graphics, images, audio, video, software, data compilations and any other
                form of information capable of being stored in a computer that appears on, is uploaded to or forms part
                of a User Site or the Software and has been uploaded by a User;
              </div>
            </li>
            <li>
              <span>14.18.</span>
              <div>
                “User Site” means a partition/tenancy on the Platform created by OR3IS for a User or Users accessing the
                Software which shall contain User Content and shall be hosted on the Platform;
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.schedule1}>
        <h1>SCHEDULE 1</h1>
        <h3>Processing, Personal Data and Data Subjects</h3>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>1: Processing by OR3IS</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>1.1</span>
              <div>
                Scope – persons who choose to enter their personal details into the application as either a person
                wishing help or as a person able and willing to offer help. Also staff of Voluntary Action Orkney who
                access the system to facilitate the matching of volunteer helpers to those requiring help.
              </div>
            </li>
            <li>
              <span>1.2</span>
              <div>
                Nature – the collection of data from a web based questionnaire, the storage of that data in a database
                and the transmission of that data to a map based web application
              </div>
            </li>
            <li>
              <span>1.3</span>
              <div>
                Purpose of Processing – to enable Voluntary Action Orkney to identify individuals in need of help and to
                identify volunteers who may be able to provide that help.
              </div>
            </li>
            <li>
              <span>1.4</span>
              <div>
                Duration of the Processing – the term of the agreement or such later date as may be specified or
                required by law
              </div>
            </li>
            <li>
              <span>1.5</span>
              <div>Types of Personal Data – names, addresses, email addresses</div>
            </li>
            <li>
              <span>1.6</span>
              <div>Categories of Data Subject – natural persons over the age of 18 resident in Orkney</div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2: Rights and Obligations of Data Controller</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>2.1</span>
              <div>
                The rights and obligations of the Data Controller set out in this Agreement and the GDPR and DPA.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const TermsAndConditions = () => {
  const [info, setInfo] = useState(PRIVACY_POLICY);
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <OrbisLogo className={styles.logo} />
      </div>
      <div className={styles.body}>
        <div className={styles.buttons}>
          <div>
            <Button
              theme="link"
              classNames={[`${styles.button} ${info !== PRIVACY_POLICY && styles.unselected}`]}
              onClick={() => setInfo(PRIVACY_POLICY)}
            >
              Privacy Policy
            </Button>
          </div>
          <div>
            <Button
              theme="link"
              classNames={[`${styles.button} ${info !== EULA && styles.unselected}`]}
              onClick={() => setInfo(EULA)}
            >
              End User License Agreement
            </Button>
          </div>
        </div>
        <div className={styles.infoContainer}>
          {info === PRIVACY_POLICY && <PrivacyPolicy />}
          {info === EULA && <EndUserLicenseAgreement />}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
