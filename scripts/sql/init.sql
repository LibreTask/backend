
-- This script is used to define/create LibreTask database.

CREATE TYPE platform as ENUM('desktop-mac', 'desktop-windows', 'desktop-linux',
    'mobile-android', 'mobile-ios');

CREATE TABLE users (
  id TEXT,
  email TEXT UNIQUE NOT NULL,
  show_completed_tasks BOOLEAN NOT NULL DEFAULT TRUE,
  email_is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  confirm_email_token TEXT,
  password TEXT,
  password_reset_token TEXT,
  password_reset_expiration_date_time_utc TIMESTAMP,
  created_at_date_time_utc TIMESTAMP,
  updated_at_date_time_utc TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE tasks (
  id TEXT,
  owner_id TEXT REFERENCES users (id) ON DELETE CASCADE,
  name TEXT,
  notes TEXT,
  due_date_time_utc TIMESTAMP,
  completion_date_time_utc TIMESTAMP,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at_date_time_utc TIMESTAMP,
  updated_at_date_time_utc TIMESTAMP,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id)
);

CREATE TABLE releases (
  platform platform,
  current_version TEXT,
  download_link TEXT,
  release_date_time_utc TIMESTAMP,
  PRIMARY KEY(platform) -- we only keep track of the most recent version
);
