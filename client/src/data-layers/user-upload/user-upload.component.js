import React, { useState } from 'react';

import { Form } from './form/form.component';
import { Intro } from './intro/intro.component';
import { Success } from './success/success.component';

const UserUpload = ({ onComplete }) => {
  const [stage, setStage] = useState('intro');
  return (
    <>
      {stage === 'intro' && <Intro onNextClick={() => setStage('form')} />}
      {stage === 'form' && (
        <Form
          onBackClick={() => setStage('intro')}
          onSubmit={() => setStage('success')}
        />
      )}
      {stage === 'success' && <Success onOkClick={onComplete} />}
    </>
  );
};

export { UserUpload };
