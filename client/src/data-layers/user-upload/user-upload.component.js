import React, { useState } from 'react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useFadeTransitionProps } from 'mission-control/shared-components/useFadeTransitionProps';

import { Form } from './form/form.component';
import { Intro } from './intro/intro.component';
import { Success } from './success/success.component';

const Stages = { intro: 'intro', form: 'form', success: 'success' };

/**
 * This handles the whole User Upload journey
 *
 * `onSubmit` in `Form` is called with the uploaded file, name, and description.
 * The form also validates the file using `validate` hooked into `yup` hooked into `react-hook-form`.
 *
 * The file is parsed for validation but the parsed result will need to be used for conversion to GeoJson
 * I was going to look into a way of spitting that parsed file out of the validation but didn't get round to it
 *
 * @param {{
 *   onComplete: React.MouseEventHandler<HTMLButtonElement>
 * }} props
 */
const UserUpload = ({ onComplete }) => {
  const [stage, setStage] = useState(Stages.intro);
  const fadeTransitionProps = useFadeTransitionProps(stage);
  return (
    <>
      <TransitionGroup style={{ position: 'relative' }}>
        <CSSTransition {...fadeTransitionProps}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {stage === Stages.intro && (
              <Intro onNextClick={() => setStage(Stages.form)} />
            )}
            {stage === Stages.form && (
              <Form
                onBackClick={() => setStage(Stages.intro)}
                onSubmit={() => setStage(Stages.success)}
              />
            )}
            {stage === Stages.success && <Success onOkClick={onComplete} />}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

export { UserUpload };
