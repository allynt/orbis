import React, { useState } from 'react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useFadeTransitionProps } from 'mission-control/shared-components/useFadeTransitionProps';

import { Form } from './form/form.component';
import { Intro } from './intro/intro.component';
import { Success } from './success/success.component';

const Stages = { intro: 'intro', form: 'form', success: 'success' };

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
