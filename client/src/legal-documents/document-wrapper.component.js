import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Button } from '@astrosat/astrosat-ui';

import { ReactComponent as OrbisLogo } from '../orbis-light.svg';

import { PRIVACY_POLICY, DOCUMENT } from './legal-documents-constants';

import styles from './legal-documents.module.css';

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
        online. We respect and value the privacy of Customers and will only
        collect and use personal data in ways that are described here, and in a
        manner that is consistent with Our obligations and your rights under the
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

const DocumentWrapper = ({ children }) => {
  const Component = children;

  const [info, setInfo] = useState(DOCUMENT);
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Link to="/">
          <OrbisLogo className={styles.logo} />
        </Link>
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
                `${styles.button} ${
                  info === PRIVACY_POLICY && styles.unselected
                }`,
              ]}
              onClick={() => setInfo(DOCUMENT)}
            >
              End User License Agreement
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
              onClick={() => {
                setInfo(PRIVACY_POLICY);
              }}
            >
              Privacy Policy
            </Button>
          </div>
        </div>
        <div className={styles.infoContainer}>
          {info === PRIVACY_POLICY && <PrivacyPolicy />}
          {info === DOCUMENT && (
            <Component onClick={() => setInfo(PRIVACY_POLICY)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentWrapper;
