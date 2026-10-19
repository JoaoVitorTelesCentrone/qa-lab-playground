do $$
begin
  if has_function_privilege('anon', 'public.complete_lab_submission(text,text,jsonb)', 'EXECUTE') then
    raise exception 'Anonymous execution is allowed';
  end if;
end;
$$;

set role authenticated;
set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select public.complete_lab_submission(
  'desafio-101',
  'Evidencia valida com mais de vinte caracteres.',
  '[{"name":"prova.pdf","path":"11111111-1111-4111-8111-111111111111/desafio-101/33333333-3333-4333-8333-333333333333.pdf"}]'::jsonb
);

do $$
begin
  if (select count(*) from public.lab_submissions) <> 1
    or (select count(*) from public.lab_enrollments where status = 'completed') <> 1
    or (select count(*) from public.activity_events where name = 'lab_completed') <> 1 then
    raise exception 'Successful completion did not persist all three writes';
  end if;

  begin
    perform public.complete_lab_submission('falha-controlada', 'Evidencia valida com mais de vinte caracteres.', '[]'::jsonb);
    raise exception 'Expected failure did not happen';
  exception when others then
    if sqlerrm <> 'Falha simulada na matricula' then raise; end if;
  end;

  begin
    perform public.complete_lab_submission(
      'desafio-101',
      '',
      '[{"name":"prova.pdf","path":"22222222-2222-4222-8222-222222222222/desafio-101/33333333-3333-4333-8333-333333333333.pdf"}]'::jsonb
    );
    raise exception 'Expected path rejection did not happen';
  exception when others then
    if sqlerrm <> 'Invalid attachment path' then raise; end if;
  end;

  if (select count(*) from public.lab_submissions) <> 1
    or (select count(*) from public.lab_enrollments) <> 1
    or (select count(*) from public.activity_events) <> 1 then
    raise exception 'Failed completion left partial data';
  end if;
end;
$$;
