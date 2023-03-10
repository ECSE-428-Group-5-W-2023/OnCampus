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
    CONSTRAINT "todo_fk1" FOREIGN KEY ("event_list_id") REFERENCES "event_list"("id")
);
CREATE TABLE "profile" (
    "id" SERIAL PRIMARY KEY,
    "profile_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "name" VARCHAR(255),
    "username" VARCHAR(255),
    "school" VARCHAR(255),
    "bio" VARCHAR(255)
);