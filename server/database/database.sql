-- Migrations will appear here as you chat with AI

create table users (
  id bigint primary key generated always as identity,
  name text,
  email text,
  password text,
  role text,
  created_at timestamp,
  updated_at timestamp,
  last text,
  birth date,
  gender text,
  imagen_perfil text,
  reset_password_token text,
  reset_password_expires timestamp
);

create table teachers (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  bio text,
  experience text,
  availability text,
  created_at timestamp,
  updated_at timestamp
);

create table planes (
  id text primary key,
  plan text,
  nombre text,
  precio text,
  caracteristicas text[0]
);

create table oauth_tokens (
  id bigint primary key generated always as identity,
  access_token text not null,
  refresh_token text,
  id_tutor bigint unique
);

create table subjects (
  id bigint primary key generated always as identity,
  name text,
  description text,
  created_at timestamp,
  updated_at timestamp,
  imagen text
);

create table subscriptions (
  id bigint primary key generated always as identity,
  user_id bigint not null references users (id),
  plan_id text not null references planes (id),
  subscription_date timestamp,
  status boolean
);

create table tutor_subjects (
  id bigint primary key generated always as identity,
  id_tutor bigint not null references teachers (id),
  id_subject bigint not null references subjects (id)
);

create table chat_history (
  id bigint primary key generated always as identity,
  emisor bigint not null references users (id),
  mensaje text not null,
  receptor bigint not null references users (id),
  fecha timestamp
);

alter table oauth_tokens
add constraint oauth_tokens_id_tutor_fkey foreign key (id_tutor) references teachers (id);

create table classes (
  id bigint primary key generated always as identity,
  teacher_id bigint references teachers (id),
  subject_id bigint references subjects (id),
  start_time timestamp,
  end_time timestamp,
  google_meet_link text,
  created_at timestamp,
  updated_at timestamp,
  title text,
  description text,
  meetid text
);

create table estudi_subjects (
  id bigint primary key generated always as identity,
  id_estudi bigint references users (id),
  id_subject bigint references subjects (id)
);

create table payments (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  amount numeric,
  payment_date timestamp,
  status text,
  created_at timestamp,
  updated_at timestamp
);

create table ratings (
  id bigint primary key generated always as identity,
  class_id bigint references classes (id),
  rating int,
  comment text,
  created_at timestamp,
  updated_at timestamp
);
CREATE TABLE student_classes (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id bigint REFERENCES users(id),
    class_id bigint REFERENCES classes(id)
);
alter table student_classes
add column active boolean default true;