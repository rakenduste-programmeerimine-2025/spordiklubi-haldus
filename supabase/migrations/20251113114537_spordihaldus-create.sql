-- Created by Redgate Data Modeler (https://datamodeler.redgate-platform.com)
-- Last modification date: 2025-11-13 11:38:16.697

-- tables
-- Table: Club
CREATE TABLE club (
    id int  NOT NULL,
    name varchar(50)  NOT NULL,
    created_at timestamp  NOT NULL,
    club_logo varchar(50)  NOT NULL,
    invite_code varchar(100)  NOT NULL,
    club_invite_id int  NOT NULL,
    CONSTRAINT club_pk PRIMARY KEY (id)
);

-- Table: Club_invite
CREATE TABLE club_invite (
    id int  NOT NULL,
    token varchar(100)  NOT NULL,
    created_at timestamp  NOT NULL,
    CONSTRAINT club_invite_pk PRIMARY KEY (id)
);

-- Table: Event
CREATE TABLE event (
    id int  NOT NULL,
    title varchar(100)  NOT NULL,
    description varchar(200)  NOT NULL,
    date date  NOT NULL,
    start_time time  NOT NULL,
    end_time time  NULL,
    location varchar(50)  NOT NULL,
    event_type_id int  NOT NULL,
    club_id int  NOT NULL,
    CONSTRAINT event_pk PRIMARY KEY (id)
);

-- Table: Event_rsvp
CREATE TABLE event_rsvp (
    id int  NOT NULL,
    profile_id uuid  NOT NULL,
    event_id int  NOT NULL,
    status boolean  NULL,
    reason varchar(100)  NULL,
    CONSTRAINT event_rsvp_pk PRIMARY KEY (id)
);

-- Table: Forum_comment
CREATE TABLE forum_comment (
    id int  NOT NULL,
    profile_id uuid  NOT NULL,
    content varchar(150)  NOT NULL,
    created_at timestamp  NOT NULL,
    forum_post_id int  NOT NULL,
    CONSTRAINT forum_comment_pk PRIMARY KEY (id)
);

-- Table: Forum_post
CREATE TABLE forum_post (
    id int  NOT NULL,
    profile_id uuid  NOT NULL,
    club_id int  NOT NULL,
    title varchar(50)  NOT NULL,
    content varchar(200)  NOT NULL,
    created_at timestamp  NOT NULL,
    CONSTRAINT forum_post_pk PRIMARY KEY (id)
);

-- Table: Member
CREATE TABLE member (
    id int  NOT NULL,
    profile_id uuid  NOT NULL,
    club_id int  NOT NULL,
    role_id int NOT NULL,
    CONSTRAINT member_pk PRIMARY KEY (id)
);

-- Table: Role
CREATE TABLE role (
    id int  NOT NULL,
    name varchar(10)  NOT NULL,
    CONSTRAINT role_pk PRIMARY KEY (id)
);

-- Table: User
CREATE TABLE profile (
    id uuid references auth.users(id) on delete cascade,
    name varchar(50)  NOT NULL,
    email varchar(50)  NOT NULL,
    role_id int  NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (id)
);

-- Table: event_type
CREATE TABLE event_type (
    id int  NOT NULL,
    name varchar(50)  NOT NULL,
    CONSTRAINT event_type_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: Club_Club_invite (table: Club)
ALTER TABLE club ADD CONSTRAINT club_club_invite
    FOREIGN KEY (club_invite_id)
    REFERENCES club_invite (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_Club (table: Event)
ALTER TABLE Event ADD CONSTRAINT event_club
    FOREIGN KEY (club_id)
    REFERENCES club (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_event_type (table: Event)
ALTER TABLE Event ADD CONSTRAINT event_event_type
    FOREIGN KEY (event_type_id)
    REFERENCES event_type (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_rsvp_Event (table: Event_rsvp)
ALTER TABLE event_rsvp ADD CONSTRAINT event_rsvp_event
    FOREIGN KEY (event_id)
    REFERENCES event (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Event_rsvp_User (table: Event_rsvp)
ALTER TABLE event_rsvp ADD CONSTRAINT event_rsvp_profile
    FOREIGN KEY (profile_id)
    REFERENCES profile (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_comment_Forum_post (table: Forum_comment)
ALTER TABLE forum_comment ADD CONSTRAINT forum_comment_forum_post
    FOREIGN KEY (forum_post_id)
    REFERENCES forum_post (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_comment_User (table: Forum_comment)
ALTER TABLE forum_comment ADD CONSTRAINT forum_comment_profile
    FOREIGN KEY (profile_id)
    REFERENCES profile (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_post_Club (table: Forum_post)
ALTER TABLE forum_post ADD CONSTRAINT forum_post_club
    FOREIGN KEY (club_id)
    REFERENCES club (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Forum_post_User (table: Forum_post)
ALTER TABLE forum_post ADD CONSTRAINT forum_post_profile
    FOREIGN KEY (profile_id)
    REFERENCES profile (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Member_Club (table: Member)
ALTER TABLE member ADD CONSTRAINT member_club
    FOREIGN KEY (club_id)
    REFERENCES club (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Member_Role (table: Member)
ALTER TABLE member ADD CONSTRAINT member_role
    FOREIGN KEY (role_id)
    REFERENCES role (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Member_User (table: Member)
ALTER TABLE member ADD CONSTRAINT member_profile
    FOREIGN KEY (profile_id)
    REFERENCES profile (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: User_Role (table: User)
ALTER TABLE profile ADD CONSTRAINT profile_role
    FOREIGN KEY (role_id)
    REFERENCES role (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

