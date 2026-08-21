CREATE TYPE "public"."amount_type" AS ENUM('demanded', 'paid', 'accepted', 'reported');--> statement-breakpoint
CREATE TYPE "public"."estimation_methodology" AS ENUM('single_observation', 'median_of_observations', 'editorial_estimate');--> statement-breakpoint
CREATE TYPE "public"."evidence_confidence" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('documented_case', 'historical', 'news', 'public_report', 'crowdsourced');--> statement-breakpoint
CREATE TABLE "initial_estimates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"min_amount" numeric(12, 2),
	"max_amount" numeric(12, 2),
	"methodology" "estimation_methodology" NOT NULL,
	"confidence" "evidence_confidence" NOT NULL,
	"observation_count" numeric DEFAULT 0 NOT NULL,
	"calculated_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "source_type" "source_type" DEFAULT 'crowdsourced' NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "source_name" varchar(200);--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "source_url" varchar(500);--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "source_date" varchar(10);--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "evidence_confidence" "evidence_confidence" DEFAULT 'low' NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "amount_type" "amount_type" DEFAULT 'reported' NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "demanded_amount" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "source_record_id" varchar(200);--> statement-breakpoint
ALTER TABLE "initial_estimates" ADD CONSTRAINT "initial_estimates_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "initial_estimates_service_id_unique" ON "initial_estimates" USING btree ("service_id");--> statement-breakpoint
CREATE UNIQUE INDEX "source_record_id_unique" ON "reports" USING btree ("source_record_id");