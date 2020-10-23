import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';

import { Button } from '@astrosat/astrosat-ui';

import { ReactComponent as OrbisLogo } from '../orbis-light.svg';

import styles from './terms-and-conditions.module.css';

const PRIVACY_POLICY = 'PRIVACY_POLICY';
const TERMS = 'TERMS';

const PrivacyPolicy = () => {
  return (
    <div className={styles.text}>
      <h1 className={styles.textHeader}>Privacy Policy</h1>
      <div className={styles.description}>
        <span className={styles.emphasis}>STEVENSON ASTROSAT LIMITED</span> a
        company incorporated in Scotland (Number SC423073) and whose Registered
        Office is at Copernicus Kirk, 200 High Street, Musselburgh EH21 7DX
        trading as ORBIS&trade; understands that your privacy is important to
        you and that you care about how your personal data is used and shared
        online. We respect and valuethe privacy of Customers and will only
        collect and use personal data in ways that are described here, and in a
        mannerthat is consistent with Our obligations and your rights under the
        law.Please read this Privacy Policy carefully and ensure that you
        understand it. If you do not accept and agree with thisPrivacy Policy,
        you must stop using Our Subscription Services immediately.
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          1. Definitions and Interpretation
        </h2>
        <div className={styles.description}>
          In this Policy, the following terms shall have the following meanings:
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>"Account"</span>
              <div>
                means an account required to access and/or useSubscription
                Service(s);
              </div>
            </li>
            <li className={styles.listItem}>
              <span>"Cookie"</span>
              <div>
                means a small text file placed on your computer or deviceby Our
                Subscription Services when you visit certain partsof Our
                Subscription Services and/or when you use certainfeatures of Our
                Subscription Services. Details of theCookies used by Our
                Subscription Services are set out insection 12, below;
              </div>
            </li>
            <li className={styles.listItem}>
              <span>“Cookie Law”</span>
              <div>
                means the relevant parts of the Privacy and
                ElectronicCommunications (EC Directive) Regulations 2003
              </div>
            </li>
            <li className={styles.listItem}>
              <span>“personal data”</span>
              <div>
                means any and all data that relates to an identifiableperson who
                can be directly or indirectly identified fromthat data. In this
                case, it means personal data that you giveto Us via Our
                Subscription Services. This definition shall,where applicable,
                incorporate the definitions provided inthe EU Regulation
                2016/679 – the General Data ProtectionRegulation (“GDPR”); and
              </div>
            </li>
            <li className={styles.listItem}>
              <span>“We/Us/Our”</span>
              <div>
                means the said Stevenson Astrosat Limited trading astrading as
                ORBIS™ (as above).
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2. Information About Us</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>2.1.1</span>
              <div>Our VAT number is GB 150 4887 06</div>
            </li>
            <li className={styles.listItem}>
              <span>2.1.2</span>
              <div>
                Our Data Protection Officer is Steven Hunt, and can be contacted
                by email atsteven.hunt@astrosat.net, by telephone on 0131 516
                8864, or by post at Copernicus Kirk,200 High Street, Musselburgh
                EH21 7DX.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          3. What Does This Policy Cover?
        </h2>
        <div className={styles.description}>
          This Privacy Policy applies only to our use of data gathered by Us in
          your use of the Subscription Services.
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>4. Your Rights</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>1.1.1</span>
              <div>
                As a data subject, you have the following rights under the GDPR,
                which this Policy and Ouruse of personal data have been designed
                to uphold:
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.1</span>
                    <div>
                      4.1.1.a.1The right to be informed about Our collection and
                      use of personal data;
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.2</span>
                    <div>
                      The right of access to the personal data We hold about you
                      or your employees (see section11);
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.3</span>
                    <div>
                      The right to rectification if any personal data We hold
                      about you or your employees isinaccurate or incomplete
                      (please contact Us using the details in section 13);
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.4</span>
                    <div>
                      The right to be forgotten – i.e. the right to ask Us to
                      delete any personal data We hold aboutyou or your
                      employees (We only hold personal data for a limited time,
                      as explained in section6 but if you would like Us to
                      delete it sooner, please contact Us using the details in
                      section 13). Please note that deletion of certain personal
                      data may prevent the Subscription Servicesfrom
                      functioning;
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.5</span>
                    <div>
                      The right to restrict (i.e. prevent) the processing of
                      personal data;
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.6</span>
                    <div>
                      The right to data portability (obtaining a copy of
                      personal data to re-use with another serviceor
                      organisation);
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.7</span>
                    <div>
                      The right to object to Us using personal data for
                      particular purposes; and
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>4.1.1.a.8</span>
                    <div>
                      Rights with respect to automated decision making and
                      profiling.
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className={styles.listItem}>
              <span>4.1.2</span>
              <div>
                If you have any cause for complaint about Our use of personal
                data, please contact Us usingthe details provided in section 13
                and We will do Our best to solve the problem for you. If Weare
                unable to help, you also have the right to lodge a complaint
                with the UK’s supervisoryauthority, the Information
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
        <h2 className={styles.textSectionHeader}>
          5. What Data Do We Collect?
        </h2>
        <div className={styles.description}>
          We may collect some or all of the following personal and non-personal
          data:
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>a)</span>
              <div>Name</div>
            </li>
            <li className={styles.listItem}>
              <span>b)</span>
              <div>Email address</div>
            </li>
            <li className={styles.listItem}>
              <span>c)</span>
              <div>Name of the company, organization, legal entity</div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          6. How Do We Use Your Data?
        </h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>1.1.1</span>
              <div>
                All personal data is processed and stored securely, for no
                longer than is necessary in lightof the reason(s) for which it
                was first collected. We will comply with Our obligations
                andsafeguard your rights under the GDPRat all times. For more
                details on security see section7, below.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>6.1.1</span>
              <div>
                0ur use of personal data will always have a lawful basis, either
                because it is necessary forOur performance of a contract with
                you, because you have consented to Our use of personaldata (e.g.
                by subscribing to emails or for delivery of the Subscription
                Services), or becauseit is in Our legitimate interests.
                Specifically, We may use personal data for the
                followingpurposes:
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <span>1.1.1.a.1</span>
                    <div>[Providing and managing your Account;]</div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.1</span>
                    <div>
                      [Providing and managing your access to the Subscription
                      Services;]
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.2</span>
                    <div>
                      [Personalising and tailoring your experience in the
                      Subscription Services;]
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.3</span>
                    <div>
                      [Supplying Our [products] AND/OR[services] to you (please
                      note that We require yourpersonal data in order to enter
                      into a contract with you);]
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.4</span>
                    <div>
                      [Personalising and tailoring Our [products]AND/OR
                      [services] for you;]
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.5</span>
                    <div>[Replying to emails from you;]</div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.6</span>
                    <div>
                      [Supplying you with emails that you have opted into (you
                      may unsubscribe or opt-out at anytime
                    </div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.7</span>
                    <div>[Market research;]</div>
                  </li>
                  <li className={styles.listItem}>
                    <span>6.1.1.a.8</span>
                    <div>
                      [Analysing your use of Our Subscription Services [and
                      gathering feedback] to enable Us tocontinually improve Our
                      Subscription Services and your user experience;]
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className={styles.listItem}>
              <span>6.1.2</span>
              <div>
                With your permission and/or where permitted by law, We may also
                use your data formarketing purposes which may include contacting
                you by email. We will not, however, sendyou any unsolicited
                marketing or spam and will take all reasonable steps to ensure
                that Wefully protect your rights and comply with Our obligations
                under the GDPR and the Privacyand Electronic Communications (EC
                Directive) Regulations 2003.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>6.1.3</span>
              <div>
                You have the right to withdraw your consent to Us using your
                personal data at any time, andto request that We delete it;
                however this may adversely affect the delivery, use and
                functionof the Subscription Services.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>6.1.4</span>
              <div>
                We do not keep personal data for any longer than is necessary in
                light of the reason(s) forwhich it was first collected.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          7. How and Where Do We Store Your Data?
        </h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>1.1.1</span>
              <div>
                We only keep personal data for as long as We need to in order to
                use it as described abovein section 6, and/or for as long as We
                have your permission to keep it.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>7.1.2</span>
              <div>
                Your data will only be stored within the European Economic Area
                (“the EEA”) (The EEA consists of all EU member states, plus
                Norway, Iceland, and Liechtenstein).
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>8. Do We Share Your Data?</h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>8.1.1</span>
              <div>
                We may share your data with other companies in Our group for
                administrative and internalmanagement. This includes Our
                subsidiariesand/orOur holding company and itssubsidiaries.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>8.1.1</span>
              <div>
                We may sometimes contract with third parties to supply products
                and services to you onOur behalf. These may include payment
                processing, delivery of goods, search enginefacilities,
                advertising, and marketing. In some cases, the third parties may
                require access tosome or all of your data. Where any of your
                data is required for such a purpose, We will takeall reasonable
                steps to ensure that your data will be handled safely, securely,
                and inaccordance with your rights, Our obligations, and the
                obligations of the third party under thelaw.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>8.1.2</span>
              <div>
                We may compile statistics about the use of products and services
                including theSubscription Services including data on traffic,
                usage patterns, user numbers, sales, andother information. All
                such data will be anonymised and will not include any
                personallyidentifying data, or any anonymised data that can be
                combined with other data and used toidentify you or your
                employees [or customers]. We may from time to time share such
                datawith third parties such as prospective investors,
                affiliates, partners, and advertisers. Datawill only be shared
                and used within the bounds of the law.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>8.1.3</span>
              <div>
                In certain circumstances, We may be legally required to share
                certain data held by Us, which may include your personal data,
                for example, where We are involved in legal proceedings, where
                We are complying with legal requirements, a court order, or a
                governmental authority.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          9. What Happens If Our Business Changes Hands?
        </h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>1.1.1</span>
              <div>
                We may, from time to time, expand or reduce Our business and
                this may involve the saleand/or the transfer of control of all
                or part of Our business. Any personal data that you haveprovided
                will, where it is relevant to any part of Our business that is
                being transferred, betransferred along with that part and the
                new owner or newly controlling party will, under theterms of
                this Privacy Policy, be permitted to use that data only for the
                same purposes forwhich it was originally collected by Us.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>9.1.1</span>
              <div>
                In the event that any of your data is to be transferred in such
                a manner, you will not becontacted in advance and informed of
                the changes.{' '}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          10. How Can You Control Your Data?
        </h2>
        <div className={styles.description}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>1.1.1</span>
              <div>
                When you submit personal data to us, you may be given options to
                restrict Our use of yourdata. In particular, We aim to give you
                strong controls on Our use of your data for directmarketing
                purposes (including the ability to opt-out of receiving emails
                from Us which youmay do by unsubscribing using the links
                provided in Our emailsandat the point ofproviding your
                detailsand by managing your Account).
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          11. How Can You Access Your Data?
        </h2>
        <div className={styles.description}>
          You have the right to ask for a copy of any of your personal data held
          by Us (where such data is held). Pleasecontact Us for more details at
          steven.hunt@astrosat.netor using the contact details below in section
          13.
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>12. Contacting us</h2>
        <div className={styles.description}>
          If you have any questions about Our Subscription Services or this
          Privacy Policy, please contact Us by emailat steven.hunt@astrosat.net,
          by telephone on 0131 516 8864, or by post at Copernicus Kirk, 200 High
          Street,Musselburgh EH21 7DX. Please ensure that your query is clear,
          particularly if it is a request for informationabout the data We hold
          about you (as under section 11, above).
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          13. Changes to Our Privacy Policy
        </h2>
        <div className={styles.description}>
          We may change this Privacy Policy from time to time (for example, if
          the law changes). Any changes will be immediately posted on Our
          Subscription Services and you will be deemed to have accepted the
          terms of thePrivacy Policy on your first use of Our Subscription
          Services following the alterations. We recommend thatyou check this
          page regularly to keep up-to-date.
        </div>
      </div>
    </div>
  );
};

const Terms = () => {
  return (
    <div className={styles.text}>
      <h1 className={styles.textHeader}>
        Astrosat Orbis&trade; Services Agreement with you “the Customer”
      </h1>
      <div className={styles.description}>
        This agreement is between{' '}
        <span className={styles.emphasis}>STEVENSON ASTROSAT LIMITED</span> a
        company incorporated in Scotland (Number SC423073) and whose Registered
        Office is at Copernicus Kirk, 200 High Street, Musselburgh EH21 7DX
        (“Astrosat”) and you, (“the Customer”).
      </div>
      <div className={styles.description}>
        This is a Click to Agree Contract from within the Orbis Software if the
        Customer wishes to be bound by these Terms and Conditions, the Customer
        must click to accept these Terms and Conditions. If the Customer does
        not agree to be bound by these Terms and Conditions, the Customer cannot
        order or use any Subscription Services or any Professional Services. The
        Customer must be at least 18 years old to order Subscription Services.
      </div>
      <div className={styles.description}>
        Astrosat’s issue of an Order Form to the Customer constitutes a
        contractual offer and the Customer’s signing/acceptance of these Terms
        and Conditions and acceptance/signing of an Order Form will conclude the
        contract between Astrosat and the Customer relating to the Subscription
        Services and Professional Services listed in the Order Form. All Order
        Forms will be deemed to be subject to and include these Terms and
        Conditions.
      </div>
      <div className={styles.description}>
        The contract (“Agreement”) between the User and ORBIS will comprise:
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>1.</span>
            <div>these Terms and Conditions; and</div>
          </li>
          <li className={styles.listItem}>
            <span>2.</span>
            <div>the Privacy Policy;</div>
          </li>
        </ul>
      </div>
      <div className={styles.title}>
        <h1>PART ONE – SUBSCRIPTION SERVICES.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>1: Grant of Licence.</h2>
        <div className={styles.description}>
          Astrosat grants to the Customer a non-exclusive, royalty based (i.e.
          the fees specified in the Order Form), non-sublicensable, term licence
          to Use the Subscription Services for the Customer’s internal business
          purposes for the Subscription Term, subject to the following
          conditions:
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span>1.1.</span>
              <div>
                The Subscription Services are located on the Platform. Astrosat
                has full administrative access rights to the Platform. Users may
                access the Subscription Services but have no right to administer
                the Platform or receive a copy of the object code or source code
                to the Software.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>1.2.</span>
              <div>
                Users must have a reasonable speed Internet connection, and
                Local Equipment that is compatible with the Subscription
                Services, as set out in the Documentation. None of these things
                are Astrosat’s responsibility.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>1.3.</span>
              <div>
                Astrosat may periodically Upgrade and Update the Services, in
                order to provide Users with a greater, evolving user experience.
                Some of these changes shall occur automatically, while others
                may require the Customer to schedule and implement the changes.
                The changes may also mean that Users need to upgrade their Local
                Equipment in order to make efficient use of the Subscription
                Services. Astrosat shall provide the Customer with reasonable
                notification in advance in this case.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>1.4.</span>
              <div>
                Astrosat has all required distribution rights to the
                Intellectual Property in the Software and the Documentation.
              </div>
            </li>
            <li className={styles.listItem}>
              <span>1.5.</span>
              <div>
                Neither party shall be under any liability to the other in
                respect of anything which, apart from this provision, may
                constitute breach of this Agreement arising by reason of Force
                Majeure.
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2: Conditions of Use.</h2>
        The Subscription Services provided to the Customer are non-exclusive,
        non-transferable and are for the Customer’s internal business use only.
        The Customer’s right to use the Subscription Services is subject to the
        following conditions:- the Customer shall not:
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>2.1.</span>
            <div>
              subject to Clause 20.4 of this Agreement, transfer to any other
              person any of its rights to use the Subscription Services;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.2.</span>
            <div>
              sell, license, rent or lease the Subscription Services except as
              provided for in this Agreement;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.3.</span>
            <div>
              make the Subscription Services available to anyone who is not a
              User;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.4.</span>
            <div>
              create any derivative works based upon the Subscription Services
              or Documentation;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.5.</span>
            <div>
              copy any feature, design or graphic in, or reverse engineer the
              Software (including without prejudice to the foregoing generality
              the graphical user interface and/or menu command hierarchy);
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.6.</span>
            <div>
              access the Subscription Services (i) in order to build a
              competitive solution or to assist someone else to build a
              competitive solution; or (ii) if the User is an employee or
              contractor of a Astrosat competitor;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.7.</span>
            <div>
              use the Subscription Services in a way that violates any criminal
              or civil law;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.8.</span>
            <div>
              load test the Subscription Services in order to test scalability;
              or,
            </div>
          </li>
          <li className={styles.listItem}>
            <span>2.9.</span>
            <div>
              exceed any usage limits listed on the applicable Order Form.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>3: User Content/Security</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>3.1.</span>
            <div>
              Users provide all data for use in the Subscription Services, and
              Astrosat is not obliged to modify or add to User Content except as
              specified in Clause 4. The Customer is solely responsible for User
              Content and the accuracy of User Content.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>3.2.</span>
            <div>
              User Content belongs to Users or their licensors, and Astrosat
              makes no claim to any right of ownership in User Content except as
              specifically provided herein.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>3.3.</span>
            <div>
              Astrosat shall keep User Content confidential in accordance with
              Clause 16 of this Agreement.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>3.4.</span>
            <div>
              Subject to the terms of Clauses 4 and 23, Astrosat shall only be
              entitled to use User Content strictly as necessary to carry out
              its obligations under this Agreement, and for no other purpose.
              However, Astrosat:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>3.4.1.</span>
                  <div>
                    may observe and report back to the Customer on the
                    Customer’s and its clients’ usage of the Subscription
                    Services, and make recommendations for improved usage of the
                    Subscription Services; and,
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>3.4.2.</span>
                  <div>
                    shall use reasonable endeavours to ensure that the data
                    centre containing the User Content complies with ISO 27001.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>3.5.</span>
            <div>
              Astrosat shall, in providing the Subscription Services, comply
              with the Privacy Legislation and in accordance with its Privacy
              Policy and Clauses 21 and 22 of this Agreement. For the purposes
              of the Legislation (except in the case of Data Sharing in terms of
              Clause 22), Astrosat will be a Data Processor and the Customer
              will be the Data Controller of User Content. This clause is in
              addition to, and does not relieve, remove or replace, Astrosat’s
              obligations or rights under the Privacy Legislation.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>3.6.</span>
            <div>
              Sharing of login/account details is not permitted unless expressly
              authorised in writing by Astrosat. Users must keep login/account
              details confidential and Users should not reveal their username or
              password to any unauthorised third parties. Astrosat accepts no
              liability for any losses or damages incurred as a result of
              account details being shared in breach of the terms of this
              Agreement. It is recommended that Users do not save login/account
              details in their internet browser.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>3.7.</span>
            <div>Passwords must be robust and difficult to break.</div>
          </li>
          <li className={styles.listItem}>
            <span>3.8.</span>
            <div>
              Industry Best Practice security recommendations should be
              implemented at all times, such as (a) maintaining a recognised
              Cyber Essentials Certification IT systems such as
              https://www.cyberessentials.ncsc.gov.uk; (b) Always implementing
              strong, robust, difficult to break passwords, that are changed on
              a regular basis; (c) that Users do not save login/account details
              in their internet browser; and (d) implementing two factor
              authentication at each endpoint.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>3.9.</span>
            <div>
              Whereas as part of the Subscription Services, Astrosat may host
              email accounts or other online communications infrastructure or
              subscription accounts (including the Astrosat subscription itself)
              for Users, Astrosat accepts no responsibility and shall not be
              liable for third parties accessing such email, online
              communications accounts or subscription accounts by way of
              breaking or hacking passwords. It is the responsibility of Users
              to ensure that all email, online communications accounts and
              subscription accounts are properly protected with robust
              passwords. The terms of Clause 4 apply to the use of any such
              email, online communications accounts and subscription accounts.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>4: Acceptable Usage Policy</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>4.1.</span>
            <div>
              Without prejudice to the generality of Clause 2.7, when using the
              Subscription Services; Users should do so in accordance with the
              following rules:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>4.1.1.</span>
                  <div>Users must not use obscene or vulgar language;</div>
                </li>
                <li className={styles.listItem}>
                  <span>4.1.2.</span>
                  <div>
                    User Sites may not contain any material that is unlawful or
                    otherwise objectionable (including that which may be in
                    breach of rules, regulations or legislation in force in the
                    United Kingdom or any other jurisdiction in which the
                    Customer’s User Site can be lawfully accessed. This does not
                    extend to material which may be automatically blocked in
                    certain jurisdictions but that is lawful in the Customer’s
                    home country);
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>4.1.3.</span>
                  <div>
                    User Sites may not contain any material that is intended to
                    promote or incite violence or any other unlawful conduct
                    against any group, individual or animal. This includes, but
                    is not limited to, the provision of instructions on how to
                    assemble weapons of any kind, bombs, grenades or other
                    explosive devices;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>4.1.4.</span>
                  <div>
                    User Sites may not infringe the Intellectual Property rights
                    of any third party including, but not limited to, copyright,
                    trademarks, patents and designs;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>4.1.5.</span>
                  <div>
                    User Sites may not contain any material that may contain
                    viruses or other software or instructions that may damage or
                    disrupt other software, computer hardware or communications
                    networks; and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>4.1.6.</span>
                  <div>
                    User Sites may not be used for unauthorised
                    mass-communications such as “spam” or “junk mail”.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>4.2.</span>
            <div>
              Astrosat does not screen or pre-approve any User Site or User
              Content (although Users acknowledge that Astrosat may do so if it
              wishes).
            </div>
          </li>
          <li className={styles.listItem}>
            <span>4.3.</span>
            <div>
              Astrosat may edit a User Site to comply with the provisions of
              sub-Clause 4.1 without prior consultation. In cases of severe
              breaches of the provisions of sub-Clause 4.1, a User Site may be
              taken down and the relevant account may be suspended or
              terminated. The Customer will not be informed in writing of the
              reasons for such alterations or take downs.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>4.4.</span>
            <div>
              Astrosat accepts no responsibility or liability for any
              infringement of third-party rights by User Sites.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>4.5.</span>
            <div>
              Astrosat will not be liable in any way or under any circumstances
              for any loss or damage that any User may incur as a result of such
              User Sites, or Astrosat exercising its rights under this
              Agreement, nor for any errors or omissions in User Sites. Use of
              and reliance upon User Sites is entirely at the Customer’s own
              risk.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>4.6.</span>
            <div>
              The Customer acknowledges that Astrosat may retain copies of any
              and all communications, information, User Content and User Sites
              sent to Astrosat.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>4.7.</span>
            <div>
              Users must comply with the terms of the Privacy Legislation at all
              times.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>4.8.</span>
            <div>
              Users who are your employees and consultants and other third
              parties must enter into the EULA.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>5: Intellectual Property</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>5.1.</span>
            <div>
              Subject to the exceptions in Clause 6 of this Agreement, all
              Content, that is not User Content, and the Database and the
              Software and the Documentation are the property of Astrosat, or
              Astrosat’s Affiliates or licensors. By continuing to use the
              Subscription Services the Customer acknowledges that such material
              is protected by applicable United Kingdom and international
              Intellectual Property and other laws.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>5.2.</span>
            <div>
              The Customer may print, reproduce, copy, distribute, store or in
              any other fashion re-use Content from the Subscription Services
              for personal or educational purposes only unless otherwise given
              Astrosat’s express written permission to do so. Specifically, the
              Customer agrees that it will not systematically copy Content from
              the Subscription Services with a view to creating or compiling any
              form of comprehensive collection, compilation, directory or
              database unless given Astrosat’s express written permission to do
              so.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>5.3.</span>
            <div>
              In the event that new inventions, designs or processes evolve in
              performance of or as a result of this Agreement, the Customer
              acknowledges that the same shall be the property of Astrosat
              unless otherwise agreed in writing by Astrosat.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>5.4.</span>
            <div>
              Any trade mark, trade name or logo such as “Powered by Astrosat”
              appearing on or in the Software is the property of Astrosat and
              must not be copied, obscured or removed from the Software.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          6: User Site Intellectual Property
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>6.1.</span>
            <div>
              The Intellectual Property rights subsisting in the User Content of
              User Sites belong to the User to which that/those User Site(s)
              belong(s) unless it is expressly stated otherwise in this
              Agreement.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>6.2.</span>
            <div>
              Where expressly indicated, certain Content available through User
              Sites and the Intellectual Property rights subsisting therein
              belongs to third parties.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>6.3.</span>
            <div>
              The third party Content described in this Clause 6, unless
              expressly stated to be so, is not covered by any permission
              granted by Clause 5 of these Terms and Conditions to use Content.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>6.4.</span>
            <div>
              For the avoidance of doubt, the Database (excluding the User
              Content therein) shall not be considered User Content.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          7: Third Party Intellectual Property
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>7.1.</span>
            <div>
              Unless otherwise expressly indicated, all Intellectual Property
              rights including, but not limited to, copyright and trademarks, in
              Content belong to the manufacturers or distributors of such
              Content as may be applicable.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>7.2.</span>
            <div>
              Subject to Clause 5 the Customer may not reproduce, copy,
              distribute, store or in any other fashion re-use Content unless
              otherwise indicated on the Subscription Services or the
              Documentation or unless given express written permission to do so
              by the relevant manufacturer or supplier.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          8: Subscription Services Warranties
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>8.1.</span>
            <div>
              Astrosat warrants that: (i) the Subscription Services will
              function substantially as described in the Documentation; and (ii)
              Astrosat owns or otherwise has the right to provide the
              Subscription Services to the Customer under this Agreement. The
              remedies set out in this Clause 8 are the Customer’s exclusive
              remedies for breach of either warranty.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>8.2.</span>
            <div>
              If the Subscription Services do not function substantially in
              accordance with the Documentation, Astrosat shall, at its option,
              either (i) modify the Subscription Services to conform to the
              Documentation; or (ii) provide a workaround solution that will
              reasonably meet the Customer’s requirements. If neither of these
              options are commercially feasible, either party may terminate the
              relevant Order Form under this Agreement, in which case Astrosat
              shall refund to the Customer all fees pre-paid to Astrosat under
              the relevant Order Form for unused Subscription Services. If the
              normal operation, possession or use of the Subscription Services
              by the Customer is found to infringe any third party Intellectual
              Property right or Astrosat believes that this is likely, Astrosat
              shall, at its option, either (i) obtain a license from such third
              party for the benefit of the Customer; (ii) modify the
              Subscription Services so that they no longer infringe; or (iii) if
              neither of these options are commercially feasible, terminate the
              relevant Order Form under this Agreement, in which case Astrosat
              shall refund to the Customer all fees pre-paid to Astrosat under
              the relevant Order Form for unused Subscription Services.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>8.3.</span>
            <div></div>
          </li>
          <li className={styles.listItem}>
            <span>8.4.</span>
            <div>
              However, Astrosat has no warranty obligations for:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>8.4.1.</span>
                  <div>
                    the extent that Software has been modified by the Customer
                    or any third party, unless the modification has been
                    approved in writing by Astrosat; or,
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>8.4.2.</span>
                  <div>
                    problems in the Subscription Services caused by any
                    Third-Party Software or hardware, by accidental damage or by
                    other matters beyond Astrosat’s reasonable control.
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.title}>
        <h1>PART TWO – PROFESSIONAL SERVICES.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          9: Professional Services Warranties.
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>9.1.</span>
            <div>
              Astrosat warrants that (i) the Professional Services shall
              substantially conform to the applicable Order Form; and (ii) the
              Professional Services shall be performed with reasonable skill,
              care and diligence. The remedies set out in this Clause 9 are the
              Customer’s exclusive remedies for breach of either warranty. If
              the Professional Services do not conform to the Order Form or are
              not performed with reasonable skill, care and diligence, Astrosat
              shall re-perform the Professional Services to the extent necessary
              to correct the defective performance.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>9.2.</span>
            <div>
              Astrosat shall comply with the terms of the SLA (or as amended in
              an Order Form) at all times. The terms of Clause 9.1 shall apply
              to the SLA.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          10: The Customer’s Responsibilities.
        </h2>
        <div className={styles.description}>
          The Customer shall provide Astrosat with all information, access, and
          full good faith cooperation reasonably necessary to enable Astrosat to
          deliver the Professional Services and shall do anything that is
          identified in the Order Form as the Customer’s responsibility. If the
          Customer fails to do this, Astrosat shall be relieved of its
          obligations to the extent that the obligations are dependent upon the
          Customer’s performance.
        </div>
      </div>
      <div className={styles.title}>
        <h1>PART THREE – GENERAL.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>11: Term of Agreement.</h2>
        <div className={styles.description}>
          This Agreement starts on the date that both parties sign an Order Form
          for the relevant services and ends when Astrosat no longer is obliged
          to provide the Customer with Subscription Services or Professional
          Services under any Order Form.
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>12: Payments.</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>12.1.</span>
            <div>
              The Customer shall pay the fees listed in, and in accordance with,
              the relevant Order Form.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>12.2.</span>
            <div>
              If the Customer initially purchases Subscription Services for a
              term, and subsequently orders an additional product, the purchase
              price for the additional product shall be pro-rated so that the
              added subscriptions terminate on the same day as the initial
              Subscription Term (unless specified otherwise in the relevant
              Order Form).
            </div>
          </li>
          <li className={styles.listItem}>
            <span>12.3.</span>
            <div>
              The fees for the initial Subscription Term (stated in the relevant
              Order Form) will be as specified in the Order Form. Astrosat
              reserves the right to change fees from time to time and any such
              changes may affect the Customer’s recurring fees after the initial
              Subscription Term. Increases in price will be reflected in the
              Customer’s recurring fees for the Services.
            </div>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          13: Termination and Suspension.
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>13.1.</span>
            <div>
              Either party may terminate rights granted to the other under a
              particular Order Form at any time after expiry of the Subscription
              Term and provided all outstanding fees have been paid to the party
              providing the services by providing 30 days’ prior written notice
              to the other party.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>13.2.</span>
            <div>
              Either party may terminate this Agreement, or any rights granted
              under a particular Order Form with immediate effect if:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>13.2.1.</span>
                  <div>
                    the other party commits a material breach of any term of
                    this Agreement or any Order Form which is irremediable or
                    (if such breach is remediable) fails to remedy that breach
                    within a period of 30 days after being notified in writing
                    to do so; or
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>13.2.2.</span>
                  <div>
                    the other party is unable to pay its debts and/or ceases to
                    trade and/or suffers an Insolvency Event.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>13.3.</span>
            <div>
              Sections 2.4, 2.5, 3.3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18,
              20, 21, 22, 23, 24 and 25 shall continue after this Agreement
              ends.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>13.4.</span>
            <div>
              If Astrosat terminates an Order Form under this Agreement because
              of non-payment by the Customer, all unpaid fees for the remainder
              of the Subscription Term immediately fall due for payment.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>13.5.</span>
            <div>
              Upon termination of this Agreement or any Order Form for any
              reason:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>13.5.1.</span>
                  <div>
                    (except in the case of termination due to the Customer’s
                    material breach of this Agreement), the Customer will be
                    given restricted access to the Subscription Services for a
                    period of ten days in which to recover their User Content.
                    Astrosat can provide a User Content recovery service to the
                    Customer, should they wish to use it. Astrosat reserves the
                    right to charge for this service; and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>13.5.2.</span>
                  <div>
                    each party shall immediately pay to the other all of that
                    party’s unpaid invoices and interest at the rate specified
                    in the relevant Order Form, for any services for which no
                    invoice has been raised and any work in progress. Each party
                    shall invoice the other and the invoice shall be payable
                    immediately on receipt.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>13.6.</span>
            <div>
              Termination of this Agreement or any Order Form shall not affect
              any of the parties’ rights and remedies that have accrued as at
              termination, including the right to claim damages (subject to the
              limitations contained herein) in respect of any breach of this
              Agreement or any Order Form that existed at or before the date of
              termination.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>13.7.</span>
            <div>
              Astrosat may retain User Content in backup media for an additional
              period of up to one year after the date of termination of this
              Agreement, or longer if required by law, provided it makes no
              further use of such User Content (except as provided for herein or
              as is required by law), keeps the User Content confidential in
              accordance with Clause 16, and supplies the Customer with a copy
              of the most recent back-up of the User Content within 30 days of
              the Customer’s request (at the Customer’s cost).
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>14: Warranty Disclaimer.</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>14.1.</span>
            <div>
              Except as expressly provided in this Agreement, the Subscription
              Services, Software and Professional Services are provided with no
              other warranties of any kind, and Astrosat disclaims all other
              warranties, express or implied, including without limitation any
              warranty of merchantability or fitness for a particular purpose.
              Astrosat does not warrant that the use of the Subscription
              Services shall be uninterrupted or error-free.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          15: Limitation of Liability.
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>15.1.</span>
            <div>
              Neither party shall be liable under this Agreement for any
              indirect, special, incidental, punitive or consequential damages
              (including without limitation damages for loss of goodwill, work
              stoppage, computer failure or malfunction, lost or corrupted data,
              lost profits, lost business or lost opportunity), or any other
              similar damages under any theory of liability (whether in
              contract, tort/delict, strict liability or any other theory), even
              if the other party has been informed of this possibility. The
              Customer assumes all responsibility for the selection of the
              Subscription Services, Software and Documentation necessary to
              achieve the Customer’s intended results, and for the use and
              results of the Subscription Services or work product. Each party’s
              total liability for any direct loss, cost, claim or damages of any
              kind related to this Agreement or the relevant Order Form shall
              not exceed the amount of the fees paid or payable by the relevant
              party under such relevant Order Form during the period of 12
              months before the event giving rise to such loss, cost, claim or
              damages. However, there is no limitation on direct loss, claim or
              damages arising as a result of an infringement of either party’s
              Intellectual Property rights by the other party, or a breach of
              Clause 16 or Clauses 21 and 22 of this Agreement by the other
              party.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>15.2.</span>
            <div>
              Astrosat’s liability under this Agreement (except where provided
              otherwise in this agreement to a lesser extent) shall be limited
              to the amount of professional indemnity insurance underwritten in
              the name of Astrosat which shall be £1,000,000. This limitation
              shall not apply to a breach of Clauses 21 or 22.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>16: Confidentiality.</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>16.1.</span>
            <div>
              Each party may be given access to Confidential Information from
              the other party in order to perform its obligations under this
              Agreement and any Order Form. A party’s Confidential Information
              shall not be deemed to include information that (i) is now, or
              subsequently becomes, through no act or failure to act on the part
              of receiving party (the “Receiver”), generally known or available;
              (ii) is known by the Receiver at the time of receiving such
              information, as evidenced by the Receiver’s records; (iii) is
              subsequently provided to the Receiver by a third party, as a
              matter of right and without restriction on disclosure; or (iv) is
              required to be disclosed by law, provided that the party to whom
              the information belongs is given prior written notice of any such
              proposed disclosure.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>16.2.</span>
            <div>
              Subject to clauses 16.4, each party shall hold the other’s
              Confidential Information in confidence and not make the other’s
              Confidential Information available to any third party (other than
              to a consultant or a Sub-contractor for the purposes of this
              Agreement and which consultant or Sub-contractor shall have
              entered into undertakings of confidentiality in relation to the
              Confidential Information on terms no less onerous than those
              contained in this Clause 16), or use the other’s Confidential
              Information for any purpose other than to carry out its
              obligations under this Agreement.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>16.3.</span>
            <div>
              Each party shall take all reasonable steps to ensure that the
              other’s Confidential Information to which it has access is not
              disclosed or distributed by its employees or agents in violation
              of the terms of this Agreement.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>16.4.</span>
            <div>
              A party may disclose Confidential Information to the extent such
              Confidential Information is required to be disclosed by law, by
              any governmental or other regulatory authority or by a court or
              other authority of a competent jurisdiction, provided that, to the
              extent it is legally permitted to do so, it gives the other party
              as much notice of such disclosure as possible and, where notice of
              disclosure is not prohibited and is given in accordance with this
              clause 16.4, it takes into account the reasonable requests of the
              other party in relation to the content of such disclosure.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>16.5.</span>
            <div>
              No party shall make, or permit any person to make, any public
              announcement concerning this Agreement without the prior written
              consent of the other parties (such consent not to be unreasonably
              withheld or delayed), except as required by law, any governmental
              or regulatory authority (including without limitation, any
              relevant securities exchange), any court or other authority of
              competent jurisdiction.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>16.6.</span>
            <div>
              This clause 16 shall survive termination of this Agreement or any
              Order Form, howsoever arising.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const TermsAndConditions = () => {
  const [info, setInfo] = useState(TERMS);
  const [redirect, setRedirect] = useState(null);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <OrbisLogo className={styles.logo} onClick={() => setRedirect('/')} />
      </div>
      <p className={styles.headerText}>
        In the event that your company has a pre-existing wet signature contract
        with Astrosat that conflicts with these Terms and Conditions, then the
        conditions of that contract shall be deemed to prevail.
      </p>
      <div className={styles.body}>
        <div className={styles.buttons}>
          <div>
            <Button
              theme="link"
              classNames={[
                `${styles.button} ${info !== TERMS && styles.unselected}`,
              ]}
              onClick={() => setInfo(TERMS)}
            >
              Terms & Conditions
            </Button>
          </div>
          <div>
            <Button
              theme="link"
              classNames={[
                `${styles.button} ${
                  info !== PRIVACY_POLICY && styles.unselected
                }`,
              ]}
              onClick={() => setInfo(PRIVACY_POLICY)}
            >
              Privacy Policy
            </Button>
          </div>
        </div>
        <div className={styles.infoContainer}>
          {info === TERMS && <Terms />}
          {info === PRIVACY_POLICY && <PrivacyPolicy />}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
