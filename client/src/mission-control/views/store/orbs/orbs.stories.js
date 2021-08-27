import React from 'react';

import faker from 'faker/locale/en_GB';
import { MemoryRouter } from 'react-router-dom';

import { OrbCard, OrbCardSkeleton } from './orb-card.component';
import { Orbs } from './orbs.component';

export default { title: 'Mission Control/Store/Orbs' };

const logo =
  "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M23.6094 21.7237L19.0933 17.2082C20.5488 15.3386 21.3374 13.0358 21.3335 10.6664C21.3329 4.77606 16.5574 0 10.6664 0C4.77606 0 0 4.77606 0 10.6664C0 16.5568 4.77606 21.3335 10.6664 21.3335C13.0358 21.3374 15.3386 20.5488 17.2082 19.0933L21.7237 23.6094C21.8475 23.7333 21.9946 23.8315 22.1563 23.8985C22.3181 23.9655 22.4914 24 22.6666 24C22.8417 24 23.0151 23.9655 23.1769 23.8985C23.3386 23.8315 23.4856 23.7333 23.6094 23.6094C23.7333 23.4856 23.8315 23.3386 23.8985 23.1769C23.9655 23.0151 24 22.8417 24 22.6666C24 22.4914 23.9655 22.3181 23.8985 22.1563C23.8315 21.9946 23.7333 21.8475 23.6094 21.7237ZM10.6664 18.6667C6.24831 18.6667 2.66678 15.0852 2.66678 10.6664C2.66678 6.24831 6.24831 2.66678 10.6664 2.66678C15.0852 2.66678 18.6667 6.24831 18.6667 10.6664C18.6667 15.0852 15.0852 18.6667 10.6664 18.6667Z' fill='black'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.5059 8.22873L10.9716 8.49817L10.7514 8.91441L10.2858 8.64425L10.5059 8.22873ZM12.5638 9.60017L13.0287 9.86961L12.8079 10.2858L12.343 10.0164L12.5638 9.60017ZM10.5594 10.2858L10.9716 10.5032L10.6986 10.9716L10.2858 10.7542L10.5594 10.2858Z' stroke='black' stroke-width='0.1'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.3272 13.2681C9.36856 13.2881 9.416 13.2915 9.45984 13.2776C9.50368 13.2637 9.54048 13.2335 9.56272 13.1932C9.58488 13.153 9.59088 13.1058 9.57936 13.0613C9.56776 13.0168 9.53968 12.9784 9.50064 12.954C9.45944 12.9354 9.41272 12.9329 9.36976 12.9471C9.3268 12.9612 9.29072 12.9911 9.26872 13.0306C9.24664 13.0701 9.24032 13.1165 9.25088 13.1605C9.26152 13.2045 9.28824 13.2429 9.32584 13.2681H9.32648H9.3272ZM9.06664 13.7385C8.9004 13.6459 8.77768 13.4912 8.72536 13.3083C8.67304 13.1254 8.69536 12.9292 8.78752 12.7627C8.8332 12.6805 8.89456 12.608 8.96824 12.5495C9.04192 12.491 9.1264 12.4475 9.2168 12.4216C9.30728 12.3957 9.40192 12.3879 9.49544 12.3986C9.58888 12.4093 9.67936 12.4383 9.7616 12.4839C9.84384 12.5296 9.91632 12.5911 9.9748 12.6647C10.0334 12.7383 10.0768 12.8228 10.1027 12.9133C10.1286 13.0037 10.1364 13.0984 10.1257 13.1919C10.115 13.2853 10.086 13.3758 10.0403 13.458C9.84832 13.8051 9.41288 13.9312 9.06664 13.7392V13.7385Z' fill='black'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.91667 13.5403C7.90299 13.4738 7.91487 13.4046 7.94997 13.3466C7.98507 13.2885 8.0408 13.2458 8.106 13.227C8.1712 13.2082 8.24112 13.2147 8.30176 13.2452C8.36232 13.2757 8.40928 13.3279 8.43304 13.3915C8.46936 13.5208 8.53096 13.6416 8.61416 13.747C8.69744 13.8523 8.80064 13.9402 8.918 14.0054C9.03536 14.0707 9.16448 14.1122 9.29792 14.1273C9.43136 14.1424 9.56648 14.131 9.69544 14.0937C9.72936 14.084 9.76496 14.081 9.8 14.085C9.83512 14.089 9.86904 14.0999 9.89992 14.117C9.9308 14.1342 9.958 14.1572 9.98 14.1849C10.002 14.2125 10.0183 14.2442 10.028 14.2782C10.0378 14.3121 10.0407 14.3476 10.0366 14.3827C10.0326 14.4178 10.0218 14.4518 10.0046 14.4826C9.98752 14.5135 9.96448 14.5407 9.93688 14.5627C9.9092 14.5847 9.87752 14.601 9.84352 14.6107C9.64672 14.6672 9.44072 14.6844 9.23728 14.6611C9.03384 14.6379 8.83704 14.5748 8.658 14.4754C8.47904 14.3759 8.32144 14.2422 8.19416 14.0817C8.06696 13.9212 7.97267 13.7373 7.91667 13.5403Z' fill='black'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.14253 13.7625C7.13115 13.7281 7.12684 13.6918 7.12985 13.6557C7.13287 13.6196 7.14313 13.5845 7.16004 13.5525C7.17696 13.5205 7.20016 13.4922 7.22827 13.4694C7.25638 13.4466 7.2888 13.4297 7.32361 13.4197C7.35841 13.4097 7.39488 13.4068 7.43081 13.4113C7.46674 13.4158 7.5014 13.4274 7.53271 13.4456C7.56403 13.4638 7.59135 13.4881 7.61303 13.5171C7.6347 13.5461 7.6503 13.5792 7.65888 13.6144C7.79191 14.0814 8.10456 14.4756 8.52976 14.7108C8.73928 14.8276 8.96984 14.9017 9.20824 14.9289C9.44656 14.9561 9.68784 14.9358 9.91832 14.8692C9.95232 14.8595 9.98792 14.8566 10.023 14.8606C10.0582 14.8646 10.0922 14.8755 10.123 14.8927C10.154 14.9098 10.1812 14.933 10.2032 14.9606C10.2252 14.9883 10.2415 15.0201 10.2513 15.054C10.261 15.088 10.2639 15.1236 10.2599 15.1587C10.2558 15.1938 10.245 15.2278 10.2278 15.2588C10.2106 15.2897 10.1875 15.3169 10.1598 15.3389C10.1322 15.3609 10.1005 15.3772 10.0665 15.387C9.768 15.4731 9.45552 15.4993 9.14688 15.4639C8.83832 15.4286 8.53976 15.3326 8.26848 15.1812C7.99661 15.0306 7.75718 14.8277 7.56396 14.5842C7.37072 14.3407 7.22751 14.0614 7.14253 13.7625ZM7.42848 5.52214L10.6404 7.30638C10.7275 7.35438 10.7583 7.4641 10.7103 7.5505L9.86344 9.08175C9.85208 9.10231 9.8368 9.12047 9.8184 9.13511C9.8 9.14975 9.77888 9.16063 9.75624 9.16719C9.73368 9.17367 9.71 9.17559 9.68664 9.17295C9.6632 9.17031 9.64064 9.16311 9.62008 9.15167L6.4088 7.36742C6.38812 7.35603 6.3699 7.34068 6.35519 7.32222C6.34047 7.30378 6.32954 7.2826 6.32304 7.25991C6.31654 7.23722 6.31459 7.21347 6.31731 7.19002C6.32002 7.16658 6.32735 7.1439 6.33886 7.1233L7.18573 5.59208C7.19704 5.57151 7.21231 5.55338 7.23064 5.53873C7.24898 5.52408 7.27003 5.51319 7.29258 5.5067C7.31513 5.50019 7.33875 5.49822 7.36207 5.50086C7.38539 5.50351 7.40796 5.51074 7.42848 5.52214ZM7.34208 5.67985L6.4952 7.21038L9.70712 8.99463L10.554 7.46342L7.34208 5.67916V5.67985Z' fill='black'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.42848 5.52214L10.6404 7.30638C10.7275 7.35438 10.7583 7.4641 10.7103 7.5505L9.86344 9.08175C9.85208 9.10231 9.8368 9.12047 9.8184 9.13511C9.8 9.14975 9.77888 9.16063 9.75624 9.16719C9.73368 9.17367 9.71 9.17559 9.68664 9.17295C9.6632 9.17031 9.64064 9.16311 9.62008 9.15167L6.4088 7.36742C6.38812 7.35603 6.3699 7.34068 6.35519 7.32222C6.34047 7.30378 6.32954 7.2826 6.32304 7.25991C6.31654 7.23722 6.31459 7.21347 6.31731 7.19002C6.32002 7.16658 6.32735 7.1439 6.33886 7.1233L7.18573 5.59208C7.19704 5.57151 7.21231 5.55338 7.23064 5.53873C7.24898 5.52408 7.27003 5.51319 7.29258 5.5067C7.31513 5.50019 7.33875 5.49822 7.36207 5.50086C7.38539 5.50351 7.40796 5.51074 7.42848 5.52214ZM7.34208 5.67985L6.4952 7.21038L9.70712 8.99463L10.554 7.46342L7.34208 5.67916V5.67985ZM13.6912 9.00079L16.9031 10.785C16.9902 10.833 17.021 10.9428 16.973 11.0292L16.1262 12.5604C16.1148 12.581 16.0994 12.5991 16.0811 12.6138C16.0627 12.6285 16.0416 12.6394 16.019 12.6458C15.9964 12.6523 15.9727 12.6543 15.9493 12.6517C15.9259 12.649 15.9034 12.6418 15.8827 12.6303L12.6708 10.8461C12.6502 10.8346 12.6321 10.8193 12.6174 10.8008C12.6027 10.7823 12.5919 10.7611 12.5854 10.7384C12.579 10.7158 12.5771 10.692 12.5799 10.6686C12.5826 10.6452 12.59 10.6226 12.6016 10.602L13.4478 9.07071C13.459 9.05007 13.4743 9.03191 13.4927 9.01719C13.5111 9.00247 13.5322 8.99151 13.5549 8.98503C13.5775 8.97855 13.6012 8.97655 13.6246 8.97927C13.648 8.98199 13.6706 8.98927 13.6912 9.00079ZM13.6048 9.15855L12.7579 10.689L15.9698 12.4733L16.8167 10.9421L13.6048 9.15783V9.15855Z' fill='black'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.6912 9.0008L16.9031 10.785C16.9902 10.833 17.021 10.9428 16.973 11.0292L16.1262 12.5604C16.1148 12.581 16.0995 12.5991 16.0811 12.6138C16.0627 12.6285 16.0416 12.6394 16.019 12.6458C15.9964 12.6523 15.9727 12.6543 15.9494 12.6517C15.926 12.649 15.9034 12.6418 15.8828 12.6303L12.6709 10.8461C12.6502 10.8346 12.6321 10.8193 12.6174 10.8008C12.6028 10.7823 12.5919 10.7611 12.5854 10.7384C12.579 10.7158 12.5771 10.692 12.5799 10.6686C12.5826 10.6452 12.5901 10.6226 12.6016 10.602L13.4478 9.07071C13.4591 9.05007 13.4744 9.03191 13.4928 9.01719C13.5111 9.00247 13.5322 8.99152 13.5549 8.98504C13.5775 8.97856 13.6012 8.97655 13.6246 8.97927C13.648 8.98199 13.6706 8.98928 13.6912 9.0008ZM13.6048 9.15856L12.7579 10.689L15.9698 12.4733L16.8167 10.9421L13.6048 9.15783V9.15856ZM12.8066 6.99438C13.03 7.11888 13.195 7.32682 13.2654 7.57267C13.3358 7.81852 13.306 8.08223 13.1824 8.30615L11.981 10.4786C11.967 10.5038 11.9482 10.526 11.9258 10.5439C11.9032 10.5619 11.8773 10.5752 11.8496 10.5832C11.8219 10.5911 11.793 10.5936 11.7643 10.5903C11.7357 10.587 11.7079 10.5782 11.6827 10.5642L10.3819 9.84151C10.331 9.81303 10.2935 9.76568 10.2774 9.70968C10.2614 9.65368 10.2682 9.59359 10.2962 9.54255L11.4976 7.37084C11.5586 7.25991 11.641 7.16214 11.7399 7.08311C11.8389 7.00409 11.9525 6.94538 12.0742 6.91034C12.1958 6.8753 12.3232 6.86463 12.449 6.87893C12.5749 6.89323 12.6966 6.93223 12.8073 6.99369L12.8066 6.99438ZM10.7385 10.735C11.4873 11.1506 11.6594 11.7245 11.2548 12.4562L9.00912 11.2082C9.41368 10.4772 9.98968 10.3188 10.7385 10.735Z' fill='black'/%3E%3C/svg%3E%0A";
const orbs = new Array(9).fill().map((_, i) => ({
  id: faker.random.uuid(),
  name: faker.commerce.department(),
  logo,
}));

const Template = args => (
  <MemoryRouter>
    <Orbs {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  orbs,
  isLoading: false,
};

export const Card = args => (
  <MemoryRouter>
    <OrbCard {...args} />
    <OrbCardSkeleton />
  </MemoryRouter>
);
Card.args = {
  orb: orbs[2],
};