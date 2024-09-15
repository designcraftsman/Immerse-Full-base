import React from 'react';
import { Helmet } from 'react-helmet';
import logo from '../../assets/lms/logo.png';

function Head() {
  return (
    <Helmet>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href={logo} type="image/x-icon" />
      <link rel="apple-touch-icon" sizes="180x180" href={logo} />
      <link rel="icon" type="image/png" sizes="32x32" href={logo} />
      <link rel="icon" type="image/png" sizes="16x16" href={logo} />
      <link rel="manifest" href={logo} />
      <meta name="theme-color" content="#ffffff" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <title>Immerse</title>
    </Helmet>
  );
}

export default Head;
