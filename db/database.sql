CREATE TABLE "event_list"(
    "id" SERIAL PRIMARY KEY,
    "owner_id" VARCHAR(255) NOT NULL
);
CREATE TABLE "event" (
    "id" SERIAL PRIMARY KEY,
    "event_list_id" integer NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "is_deleted" BOOLEAN,
    CONSTRAINT "todo_fk1" FOREIGN KEY ("event_list_id") REFERENCES "event_list"("id")
);