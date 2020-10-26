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
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          17: Indemnification by Astrosat.
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>17.1.</span>
            <div>
              Astrosat shall indemnify and hold harmless the Customer its
              clients, its Affiliates, directors and employees from any damages
              finally awarded against the Customer (including, without
              limitation, reasonable costs and legal fees incurred by the
              Customer) arising out of any third party suit, claim or other
              legal action alleging that the use of the Subscription Services or
              Documentation by the Customer (other than User Content – see
              Clauses 4 and 18) infringes the Intellectual Property of any third
              party, (“Legal Action”). Astrosat shall provide reasonable
              assistance in the defence of such Legal Action.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>17.2.</span>
            <div>
              However, Astrosat shall have no indemnification obligations for
              any Legal Action arising out of: (i) a combination of the
              Subscription Services and/or Software with software or products
              not supplied, or approved in writing by Astrosat; (ii) any repair,
              adjustment, modification or alteration to the Subscription
              Services by the Customer or any third party, unless approved in
              writing by Astrosat; or (iii) any refusal by the Customer to
              install and use a non-infringing version of the Subscription
              Services offered by Astrosat under Clause 8.2(ii). Clause 8.2(ii)
              and this Clause 17 state the entire liability of Astrosat with
              respect to any Intellectual Property infringement by the
              Subscription Services or Software or Documentation.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>17.3.</span>
            <div>
              The Customer shall give written notice to Astrosat of any Legal
              Action no later than 30 days after first receiving notice of a
              Legal Action, and shall give copies to Astrosat of all
              communications, notices and/or other actions relating to the Legal
              Action. The Customer shall give Astrosat the sole control of the
              defence of any Legal Action, shall act in accordance with the
              reasonable instructions of Astrosat and shall give Astrosat such
              assistance as Astrosat reasonably requests to defend or settle
              such claim. Astrosat shall conduct its defence at all times in a
              manner that is not adverse to the Customer’s interests. the
              Customer may employ its own counsel to assist it with respect to
              any such claim. The Customer shall bear all costs of engaging its
              own counsel, unless engagement of counsel is necessary because of
              a conflict of interest with Astrosat or its counsel, or because
              Astrosat fails to assume control of the defence. The Customer
              shall not settle or compromise any Legal Action without Astrosat’s
              express written consent. Astrosat shall be relieved of its
              indemnification obligation under Clause 17 if the Customer
              materially fails to comply with Clause 17.3.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          18. Indemnification by the Customer.
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>18.1.</span>
            <div>
              The Customer shall indemnify and hold harmless Astrosat, its
              Affiliates, directors, and employees from any damages finally
              awarded against Astrosat (including, without limitation,
              reasonable costs and legal fees incurred by Astrosat) arising out
              of any third party suit, claim or other legal action (including
              but not limited to any governmental investigations, complaints and
              actions) in connection with the User Content, including, without
              limitation, any action for infringement of any trademark,
              copyright, trade secret, right of publicity or privacy (including
              defamation), patent or other proprietary right with respect to the
              User Content (“Legal Claim”).
            </div>
          </li>
          <li className={styles.listItem}>
            <span>18.2.</span>
            <div>
              Astrosat shall give written notice to the Customer of any Legal
              Claim no later than 30 days after first receiving notice of a
              Legal Claim and shall give copies to the Customer of all
              communications, notices and/or other actions relating to the Legal
              Claim. Astrosat shall give the Customer the sole control of the
              defence of any Legal Claim, shall act in accordance with the
              reasonable instructions of the Customer and shall give the
              Customer such assistance as the Customer reasonably requests to
              defend or settle such claim. The Customer shall conduct its
              defence at all times in a manner which is not adverse to
              Astrosat’s interests. Astrosat may employ its own counsel to
              assist it with respect to any such claim. Astrosat shall bear all
              costs of engaging its own counsel, unless engagement of counsel is
              necessary because of a conflict of interest with the Customer or
              its counsel, or because the Customer fails to assume control of
              the defence. Astrosat shall not settle or compromise any Legal
              Claim without the Customer’s express written consent. The Customer
              shall be relieved of its indemnification obligation under Clause
              18 if Astrosat materially fails to comply with Clause 18.2.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>19. Publicity.</h2>
        <div className={styles.description}>
          Astrosat may list the Customer as a customer and use the Customer’s
          logo on Astrosat’s website, on publicly available Customer lists, and
          in media releases with the Customer’s consent, such consent not to be
          unreasonably withheld.
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>20. Miscellaneous.</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>20.1.</span>
            <div>
              This Agreement represents the entire express agreement of the
              parties, and supersedes any prior or current agreements or
              understandings, whether written or oral. If there is a conflict
              between the Agreement and an Order Form, the Order Form shall
              prevail.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>20.2.</span>
            <div>
              This Agreement may not be changed or any part waived except by
              written agreement between the parties.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>20.3.</span>
            <div>
              This Agreement shall be governed by the laws of Scotland. The
              parties consent to the exercise of exclusive jurisdiction of the
              Scottish courts.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>20.4.</span>
            <div>
              Neither party shall assign or otherwise transfer any of its rights
              or obligations under this Agreement without the prior written
              consent of the other party.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>20.5.</span>
            <div>The language of this Agreement shall be English.</div>
          </li>
          <li className={styles.listItem}>
            <span>20.6.</span>
            <div>
              The time zone of this Agreement shall be Greenwich Mean Time.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>21. Data Processing.</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>21.1.</span>
            <div>
              Both parties will comply with all applicable requirements of the
              Privacy Legislation. This Clause 21 is in addition to, and does
              not relieve, remove or replace a party’s obligations or rights
              under the Privacy Legislation.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.2.</span>
            <div>
              The provisions of this Agreement shall apply to the processing of
              the Personal Data carried out for the Customer by Astrosat, and to
              all Personal Data held by Astrosat in relation to all such
              processing whether such Personal Data is held at the date of this
              Agreement or received afterwards.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.3.</span>
            <div>
              This Agreement shall continue in full force and effect for so long
              as Astrosat is processing Personal Data on behalf of the Customer.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.4.</span>
            <div>
              Astrosat is only to process the Personal Data received from the
              Customer:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.4.1.</span>
                  <div>
                    for the purposes of this Agreement and not for any other
                    purpose;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.4.2.</span>
                  <div>
                    to the extent and in such a manner as is necessary for those
                    purposes; and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.4.3.</span>
                  <div>
                    strictly in accordance with the Agreement or otherwise with
                    the express written authorisation and instructions of the
                    Customer (which may be specific instructions or instructions
                    of a general nature or as otherwise notified by the Customer
                    to Astrosat).
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.5.</span>
            <div>
              Schedule 1 sets out the scope, nature and purpose of processing by
              Astrosat, the duration of processing and the types of Personal
              Data and categories of data subject.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.6.</span>
            <div>
              All instructions given by the Customer to Astrosat shall be made
              in writing and shall at all times be in compliance with the GDPR
              and other applicable laws. Astrosat shall act only on such written
              instructions from the Customer unless Astrosat is required by law
              to do otherwise (as per Article 29 of the GDPR).
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.7.</span>
            <div>
              Astrosat shall promptly assist the Customer (where the Customer
              cannot do this itself via the Subscription Services) in complying
              with a legitimate data subject request to amend, transfer, delete,
              or otherwise dispose of Personal Data. Where permitted to do so by
              law, Astrosat may charge a reasonable fee for providing such
              assistance.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.8.</span>
            <div>
              Both Parties shall comply at all times with the GDPR and other
              applicable laws and shall not perform their obligations under this
              Agreement or any other agreement or arrangement between themselves
              in such way as to cause either party to breach any of its
              applicable obligations under the GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.9.</span>
            <div>
              The Customer hereby warrants, represents, and undertakes that the
              Personal Data shall comply with the GDPR in all respects
              including, but not limited to, its collection, holding, and
              processing.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.10.</span>
            <div>
              Astrosat agrees to comply with any reasonable measures required by
              the Customer to ensure that its obligations under this Agreement
              are satisfactorily performed in accordance with any and all
              applicable legislation from time to time in force (including, but
              not limited to, the GDPR) and any best practice guidance issued by
              the ICO.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.11.</span>
            <div>
              Astrosat shall provide all reasonable assistance (at the
              Customer’s cost) to the Customer in complying with its obligations
              under the GDPR with respect to the security of processing, the
              notification of Personal Data breaches, the conduct of data
              protection impact assessments, and in dealings with the ICO.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.12.</span>
            <div>
              When processing the Personal Data on behalf of the Customer,
              Astrosat shall:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.12.1.</span>
                  <div>
                    not process the Personal Data outside the European Economic
                    Area (all EU member states, plus Iceland, Liechtenstein, and
                    Norway) (“EEA”) other than the United Kingdom (which shall
                    be permitted) without the prior written consent of the
                    Customer and, where the Customer consents to such a transfer
                    to a country that is outside of the EEA, to comply with the
                    obligations of Data Processors under the provisions
                    applicable to transfers of Personal Data to third countries
                    set out in Chapter 5 of the GDPR by providing an adequate
                    level of protection to any Personal Data that is transferred
                    and providing appropriate safeguards in relation to the
                    transfer;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.12.2.</span>
                  <div>
                    not transfer any of the Personal Data to any third party
                    without the written consent of the Customer and, in the
                    event of such consent, the Personal Data shall be
                    transferred strictly subject to the terms of a suitable
                    agreement, as set out in Clause 21.21;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.12.3.</span>
                  <div>
                    process the Personal Data only to the extent, and in such
                    manner, as is necessary in order to comply with its
                    obligations to the Customer or as may be required by law (in
                    which case, Astrosat shall inform the Customer of the legal
                    requirement in question before processing the Personal Data
                    for that purpose unless prohibited from doing so by law);
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.12.4.</span>
                  <div>
                    Implement appropriate technical and organisational measures,
                    and take all steps necessary to protect the Personal Data
                    against unauthorised or unlawful processing, accidental
                    loss, destruction, damage, alteration, or disclosure;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.12.5.</span>
                  <div>
                    make available to the Customer any and all such information
                    as is reasonably required and necessary to demonstrate
                    Astrosat’s compliance with the GDPR; and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.12.6.</span>
                  <div>
                    inform the Customer immediately if it is asked to do
                    anything that infringes the GDPR or the Privacy Legislation
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.13.</span>
            <div>
              Astrosat shall, at the Customer’s cost, assist the Customer in
              complying with its obligations under the GDPR. In particular, the
              following shall apply to data subject access requests, complaints,
              and data breaches.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.14.</span>
            <div>
              Astrosat shall notify the Customer without undue delay if it
              receives:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.14.1.</span>
                  <div>a subject access request from a data subject; or</div>
                </li>
                <li className={styles.listItem}>
                  <span>21.14.2.</span>
                  <div>
                    any other complaint or request relating to the processing of
                    the Personal Data.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.15.</span>
            <div>
              Astrosat shall, at the Customer’s cost, cooperate fully with the
              Customer and assist as required in relation to any subject access
              request, complaint, or other request, including by:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.15.1.</span>
                  <div>
                    providing the Customer with full details of the complaint or
                    request;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.15.2.</span>
                  <div>
                    providing the necessary information and assistance in order
                    to comply with a subject access request;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.15.3.</span>
                  <div>
                    providing the Customer with any Personal Data it holds in
                    relation to a data subject (within the timescales required
                    by the Customer); and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.15.4.</span>
                  <div>
                    providing the Customer with any other information requested
                    by the Customer.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.16.</span>
            <div>
              Astrosat shall notify the Customer immediately if it becomes aware
              of any form of Personal Data breach, including any unauthorised or
              unlawful processing, loss of, damage to, or destruction of any of
              the Personal Data.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.17.</span>
            <div>
              The Customer shall be liable for, and shall indemnify (and keep
              indemnified) Astrosat in respect of any and all action,
              proceeding, liability, cost, claim, loss, expense (including
              reasonable legal fees and payments on a solicitor and client
              basis), or demand suffered or incurred by, awarded against, or
              agreed to be paid by, Astrosat and any Sub-Processor arising
              directly or in connection with:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.17.1.</span>
                  <div>
                    any non-compliance by the Customer with the GDPR or other
                    applicable legislation;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.17.2.</span>
                  <div>
                    any Personal Data processing carried out by Astrosat or
                    Sub-Processor in accordance with instructions given by the
                    Customer that infringe the GDPR or other applicable
                    legislation; or
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.17.3.</span>
                  <div>
                    any breach by the Customer of its obligations under this
                    Agreement, except to the extent that Astrosat or a
                    Sub-Processor is liable under sub-Clause 21.18.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.18.</span>
            <div>
              Astrosat shall be liable for, and shall indemnify (and keep
              indemnified) the Customer in respect of any and all action,
              proceeding, liability, cost, claim, loss, expense (including
              reasonable legal fees and payments on a solicitor and client
              basis), or demand suffered or incurred by, awarded against, or
              agreed to be paid by, the Customer arising directly or in
              connection with Astrosat’s Personal Data processing activities
              that are subject to this Agreement:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.18.1.</span>
                  <div>
                    only to the extent that the same results from Astrosat’s or
                    a Sub-Processor’s breach of this Agreement; and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.18.2.</span>
                  <div>
                    not to the extent that the same is or are contributed to by
                    any breach of this Agreement by the Customer.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.19.</span>
            <div>
              The Customer shall not be entitled to claim back from Astrosat or
              a Sub-Processor any sums paid in compensation by the Customer in
              respect of any damage to the extent that the Customer is liable to
              indemnify Astrosat or Sub-Processor under sub-Clause 21.17.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.20.</span>
            <div>
              Nothing in this Agreement (and in particular, this Clause 21)
              shall relieve either party of, or otherwise affect, the liability
              of either party to any data subject, or for any other breach of
              that party’s direct obligations under the GDPR. Furthermore,
              Astrosat hereby acknowledges that it shall remain subject to the
              authority of the ICO and shall co-operate fully therewith, as
              required, and that failure to comply with its obligations as a
              Data Processor under the GDPR may render it subject to the fines,
              penalties, and compensation requirements set out in the GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.21.</span>
            <div>
              In the event that Astrosat appoints a Sub-Processor, Astrosat
              shall:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.21.1.</span>
                  <div>
                    enter into a Sub-Processing Agreement with the Sub-Processor
                    which shall impose upon the Sub-Processor the same or
                    similar obligations as are imposed upon Astrosat by this
                    Agreement;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.21.2.</span>
                  <div>
                    ensure that the Sub-Processor complies fully with its
                    obligations under the Sub-Processing Agreement and the GDPR;
                    and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.21.3.</span>
                  <div>
                    remain fully liable to the Customer for performance of the
                    Sub-Processor’s obligations to the extent the Sub-Processor
                    fails to fulfil their data protection obligations.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.22.</span>
            <div>
              Except as provided otherwise herein, Astrosat shall, at the
              written direction of the Customer, delete or return Personal Data
              and copies thereof to the Customer on termination of this
              Agreement unless required by applicable law to store the Personal
              Data (and for these purposes the term “delete” shall mean to put
              such data beyond use).
            </div>
          </li>
          <li className={styles.listItem}>
            <span>21.23.</span>
            <div>
              Astrosat shall maintain complete and accurate records and
              information to demonstrate its compliance with this Clause 21 and
              immediately inform the Customer if, in the opinion of Astrosat,
              its instruction infringes the DPA or GDPR or applicable laws.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>22. Data Sharing</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>22.1.</span>
            <div>
              In certain circumstances, Astrosat and a Customer may require to
              share data which includes Personal Data for example to improve and
              enhance User experience and (2) to perform and/or improve the
              Services and (3) to obtain relevant marketing, demographic,
              clinical and other appropriate information from Astrosat.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.2.</span>
            <div>
              The parties shall not process the Shared Personal Data for any
              purpose or in any way that is incompatible with the Stated
              Purposes.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.3.</span>
            <div>
              The Shared Personal Data shall be disclosed by one party to
              another only to the extent reasonably necessary for the Stated
              Purposes.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.4.</span>
            <div>
              Each party shall appoint a data protection officer and/or at least
              one other of its representatives as a point of contact for all
              issues relating to the sharing of the Shared Personal Data and the
              GDPR (including, but not limited to, compliance, training, and the
              handling of Personal Data breaches).
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.5.</span>
            <div>
              Both parties shall at all times during the Subscription Term
              comply with their obligations as Data Controllers, the rights of
              data subjects, and all other applicable requirements under the
              GDPR. These Terms and Conditions are in addition to, and do not
              relieve, remove, or replace either party’s obligations under the
              GDPR. Any material breach of the GDPR by either party shall, if
              not remedied within 14 days of written notice from the other
              party, give the other party grounds to terminate this Agreement
              with immediate effect.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.6.</span>
            <div>
              The extent of the Shared Personal Data, including any applicable
              restrictions relating to will be agreed between the parties and
              set out in writing.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.7.</span>
            <div>
              Each party shall ensure that the Shared Personal Data is accurate
              and up-to-date prior to its disclosure to the other party.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.8.</span>
            <div>
              The parties shall use compatible technology for the processing of
              the Shared Personal Data in order to preserve accuracy.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.9.</span>
            <div>
              Both parties shall at all times during the Term process the Shared
              Personal Data fairly and lawfully.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.10.</span>
            <div>
              Both parties shall ensure that they have legitimate grounds for
              processing the Shared Personal Data under the GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.11.</span>
            <div>
              Both parties shall ensure that they have in place all required
              notices and consents in order to enable the sharing of the Shared
              Personal Data under this Agreement. In particular, the parties
              shall ensure that data subjects are provided with clear and
              sufficient information about the following:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>21.11.1.</span>
                  <div>
                    the purposes for which their Personal Data is to be
                    processed;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.11.2.</span>
                  <div>
                    the legal basis upon which it is relying for such purposes;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.11.3.</span>
                  <div>
                    the fact that their Personal Data is to be transferred to a
                    third party and sufficient detail about the transfer to
                    enable the data subject to understand the purpose of the
                    transfer and any risks associated therewith; and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.11.4.</span>
                  <div>
                    in the event that their Personal Data is to be transferred
                    outside of the United Kingdom or EEA, the fact that such a
                    transfer is to take place and sufficient detail about the
                    transfer to enable the data subject to understand the
                    purpose of the transfer and any risks associated therewith;
                    and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>21.11.5.</span>
                  <div>
                    all other information required under Article 13 of the GDPR.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.12.</span>
            <div>
              The parties shall assist one another in complying with their
              respective obligations and the rights of data subjects under the
              GDPR. Such assistance shall include, but not be limited to:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>22.12.1.</span>
                  <div>
                    consulting with the other party with respect to information
                    and notices provided to data subjects relating to the Shared
                    Personal Data;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>22.12.2.</span>
                  <div>
                    informing the other party about the receipt of data subject
                    access requests and providing reasonable assistance in
                    complying with the same;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>22.12.3.</span>
                  <div>
                    not disclosing or otherwise releasing any Shared Personal
                    Data in response to a data subject access request without
                    prior consultation with the other party, whenever reasonably
                    possible;
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>22.12.4.</span>
                  <div>
                    assisting the other party at the cost of the other party in
                    responding to any other data subject request.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.13.</span>
            <div>
              Each party shall maintain records of all data subject requests
              received, the decisions made in response, and any information
              provided to the data subject(s) concerned. Such records shall
              include copies of the request, details of any data accessed and
              shared, and, if applicable, details of any further correspondence,
              telephone conversations, or meetings relating to the request.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.14.</span>
            <div>
              Each party shall hold and process the Shared Personal Data only
              for so long as is necessary for the fulfilment of the Stated
              Purposes.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.15.</span>
            <div>
              In the event that any statutory or similar retention periods apply
              to any of the Shared Personal Data, the relevant Personal Data
              shall be retained by the relevant party in accordance therewith.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.16.</span>
            <div>
              The parties shall delete (or otherwise dispose of) or at a party’s
              option anonymise the Shared Personal Data (or the relevant part
              thereof) and any and all copies thereof or, on the written request
              of the other party, other than in the case of anonymised data,
              return it to the other disclosing party, subject to any legal
              requirement to retain any applicable Personal Data, in the
              following circumstances:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>22.16.1.</span>
                  <div>
                    upon the termination or expiry of this Agreement; or
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>22.16.2.</span>
                  <div>
                    once the Stated Purposes have been fulfilled and it is no
                    longer necessary to retain the Shared Personal Data (or the
                    relevant part thereof) in light of the Stated Purposes;
                    whichever is earlier.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.17.</span>
            <div>
              All Shared Personal Data to be deleted or disposed of or
              anonymised under this Agreement shall be deleted or disposed of
              using methods compliant with the GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.18.</span>
            <div>
              Following the deletion and/or disposal or anonymisation of the
              Shared Personal Data (as applicable), the party deleting or
              disposing of the data shall notify the other party of the same in
              writing, confirming that the Shared Personal Data has been deleted
              or disposed of or anonymised using methods compliant with the
              GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.19.</span>
            <div>
              Following the deletion and/or disposal or anonymisation of the
              Shared Personal Data (as applicable), the party deleting or
              disposing of the data shall notify the other party of the same in
              writing, confirming that the Shared Personal Data has been deleted
              or disposed of or anonymised using methods compliant with the
              GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.20.</span>
            <div>
              In the event that a party wishes to appoint a third-party Data
              Processor, it shall remain liable to the other party for any acts
              and/or omissions of the third-party processor and it shall comply
              with Articles 28 and 30 of the GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.21.</span>
            <div>
              Neither party shall transfer any of the Shared Personal Data
              outside of the United Kingdom or EEA unless:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>22.21.1.</span>
                  <div>
                    that party complies with the provisions of Article 26 of the
                    GDPR (where the third party is a joint controller); and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>22.21.2.</span>
                  <div>
                    that party ensures that the transfer is to a country that
                    the European Commission has determined (by means of an
                    adequacy decision) offers an adequate level of data
                    protection, pursuant to Article 45 of the GDPR; there are
                    appropriate safeguards in place pursuant to Article 46 of
                    the GDPR; or one of the derogations for specific situations
                    set out in Article 49 of the GDPR applies.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.22.</span>
            <div>
              A party shall transfer the Shared Personal Data to the other party
              using methods compliant with the GDPR.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.23.</span>
            <div>
              Both parties shall ensure that they have in place appropriate
              technical and organisational measures as reviewed and approved by
              the other party, to protect against the unauthorised or unlawful
              processing of, and against the accidental loss or destruction of,
              or damage to, the Shared Personal Data, having regard to the state
              of technological development and the cost of implementing any such
              measures.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.24.</span>
            <div>
              When putting appropriate technical and organisational measures in
              place, both parties shall ensure a level of security appropriate
              to the nature of the Shared Personal Data which is to be
              protected, and to the potential harm resulting from the
              unauthorised or unlawful processing of, the accidental loss or
              destruction of, or damage to, the Shared Personal Data.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.25.</span>
            <div>
              All technical and organisational measures put in place by both
              parties shall be reviewed regularly by the respective party,
              updating such measures upon the agreement of the other party as
              appropriate throughout the Term of this Agreement.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.26.</span>
            <div>
              Both parties shall ensure that any and all of their
              representatives by whom the Shared Personal Data is to be handled
              and processed are appropriately trained to do so in accordance
              with the GDPR and with the requisite technical and organisational
              measures.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.27.</span>
            <div>
              The parties shall further ensure that any of their respective
              representatives to whom the Shared Personal Data is to be
              disclosed are subject to contractual obligations in relation to
              confidentiality and data protection that bind those
              Representatives and that are same as the obligations imposed upon
              the parties by this Agreement.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.28.</span>
            <div>
              In the event of a dispute or claim brought by a data subject or
              the ICO concerning the processing of Shared Personal Data against
              either or both parties, the parties will inform each other about
              any such disputes or claims and will cooperate with a view to
              settling them amicably in a timely fashion.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>22.29.</span>
            <div>
              The parties agree to respond to any generally available
              non-binding mediation procedure initiated by a data subject or by
              the supervisory authority. If they do participate in the
              proceedings, the parties may elect to do so remotely (such as by
              telephone or other electronic means). The parties also agree to
              consider participating in any other arbitration, mediation, or
              other dispute resolution proceedings developed for data protection
              disputes.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          23. Feedback and Modifications
        </h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>23.1.</span>
            <div>
              The Customer hereby acknowledges that upon submitting Feedback to
              Astrosat, the Customer automatically grants to Astrosat a
              worldwide, perpetual, irrevocable, royalty free licence to use
              that Feedback in any way Astrosat deems appropriate including, but
              not limited to:
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <span>23.1.1.</span>
                  <div>
                    The use, publication, distribution, transmission,
                    broadcasting, licensing, sub-licensing, leasing, lending and
                    sale of the Feedback; and
                  </div>
                </li>
                <li className={styles.listItem}>
                  <span>23.1.1.</span>
                  <div>
                    The creation, use, publication, distribution, transmission,
                    broadcasting, licensing, sub-licensing, leasing, lending and
                    sale of any derivative works based upon the Feedback.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className={styles.listItem}>
            <span>23.2.</span>
            <div>
              Astrosat’s use of the Feedback shall not bestow any rights or
              interests upon the Customer whatsoever.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>23.3.</span>
            <div>
              The Customer hereby acknowledges that any modifications made to
              the Software at the request or suggestion of the Customer will
              belong to and be the Intellectual Property of Astrosat.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>24. Change Orders.</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>24.1.</span>
            <div>
              If the Customer wishes to amend the scope of an Order Form, the
              parties will use all reasonable endeavours to agree to a Change
              Order. Each Change Order shall detail the requested changes to the
              applicable task, responsibility, duty, budget, work programme or
              other matter. The Change Order will become effective upon the
              execution of the Change Order by both parties and will include a
              specified period of time (as agreed upon by the parties) within
              which Astrosat will implement the changes and any increase in
              price.
            </div>
          </li>
          <li className={styles.listItem}>
            <span>24.2.</span>
            <div>
              Both parties agree to act in good faith and promptly when
              considering a Change Order requested by the other party. Astrosat
              reserves the right to postpone effecting material changes in the
              scope of Professional Services until such time as the parties
              agree to and execute the corresponding Change Order.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>25. Entire Agreement</h2>
        <div className={styles.description}>
          This Agreement and each Order Form comprises the entire Agreement
          between the Parties and supersedes all previous agreements between the
          Parties. This Agreement can only be altered or amended by either an
          Order Form or a Change Order.
        </div>
      </div>
      <div className={styles.title}>
        <h1>PART FOUR – DEFINITIONS.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>26. Glossary.</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>26.1.</span>
            <div>
              <strong>“Affiliate”</strong> means an entity which controls, is
              controlled by, or is under common control with, a party, and
              control means the ability to vote 50% or more of the voting
              securities of any entity or otherwise having the ability to
              influence and direct the polices and direction of an entity;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.2.</span>
            <div>
              <strong>“Change Order”</strong>
              means a written statement signed by the parties recording any (a)
              change in the details of an Order Form, or (b) change in the
              assumptions upon which the Order Form is based (including, but not
              limited to, changes in an agreed starting date for a Subscription
              or Professional Services or suspension of the services by the
              Customer or (c) any changes in the fees, costs and/or time lines;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.3.</span>
            <div>
              <strong>“Confidential Information”</strong> means any information
              that is proprietary or confidential which either party directly or
              indirectly discloses, or makes available, to the other, including
              but not limited to, the existence and terms of this Agreement, all
              confidential or proprietary information relating to the business,
              affairs, operations, processes, product information, know-how,
              technical information, designs, trade secrets or software and/or
              Intellectual Property of the party disclosing such information;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.4.</span>
            <div>
              <strong>“Content”</strong> means any text, graphics, images,
              audio, video, software, data compilations including, but not
              limited to, text, graphics, logos, icons, sound clips, video
              clips, data compilations, page layout, underlying code and
              software and any other form of information capable of being stored
              in a computer that appears on, is uploaded to or forms part of the
              Subscription Services or the Platform; BUT excluding User Content;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.5.</span>
            <div>
              <strong>“Database”</strong> means the database stored on the
              Platform which contains inter alia User Content;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.6.</span>
            <div>
              <strong>“Data Controller”</strong>,
              <strong>“Data Processor”</strong>,<strong>“Personal Data”</strong>
              ,<strong>“processing”</strong>, and
              <strong>“data subject”</strong> shall have the meanings ascribed
              to them in the GDPR;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.7.</span>
            <div>
              <strong>“DPA”</strong> means the Data Protection Act 2018 and any
              modification, amendment or re-enactment thereof;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.8.</span>
            <div>
              <strong>“Documentation”</strong> means user documentation provided
              electronically by Astrosat for use with the Subscription Services,
              as periodically updated;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.9.</span>
            <div>
              <strong>“EULA”</strong> means the End User Licence Agreement in
              the form set out in PART SEVEN of this Agreement;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.10.</span>
            <div>
              <strong>“Feedback”</strong> means all comments, suggestions,
              requests, requirements, improvements, feedback, or other input the
              Customer and Users provide regarding any products or services
              owned or supplied by Astrosat or its Affiliates;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.11.</span>
            <div>
              <strong>“Force Majeure”</strong>, means circumstances beyond the
              control of Astrosat which shall include (but shall not be limited
              to) acts of God, perils of the sea or air, fire, flood, drought,
              explosion, sabotage, accident, embargo, riot, civil commotion,
              including acts of local government and parliamentary authority;
              inability to supply the Subscription Services and or the
              Professional Services, materials, breakdown of Local Equipment and
              labour disputes of whatever nature and for whatever cause arising
              including (but without prejudice to the generality of the
              foregoing) work to rule, overtime bars, strikes and lockouts and
              whether between either of the parties hereto and any or all of its
              employees and/or any other employer and any or all of its
              employees and/or between any two or more groups of employees (and
              whether of either of the parties hereto or any other employer);
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.12.</span>
            <div>
              <strong>“GDPR”</strong> means the General Data Protection
              Regulation (Regulation (EU) 2016/679) as amended, replaced,
              supplemented or adopted into United Kingdom Legislation from time
              to time;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.13.</span>
            <div>
              <strong>“ICO”</strong> means the UK’s supervisory authority, the
              Information Commissioner’s Office;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.14.</span>
            <div>
              <strong>“Industry Best Practice”</strong> means the standard of
              care, attention, diligence, expertise, knowledge, methods and
              practice expected of a competent and experienced professional in
              the IT and Cyber Security profession;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.15.</span>
            <div>
              <strong>“Insolvency Event”</strong> means the other party (a)
              enters liquidation, or a winding up petition is presented against
              the company; (b) has a receiver, liquidator, administrator,
              trustee or an individual with a similar role appointed over any of
              its assets; (c) proposes to make any arrangements with its
              creditors or passes a resolution to place the company into
              liquidation; or (d) suffers an event which, under the law of a
              different country, is equivalent to any of the previously
              specified acts or events;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.16.</span>
            <div>
              <strong>“Intellectual Property”</strong> means patents,
              trademarks, trade name, service mark, copyright, trade secrets,
              know-how, process, technology, development tool, ideas, concepts,
              design right, domain names, moral right, database right,
              methodology, algorithm and invention, and any other proprietary
              information (whether registered, unregistered, pending or applied
              for);
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.17.</span>
            <div>
              <strong>“Local Equipment”</strong> means the Customer or User’s
              own on-premise equipment including hardware and software
              environment which is used in connection with the Software
              Services, which comprise of, but is not limited to - server
              computers (whether virtual or not), Desktop PC’s, Laptops or any
              other portable device, storage systems and relative hardware,
              firmware, operating software, operating system software,
              networking software, database software, anti-virus and security
              software, switches, power supplies and telecommunications
              infrastructure, internet connection, broadband availability and
              infrastructure, routers, Printers, associated peripheral devices
              or accessories whether fixed or portable;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.18.</span>
            <div>
              <strong>“Order Form”</strong> means a document provided by
              Astrosat and signed by the Customer that describes the
              Subscription Services and Professional Services being purchased
              and/or licensed by the Customer in terms of this Agreement and any
              additional conditions pertaining thereto substantially in the form
              comprising PART SIX of this Agreement;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.19.</span>
            <div>
              <strong>“Platform”</strong> means the hardware and software
              environment in which the software element of the Subscription
              Services operates, which comprises one or more server computers
              (whether virtual or not), mirroring/duplicating/back-up and
              storage systems and relative hardware operating software, virtual
              machine software (where relevant), operating system software,
              database software, anti-virus and security software, switches,
              power supplies and telecommunications infrastructure;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.20.</span>
            <div>
              <strong>“Privacy Legislation”</strong> means the GDPR, the DPA,
              the Data Protection Directive (95/46/EC), the Regulation of
              Investigatory Powers Act 2000, the Telecommunications (Lawful
              Business Practice) (Interception of Communications) Regulations
              2000 (SI 2000/2699), the Electronic Communications Data Protection
              Directive (2002/58/EC), the Privacy and Electronic Communications
              (EC Directive) Regulations 2003 (SI 2426/2003) and all applicable
              laws and regulations relating to the processing of personal data
              and privacy, including where applicable the guidance and codes of
              practice issued by the Information Commissioner. (as amended or
              replaced from time to time) Upon the effect of the United Kingdom
              leaving the European Union, all legislation enacted in the United
              Kingdom in respect of the protection of personal data shall apply
              to the contractual relationship between the Data Controller who is
              based in the United Kingdom and the Data Processor, instead of the
              GDPR;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.21.</span>
            <div>
              <strong>“Privacy Policy”</strong> means Astrosat’s policy relating
              to User Content and compliance with (amongst others) the Privacy
              Legislation from time to time, the current version of which is
              located here https://app.orbis.astrosat.net/terms;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.22.</span>
            <div>
              <strong>“Professional Services”</strong> means the training,
              consulting, development and other professional services identified
              on an Order Form but does not include the Subscription Services;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.23.</span>
            <div>
              <strong>“Shared Personal Data”</strong> means the personal data
              and special category personal data to be shared between Astrosat
              and the Customer under these Terms and Conditions;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.24.</span>
            <div>
              <strong>“SLA”</strong> means a Service Level Agreement in the form
              set out in PART FIVE of this Agreement;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.25.</span>
            <div>
              <strong>“Software”</strong> means the Astrosat© proprietary
              operating software and the Third-Party Software written in object
              and source code residing on and used for operating the Platform
              and the Subscription Services as Updated and Upgraded from time to
              time;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.26.</span>
            <div>
              <strong>“Sub-Processor”</strong> means a sub-processor appointed
              by Astrosat to process the Personal Data;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.27.</span>
            <div>
              <strong>“Sub-Processing Agreement”</strong> means an agreement
              between Astrosat and a Sub-Processor governing the Personal Data
              processing carried out by the Sub-Processor, as described in
              Clause 21;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.28.</span>
            <div>
              <strong>“Subscription Services”</strong> means the hosted Customer
              experience solutions identified in an Order Form, and any
              modifications periodically made by Astrosat, but does not include
              the Professional Services;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.29.</span>
            <div>
              <strong>“Subscription Term”</strong> means the period of time
              during which Astrosat is required to provide the Customer with the
              Subscription Services as specified in the relevant Order Form;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.30.</span>
            <div>
              <strong>“Third-Party Software”</strong> means software other than
              the Software which belongs to third parties and in relation to
              which Astrosat has the right to grant sub-licenses;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.31.</span>
            <div>
              <strong>“Update”</strong> means any update, update rollup, service
              pack, feature pack, critical update, security update, or hotfix
              that is used to improve or to fix a software product;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.32.</span>
            <div>
              <strong>“Upgrade”</strong> means a software package that replaces
              an installed version of a product with a newer version of the same
              product, typically leaving existing customer data and preferences
              intact while replacing the existing software with the newer
              version;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.33.</span>
            <div>
              <strong>“User”</strong> means the Customer and any of its
              employees, or a person to whom the Customer has outsourced
              services, that has permission to accesses the Subscription
              Services as a named user and is not employed by Astrosat and
              acting in the course of their employment;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.34.</span>
            <div>
              <strong>“User Content”</strong> means any text, graphics, images,
              audio, video, software, data compilations and any other form of
              information capable of being stored in a computer that appears on,
              is uploaded to or forms part of a User Site or the Subscription
              Services and has been uploaded by a User;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.35.</span>
            <div>
              <strong>“User Site”</strong> means a partition/tenancy/instance on
              the Platform created by Astrosat for the Customer and/or User or
              Users accessing the Subscription Services which shall contain User
              Content and shall be hosted on the Platform;
            </div>
          </li>
          <li className={styles.listItem}>
            <span>26.36.</span>
            <div>
              <strong>“Working Day”</strong> means any day (1) which is neither
              a Saturday or a Sunday or a public holiday in any part of the
              United Kingdom and (2) upon which the Bank of England is open for
              business.
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.title}>
        <h1>PART FIVE – SLA.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>
          1. Server availability Service Level Agreement (SLA)
        </h2>
        <div className={styles.description}>
          This SLA is designed to ensure that Astrosat meets the needs of its
          Customers and it outlines what levels of service can be expected.
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <td className={styles.td}>Service Line</td>
              <td className={styles.td}>SLA</td>
              <td className={styles.td}>KPI (%)</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.td}>System Availability</td>
              <td className={styles.td}>To be made available to Users 24/7</td>
              <td className={styles.td}>99</td>
            </tr>
            <tr>
              <td className={styles.td}>Support Hours:</td>
              <td className={styles.td}>
                Astrosat will respond within defined service levels (see below)
              </td>
              <td className={styles.td}>99</td>
            </tr>
            <tr>
              <td className={styles.td}>Technical Support - Second Line</td>
              <td className={styles.td}>Available 9.00am – 5.00pm GMY</td>
              <td className={styles.td}>99</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2. Incident Resolution Targets</h2>
       <table className={styles.table}>
         <thead>
           <tr>
           <td></td>
           <td>Severity Description</td>
           <td>Response</td>
           <td>Resolution</td>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td>2.1</td>
             <td>Unplanned outage impacting multiple Users</td>
             <td>1hr</td>
             <td><24 hrs</td>
           </tr>
           <tr>
           <td>2.2</td>
             <td>Outage / severe disruption to service for several Users</td>
             <td>2hrs</td>
             <td>within 2 Working Days</td>
           </tr>
           <tr>
           <td>2.3</td>
             <td>Reduced functionally causing disruption to business</td>
             <td>4hrs</td>
             <td>within 3 Working Days</td>
           </tr>
           <tr>
           <td>2.4</td>
             <td>Non-urgent / reduced functionality with low impact</td>
             <td>8hrs</td>
             <td>within 5 Working Days</td>
           </tr>
           <tr>
           <td>2.5</td>
             <td>On Demand Professional services requests for installations etc.</td>
             <td>8hrs</td>
             <td>Agree with Customer</td>
           </tr>
         </tbody>
       </table>
       <div className={styles.description}>
       Astrosat shall use reasonable endeavours to provide the helpdesk support services in accordance with these Service Levels and Response Times. These Response times refer only to the time within which Astrosat shall respond to a helpdesk support request. Astrosat gives no guarantee as to the time any given issue may take to resolve save that it hereby undertakes to use reasonable endeavours to resolve issues as quickly as is reasonably possible within the target resolution times specified in the table above.
       </div>
      </div>
    </div>
  );
};

const container = () => {
  return (
    <>
      <div className={styles.title}>
        <h1>PART ONE – SUBSCRIPTION SERVICES.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>1: header</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>11.1.</span>
            <div>sdfgs</div>
          </li>
        </ul>
      </div>
    </>
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
