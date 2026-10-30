begin;
select plan(6);

select has_column('public', 'profiles', 'acquisition_source', 'profiles store acquisition source');
select has_column('public', 'profiles', 'acquisition_medium', 'profiles store acquisition medium');
select has_column('public', 'profiles', 'acquisition_campaign', 'profiles store acquisition campaign');

insert into auth.users (id, aud, role, email, encrypted_password, raw_user_meta_data)
values (
  '00000000-0000-4000-8000-000000000099',
  'authenticated',
  'authenticated',
  'attribution-test@example.test',
  '',
  '{"full_name":"Attribution Test","acquisition_source":"LinkedIn Ads!","acquisition_medium":"Paid Social","acquisition_campaign":"W25?promo"}'::jsonb
);

select is(
  (select acquisition_source from public.profiles where id = '00000000-0000-4000-8000-000000000099'),
  'linkedinads',
  'signup trigger normalizes source metadata'
);
select is(
  (select acquisition_medium from public.profiles where id = '00000000-0000-4000-8000-000000000099'),
  'paidsocial',
  'signup trigger normalizes medium metadata'
);
select is(
  (select acquisition_campaign from public.profiles where id = '00000000-0000-4000-8000-000000000099'),
  'w25promo',
  'signup trigger normalizes campaign metadata'
);

select * from finish();
rollback;
