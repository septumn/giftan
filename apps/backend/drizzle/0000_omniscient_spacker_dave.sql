CREATE TYPE "public"."Role" AS ENUM('USER', 'MODERATOR', 'ADMIN');--> statement-breakpoint
CREATE TABLE "Account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "Account_provider_providerAccountId_unique" UNIQUE("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "ActivateToken" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ActivateToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "CartItem" (
	"userId" text NOT NULL,
	"giftId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "CartItem_userId_giftId_pk" PRIMARY KEY("userId","giftId")
);
--> statement-breakpoint
CREATE TABLE "Dispute" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"purchaseId" text NOT NULL,
	"userId" text NOT NULL,
	"moderatorId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Dispute_purchaseId_unique" UNIQUE("purchaseId")
);
--> statement-breakpoint
CREATE TABLE "Favorite" (
	"userId" text NOT NULL,
	"giftId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Favorite_userId_giftId_pk" PRIMARY KEY("userId","giftId")
);
--> statement-breakpoint
CREATE TABLE "Gift" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Gift_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"collection" text NOT NULL,
	"modelName" text NOT NULL,
	"symbol" text NOT NULL,
	"backdrop" text NOT NULL,
	"collectibleNumber" integer NOT NULL,
	"description" text NOT NULL,
	"price" double precision NOT NULL,
	"categories" text[] DEFAULT '{"all"}' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"sellerId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Purchase" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"pricePaid" double precision NOT NULL,
	"buyerId" text NOT NULL,
	"giftId" integer NOT NULL,
	CONSTRAINT "Purchase_giftId_unique" UNIQUE("giftId")
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"password" text,
	"email" text,
	"emailVerified" timestamp,
	"bio" text,
	"confirmationSentAt" timestamp,
	"image" text,
	"role" "Role" DEFAULT 'USER' NOT NULL,
	"isBlocked" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_name_unique" UNIQUE("name"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "VerificationToken_identifier_token_pk" PRIMARY KEY("identifier","token"),
	CONSTRAINT "VerificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_giftId_Gift_id_fk" FOREIGN KEY ("giftId") REFERENCES "public"."Gift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_purchaseId_Purchase_id_fk" FOREIGN KEY ("purchaseId") REFERENCES "public"."Purchase"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_giftId_Gift_id_fk" FOREIGN KEY ("giftId") REFERENCES "public"."Gift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_sellerId_User_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_buyerId_User_id_fk" FOREIGN KEY ("buyerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_giftId_Gift_id_fk" FOREIGN KEY ("giftId") REFERENCES "public"."Gift"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;