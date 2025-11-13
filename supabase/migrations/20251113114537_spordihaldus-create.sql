-- Created by Redgate Data Modeler (https://datamodeler.redgate-platform.com)
-- Last modification date: 2025-11-13 11:38:16.697

-- tables
-- Table: Club
CREATE TABLE Club (
    id int  NOT NULL,
    name varchar(50)  NOT NULL,
    created_at timestamp  NOT NULL,
    club_logo varchar(50)  NOT NULL,
    invite_code varchar(100)  NOT NULL,
    Club_invite_id int  NOT NULL,
    CONSTRAINT Club_pk PRIMARY KEY (id)
);

-- Table: Club_invite
CREATE TABLE Club_invite (
    id int  NOT NULL,
    token varchar(100)  NOT NULL,
    created_at timestamp  NOT NULL,
    CONSTRAINT Club_invite_pk PRIMARY KEY (id)
);

-- Table: Event
CREATE TABLE Event (
    id int  NOT NULL,
    title varchar(100)  NOT NULL,
    description varchar(200)  NOT NULL,
    date date  NOT NULL,
    start_time time  NOT NULL,
    end_time time  NULL,
    location varchar(50)  NOT NULL,
    event_type_id int  NOT NULL,
    Club_id int  NOT NULL,
    CONSTRAINT Event_pk PRIMARY KEY (id)
);

-- Table: Event_rsvp
CREATE TABLE Event_rsvp (
    id int  NOT NULL,
    User_id int  NOT NULL,
    Event_id int  NOT NULL,
    status boolean  NULL,
    reason varchar(100)  NULL,
    CONSTRAINT Event_rsvp_pk PRIMARY KEY (id)
);

-- Table: Forum_comment
CREATE TABLE Forum_comment (
    id int  NOT NULL,
    User_id int  NOT NULL,
    content varchar(150)  NOT NULL,
    created_at timestamp  NOT NULL,
    Forum_post_id int  NOT NULL,
    CONSTRAINT Forum_comment_pk PRIMARY KEY (id)
);

-- Table: Forum_post
CREATE TABLE Forum_post (
    id int  NOT NULL,
    User_id int  NOT NULL,
    Club_id int  NOT NULL,
    title varchar(50)  NOT NULL,
    content varchar(200)  NOT NULL,
    created_at timestamp  NOT NULL,
    CONSTRAINT Forum_post_pk PRIMARY KEY (id)
);

-- Table: Member
CREATE TABLE Member (
    id int  NOT NULL,
    User_id int  NOT NULL,
    Club_id int  NOT NULL,
    Role_id int  NOT NULL,
    CONSTRAINT Member_pk PRIMARY KEY (id)
);

-- Table: Role
CREATE TABLE Role (
    id int  NOT NULL,
    name varchar(10)  NOT NULL,
    CONSTRAINT Role_pk PRIMARY KEY (id)
);

-- Table: User
CREATE TABLE "User" (
    id int  NOT NULL,
    name varchar(50)  NOT NULL,
    email varchar(50)  NOT NULL,
    password varchar(50)  NOT NULL,
    Role_id int  NOT NULL,
    CONSTRAINT User_pk PRIMARY KEY (id)
);

-- Table: event_type
CREATE TABLE event_type (
    id int  NOT NULL,
    name varchar(50)  NOT NULL,
    CONSTRAINT event_type_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: Club_Club_invite (table: Club)
ALTER TABLE Club ADD CONSTRAINT Club_Club_invite
    FOREIGN KEY (Club_invite_id)
    REFERENCES Club_invite (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_Club (table: Event)
ALTER TABLE Event ADD CONSTRAINT Event_Club
    FOREIGN KEY (Club_id)
    REFERENCES Club (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_event_type (table: Event)
ALTER TABLE Event ADD CONSTRAINT Event_event_type
    FOREIGN KEY (event_type_id)
    REFERENCES event_type (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_rsvp_Event (table: Event_rsvp)
ALTER TABLE Event_rsvp ADD CONSTRAINT Event_rsvp_Event
    FOREIGN KEY (Event_id)
    REFERENCES Event (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_rsvp_User (table: Event_rsvp)
ALTER TABLE Event_rsvp ADD CONSTRAINT Event_rsvp_User
    FOREIGN KEY (User_id)
    REFERENCES "User" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_comment_Forum_post (table: Forum_comment)
ALTER TABLE Forum_comment ADD CONSTRAINT Forum_comment_Forum_post
    FOREIGN KEY (Forum_post_id)
    REFERENCES Forum_post (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_comment_User (table: Forum_comment)
ALTER TABLE Forum_comment ADD CONSTRAINT Forum_comment_User
    FOREIGN KEY (User_id)
    REFERENCES "User" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_post_Club (table: Forum_post)
ALTER TABLE Forum_post ADD CONSTRAINT Forum_post_Club
    FOREIGN KEY (Club_id)
    REFERENCES Club (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_post_User (table: Forum_post)
ALTER TABLE Forum_post ADD CONSTRAINT Forum_post_User
    FOREIGN KEY (User_id)
    REFERENCES "User" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Member_Club (table: Member)
ALTER TABLE Member ADD CONSTRAINT Member_Club
    FOREIGN KEY (Club_id)
    REFERENCES Club (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Member_Role (table: Member)
ALTER TABLE Member ADD CONSTRAINT Member_Role
    FOREIGN KEY (Role_id)
    REFERENCES Role (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Member_User (table: Member)
ALTER TABLE Member ADD CONSTRAINT Member_User
    FOREIGN KEY (User_id)
    REFERENCES "User" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: User_Role (table: User)
ALTER TABLE "User" ADD CONSTRAINT User_Role
    FOREIGN KEY (Role_id)
    REFERENCES Role (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

