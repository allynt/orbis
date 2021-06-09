import * as React from 'react';

import { darken, makeStyles, SvgIcon } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  svg: {
    width: 'auto',
    height: 'auto',
  },
  light: {
    fill: theme.palette.text.primary,
  },
  darker: {
    fill: darken(theme.palette.text.primary, 0.3),
  },
}));

/**
 *
 * @param {{
 *  color?: "inherit" | "disabled" | "action" | "primary" | "secondary" | "error"
 *  style?: React.CSSProperties
 *  htmlColor?: string
 *  className?: string
 *  titleAccess?: string
 *  variant?: 'admin' | 'default'
 * }} props
 */
export const OrbisLogo = ({
  className,
  color = 'primary',
  variant = 'default',
  ...props
}) => {
  const styles = useStyles();
  return (
    <SvgIcon
      className={clsx(styles.svg, className)}
      color={color}
      viewBox="0 0 286 148"
      {...props}
    >
      {variant === 'default' ? (
        <>
          <path
            className={styles.light}
            d="M225.783 108.115V48.058l4.033 4.573v60.079z"
          />
          <path
            fill="currentColor"
            d="M212.79 87.837c-2.344-2.995-5.41-4.996-9.197-5.997 3.066-1.386 5.484-3.453 7.263-6.225 1.852-2.765 2.783-5.804 2.783-9.102 0-5.07-2.062-9.413-6.177-13.023-4.197-3.61-9.197-5.418-15.009-5.418h-17.256l3.847 4.41s9.138.082 13.417.082c4.435 0 8.23 1.349 11.377 4.032 3.148 2.765 4.718 6.07 4.718 9.91 0 3.69-1.13 6.796-3.386 9.33-2.262 2.617-4.963 3.922-8.11 3.922h-7.747l3.713 4.269h4.026c3.951 0 7.3 1.386 10.046 4.15 2.82 2.69 4.234 5.997 4.234 9.91 0 4.454-1.734 8.301-5.202 11.525-3.55 3.15-7.79 4.78-12.71 4.729-6.45-.074-9.68-1.097-13.647-3.832-2.41-1.66-6.258-6.026-10.402-10.814l-17.466-20.204 6.161.022c6.221 0 8.431-.815 12.063-3.624 5.097-3.943 6.466-13.942 3.743-18.96-2.083-3.839-5.871-8.99-14.407-8.908l-35.509.081 3.209 3.699 32.034.059c5.246 0 9.391 3.328 10.894 7.019.782 1.927 2.411 8.33-1.986 12.911-2.85 2.965-5.127 4.025-10.247 4.025l-9.443.014h-5.365l22.403 25.734c1.027 1.2 1.95 2.253 2.783 3.202l1.511 1.734h.045c3.601 3.943 5.29 5.307 7.166 6.656 3.55 2.557 10.075 5.003 16.445 5.003 6.37 0 11.78-1.957 16.214-5.877 4.517-3.921 6.78-8.643 6.78-14.18.022-3.846-1.184-7.27-3.61-10.264z"
          />
          <path
            className={styles.light}
            d="M281.763 83.819c-1.272-1.764-1.711-2.09-2.969-3.187-1.034-.904-2.455-1.838-4.048-2.616-2.061-1-4.442-1.786-7.85-1.712l-7.888.03-2.716-.008c-5.127 0-7.404-1.075-10.247-4.099-4.398-4.67-2.768-11.191-1.987-13.156 1.504-3.765 5.648-7.152 10.894-7.152l22.012-.052-3.327-3.869h-18.952c-8.536-.081-12.323 5.166-14.407 9.08-2.723 5.114-1.354 15.298 3.743 19.322 3.632 2.861 5.842 3.699 12.062 3.699l1.578-.008 8.572.104c3.669 0 7.442 1.445 9.994 4.07 2.62 2.541 3.936 5.67 3.936 9.375 0 4.217-1.614 7.849-4.829 10.903-3.296 2.98-7.233 4.52-11.802 4.469-5.99-.067-8.996-1.038-12.672-3.624-1.987-1.394-5.566-5.485-8.915-9.399h-5.164c6.347 7.538 9.145 10.184 11.474 11.889 3.297 2.416 9.354 4.736 15.277 4.736 5.916 0 10.939-1.853 15.061-5.559 4.197-3.706 6.296-8.182 6.296-13.415-.008-3.632-1.02-6.908-3.126-9.82z"
          />
          <ellipse
            cx="79.011"
            cy="80.114"
            fill="currentColor"
            rx="11.422"
            ry="11.377"
          />
          <ellipse
            cx="113.926"
            cy="106.277"
            fill="currentColor"
            rx="4.695"
            ry="4.677"
          />
          <path
            fill="currentColor"
            d="M106.804 111.184a41.72 41.72 0 01-27.793 10.547c-23.075 0-41.79-18.633-41.79-41.625 0-22.984 18.707-41.624 41.79-41.624 23.076 0 41.79 18.633 41.79 41.624a41.334 41.334 0 01-4.137 18.078 8.593 8.593 0 013.155 1.92 44.997 44.997 0 004.673-19.998c0-25.014-20.36-45.293-45.473-45.293-25.115 0-45.474 20.279-45.474 45.293 0 25.015 20.36 45.294 45.474 45.294 11.75 0 22.45-4.44 30.524-11.718a8.418 8.418 0 01-2.739-2.498z"
          />
          <g className={styles.light}>
            <ellipse cx="104.155" cy="6.945" rx="4.695" ry="4.677" />
            <path d="M96.014 2.646C57.35-6.426 17.338 15.031 4.204 53.254A77.685 77.685 0 00.112 73.918C.26 93.04 5.715 105.38 14.987 118.144 3.37 99.77-.12 76.512 7.493 54.365c12.524-36.45 50.63-56.952 87.502-48.413a9.176 9.176 0 011.02-3.306zm17.153 6.181a9.029 9.029 0 01-1.347 3.202 74.226 74.226 0 0127.339 23.496h4.19C135.98 24.4 125.72 15.075 113.166 8.827z" />
          </g>
          <g className={styles.darker} transform="translate(16.37 18.53)">
            <ellipse cx="5.454" cy="41.899" rx="4.695" ry="4.677" />
            <path d="M4.413 50.8c.022-.133.06-.267.082-.4a8.634 8.634 0 01-2.635-.726c-.044.215-.096.422-.134.63a60.952 60.952 0 00-.803 16.543c2.314 14.86 7.977 23.836 16.66 32.708C6.423 86.592 1.035 68.9 4.414 50.8zM73.378 1.275C46.002-3.787 19.511 10.08 7.441 33.568a8.52 8.52 0 012.53 1.038C21.55 12.28 46.791-.874 72.872 3.943a58.382 58.382 0 0127.429 13.067h4.085C96.08 9.154 85.486 3.513 73.378 1.275z" />
          </g>
          <g className={styles.light}>
            <path d="M157.257 142.482c0 1.49-.469 2.653-1.4 3.489-.93.836-2.204 1.254-3.82 1.254h-6.471V129.92h6.315c1.616 0 2.867.395 3.76 1.193.894.798 1.333 1.923 1.333 3.374 0 .89-.23 1.68-.7 2.387-.469.706-1.117 1.185-1.95 1.451.967.304 1.697.813 2.181 1.528.507.714.752 1.596.752 2.63zm-9.867-4.917h4.297c1.08 0 1.929-.243 2.547-.737.618-.494.923-1.239.923-2.242s-.297-1.763-.9-2.272c-.604-.51-1.453-.768-2.547-.768h-4.32v6.02zm8.043 4.796c0-1.034-.313-1.824-.938-2.356-.626-.54-1.512-.806-2.659-.806h-4.446v6.4h4.424c1.147 0 2.04-.274 2.673-.829.633-.555.946-1.36.946-2.41zm10.373 4.864h-1.824v-7.273l-5.146-10.032h1.974l4.073 8.299 4.096-8.299h1.973l-5.146 10.062v7.243zm14.284-4.165l-1.453 4.165h-1.921l6.27-17.305h1.527l6.27 17.305h-1.921l-1.445-4.165h-7.328zm3.648-10.587l-3.12 9.029h6.27l-3.15-9.029zm8.042 9.865h1.803c.23 2.288 1.601 3.435 4.096 3.435 1.295 0 2.286-.273 2.956-.828.678-.555 1.013-1.353 1.013-2.41 0-.95-.268-1.671-.797-2.158-.536-.486-1.34-.82-2.42-1.003l-1.951-.327c-1.4-.235-2.473-.714-3.225-1.444-.752-.73-1.124-1.748-1.124-3.07 0-1.52.506-2.706 1.526-3.565 1.02-.858 2.354-1.276 4.023-1.276 1.534 0 2.785.395 3.76 1.193.976.798 1.55 1.999 1.735 3.625h-1.802c-.2-2.158-1.437-3.238-3.723-3.238-1.184 0-2.1.282-2.763.844-.655.562-.983 1.322-.983 2.295 0 .851.253 1.52.76 1.991.506.472 1.28.806 2.308.988l1.996.35c1.452.25 2.554.752 3.321 1.505.767.752 1.147 1.816 1.147 3.184 0 1.573-.521 2.79-1.571 3.648-1.05.859-2.487 1.292-4.32 1.292-1.734 0-3.09-.425-4.073-1.277-.983-.85-1.541-2.105-1.69-3.754zm19.735-10.762v15.649h-1.802v-15.649h-4.923v-1.656h11.64v1.656zm8.944 8.049v7.6h-1.825V129.92h6.397c1.616 0 2.882.425 3.813 1.269.93.843 1.385 2.044 1.385 3.602 0 1.239-.328 2.257-.976 3.063-.648.806-1.556 1.338-2.725 1.604l4.073 7.774h-2.1l-3.895-7.6h-4.146v-.007zm4.423-1.581c1.117 0 1.98-.281 2.599-.844.618-.562.923-1.36.923-2.394 0-1.071-.305-1.877-.908-2.424-.61-.54-1.475-.813-2.607-.813h-4.423v6.467h4.416v.008zm8.37 2.759v-4.493c0-2.287.544-3.967 1.624-5.031 1.08-1.064 2.539-1.596 4.37-1.596 1.818 0 3.263.532 4.335 1.596s1.608 2.736 1.608 5.031v4.492c0 2.287-.543 3.967-1.623 5.031-1.08 1.064-2.532 1.596-4.349 1.596-1.832 0-3.284-.532-4.356-1.596-1.073-1.064-1.609-2.736-1.609-5.031zm10.113-4.416c0-3.359-1.37-5.039-4.118-5.039-1.385 0-2.42.396-3.12 1.194-.7.79-1.05 2.074-1.05 3.853v4.514c0 1.687.35 2.919 1.057 3.686.707.768 1.743 1.155 3.113 1.155 2.748 0 4.118-1.61 4.118-4.84v-4.524zm4.297 5.951h1.802c.23 2.288 1.6 3.435 4.096 3.435 1.295 0 2.286-.273 2.956-.828.678-.555 1.013-1.353 1.013-2.41 0-.95-.268-1.671-.797-2.158-.536-.486-1.34-.82-2.42-1.003l-1.951-.327c-1.4-.235-2.473-.714-3.225-1.444-.752-.73-1.124-1.748-1.124-3.07 0-1.52.506-2.706 1.526-3.565 1.02-.858 2.353-1.276 4.022-1.276 1.534 0 2.785.395 3.76 1.193.976.798 1.55 1.999 1.735 3.625h-1.802c-.2-2.158-1.437-3.238-3.723-3.238-1.184 0-2.1.282-2.763.844-.655.562-.983 1.322-.983 2.295 0 .851.253 1.52.76 1.991.506.472 1.28.806 2.308.988l1.996.35c1.452.25 2.554.752 3.321 1.505.767.752 1.147 1.816 1.147 3.184 0 1.573-.521 2.79-1.571 3.648-1.05.859-2.488 1.292-4.32 1.292-1.735 0-3.09-.425-4.073-1.277-.983-.85-1.541-2.105-1.69-3.754zm16.36.722l-1.452 4.165h-1.921l6.27-17.305h1.527l6.27 17.305h-1.921l-1.445-4.165h-7.328zm3.65-10.587l-3.12 9.029h6.27l-3.15-9.029zm12.212-.897v15.649h-1.802v-15.649h-4.922v-1.656h11.639v1.656z" />
          </g>
        </>
      ) : (
        <>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M212.797 100.437V43.7535L215.859 48.0719V104.776L212.797 100.437Z"
            className={styles.light}
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M200.037 81.7156C197.837 78.9086 194.954 77.0389 191.388 76.1016C194.269 74.8077 196.547 72.866 198.217 70.2766C199.962 67.6855 200.836 64.8434 200.836 61.7501C200.836 57.0015 198.898 52.9373 195.031 49.5546C191.083 46.1734 186.38 44.4829 180.915 44.4829H164.68L168.297 48.6125C168.297 48.6125 176.89 48.6909 180.915 48.6909C185.087 48.6909 188.656 49.9496 191.614 52.4687C194.575 55.0598 196.056 58.153 196.056 61.7501C196.056 65.2048 194.991 68.1158 192.867 70.4909C190.741 72.938 188.2 74.1615 185.239 74.1615H177.955L181.45 78.1553H185.241C188.958 78.1553 192.107 79.4492 194.689 82.0387C197.344 84.5577 198.672 87.6526 198.672 91.32C198.672 95.4945 197.039 99.09 193.778 102.113C190.437 105.064 186.454 106.591 181.824 106.537C175.756 106.47 172.716 105.513 168.991 102.951C166.725 101.393 163.106 97.3114 159.209 92.8235L142.778 73.9024L148.574 73.92C154.421 73.92 156.503 73.1555 159.917 70.5229C164.71 66.8282 166 57.4669 163.435 52.7662C161.475 49.1723 157.914 44.3453 149.887 44.4221L116.487 44.4988L119.507 47.9632L149.641 48.0224C154.572 48.0224 158.475 51.138 159.885 54.5959C160.621 56.3969 162.156 62.3931 158.019 66.6843C155.34 69.4641 153.199 70.4493 148.378 70.4493L139.498 70.4605H134.454L155.524 94.5572C156.491 95.68 157.357 96.6701 158.143 97.553L159.566 99.1796H159.611C162.998 102.874 164.59 104.152 166.353 105.412C169.694 107.805 175.83 110.099 181.824 110.099C187.819 110.099 192.904 108.264 197.077 104.595C201.327 100.926 203.454 96.5021 203.454 91.32C203.454 87.723 202.313 84.5225 200.039 81.7156"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M264.91 77.9554C263.711 76.3048 263.298 76.0009 262.116 74.9709C261.141 74.1232 259.808 73.2515 258.307 72.5238C256.37 71.5849 254.125 70.8492 250.925 70.9179L243.505 70.9435L240.951 70.9403C236.132 70.9403 233.989 69.9359 231.31 67.1033C227.173 62.7322 228.708 56.6224 229.445 54.7879C230.856 51.2644 234.757 48.0895 239.688 48.0895L260.392 48.0416L257.267 44.4205H239.442C231.415 44.3453 227.854 49.2619 225.894 52.923C223.329 57.7116 224.619 67.2521 229.412 71.0155C232.826 73.6961 234.907 74.4766 240.755 74.4766L242.244 74.4718L250.304 74.5662C253.757 74.5662 257.303 75.9209 259.7 78.3728C262.167 80.7559 263.401 83.6829 263.401 87.1552C263.401 91.1057 261.884 94.5077 258.855 97.3674C255.753 100.16 252.051 101.604 247.755 101.555C242.117 101.491 239.295 100.585 235.833 98.1607C233.965 96.854 230.597 93.0266 227.45 89.3592H222.595C228.562 96.4158 231.196 98.8965 233.384 100.491C236.489 102.754 242.186 104.925 247.755 104.925C253.32 104.925 258.044 103.189 261.921 99.717C265.866 96.2446 267.84 92.0574 267.84 87.1552C267.84 83.7516 266.894 80.6856 264.91 77.9554"
            className={styles.light}
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M84.9444 74.4846C84.9444 80.3657 80.1354 85.1335 74.2021 85.1335C68.2719 85.1335 63.463 80.3657 63.463 74.4846C63.463 68.602 68.2719 63.8326 74.2021 63.8326C80.1354 63.8326 84.9444 68.602 84.9444 74.4846"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M111.326 97.9224C111.917 100.267 110.482 102.644 108.116 103.229C105.75 103.816 103.353 102.39 102.762 100.045C102.171 97.6985 103.609 95.3234 105.974 94.7348C108.34 94.151 110.737 95.5761 111.328 97.9208"
            fill="currentColor"
          />
          <mask
            id="mask0"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x="31"
            y="32"
            width="86"
            height="85"
          >
            <path
              d="M31.4303 32.0698H116.977V116.898H31.4303V32.0698Z"
              className={styles.light}
            />
          </mask>
          <g mask="url(#mask0)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M100.345 103.581C93.3978 109.722 84.2425 113.458 74.2036 113.458C52.4957 113.458 34.8997 96.0089 34.8997 74.4824C34.8997 52.9575 52.4957 35.5079 74.2036 35.5079C95.91 35.5079 113.508 52.9575 113.508 74.4824C113.508 80.5506 112.11 86.2925 109.616 91.4122C110.737 91.796 111.746 92.4134 112.582 93.2115C115.392 87.5624 116.977 81.2063 116.977 74.4824C116.977 51.059 97.8262 32.0708 74.2036 32.0708C50.5811 32.0692 31.4303 51.059 31.4303 74.4824C31.4303 97.9074 50.5811 116.899 74.2036 116.899C85.2528 116.899 95.3221 112.742 102.913 105.922C101.895 105.333 101.018 104.534 100.345 103.579"
              fill="currentColor"
            />
          </g>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M102.261 6.25211C102.1 8.66562 99.9994 10.4937 97.5676 10.3354C95.1342 10.1787 93.2902 8.09623 93.4493 5.68112C93.6067 3.2692 95.7076 1.44268 98.1426 1.59782C100.574 1.75616 102.418 3.84019 102.261 6.25211Z"
            className={styles.light}
          />
          <mask
            id="mask1"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="91"
            height="111"
          >
            <path d="M0 0H90.2015V110.099H0V0Z" className={styles.light} />
          </mask>
          <g mask="url(#mask1)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M90.2015 1.9385C53.8337 -6.55918 16.197 13.539 3.84848 49.3291C1.63833 55.7363 0.382278 62.2363 0 68.682C0.13974 86.589 5.26837 98.1431 13.9901 110.099C3.06465 92.8923 -0.21202 71.1163 6.94204 50.3783C18.7172 16.2468 54.5597 -2.9525 89.2458 5.04456C89.3679 3.92657 89.6971 2.87895 90.2015 1.9385Z"
              className={styles.light}
            />
            <path
              className={styles.darker}
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M106.331 7.73157C106.1 8.82716 105.664 9.83959 105.062 10.7337C115.576 15.9829 124.3 23.6201 130.778 32.7336H134.721C127.79 22.3118 118.137 13.5822 106.331 7.73157ZM24.8224 56.3329C24.6649 58.7464 22.564 60.5745 20.129 60.4162C17.6972 60.2595 15.8533 58.177 16.0123 55.7619C16.1713 53.35 18.2722 51.5219 20.704 51.6786C23.139 51.837 24.9814 53.921 24.8224 56.3329V56.3329ZM19.4351 64.3875C19.4576 64.2596 19.4897 64.138 19.5154 64.0117C18.632 63.9141 17.8 63.6806 17.0322 63.3287C16.9937 63.5287 16.9439 63.7222 16.907 63.9221C15.9272 69.157 15.7023 74.3583 16.1488 79.4156C18.3268 93.3305 23.6514 101.737 31.819 110.048C21.3288 97.9016 16.2629 81.3333 19.4351 64.3875V64.3875ZM84.3051 18.0078C58.5544 13.2687 33.6372 26.2528 22.2894 48.2495C23.1455 48.451 23.9486 48.7789 24.6698 49.2235C35.5583 28.316 59.3028 15.9973 83.8377 20.5109C93.7384 22.3342 102.508 26.6846 109.64 32.7464H113.483C105.664 25.3859 95.6979 20.1014 84.3067 18.0062"
            />
          </g>
          <path
            d="M228.448 148L230.367 143.165H235.957L237.868 148H238.951L233.53 134.242H232.92L227.385 148H228.448ZM235.639 142.301H230.716L232.645 137.381C232.846 136.895 233.03 136.351 233.201 135.75C233.421 136.438 233.609 136.975 233.766 137.364L235.639 142.303V142.301ZM244.194 148C246.539 148 248.318 147.411 249.529 146.234C250.74 145.055 251.346 143.317 251.346 141.019C251.346 138.826 250.774 137.158 249.627 136.012C248.484 134.87 246.813 134.299 244.616 134.299H240.899V148H244.192H244.194ZM244.137 147.157H241.86V135.141H244.391C246.33 135.141 247.8 135.637 248.8 136.627C249.801 137.617 250.302 139.093 250.302 141.054C250.302 145.121 248.246 147.155 244.137 147.155V147.157ZM255.429 148V137.729C255.429 136.916 255.405 136.123 255.355 135.349H255.431L260.559 148H261.171L266.319 135.368H266.395C266.319 136.142 266.282 136.892 266.282 137.617V148H267.251V134.299H265.802L260.927 146.351H260.871L255.994 134.299H254.509V148H255.431H255.429ZM272.098 148V134.299H271.138V148H272.098ZM276.917 148L276.915 138.856C276.907 138.132 276.87 137.124 276.803 135.836H276.878L285.031 148H286V134.299H285.068V143.24C285.068 144.251 285.097 145.319 285.154 146.444H285.097L276.955 134.299H275.997V148H276.918H276.917Z"
            fill="currentColor"
          />
        </>
      )}
    </SvgIcon>
  );
};
