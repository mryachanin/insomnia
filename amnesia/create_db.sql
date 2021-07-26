-- CREATE DATABASE insomnia
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     CONNECTION LIMIT = -1;

CREATE TABLE public.activity
(
    id integer NOT NULL,
    sleep_time timestamp with time zone,
    wake_time timestamp with time zone,
    sleep_rating smallint,
    PRIMARY KEY (id)
);

ALTER TABLE public.activity
    OWNER to postgres;

ALTER TABLE public.activity
    ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2100000000 );

CREATE TABLE public.interruption
(
    id integer NOT NULL,
    sleep_id integer NOT NULL,
    interrupt_time timestamp with time zone,
    PRIMARY KEY (id),
    CONSTRAINT sleep_id FOREIGN KEY (sleep_id)
        REFERENCES public.activity (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public.interruption
    OWNER to postgres;

ALTER TABLE public.interruption
    ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2100000000 );
