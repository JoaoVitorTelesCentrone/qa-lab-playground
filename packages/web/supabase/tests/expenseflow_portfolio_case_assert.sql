set role authenticated;
set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
insert into public.expenseflow_portfolio_cases (user_id, source_deliverable_id, title, summary, snapshot, published)
values ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Investigação ExpenseFlow', repeat('Resumo da investigação. ', 3), '{}'::jsonb, true);

reset role;
set role anon;
do $$ begin
  if (select count(*) from public.expenseflow_portfolio_cases) <> 0 then
    raise exception 'Private profile leaked its case';
  end if;
end $$;

reset role;
update public.profiles set portfolio_public = true where username = 'aluno-um';
set role anon;
do $$ begin
  if (select count(*) from public.expenseflow_portfolio_cases) <> 1 then
    raise exception 'Published case was not visible';
  end if;
end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';
do $$ begin
  begin
    insert into public.expenseflow_portfolio_cases (user_id, source_deliverable_id, title, summary, snapshot, published)
    values ('22222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'Case indevido', repeat('Resumo indevido. ', 3), '{}'::jsonb, true);
    raise exception 'Cross-account source accepted';
  exception when insufficient_privilege then null;
  end;
  if (select count(*) from public.expenseflow_portfolio_cases where user_id = '22222222-2222-4222-8222-222222222222') <> 0 then
    raise exception 'Cross-account case persisted';
  end if;
end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
update public.expenseflow_portfolio_cases set published = false where user_id = '11111111-1111-4111-8111-111111111111';
reset role;
set role anon;
do $$ begin
  if (select count(*) from public.expenseflow_portfolio_cases) <> 0 then
    raise exception 'Unpublished case remained public';
  end if;
end $$;
