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
    "is_recurring" BOOLEAN,
    "is_private" BOOLEAN,
    "days_of_week" TEXT[],
    "start_date" VARCHAR(255),
    "end_date" VARCHAR(255),
    CONSTRAINT "todo_fk1" FOREIGN KEY ("event_list_id") REFERENCES "event_list"("id")
);