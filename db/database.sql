CREATE TABLE "event_list"(
    "id" SERIAL PRIMARY KEY,
    "owner_id" VARCHAR(255) NOT NULL
);
CREATE TABLE "event" (
    "id" SERIAL PRIMARY KEY,
    "event_list_id" integer NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "is_private" BOOLEAN,
    "event_tags" TEXT[],
    "r_rule" VARCHAR(255),
    "ex_date" VARCHAR(255),
    "all_day" BOOLEAN,
    "start_date" VARCHAR(255),
    "end_date" VARCHAR(255),
    CONSTRAINT "event_fk1" FOREIGN KEY ("event_list_id") REFERENCES "event_list"("id")
);
CREATE TABLE "profile" (
    "id" SERIAL PRIMARY KEY,
    "profile_id" VARCHAR(255) NOT NULL UNIQUE,
    "email" VARCHAR(255),
    "name" VARCHAR(255),
    "username" VARCHAR(255),
    "school" VARCHAR(255),
    "bio" VARCHAR(255)
);
CREATE TABLE "friendship" (
    "id" SERIAL PRIMARY KEY,
    "profile_id_one" VARCHAR(255),
    "profile_id_two" VARCHAR(255)
);
CREATE TABLE "friend_group" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255),
    "description" VARCHAR(255)
);
CREATE TABLE "group_membership"(
    "id" SERIAL PRIMARY KEY,
    "friend_group_id" integer NOT NULL,
    "profile_id" VARCHAR(255) NOT NULL,
    CONSTRAINT "group_membership_fk1" FOREIGN KEY ("friend_group_id") REFERENCES "friend_group"("id")
);
CREATE TABLE "friendrequest"(
    "id" SERIAL PRIMARY KEY,
    "sending_profile_id" VARCHAR(255),
    "receiving_profile_id" VARCHAR(255)
);
