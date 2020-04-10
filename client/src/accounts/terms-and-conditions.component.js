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
      <p className={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis libero in nulla placerat, sed cursus
        tortor dictum. Sed blandit nisi pellentesque, finibus justo et, elementum ligula. Nullam congue egestas rutrum.
        Nullam id nulla convallis, tempor quam vitae, mattis nibh. Phasellus et consectetur ante, eget facilisis augue.
        Fusce sed laoreet nisi. Vestibulum posuere maximus nunc, a pellentesque mauris pellentesque quis. Sed vel cursus
        dui. Nam interdum eros ac venenatis interdum. Maecenas nisi risus, ultricies sit amet ante in, malesuada pretium
        nibh. Fusce lobortis arcu erat, sit amet sagittis velit rhoncus egestas. Quisque a enim non ante hendrerit
        blandit. Nam non ligula accumsan, vestibulum est et, volutpat libero. Fusce vel volutpat nisi, in convallis
        diam. Suspendisse accumsan dignissim enim, sed ullamcorper dui luctus ac. Donec sed massa laoreet, tincidunt
        arcu id, sodales sapien.
      </p>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 1</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 2</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 3</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>Title 4</h2>
        <p className={styles.description}>
          Nulla facilisi. Morbi a fringilla lectus. Sed nec posuere turpis. Phasellus pulvinar porta vulputate. Nulla id
          semper velit. Phasellus volutpat est suscipit, consectetur lorem at, eleifend sem. Vestibulum ligula tortor,
          venenatis a enim et, vehicula tincidunt sem. Nullam faucibus sem et arcu porta dictum. Fusce iaculis quam
          neque, sit amet pellentesque quam laoreet eu. Mauris sed convallis purus. In a placerat nibh. Ut sit amet
          tristique tortor, ac viverra risus. Duis a facilisis purus, eu viverra massa. Nunc ac nisi ipsum. Nulla sed
          magna sapien. Duis ultrices a justo ac pretium. Nam nibh magna, commodo et nisi nec, porttitor tincidunt
          tortor.
        </p>
      </div>
    </div>
  );
};

const EndUserLicenseAgreement = () => {
  return (
    <div className={styles.text}>
      <h1 className={styles.textHeader}>End User License Agreement</h1>
      <p className={styles.description}>
        This agreement is between <span className={styles.emphasis}>STEVENSON ASTROSAT LIMITED</span> a company
        incorporated in Scotland (Number SC423073) and whose Registered Office is at Copernicus Kirk, 200 High Street,
        Musselburgh EH21 7DX trading as OR3IS&trade; &#153; (<span className={styles.emphasis}>“OR3IS”</span>) and you (
        <span className={styles.emphasis}>“the User”</span>). This is a Click to Agree Contract from within the Software
        if the User wishes to be bound by these Terms and Conditions. If the User does not agree to be bound by these
        Terms and Conditions, the User cannot USE the Software.
      </p>
      <p className={styles.description}>
        The contract (“Agreement”) between the User and OR3IS will comprise:{' '}
        <ul className={styles.list}>
          <li>
            <span>1.</span>
            <p>these Terms and Conditions; and</p>
          </li>
          <li>
            <span>2.</span>
            <p>the Privacy Policy;</p>
          </li>
        </ul>
      </p>
      <div className={styles.title}>
        <h1>PART ONE – SUBSCRIPTION SERVICES.</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>1: Access to the Software.</h2>
        <p className={styles.description}>
          OR3IS grants to the User a non-exclusive, royalty based, non-sublicensable licence to Use the Software for the
          User’s personal business use for the duration of this Agreement, subject to the following conditions: -
          <ul className={styles.list}>
            <li>
              <span>1.1.</span>
              <p>
                The Software is located on the Platform. OR3IS has full administrative access rights to the Platform.
                Users may access the Software but have no right to administer the Platform or receive a copy of the
                object code or source code to the Software.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2: Conditions of Use.</h2>
        <p className={styles.description}>
          The rights to use the Software provided to the User are non-exclusive, non-transferable and are for the User’s
          personal business use only. The User’s right to use the Software is subject to the following conditions:- the
          User shall not:
          <ul className={styles.list}>
            <li>
              <span>2.1.</span>
              <p> Transfer to any other person any of its rights to use the Software;</p>
            </li>
            <li>
              <span>2.2.</span>
              <p>Sell, license, rent or lease the Software;</p>
            </li>
            <li>
              <span>2.3.</span>
              <p> Make the Software available to anyone who is not a User;</p>
            </li>
            <li>
              <span>2.4.</span>
              <p>Create any derivative works based upon the Software or Documentation;</p>
            </li>
            <li>
              <span>2.5.</span>
              <p>
                Copy any feature, design or graphic in, or reverse engineer the Software (including without prejudice to
                the foregoing generality the graphical user interface and menu command hierarchy);
              </p>
            </li>
            <li>
              <span>2.6.</span>
              <p>
                Access the Software (i) in order to build a competitive solution or to assist someone else to build a
                competitive solution; or (ii) if the User is an employee or contractor of a OR3IS competitor;
              </p>
            </li>
            <li>
              <span>2.7.</span>
              <p>Use the Software in a way that violates any criminal or civil law;</p>
            </li>
            <li>
              <span>2.8.</span>
              <p>Load test the Software in order to test scalability; or,</p>
            </li>
            <li>
              <span>2.9</span>
              <p>Exceed any specified usage limits listed the Documentation.</p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>3: User Content/Security</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>3.1.</span>
              <p>
                Users provide all data for use in the Software, and OR3IS is not obliged to modify or add to User
                Content except as specified in Clause 4. The User is solely responsible for User Content and the
                accuracy of User Content.
              </p>
            </li>
            <li>
              <span>3.2.</span>
              <p>
                User Content belongs to the User or its licensors, and OR3IS makes no claim to any right of ownership in
                it.
              </p>
            </li>
            <li>
              <span>3.3.</span>
              <p>OR3IS shall keep User Content confidential in accordance with Clause 10 of this Agreement.</p>
            </li>
            <li>
              <span>3.4.</span>
              <p>
                Subject to the terms of Clause 4, OR3IS shall only be entitled to use User Content strictly as necessary
                to carry out its obligations under this Agreement, and for no other purpose. However, OR3IS:
                <ul className={styles.list}>
                  <li>
                    <span>3.4.1.</span>
                    <p>
                      may observe and report back to the User on the User’s usage of the Software, and make
                      recommendations for improved usage of the Software;
                    </p>
                  </li>
                  <li>
                    <span>3.4.2.</span>
                    <p>
                      may identify trends and publish reports on its findings provided the reports include data
                      aggregated from more than one site of the User and do not identify the User;
                    </p>
                  </li>
                </ul>
              </p>
            </li>
            <li>
              <span>3.5.</span>
              <p>
                The parties shall comply with the principles of the Privacy Legislation and in accordance with the
                Privacy Policy.
              </p>
            </li>
            <li>
              <span>3.6.</span>
              <p>
                Sharing of accounts is not permitted unless expressly authorised in writing by OR3IS. Users must keep
                account details confidential and Users should not reveal their username or password to any unauthorised
                third parties. OR3IS accepts no liability for any losses or damages incurred as a result of account
                details being shared in breach of the terms of this Agreement. It is recommended that Users do not save
                account details in their internet browser.
              </p>
            </li>
            <li>
              <span>3.7.</span>
              <p>Passwords must be strong, robust, robust and difficult to break and changed on a regular basis.</p>
            </li>
            <li>
              <span>3.8.</span>
              <p>
                Whereas as part of the Subscription Services, OR3IS may host email accounts or other online
                communications infrastructure or subscription accounts (including the OR3IS subscription itself) for
                Users, OR3IS accepts no responsibility and shall not be liable for third parties accessing such email,
                online communications accounts or subscription accounts by way of breaking or hacking passwords. It is
                the responsibility of Users to ensure that all email, online communications accounts and subscription
                accounts are properly protected with robust passwords. The terms of Clause 4 apply to the use of any
                such email, online communications accounts and subscription accounts.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>4: Acceptable Usage Policy</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>4.1.</span>
              <p>
                Without prejudice to the generality of Clause 2.7, when using the Software; Users should do so in
                accordance with the following rules:
                <ul className={styles.list}>
                  <li>
                    <span>4.1.1.</span>
                    <p>Users must not use obscene or vulgar language;</p>
                  </li>
                  <li>
                    <span>4.1.2.</span>
                    <p>
                      User Sites may not contain any material that is unlawful or otherwise objectionable (including
                      that which may be in breach of rules, regulations or legislation in force in the United Kingdom or
                      any other jurisdiction in which the User’s User Site can be lawfully accessed. This does not
                      extend to material which may be automatically blocked in certain jurisdictions but that is lawful
                      in the User’s home country);
                    </p>
                  </li>
                  <li>
                    <span>4.1.3.</span>
                    <p>
                      User Sites may not contain any material that is intended to promote or incite violence or any
                      other unlawful conduct against any group, individual or animal. This includes, but is not limited
                      to, the provision of instructions on how to assemble weapons of any kind, bombs, grenades or other
                      explosive devices;
                    </p>
                  </li>
                  <li>
                    <span>4.1.4.</span>
                    <p>
                      User Sites may not infringe the Intellectual Property rights of any third party including, but not
                      limited to, copyright, trademarks, patents and designs;
                    </p>
                  </li>
                  <li>
                    <span> 4.1.5.</span>
                    <p>
                      User Sites may not contain any material that may contain viruses or other software or instructions
                      that may damage or disrupt other software, computer hardware or communications networks;
                    </p>
                  </li>
                  <li>
                    <span>4.1.6.</span>
                    <p>
                      User Sites may not be used for unauthorised mass-communications such as “spam” or “junk mail”; and
                    </p>
                  </li>
                </ul>
              </p>
            </li>
            <li>
              <span>4.2.</span>
              <p>
                OR3IS does not screen or pre-approve any User Site or User Content (although Users acknowledge that
                OR3IS may do so if it wishes).
              </p>
            </li>
            <li>
              <span>4.3.</span>
              <p>
                OR3IS may edit a User Site to comply with the provisions of sub-Clause 4.1 without prior consultation.
                In cases of severe breaches of the provisions of sub-Clause 4.1, a User Site may be taken down and the
                relevant account may be suspended or terminated. The User will not be informed in writing of the reasons
                for such alterations or take downs.
              </p>
            </li>
            <li>
              <span>4.4.</span>
              <p>
                OR3IS accepts no responsibility or liability for any infringement of third-party rights by User Sites.
              </p>
            </li>
            <li>
              <span>4.5.</span>
              <p>
                OR3IS will not be liable in any way or under any circumstances for any loss or damage that any User may
                incur as a result of such User Sites, or OR3IS exercising its rights under this Agreement, nor for any
                errors or omissions in User Sites. Use of and reliance upon User Sites is entirely at the User’s own
                risk.
              </p>
            </li>
            <li>
              <span>4.6.</span>
              <p>
                The User acknowledges that OR3IS may retain copies of any and all communications, information, User
                Content and User Sites sent to OR3IS.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>5: Intellectual Property</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>5.1.</span>
              <p>
                Subject to the exceptions in Clause 6 of this Agreement, all Content, that is not User Content, and the
                Database and the Software and the Documentation are the property of OR3IS, or OR3IS’ Affiliates or
                licensors. By continuing to use the Software the User acknowledges that such material is protected by
                applicable United Kingdom and international Intellectual Property and other laws.
              </p>
            </li>
            <li>
              <span>5.2.</span>
              <p>
                You may print, reproduce, copy, distribute, store or in any other fashion re-use Content from the
                Software for personal or educational purposes only unless otherwise given OR3IS’ express written
                permission to do so. Specifically, the User agrees that it will not systematically copy Content from the
                Software with a view to creating or compiling any form of comprehensive collection, compilation,
                directory or database unless given OR3IS’ express written permission to do so.
              </p>
            </li>
            <li>
              <span>5.3.</span>
              <p>
                In the event that new inventions, designs or processes evolve in performance of or as a result of this
                Agreement, the User acknowledges that the same shall be the property of OR3IS unless otherwise agreed in
                writing by OR3IS.
              </p>
            </li>
            <li>
              <span>5.4.</span>
              <p>
                Any trade mark, trade name or logo such as “Powered by OR3IS” appearing on or in the Software is the
                property of OR3IS and must not be copied, obscured or removed from the Software.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>6: User Site Intellectual Property</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>6.1.</span>
              <p>
                The Intellectual Property rights subsisting in the User Content of User Sites belong to the User to
                which that/those User Site(s) belong(s) unless it is expressly stated otherwise.
              </p>
            </li>
            <li>
              <span>6.2.</span>
              <p>
                Where expressly indicated, certain Content available through User Sites and the Intellectual Property
                rights subsisting therein belongs to other parties.
              </p>
            </li>
            <li>
              <span>6.3.</span>
              <p>
                The third party Content described in this Clause 6, unless expressly stated to be so, is not covered by
                any permission granted by Clause 5 of these Terms and Conditions to use Content.
              </p>
            </li>
            <li>
              <span>6.4.</span>
              <p>
                For the avoidance of doubt, the Database (excluding the User Content therein) shall not be considered
                User Content.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>7: Third Party Intellectual Property</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>7.1.</span>
              <p>
                Unless otherwise expressly indicated, all Intellectual Property rights including, but not limited to,
                Copyright and Trademarks, in Content belong to the manufacturers or distributors of such products as may
                be applicable.
              </p>
            </li>
            <li>
              <span>7.2.</span>
              <p>
                Subject to Clause 5 the User may not reproduce, copy, distribute, store or in any other fashion re-use
                Content unless otherwise indicated on the Software or the Documentation or unless given express written
                permission to do so by the relevant manufacturer or supplier.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>8: Warranty Disclaimer</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>8.1.</span>
              <p>
                Except as expressly provided in this Agreement, the Software and Professional Services are provided with
                no other warranties of any kind, and OR3IS disclaims all other warranties, express or implied, including
                without limitation any warranty of merchantability or fitness for a particular purpose. OR3IS does not
                warrant that the use of the Subscription Services shall be uninterrupted or error-free.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>9: Limitation of Liability</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>9.1.</span>
              <p>
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
              </p>
            </li>
            <li>
              <span>9.2.</span>
              <p>
                OR3IS’ liability under this Agreement (except where provided otherwise in this agreement to a lesser
                extent) shall be limited to the amount of professional indemnity insurance underwritten in the name of
                OR3IS which shall be £1,000,000. This limitation shall not apply to a breach of the Privacy Legislation.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>10: Confidentiality</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>10.1.</span>
              <p>
                Each party may be given access to Confidential Information from the other party in order to perform its
                obligations under this Agreement. A party’s Confidential Information shall not be deemed to include
                information that (i) is now, or subsequently becomes, through no act or failure to act on the part of
                receiving party (the “Receiver”), generally known or available; (ii) is known by the Receiver at the
                time of receiving such information, as evidenced by the Receiver’s records; (iii) is subsequently
                provided to the Receiver by a third party, as a matter of right and without restriction on disclosure;
                or (iv) is required to be disclosed by law, provided that the party to whom the information belongs is
                given prior written notice of any such proposed disclosure.
              </p>
            </li>
            <li>
              <span>10.2.</span>
              <p>
                Subject to clauses 10.4, each party shall hold the other’s Confidential Information in confidence and
                not make the other’s Confidential Information available to any third party (other than to a consultant
                or a Sub-contractor for the purposes of this Agreement and which consultant or Sub-contractor shall have
                entered into undertakings of confidentiality in relation to the Confidential Information on terms no
                less onerous than those contained in this Clause 10), or use the other’s Confidential Information for
                any purpose other than to carry out its obligations under this Agreement.
              </p>
            </li>
            <li>
              <span>10.3.</span>
              <p>
                Each party shall take all reasonable steps to ensure that the other’s Confidential Information to which
                it has access is not disclosed or distributed by its employees or agents in violation of the terms of
                this Agreement.
              </p>
            </li>
            <li>
              <span>10.4.</span>
              <p>
                A party may disclose Confidential Information to the extent such Confidential Information is required to
                be disclosed by law, by any governmental or other regulatory authority or by a court or other authority
                of a competent jurisdiction, provided that, to the extent it is legally permitted to do so, it gives the
                other party as much notice of such disclosure as possible and, where notice of disclosure is not
                prohibited and is given in accordance with this clause 10.4, it takes into account the reasonable
                requests of the other party in relation to the content of such disclosure.
              </p>
            </li>
            <li>
              <span>10.5.</span>
              <p>
                No party shall make, or permit any person to make, any public announcement concerning this Agreement
                without the prior written consent of the other parties (such consent not to be unreasonably withheld or
                delayed), except as required by law, any governmental or regulatory authority (including without
                limitation, any relevant securities exchange), any court or other authority of competent jurisdiction.
              </p>
            </li>
            <li>
              <span>10.6.</span>
              <p>This clause 10 shall survive termination of this Agreement or any Order Form, howsoever arising.</p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>11: Indenification by the User</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>11.1.</span>
              <p>
                The User shall indemnify and hold harmless OR3IS, its Affiliates, directors, and employees from any
                damages finally awarded against OR3IS (including, without limitation, reasonable costs and legal fees
                incurred by OR3IS) arising out of any third party suit, claim or other legal action (including but not
                limited to any governmental investigations, complaints and actions) in connection with the User Content,
                including, without limitation, any action for infringement of any trademark, copyright, trade secret,
                right of publicity or privacy (including defamation), patent or other proprietary right with respect to
                the User Content (“Legal Claim”).
              </p>
            </li>
            <li>
              <span>11.2.</span>
              <p>
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
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>12: Law</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>12.1.</span>
              <p>
                This Agreement shall be governed by the laws of Scotland. The parties consent to the exercise of
                exclusive jurisdiction of the Courts of Scotland.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>13: Feedback and Modifications</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>13.1.</span>
              <p>
                The User hereby acknowledges that upon submitting Feedback to OR3IS, the User automatically grants to
                OR3IS a worldwide, perpetual, irrevocable, royalty free licence to use that Feedback in any way OR3IS
                deems appropriate including, but not limited to:
                <ul className={styles.list}>
                  <li>
                    <span>13.1.1.</span>
                    <p>
                      The use, publication, distribution, transmission, broadcasting, licensing, sub-licensing, leasing,
                      lending and sale of the Feedback; and
                    </p>
                  </li>
                  <li>
                    <span>13.1.2.</span>
                    <p>
                      The creation, use, publication, distribution, transmission, broadcasting, licensing,
                      sub-licensing, leasing, lending and sale of any derivative works based upon the Feedback.
                    </p>
                  </li>
                </ul>
              </p>
            </li>
            <li>
              <span>13.2.</span>
              <p>OR3IS’ use of the Feedback shall not bestow any rights or interests upon the User whatsoever.</p>
            </li>
            <li>
              <span>13.3.</span>
              <p>
                The User hereby acknowledges that any modifications made to the Software at the request or suggestion of
                the User will belong to and be the Intellectual Property of OR3IS.
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.title}>
        <h1>PART 2 - DEFINITIONS</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>14: Glossary</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>14.1.</span>
              <p>
                “Affiliate” means an entity which controls, is controlled by, or is under common control with, a party,
                and control means the ability to vote 50% or more of the voting securities of any entity or otherwise
                having the ability to influence and direct the polices and direction of an entity;
              </p>
            </li>
            <li>
              <span>14.2.</span>
              <p>
                “Content” means any text, graphics, images, audio, video, software, data compilations including, but not
                limited to, text, graphics, logos, icons, sound clips, video clips, data compilations, page layout,
                underlying code and software and any other form of information capable of being stored in a computer
                that appears on, is uploaded to or forms part of the Software or the Platform; BUT excluding User
                Content;
              </p>
            </li>
            <li>
              <span>14.3.</span>
              <p>“Database” means the database stored on the Platform which contains inter alia User Content;</p>
            </li>
            <li>
              <span>14.4.</span>
              <p>“DPA” means the Data Protection Act 2018 and any modification, amendment or re-enactment thereof;</p>
            </li>
            <li>
              <span>14.5.</span>
              <p>
                “Documentation” means user documentation provided electronically by OR3IS for use with the Software, as
                periodically updated;
              </p>
            </li>
            <li>
              <span>14.6.</span>
              <p>
                “Feedback” means all comments, suggestions, requests, requirements, improvements, feedback, or other
                input the User provides regarding any products or Services owned or supplied by OR3IS, its Affiliates
                and licensees;
              </p>
            </li>
            <li>
              <span>14.7.</span>
              <p>
                “GDPR” means the General Data Protection Regulation (Regulation (EU) 2016/679) as amended, replaced,
                supplemented or adopted into United Kingdom Legislation;
              </p>
            </li>
            <li>
              <span>14.8.</span>
              <p>
                “Intellectual Property” means patents, trademarks, trade name, service mark, copyright, trade secrets,
                know-how, process, technology, development tool, ideas, concepts, design right, domain names, moral
                right, database right, methodology, algorithm and invention, and any other proprietary information
                (whether registered, unregistered, pending or applied for);
              </p>
            </li>
            <li>
              <span>14.9.</span>
              <p>
                “Platform” means the hardware and software environment in which the software element of the Software
                operates, which comprises one or more server computers (whether virtual or not),
                mirroring/duplicating/back-up and storage systems and relative hardware operating software, virtual
                machine software (where relevant), operating system software, database software, anti-virus and security
                software, switches, power supplies and telecommunications infrastructure;
              </p>
            </li>
            <li>
              <span>14.10.</span>
              <p>
                “Privacy Legislation” means the GDPR, the DPA, the Data Protection Directive (95/46/EC), the Regulation
                of Investigatory Powers Act 2000, the Telecommunications (Lawful Business Practice) (Interception of
                Communications) Regulations 2000 (SI 2000/2699), the Electronic Communications Data Protection Directive
                (2002/58/EC), the Privacy and Electronic Communications (EC Directive) Regulations 2003 (SI 2426/2003)
                and all applicable laws and regulations relating to the processing of personal data and privacy,
                including where applicable the guidance and codes of practice issued by the Information Commissioner.
                (as amended or replaced from time to time);
              </p>
            </li>
            <li>
              <span>14.11.</span>
              <p>
                “Privacy Policy” means OR3IS’ policy relating to User Content and compliance with (amongst others) the
                DPA and the GDPR from time to time, the current version of which is located here
                https://or3is.com/privacy-policy ;
              </p>
            </li>
            <li>
              <span>14.12.</span>
              <p>
                “Software” means the OR3IS™ proprietary operating software and the Third Party Software written in
                object and source code residing on and used for operating the Platform and the Software as Updated and
                Upgraded from time to time;
              </p>
            </li>
            <li>
              <span>14.13.</span>
              <p>
                “Third Party Software” means software other than the Software which belongs to third parties and in
                relation to which OR3IS has the right to grant sub-licenses;
              </p>
            </li>
            <li>
              <span>14.14.</span>
              <p>
                “Update” means any update, update rollup, service pack, feature pack, critical update, security update,
                or hotfix that is used to improve or to fix a software product;
              </p>
            </li>
            <li>
              <span>14.15.</span>
              <p>
                “Upgrade” means a software package that replaces an installed version of a product with a newer version
                of the same product, typically leaving existing customer data and preferences intact while replacing the
                existing software with the newer version;
              </p>
            </li>
            <li>
              <span>14.16.</span>
              <p>
                “User” means the person that has permission to accesses the Software as a named user and is not employed
                by OR3IS and acting in the course of their employment;
              </p>
            </li>
            <li>
              <span>14.17.</span>
              <p>
                “User Content” means any text, graphics, images, audio, video, software, data compilations and any other
                form of information capable of being stored in a computer that appears on, is uploaded to or forms part
                of a User Site or the Software and has been uploaded by a User;
              </p>
            </li>
            <li>
              <span>14.18.</span>
              <p>
                “User Site” means a partition/tenancy on the Platform created by OR3IS for a User or Users accessing the
                Software which shall contain User Content and shall be hosted on the Platform;
              </p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.schedule1}>
        <h1>SCHEDULE 1</h1>
        <h3>Processing, Personal Data and Data Subjects</h3>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>1: Processing by OR3IS</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>1.1</span>
              <p>
                Scope – persons who choose to enter their personal details into the application as either a person
                wishing help or as a person able and willing to offer help. Also staff of Voluntary Action Orkney who
                access the system to facilitate the matching of volunteer helpers to those requiring help.
              </p>
            </li>
            <li>
              <span>1.2</span>
              <p>
                Nature – the collection of data from a web based questionnaire, the storage of that data in a database
                and the transmission of that data to a map based web application
              </p>
            </li>
            <li>
              <span>1.3</span>
              <p>
                Purpose of Processing – to enable Voluntary Action Orkney to identify individuals in need of help and to
                identify volunteers who may be able to provide that help.
              </p>
            </li>
            <li>
              <span>1.4</span>
              <p>
                Duration of the Processing – the term of the agreement or such later date as may be specified or
                required by law
              </p>
            </li>
            <li>
              <span>1.5</span>
              <p>Types of Personal Data – names, addresses, email addresses</p>
            </li>
            <li>
              <span>1.6</span>
              <p>Categories of Data Subject – natural persons over the age of 18 resident in Orkney</p>
            </li>
          </ul>
        </p>
      </div>
      <div className={styles.section}>
        <h2 className={styles.textSectionHeader}>2: Rights and Obligations of Data Controller</h2>
        <p className={styles.description}>
          <ul className={styles.list}>
            <li>
              <span>2.1</span>
              <p>The rights and obligations of the Data Controller set out in this Agreement and the GDPR and DPA.</p>
            </li>
          </ul>
        </p>
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
