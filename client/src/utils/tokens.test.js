import { getAuthTokenForSource } from './tokens';

const TOKENS = {
  'astrosat/isolation_plus_core/housing_tenure/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfY29yZS9ob3VzaW5nX3RlbnVyZS8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.Xul2EFlXVc7nrN8X40I2hAnBxfGIAWC-qiyah69deS4',
  'astrosat/isolation_plus_core/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfY29yZS8qLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.hIrXAEvLr8C6ypTg1LfMTKUovNP9sV1l3d8ZIKFLK1Y',
  'lanterne/data/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsibGFudGVybmUvZGF0YS8qLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.jXwKtcjKpLX03Fm6mzWE3RLTNt7ewLZ0JI9y72PfIxQ',
  'astrosat/isolation_plus_core/housing/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfY29yZS9ob3VzaW5nLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.YksXEOr7ZAKzcZPFJ1NVBfNhWLkgfR3zqy7u1GeT--c',
  'astrosat/test/vector_popup/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvdGVzdC92ZWN0b3JfcG9wdXAvKiJdLCJjcmVhdGUiOltdLCJkZWxldGUiOltdLCJ1cGRhdGUiOltdfX19.RS1F952-OEcovsCBFR7_-1L9OGU7sdSJ2kIHH19mlu0',
  'wfc/proxy/progression_of_units/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsid2ZjL3Byb3h5L3Byb2dyZXNzaW9uX29mX3VuaXRzLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ._QYx4uRIU4uRW-rNB7wAtSuyUG-zKsl1R3ytTVZBTGY',
  'astrosat/wfc/mock/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvd2ZjL21vY2svKiJdLCJjcmVhdGUiOltdLCJkZWxldGUiOltdLCJ1cGRhdGUiOltdfX19.K-y9eWrqPmZ2sbkwhoyKKJzV24sHuAiQq-FDbb2UVR0',
  'astrosat/isolation_plus_proprietary/greenspace/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfcHJvcHJpZXRhcnkvZ3JlZW5zcGFjZS8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.4AL548RiGaRY_Vhho5ZaBJl3aqxX9z0OZHYdq5grdMY',
  'astrosat/covid/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvY292aWQvKi8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.ubM6VAjeCwaKfN2mt0ISeXz0ThiuKAJ7-XW2hPdsXK4',
  'astrosat/isolation_plus_proprietary/climate_vulnerability/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfcHJvcHJpZXRhcnkvY2xpbWF0ZV92dWxuZXJhYmlsaXR5LyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.8aXdD6nif9IZUgu2DyXQWLUyBImljK8FM7nPHdbj4_c',
  'astrosat/expos/fire_scotland_risk/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvZXhwb3MvZmlyZV9zY290bGFuZF9yaXNrLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.rajmZK8NpqBz9AbFUb2RvYpnU8yxp4aeGPGalXafTBI',
  'astrosat/infrastructure_core/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaW5mcmFzdHJ1Y3R1cmVfY29yZS8qLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.gn_cbqpqXjDLwAmG6QeuVsYfdspvYhCs9fA_Gxu6ccw',
  'astrosat/nature-scotland/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvbmF0dXJlLXNjb3RsYW5kLyovKiJdLCJjcmVhdGUiOltdLCJkZWxldGUiOltdLCJ1cGRhdGUiOltdfX19.qKvV7pEB83MmEEerjjhprEDuaztsj3AGmr4tsaSw7fU',
  'wfc/proxy/housing_approvals_over_time/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsid2ZjL3Byb3h5L2hvdXNpbmdfYXBwcm92YWxzX292ZXJfdGltZS8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.NeKUxV_tr_uKJ6TuUEs0fXygUG1Y-yxVaCv4xtkqS2M',
  'astrosat/isolation_plus_proprietary/air_pollution/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfcHJvcHJpZXRhcnkvYWlyX3BvbGx1dGlvbi8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.pKK-YUkHzKEl8IJfW1vqsmo_I-_FsjB0PYF8dLJunOI',
  'astrosat/isolation_plus_core/property_prices/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfY29yZS9wcm9wZXJ0eV9wcmljZXMvKiJdLCJjcmVhdGUiOltdLCJkZWxldGUiOltdLCJ1cGRhdGUiOltdfX19.LLKtlxWkZM543WK3Ljp3tYCxc69fPXUMdYoMBW_Gblk',
  'astrosat/mysupplylynk/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvbXlzdXBwbHlseW5rLyovKiJdLCJjcmVhdGUiOltdLCJkZWxldGUiOltdLCJ1cGRhdGUiOltdfX19._duoqQBTcyaGIe8ec-qjzaILa1oI8YzhPiisyWLYzVs',
  'orbis-user-2/*/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsib3JiaXMtdXNlci0yLyovKi8qIl0sImNyZWF0ZSI6WyJvcmJpcy11c2VyLTIvKi8qLyoiXSwiZGVsZXRlIjpbIm9yYmlzLXVzZXItMi8qLyovKiJdLCJ1cGRhdGUiOltdfX19.9tIveQVY_TBu8oZIpaevzQdBcBsg94__KRofcXJH7pg',
  'astrosat/expos/alba_land_cover/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvZXhwb3MvYWxiYV9sYW5kX2NvdmVyLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.JREIzRMozH0qatN8tZWexDqzYkvqVF2itAdeTYpOiU0',
  'wfc/proxy/affordable_housing_delivery/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsid2ZjL3Byb3h5L2FmZm9yZGFibGVfaG91c2luZ19kZWxpdmVyeS8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.1oE-hTB2dvC1Ge7UANIUcGyLlfPhsRMPc_BnLRdIy_Q',
  'astrosat/wfc/dashboard/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvd2ZjL2Rhc2hib2FyZC8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.9Tn_EAQCIA6zTo2E_VILr7mgnrWGKZYLg9nzKb0Ieog',
  'wfc/proxy/tenure_type_housing_delivery/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsid2ZjL3Byb3h5L3RlbnVyZV90eXBlX2hvdXNpbmdfZGVsaXZlcnkvKiJdLCJjcmVhdGUiOltdLCJkZWxldGUiOltdLCJ1cGRhdGUiOltdfX19.XjzCdgYH1_6OJhGmUay9YywudAD0qiTv14_a8CrDR3k',
  'astrosat/isolation_plus_proprietary/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvaXNvbGF0aW9uX3BsdXNfcHJvcHJpZXRhcnkvKi8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.zq0kj1jX0jx1DNW_XLue032G9bQMWpJ639ggO58lpxc',
  'wfc/mock/*/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsid2ZjL21vY2svKi8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.Cm5zEHWs9azd1TarphWEV7uVs9_HmyhRD4sN-o_JEos',
  'astrosat/proxy/pld/*':
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvcHJveHkvcGxkLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.WItKICZkMgfCCgo9k5vChFYO-QsnfQ_S3_k-lmHFEus',
};

const TOKENS_ARRAY = [
  [
    'astrosat/covid/new_cases/dev',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvY292aWQvKi8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.ubM6VAjeCwaKfN2mt0ISeXz0ThiuKAJ7-XW2hPdsXK4',
  ],
  [
    'astrosat/expos/fire_scotland_risk/latest',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvZXhwb3MvZmlyZV9zY290bGFuZF9yaXNrLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.rajmZK8NpqBz9AbFUb2RvYpnU8yxp4aeGPGalXafTBI',
  ],
  [
    'wfc/proxy/housing_approvals_over_time/v1',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsid2ZjL3Byb3h5L2hvdXNpbmdfYXBwcm92YWxzX292ZXJfdGltZS8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.NeKUxV_tr_uKJ6TuUEs0fXygUG1Y-yxVaCv4xtkqS2M',
  ],
  [
    'wfc/proxy/progression_of_units/v1',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsid2ZjL3Byb3h5L3Byb2dyZXNzaW9uX29mX3VuaXRzLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ._QYx4uRIU4uRW-rNB7wAtSuyUG-zKsl1R3ytTVZBTGY',
  ],
  [
    'astrosat/proxy/pld/latest',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvcHJveHkvcGxkLyoiXSwiY3JlYXRlIjpbXSwiZGVsZXRlIjpbXSwidXBkYXRlIjpbXX19fQ.WItKICZkMgfCCgo9k5vChFYO-QsnfQ_S3_k-lmHFEus',
  ],
  [
    'astrosat/wfc/dashboard/latest',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6ODAwMCIsInN1YiI6Im1hcmsuc21hbGxAYXN0cm9zYXQubmV0IiwibmFtZSI6Im9yYmlzIHRva2VuIiwiaWF0IjoxNjQ2MTU2MTY5LCJleHAiOjE2NDYxNTk3NjksInNjb3BlcyI6eyJkYXRhIjp7InJlYWQiOlsiYXN0cm9zYXQvd2ZjL2Rhc2hib2FyZC8qIl0sImNyZWF0ZSI6W10sImRlbGV0ZSI6W10sInVwZGF0ZSI6W119fX0.9Tn_EAQCIA6zTo2E_VILr7mgnrWGKZYLg9nzKb0Ieog',
  ],
  ['astro/wfc/dashboard/latest', undefined],
];

describe('Token utils', () => {
  it.each(TOKENS_ARRAY)(
    'should match sourceId: %s with token',
    (sourceId, expectedToken) => {
      const source = {
        source_id: sourceId,
      };

      const authToken = getAuthTokenForSource(TOKENS, source);

      expect(authToken).toEqual(expectedToken);
    },
  );
});
