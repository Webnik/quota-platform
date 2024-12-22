insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

create policy "Avatar images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  auth.uid() = (storage.foldername(name))[1]::uuid
  and bucket_id = 'avatars'
);