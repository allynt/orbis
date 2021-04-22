import React from 'react';
import PopupNote from './popup-note.component';

const defaultNote = {
  id: 123,
  body: 'This is the body of the test note',
};

const longBodyNote = {
  id: 456,
  body:
    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque nihil impedit, amet similique sequi error tenetur delectus eveniet natus quis animi odio obcaecati praesentium voluptate reiciendis ad, culpa est at? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione iure blanditiis sequi dolor porro similique, repudiandae laborum natus obcaecati ipsam tempora. Distinctio sunt accusamus ipsum totam. Molestias deserunt dignissimos unde! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas quis, dolorem est incidunt, sint dicta eum, consectetur natus nostrum facilis officiis voluptates aliquid fuga cupiditate nesciunt aperiam culpa accusamus ea. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda doloribus officia perferendis modi totam quos molestiae natus hic quae quisquam nihil omnis consequuntur blanditiis eos, soluta necessitatibus ut cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem animi omnis consequuntur fugit nemo natus, eaque, sint ea maxime quo sunt. Enim magnam illo dolorum aliquam obcaecati eum quia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, velit ipsam. Adipisci excepturi alias iste provident, est, atque doloribus beatae omnis debitis, mollitia ut quasi architecto ullam voluptas nemo sit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At modi officia fuga, esse dolorem temporibus delectus facere voluptates, provident ad inventore ipsa exercitationem, ullam amet! Optio laudantium explicabo enim culpa? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque nihil impedit, amet similique sequi error tenetur delectus eveniet natus quis animi odio obcaecati praesentium voluptate reiciendis ad, culpa est at? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione iure blanditiis sequi dolor porro similique, repudiandae laborum natus obcaecati ipsam tempora. Distinctio sunt accusamus ipsum totam. Molestias deserunt dignissimos unde! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas quis, dolorem est incidunt, sint dicta eum, consectetur natus nostrum facilis officiis voluptates aliquid fuga cupiditate nesciunt aperiam culpa accusamus ea. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia assumenda doloribus officia perferendis modi totam quos molestiae natus hic quae quisquam nihil omnis consequuntur blanditiis eos, soluta necessitatibus ut cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem animi omnis consequuntur fugit nemo natus, eaque, sint ea maxime quo sunt. Enim magnam illo dolorum aliquam obcaecati eum quia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, velit ipsam. Adipisci excepturi alias iste provident, est, atque doloribus beatae omnis debitis, mollitia ut quasi architecto ullam voluptas nemo sit. Lorem ipsum dolor sit amet consectetur adipisicing elit. At modi officia fuga, esse dolorem temporibus delectus facere voluptates, provident ad inventore ipsa exercitationem, ullam amet! Optio laudantium explicabo enim culpa?',
};

export default {
  title: 'Components/Feature Detail/Popup Note',
  argTypes: { onNoteSave: { action: 'Save note' } },
};

const Template = args => (
  <div style={{ maxWidth: '10rem' }}>
    <PopupNote {...args} />
  </div>
);

export const Default = Template.bind({});

export const Note = Template.bind({});
Note.args = {
  note: defaultNote,
};

export const TooMuchText = Template.bind({});
TooMuchText.args = {
  note: longBodyNote,
};
